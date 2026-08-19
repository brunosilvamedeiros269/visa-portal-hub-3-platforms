-- Carga de agosto — 2026-08-19
-- Origen: 22 transcripciones de reuniones de jul–ago/2026 (carpeta OneDrive .../VISA/Transcriçoes).
-- Qué hace: (1) da de alta los 4 clientes/proyectos que faltaban en la base
--           (BancoEstado, BBVA Uruguay, Banco de Chile, Banco Provincia),
--           (2) actualiza el estado de las tracks de BROU y Banco de Corrientes,
--           (3) carga marcos, riesgos y reuniones del período.
-- Idempotente: todo va con `where not exists`; correrlo dos veces no duplica nada.
-- NO borra ni pisa datos existentes: los updates de tracks solo tocan filas que ya existen
-- y solo las columnas de estado/próximo paso.
-- Correr en el SQL Editor del proyecto iuwvwhofxuvmwnpbsnth.

begin;

-- ============================================================
-- 1. CLIENTES
-- ============================================================
insert into clientes (nome, pais, segmento)
select v.nome, v.pais, v.segmento
from (values
  ('BancoEstado',     'Chile',     'Banco público'),
  ('BBVA Uruguay',    'Uruguay',   'Banco privado'),
  ('Banco de Chile',  'Chile',     'Banco privado'),
  ('Banco Provincia', 'Argentina', 'Banco público')
) as v(nome, pais, segmento)
where not exists (select 1 from clientes c where lower(c.nome) = lower(v.nome));

-- ============================================================
-- 2. PROYECTOS
-- ============================================================
insert into projetos (cliente_id, nome, status, gerente, csm, inicio, descricao)
select c.id, v.nome, v.status, v.gerente, v.csm, v.inicio::date, v.descricao
from (values
  ('BancoEstado',     'Apple Pay + SDK Visa',
   'Aguardando Cliente', 'Soledad Rúa / Jenny Johansen / Bruno', 'Lorena Retamales', null,
   'Pre-proyecto. Contrato Apple firmado; contrato del SDK en firma; servicio de acompañamiento aún NO contratado — es lo que traba la apertura del proyecto y la designación del PM técnico. Proveedor: Veritran (TSP certificada, falta registro como agente tercero).'),
  ('BBVA Uruguay',    'Switch/ITSP + Google Pay',
   'Em Andamento', 'Lina Torres / Bruno Medeiros', null, '2026-01-01',
   'Recta final. Pruebas de push provisioning y legacy OK; material de marketing aprobado por Google. Pendiente: confirmación de Google para la fecha de go-live (propuesta 20/ago). Luego whitelist, monitoreo y cierre.'),
  ('Banco de Chile',  'Migración de procesador a Nuek',
   'Em Andamento', 'Lina Torres / Bruno Medeiros', null, null,
   'Estabilización post-migración. No es implementación de producto: la cadencia es daily sobre la cola de tickets. Daily fija 08:00 por 2 semanas desde ~19/ago.'),
  ('Banco Provincia', 'Squad de Autorizaciones y Fraude',
   'Aguardando Cliente', 'Moisés / Bruno Medeiros', null, '2026-06-01',
   'Consultoría pura (no implementación). Diagnóstico de 150-200 páginas con ~40 accionables LISTO hace semanas y aún NO presentado: el banco no da agenda, no designó coordinador ni responsables de área y no liberó accesos al implante. Multas MAR corriendo mientras tanto.')
) as v(cliente, nome, status, gerente, csm, inicio, descricao)
join clientes c on lower(c.nome) = lower(v.cliente)
where not exists (
  select 1 from projetos p where p.cliente_id = c.id and lower(p.nome) = lower(v.nome)
);

