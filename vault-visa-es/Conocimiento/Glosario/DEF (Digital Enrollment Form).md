---
aliases: ["DEF", "Digital Enrollment Form"]
tags: ["glosario/tokenizacao"]
categoria: Tokenização
fuente: Seguimiento VTS COF/e-Commerce — BROU (ago/2026)
estado: verificado
---

# DEF (Digital Enrollment Form)

> [!info] [[Tokenização|Tokenización]]

Formulario que declara a Visa las **URLs y los campos a activar a nivel de [[Processador|PCR]]** para habilitar la tokenización de un emisor. Junto con el **Processor Digital Activation Request**, es el insumo obligatorio para que Visa solicite las **configuraciones productivas**.

## Cómo funciona en la práctica
- Son **los mismos dos documentos ya completados para el ambiente de prueba** — basta con revisarlos y cambiar el campo de *entorno* a "producción".
- El Implementation Manager **no puede adelantar** la solicitud: solo se envía **después de la carta de certificación**.
- La configuración productiva lleva **10 días hábiles** y la ejecuta el equipo de configuraciones digitales de Visa, que hace una revisión preliminar y devuelve la fecha efectiva.

> [!tip] Ganancia de cronograma
> Entregar el DEF y el Processor Digital Activation Request de producción **antes** de la ventana de certificación anticipa el disparador de los 10 días hábiles. En el [[BROU — dossiê|BROU]] eso valió cerca de **una semana**.

> [!warning] Trampa conocida
> La entrega del DEF ya falló por **bloqueo de e-mail con adjunto** entre banco y Visa. Si el e-mail no llega, adjuntarlo al caso en **Dynamics** o usar correo seguro.

**Categoría:** [[MOC — Tokenização]]

---
[[Home]]
