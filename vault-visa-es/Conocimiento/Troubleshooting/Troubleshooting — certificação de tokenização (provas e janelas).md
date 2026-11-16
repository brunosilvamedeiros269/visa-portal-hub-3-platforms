---
title: "Troubleshooting — certificación de tokenización (pruebas y ventanas)"
tags: ["troubleshooting"]
fuente: Certificación VTS COF/e-Commerce — BROU (jul–ago/2026)
estado: verificado
---

# Troubleshooting — certificación de tokenización (pruebas y ventanas)

> [!bug] Síntoma
> La certificación de [[Tokenização|tokenización]] no avanza: casos trabados, ventanas desperdiciadas, pruebas que no se logran ejecutar — y el track entero de billeteras parado detrás de ella.

Reunión tras reunión, los bloqueos de certificación del [[BROU — dossiê|BROU]] cayeron en cuatro categorías. Ninguna era un defecto de plataforma.

## 1. Falta de juego de datos
**El antipatrón:** tener **una única tarjeta tokenizada** y trabajar sobre ella. Cuando ese token se cae o se desmonta, una línea entera de pruebas se detiene.

> *"Cometimos el problema de tener una única tarjeta tokenizada y después trabajar sobre ella… ahora no estaríamos con este problema de que tenemos toda una línea de pruebas trancadas por falta de juegos de datos."*

**Qué hacer:** es posible generar **N tokens por tarjeta**. Antes de desmontar cualquier token, genere varios sobre la tarjeta que comprobadamente tokeniza y deje un juego activo. **Nunca desmonte un token sin tener otro funcionando.**

## 2. Datos de prueba inválidos
Dos ocurrencias distintas, ambas caras:
- **Tarjetas generadas con claves de producción** en lugar de claves de prueba → falla en la validación del CVV en aprovisionamientos con CVV incluido. Fue la causa raíz de una ventana entera perdida.
- **Tarjetas físicas mal embozadas** — CVV impreso en el plástico **705**, valor leído en el simulador **303**, valor informado por el procesador **113**. Ninguno de los tres coincidía, y la sospecha era que **toda la partida** estuviera mal. Detalle que confunde: las transacciones **no tokenizadas** con esas mismas tarjetas funcionaban.

**Qué hacer:** validar el CVV con el [[Processador|procesador]] antes de empezar, y tener tarjetas de reserva fuera de la partida sospechosa.

## 3. Documentación del script insuficiente
El Excel del caso 13.2 decía apenas **"a valid token"** en el campo 2 — sin especificar **qué componente** del token. El equipo gastó una reunión entera en prueba y error entre PAN y DPAN.

**Respuesta correcta, confirmada por Global Client Testing:** en el **campo 2 va el [[DPAN]] / token number**. Los dos escenarios de falla:
- con **PAN** en el campo 2 → llega al procesador, que rechaza por CVV en blanco;
- con **DPAN** en el campo 2 → Visa rechaza antes (código **82**) y la transacción ni llega al procesador.

**Qué hacer:** cuando el script sea ambiguo, escriba a **Global Client Testing** con el caso de prueba, **Token Reference ID**, valor del token y el **RRN** generado — en lugar de iterar a ciegas.

## 4. Ventanas mal dimensionadas
| Error | Corrección |
|---|---|
| Agendar **30 minutos** para un guion que exige 1–2 h | Pedir **1 a 2 horas** desde el inicio. Una ventana corta cuesta una semana |
| No encontrar un slot de 2 h continuas y esperar | **Partirla en dos ventanas de 1 h el mismo día** — así fue como el BROU anticipó la certificación en una semana |
| Cancelar a último momento | **Se cobra igual.** Reprogramar con anticipación; si hay riesgo de ajuste técnico, dejar un día entre una ventana y otra |
| Llegar sin insumos | Confirmar la estación por **ecotest** y **compartir la tarjeta antes**, para que el certificador ya aprovisione los tokens |

> [!tip] Con tokens preaprovisionados, menos gente tiene que estar en la sala
> Si el ingeniero genera los tokens antes de la sesión, el [[ITSP]] y el [[Processador|procesador]] **no necesitan participar** en la ejecución. Confírmelo con el ingeniero y ahorre convocatorias innecesarias.

## 5. Casos que simplemente no aplican
Antes de pelear con un caso, verifique si **aplica al perfil del emisor**. En la [[Scoping call|scoping call]] del BROU, el caso **13.2 (Dynamic CVV)** — la única prueba pendiente, que venía trabando el cierre — se marcó como **no aplica** y se cerró **sin ejecución**. Lo mismo suele valer para pruebas de [[OCT - AFT|AFT y OCT]] en emisores que no participan de esos flujos, y para pruebas de retail cuando el alcance es solo token.

> [!example] Visto en producción
> [[BROU — dossiê|BROU]], jul–ago/2026 — pruebas de API trabadas por falta de juego de datos y por datos de tarjeta inválidos; caso 13.2 sin interpretación por ambigüedad del script; ventana de 30 min insuficiente. Resueltos los cuatro puntos, la certificación de host cerró el **11/ago** en dos ventanas de 1 h, con carta obtenida.

---
[[Home]]