-- ============================================================
-- 3. TRACKS de los proyectos nuevos
-- ============================================================
insert into tracks (projeto_id, nome, frente, status, responsavel, technical_pm, proximo_paso, ruta_critica, waiver_hasta)
select p.id, v.nome, v.frente, v.status, v.responsavel, v.technical_pm, v.proximo_paso, v.ruta_critica, v.waiver_hasta::date
from (values
  -- BancoEstado
  ('BancoEstado','Apple Pay + SDK Visa','SDK Visa','SDK Visa','Sin iniciar','BancoEstado (Oscar / Felipe Muñoz)',null,
   'Firmar contrato del SDK y enrolar usuarios en VDP (bloqueo: el banco filtra links en correos externos)',true,null),
  ('BancoEstado','Apple Pay + SDK Visa','Apple Pay','Apple Pay','Sin iniciar','BancoEstado / Veritran',null,
   'Cerrar prerequisitos: agente tercero (Veritran), Tap to Add en autorizaciones, métodos de step-up además de OTP SMS',false,null),
  -- BBVA Uruguay
  ('BBVA Uruguay','Switch/ITSP + Google Pay','Google Pay','Google Pay','Em curso','BBVA Uruguay','Visa',
   'Esperar aprobación de Google para go-live el 20/ago; luego levantar whitelist y monitorear',true,null),
  ('BBVA Uruguay','Switch/ITSP + Google Pay','Switch / ITSP','Switch / ITSP','Em curso','BBVA Uruguay','Visa',
   'Confirmar si existe rollback de la reasignación de tokens en TLCM y el efecto sobre la tarjeta sustituida',false,null),
  -- Banco de Chile
  ('Banco de Chile','Migración de procesador a Nuek','Estabilización','Estabilización','Em curso - atrasado','Nuek','Nuek',
   'Ticket de Francisco (máx. 20/ago); reunión dedicada al parámetro de renovación anticipada',true,null),
  ('Banco de Chile','Migración de procesador a Nuek','Emisión y reemisión','Emisión y reemisión','Bloqueado','Nuek',null,
   'Servicio de bloqueo con reemisión caído: bloquea la tarjeta pero no genera la nueva',false,null),
  ('Banco de Chile','Migración de procesador a Nuek','Autorizaciones y transaccionalidad','Autorizaciones','Em curso','Nuek',null,
   'LCN invertida desde 15/jul (80% dólar); error 5906 en anulaciones; tarjeta virtual rechazada por CVV',false,null),
  -- Banco Provincia
  ('Banco Provincia','Squad de Autorizaciones y Fraude','Autorizaciones y Fraude','Autorizaciones y Fraude','Bloqueado','Juan Pablo (Riesgo) / Rafael Polo (implante)','Visa VIS',
   'Agendar la presentación del diagnóstico — el banco no responde. Escalar a nivel más alto',true,null),
  ('Banco Provincia','Squad de Autorizaciones y Fraude','Disputas / Controversias','Disputas','Bloqueado','Diana Dicochea','Visa VIS',
   'Coordinar la primera sesión trimestral de análisis de disputas',false,null)
) as v(cliente, projeto, nome, frente, status, responsavel, technical_pm, proximo_paso, ruta_critica, waiver_hasta)
join clientes c on lower(c.nome) = lower(v.cliente)
join projetos p on p.cliente_id = c.id and lower(p.nome) = lower(v.projeto)
where not exists (
  select 1 from tracks t where t.projeto_id = p.id and lower(t.nome) = lower(v.nome)
);

-- ============================================================
-- 4. BROU — actualización de estado de tracks (solo filas existentes)
--    Se hace por coincidencia de nombre; si una track no existe, no pasa nada.
-- ============================================================
update tracks t set
  status       = 'Concluído',
  proximo_paso = 'Configuraciones productivas (10 días hábiles). BIN productivo estimado 31/ago — es el hito que desbloquea las billeteras',
  avance       = 95
from projetos p join clientes c on c.id = p.cliente_id
where t.projeto_id = p.id and lower(c.nome) like 'brou%'
  and (t.nome ilike '%toke%' or t.frente ilike '%toke%');

update tracks t set
  proximo_paso = 'Definir el % de credenciales del enrolamiento masivo; waiver 30/sep, meta de subida 01/oct. Multas ya corriendo',
  waiver_hasta = '2026-09-30'
from projetos p join clientes c on c.id = p.cliente_id
where t.projeto_id = p.id and lower(c.nome) like 'brou%'
  and (t.nome ilike '%click%' or t.frente ilike '%click%');

update tracks t set
  proximo_paso = 'Resolver la "API de novedades" exigida por Apple (problema interno del banco) — riesgo de +1 mes'
from projetos p join clientes c on c.id = p.cliente_id
where t.projeto_id = p.id and lower(c.nome) like 'brou%'
  and (t.nome ilike '%apple%' or t.frente ilike '%apple%');

update tracks t set
  proximo_paso = 'Respuesta de Google sobre los provisionamientos fallidos; material técnico de UPP pendiente de HCT (freeze del banco 25/nov)'
from projetos p join clientes c on c.id = p.cliente_id
where t.projeto_id = p.id and lower(c.nome) like 'brou%'
  and (t.nome ilike '%google%' or t.frente ilike '%google%');

update tracks t set
  proximo_paso = 'Prioridad del proveedor trabada en "fábrica"; la extensión vence el 31/ago',
  waiver_hasta = '2026-08-31'
from projetos p join clientes c on c.id = p.cliente_id
where t.projeto_id = p.id and lower(c.nome) like 'brou%'
  and (t.nome ilike '%ani%' or t.frente ilike '%ani%');

-- ============================================================
-- 5. Banco de Corrientes — actualización de estado de tracks
-- ============================================================
update tracks t set
  proximo_paso = 'Push provisioning OK. Bloqueo: Wallet Extension falla y el Partner Hub espera la firma del contrato de T&C'
from projetos p join clientes c on c.id = p.cliente_id
where t.projeto_id = p.id and lower(c.nome) like '%corrientes%'
  and (t.nome ilike '%apple%' or t.frente ilike '%apple%');

update tracks t set
  proximo_paso = 'Conectividad resuelta (certificado). Abierto: HTTP 503 en el PUT y colisión de CAR ID en Register Consumer. Mandato 30/sep',
  waiver_hasta = '2026-09-30'
from projetos p join clientes c on c.id = p.cliente_id
where t.projeto_id = p.id and lower(c.nome) like '%corrientes%'
  and (t.nome ilike '%click%' or t.frente ilike '%click%');

-- ============================================================
-- 6. MARCOS (hitos con fecha) — se cuelgan de la track de ruta crítica del proyecto
-- ============================================================
insert into marcos (track_id, nome, fecha, concluido, orden)
select t.id, v.nome, v.fecha::date, v.concluido, v.orden
from (values
  ('BROU','toke','Certificación de host concluida — carta obtenida','2026-08-11',true,1),
  ('BROU','toke','Ticket de configuración productiva creado','2026-08-12',true,2),
  ('BROU','toke','BIN productivo — desbloquea las billeteras','2026-08-31',false,3),
  ('BROU','toke','Inicio de Friends & Family (5 días)','2026-09-01',false,4),
  ('BROU','toke','Remover whitelist = go-live','2026-09-07',false,5),
  ('BROU','toke','Cierre del proyecto de tokenización','2026-09-15',false,6),
  ('BROU','click','Vence el waiver de Click to Pay','2026-09-30',false,1),
  ('BROU','click','Meta de subida masiva de credenciales','2026-10-01',false,2),
  ('BROU','ani','Vence la extensión del mandato ANI','2026-08-31',false,1),
  ('BROU','google','Última ventana de instalación antes del freeze del banco','2026-11-25',false,1),
  ('Banco de Corrientes','click','Deadline del mandato Click to Pay','2026-09-30',false,1),
  ('Banco de Corrientes','apple','3er SteerCo','2026-08-28',false,1),
  ('BBVA Uruguay','Google Pay','Go-live propuesto a Google','2026-08-20',false,1),
  ('Banco de Chile','Estabilización','Ticket de Francisco (máximo)','2026-08-20',false,1),
  ('Banco de Chile','Estabilización','Ticket de cupo controlado','2026-08-31',false,2)
) as v(cliente, trackmatch, nome, fecha, concluido, orden)
join clientes c on lower(c.nome) like '%' || lower(v.cliente) || '%'
join projetos p on p.cliente_id = c.id
join tracks t on t.projeto_id = p.id and (t.nome ilike '%' || v.trackmatch || '%' or t.frente ilike '%' || v.trackmatch || '%')
where not exists (select 1 from marcos m where m.track_id = t.id and lower(m.nome) = lower(v.nome));

-- ============================================================
-- 7. RIESGOS (RAID) a nivel de proyecto
-- ============================================================
insert into riscos (projeto_id, descricao, tipo, severidade, dueno, status, mitigacion)
select p.id, v.descricao, v.tipo, v.severidade, v.dueno, v.status, v.mitigacion
from (values
  ('BROU','Decisión de extensión del contrato VCA vencida: el BIN queda productivo ~31/ago y el contrato termina el 21/sep — ninguna billetera de débito cabe en el alcance actual',
   'riesgo','alta','Visa comercial + BROU','abierto','El banco pidió la extensión en el SteerCo del 29/jul; la Visa prometió visibilidad de capacity y precio para mediados de agosto'),
  ('BROU','Click to Pay: base de clientes sucia (correos y celulares compartidos entre clientes) impide alcanzar el volumen exigido. Waiver vence 30/sep y ya hay multas corriendo',
   'issue','alta','BROU','abierto','Aceptación parcial en discusión: subir un porcentaje demostrable en vez del 100%'),
  ('BROU','Mandato OCT/AFT sin waiver formal registrado — el vigente venció en junio y no hay registro de validez hasta octubre',
   'riesgo','alta','BROU','en_mitigacion','Preparar nota preventiva al área de reglas de la Visa documentando avance y postura, antes de recibir carta de penalización'),
  ('BROU','Conflicto de calendario UPP: Google exige Unified Provisioning hasta dic/2026, pero el freeze del banco va del 25/nov a enero — el plazo real es fin de noviembre, y HCT aún no entregó la especificación técnica',
   'riesgo','media','HCT / BROU','abierto',null),
  ('Banco de Corrientes','Partner Hub bloqueado esperando la firma gerencial del contrato de T&C (con traducción y revisión jurídica pendientes) — sin plazo y fuera del control del equipo de proyecto',
   'issue','alta','Banco de Corrientes (gerencia + jurídico)','abierto','Requiere escalamiento'),
  ('Banco de Corrientes','HTTP 503 en el PUT de Click to Pay sin causa raíz ni ETA — dependencia total de Thales, contra un mandato que vence el 30/sep',
   'issue','alta','Thales','abierto',null),
  ('Banco de Corrientes','Material de marketing atrasado; la Apple aprueba las piezas y hay precedente de emisor parado 2 meses por rechazo de pieza',
   'riesgo','media','Banco de Corrientes (marketing/comercial)','abierto',null),
  ('BancoEstado','Meta interna del banco de producción en diciembre contra el benchmark declarado por la Visa: ningún caso en la región en menos de 6 meses (SDK + Apple: 7 a 8)',
   'riesgo','alta','BancoEstado','abierto','Registrar por escrito antes de abrir el proyecto'),
  ('BancoEstado','El servicio de acompañamiento aún no está contratado — sin él no hay proyecto abierto ni PM técnico designado',
   'issue','alta','BancoEstado (Jorge Núñez)','abierto',null),
  ('BancoEstado','El banco filtra links en correos externos e impide el acceso al VDP y la descarga del SDK',
   'issue','media','TI de BancoEstado','abierto','La Visa liberó el SDK antes de la firma para no trabar el avance técnico'),
  ('BBVA Uruguay','La aprobación de Google para la fecha de go-live está fuera del control de la Visa y Google suele pedir más plazo; el feriado del 25/ago estrecha la ventana',
   'riesgo','media','Google','abierto','Se pidió el 20/ago enfatizando la relevancia; alternativa 24/ago'),
  ('BBVA Uruguay','No está confirmado si existe rollback de la reasignación de tokens en TLCM; en prueba la tarjeta sustituida no pudo volver a provisionarse',
   'riesgo','baja','Visa','abierto','No bloquea el go-live; afecta a un grupo reducido de tarjetas ya alteradas'),
  ('Banco de Chile','La renovación anticipada existía en el legado y no funciona en Nuek; la alternativa (cambiar el parámetro de 5 meses) es global e impacta plásticos y procesos',
   'issue','alta','Nuek','abierto','Reunión dedicada con los especialistas, incluyendo el equipo de plásticos'),
  ('Banco de Chile','LCN con la moneda invertida desde el 15/jul (80% dólar): la base de estadísticas y consulta de transacciones del banco no es confiable',
   'issue','alta','Nuek','abierto','Ticket específico separado del ticket grande, por trazabilidad'),
  ('Banco Provincia','El banco está parado al 100%: diagnóstico listo hace semanas sin presentar, sin coordinador designado y sin accesos para el implante. Proyecto de 1 año perdiendo ~2 meses de ventana',
   'issue','alta','Banco Provincia','en_mitigacion','Escalar el destrabe a nivel más alto; integrar a Bruno en los pushes de agenda'),
  ('Banco Provincia','Exposición financiera activa a multas MAR: febrero en el techo (10 BINs) y marzo con 9 segmentos, mientras el roadmap no arranca',
   'riesgo','alta','Banco Provincia','abierto',null),
  ('Banco Provincia','NSF es el motivo de rechazo n.º 1 y su único accionable real es ampliar la línea de crédito — algo que en el contexto argentino ningún banco quiere hacer',
   'riesgo','media','Visa (equipo de Riesgo)','abierto','Concentrar las recomendaciones en los rechazos de origen técnico, que sí tienen solución')
) as v(cliente, descricao, tipo, severidade, dueno, status, mitigacion)
join clientes c on lower(c.nome) like '%' || lower(v.cliente) || '%'
join projetos p on p.cliente_id = c.id
where not exists (select 1 from riscos r where r.projeto_id = p.id and r.descricao = v.descricao);

-- ============================================================
-- 8. REUNIONES del período (jul–ago/2026)
--    Se ligan por projeto_id, que es lo que usa la tarjeta "Reuniones del proyecto".
--    NO se cargan en reunion_tracks: el vínculo por track se hace desde la app,
--    donde se ve el nombre real de cada track.
--    `ata` queda vacía a propósito — la transcripción completa vive en OneDrive.
-- ============================================================
insert into reunioes (cliente_id, projeto_id, titulo, tipo, data, participantes, resumo_ia, decisoes)
select c.id, p.id, v.titulo, v.tipo, v.data::date, v.participantes::jsonb, v.resumo, v.decisoes
from (values
  ('BROU','Sesión técnica Click to Pay — dudas de producto','adhoc','2026-07-21',
   '[{"nombre":"Alexis (Visa Producto)"},{"nombre":"Ivana (Sistarbanc)"},{"nombre":"Juan Pablo (Sistarbanc)"},{"nombre":"Eduardo (BROU)"},{"nombre":"Jimena (BROU)"},{"nombre":"Jenny"},{"nombre":"Lina"}]',
   'El Destination Site se desactivará región por región; donde el emisor hace el enrolamiento masivo, lo que él envió prevalece y el sitio queda de solo lectura. Login por correo O teléfono, definido por el OTP, con comportamiento cross-marca y cross-emisor.',
   E'• Confirmado el diseño del enrolamiento masivo: archivo del banco → Sistarbanc → API masiva de HCT → API masiva de Visa\n• Alexis lleva a validar los casos de merge de credenciales\n• El diseño de External Consumer ID (4 códigos emisores) se revisa con el equipo regional'),
  ('BROU','Seguimiento — certificación de APIs y caso 13.2','semanal','2026-07-22',
   '[{"nombre":"Fernando (Visa)"},{"nombre":"Alfredo (BROU)"},{"nombre":"Gonzalo (BROU)"},{"nombre":"Juan Pablo (Sistarbanc)"},{"nombre":"Adiel (Smart Vista)"}]',
   'Depuración en vivo del caso 13.2, que devolvía código 82. Se identificó que las tarjetas físicas de prueba estaban mal grabadas (CVV impreso 705, leído 303, informado 113).',
   E'• En el campo 2 va el DPAN / token number, confirmado por Global Client Testing\n• Buscar tarjetas fuera de la partida sospechosa y validar el CVV con el procesador'),
  ('BROU','Revisión interna del deck del SteerCo','adhoc','2026-07-24',
   '[{"nombre":"Jenny"},{"nombre":"Lina"},{"nombre":"Bruno Medeiros"}]',
   'Construcción del deck del primer SteerCo. El contrato vence el 21/sep y la tokenización termina el 28/ago: la extensión es prácticamente inevitable.',
   E'• Sustituir el cronograma por un mapa de dependencias — Bruno hace el borrador\n• Incluir una lámina de semáforo por track antes del detalle\n• No detallar el avance técnico de tokenización: reportar solo "quedan dos casos por resolver"'),
  ('BROU','1er Steering Committee (presencial, Montevideo)','steerco','2026-07-29',
   '[{"nombre":"Lina Torres"},{"nombre":"Vanessa"},{"nombre":"Bruno Medeiros"},{"nombre":"Jimena (BROU)"},{"nombre":"Ejecutivos BROU"}]',
   'SteerCo inaugural. Semáforo: tokenización verde (cierre estimado 28/ago), Apple Pay y Garmin en rojo, Click to Pay en curso con waiver hasta 30/sep, ANI y OCT/AFT en espera. El banco pidió explícitamente la extensión del contrato.',
   E'• Instaurar cadencia mensual del SteerCo\n• Evaluar la extensión del contrato VCA: capacity, continuidad de la PM y precio para 1, 2 o 3 meses, con visibilidad a mediados de agosto\n• Preparar una comunicación preventiva al área de reglas de la Visa sobre OCT/AFT\n• La priorización wallets vs. mandatos se decide en la SteerCo de agosto'),
  ('BROU','Weekly de certificación — provas de API y preparación de host','semanal','2026-07-29',
   '[{"nombre":"Fernando (Visa)"},{"nombre":"Alfredo (BROU)"},{"nombre":"Jimena (BROU)"},{"nombre":"Juan Pablo (Sistarbanc)"}]',
   'Proyecto en 56%. Ningún token disponible a pocos días del inicio de la certificación de host.',
   E'• Nueva sesión de pruebas atendida para dejar varios tokens activos como juego de datos\n• Lección: nunca desmontar un token sin tener otro funcionando\n• Scoping adelantado al 03/ago'),
  ('BROU','Scoping call de certificación VTS COF / e-Commerce','adhoc','2026-08-05',
   '[{"nombre":"Ingeniero de certificación (Visa)"},{"nombre":"Fernando (Visa)"},{"nombre":"Alfredo (BROU)"}]',
   'Sesión de alcance, sin ejecución de pruebas. Estación 11.7653 verificada por ecotest y tarjeta compartida con el certificador.',
   E'• Alcance del script: solo casos de token; retail, AFT y OCT quedan fuera\n• Caso 13.2 (Dynamic CVV) marcado como NO aplica y cerrado sin ejecución\n• Ventana de 2h partida en dos de 1h el 11/ago (09:30 y 17:30 Uruguay)'),
  ('BROU','Seguimiento VTS COF / e-Commerce','semanal','2026-08-06',
   '[{"nombre":"Fernando (Visa)"},{"nombre":"Jimena (BROU)"},{"nombre":"Carlos (HCT)"},{"nombre":"Alfredo (BROU)"}]',
   'Revisión del plan y de los insumos para la configuración productiva.',
   E'• BROU envía el DEF y el Processor Digital Activation Request de producción el 07/ago — gana ~1 semana\n• Friends & Family confirmado, con whitelist en VRM\n• La billetera propia del BROU queda FUERA del alcance: tiene Token Requestor ID propio'),
  ('BROU','Certificación de host — dos ventanas de 1h','adhoc','2026-08-11',
   '[{"nombre":"Ingeniero de certificación (Visa)"},{"nombre":"Fernando (Visa)"},{"nombre":"Equipo BROU"}]',
   'Certificación concluida con éxito en las dos ventanas del día. Carta de certificación obtenida.',
   '• Certificación CONCLUIDA — carta obtenida'),
  ('BROU','Seguimiento de tokenización — post-certificación','semanal','2026-08-12',
   '[{"nombre":"Fernando (Visa)"},{"nombre":"Jimena (BROU)"},{"nombre":"Lina Torres"}]',
   'Replanificación hasta el cierre. El DEF llegó durante la reunión, desbloqueando la solicitud.',
   E'• Ticket de configuración productiva creado el 12/ago (10 días hábiles)\n• Cronograma: 31/ago BIN productivo → 01/sep F&F (5 días) → go-live primera semana de septiembre → cierre 15/sep\n• HITO QUE DESBLOQUEA LAS BILLETERAS: el BIN productivo (~31/ago), NO el cierre del proyecto'),
  ('Banco de Corrientes','Revisión del Partner Hub y análisis de logs del flujo verde','semanal','2026-07-16',
   '[{"nombre":"Franco Demaria (Visa)"},{"nombre":"Laura (Visa)"},{"nombre":"Juanjo (Banco)"},{"nombre":"Cristian (Banco)"},{"nombre":"Mario (Visa)"},{"nombre":"Miguel Ángel (Thales)"},{"nombre":"Patricia (Thales)"}]',
   'Partner Hub de 27% a 60%. Confirmado que la configuración del lado Visa está correcta (el flujo amarillo funciona). El flujo verde no llega a la Visa: se queda en el ITSP.',
   E'• Publicar la app en TestFlight y repetir las pruebas desde ahí\n• Reenviar el correo de prerequisito a Apple para reconfirmar el AID\n• Compartir Correlation ID y Secure Element ID para rastrear en los logs'),
  ('Banco de Corrientes','Seguimiento Click to Pay y reagendamiento del SteerCo','semanal','2026-07-16',
   '[{"nombre":"Edgar Javier Cadena (Visa)"},{"nombre":"Juanjo (Banco)"},{"nombre":"Patricia (Thales)"},{"nombre":"Verónica (Banco)"},{"nombre":"Prisma"}]',
   'Prisma confirmó fase 1 y las altas masivas concluidas, sin pendientes. Thales sin validaciones adicionales.',
   E'• Pruebas de Click to Pay en preproducción desde el 22/jul\n• Sesión técnica con Thales el 24/jul a las 13:00\n• SteerCo reagendado a la ventana 27–31/jul'),
  ('Banco de Corrientes','Briefing de handover — Edgar a Bruno','adhoc','2026-08-06',
   '[{"nombre":"Edgar Javier Cadena (Visa)"},{"nombre":"Bruno Medeiros"}]',
   'Traspaso de la conducción de las weeklies por feriado en Colombia y licencia de Lina.',
   E'• Bruno conduce la weekly de Click to Pay del 07/ago\n• Bruno redacta el acta y Edgar la reenvía desde su cuenta Visa'),
  ('Banco de Corrientes','Weekly doble — Apple Pay y Click to Pay','semanal','2026-08-07',
   '[{"nombre":"Franco Demaria (Visa)"},{"nombre":"Bruno Medeiros"},{"nombre":"Patricia (Thales)"},{"nombre":"Juanjo (Banco)"},{"nombre":"Cristian (Banco)"},{"nombre":"Iván (Prisma)"}]',
   'El push provisioning ya funciona. Se descubrió que la configuración de Apple en el BCM (App ID / Banking Store ID) nunca había sido enviada: el campo Last Update seguía en el 2 de julio. Regrabada en vivo.',
   E'• Regrabar la configuración del BCM y reprobar tras la propagación\n• No hace falta reasignar rangos de BIN: hay un único grupo de Additional Information\n• No cerrar fecha con FIME todavía, solo consultar disponibilidad\n• Click to Pay: dejar de insistir en el registro en ambiente de prueba y usar la dupla CAR ID + Consumer ID ya registrada\n• Las notificaciones no son obligatorias para homologar'),
  ('Banco Provincia','Handover del squad de autorizaciones y fraude','adhoc','2026-08-10',
   '[{"nombre":"Moisés (Visa VIS)"},{"nombre":"Bruno Medeiros"}]',
   'Bruno asume como la cara visible del VIS frente al banco. El diagnóstico está listo hace 3 semanas y no se ha podido presentar: el banco está parado al 100%.',
   E'• Bruno asume el contacto directo, con Moisés acompañando la fase inicial\n• Integrar a Bruno en los pushes de agenda con el banco\n• Escalar el destrabe a nivel más alto'),
  ('Banco de Chile','Daily de estabilización de la migración','semanal','2026-08-18',
   '[{"nombre":"Sebastián (Nuek)"},{"nombre":"Claudia (Banco)"},{"nombre":"Paola (Banco)"},{"nombre":"Joyce (Banco)"},{"nombre":"Tatiana (Banco)"},{"nombre":"John (Banco)"},{"nombre":"Claudio (Banco)"}]',
   'Revisión de la cola de tickets. Temas mayores: renovación anticipada inexistente en Nuek, LCN con moneda invertida desde el 15/jul, tarjeta virtual rechazada por CVV y error 5906 en anulaciones.',
   E'• Abrir ticket específico de la LCN, separado del ticket grande\n• Abrir ticket de la tarjeta virtual rechazada por CVV\n• No forzar manualmente una renovación anticipada: tratarla por parámetro en reunión dedicada\n• Daily fija a las 08:00 por 2 semanas'),
  ('BBVA Uruguay','Seguimiento Switch/ITSP + Google Pay','semanal','2026-08-18',
   '[{"nombre":"Visa"},{"nombre":"BBVA Uruguay"}]',
   'Pruebas concluidas (push provisioning y legacy) y material de marketing aprobado por Google. Falta la confirmación de Google para la fecha de salida.',
   E'• Proponer a Google el 20/ago como fecha de go-live\n• Descartar 24 y 26/ago por el feriado del 25 en Uruguay\n• Lanzamiento solo Android: sin redes sociales al inicio\n• Toda campaña nueva de Google Pay pasa por el portal para aprobación')
) as v(cliente, titulo, tipo, data, participantes, resumo, decisoes)
join clientes c on lower(c.nome) like '%' || lower(v.cliente) || '%'
join projetos p on p.cliente_id = c.id
where not exists (
  select 1 from reunioes r
  where r.projeto_id = p.id and lower(r.titulo) = lower(v.titulo) and r.data = v.data::date
);

commit;
