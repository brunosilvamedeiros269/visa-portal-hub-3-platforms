---
title: "Troubleshooting — crash del flujo verde (push provisioning)"
tags: ["troubleshooting"]
fuente: Reports/minutas de proyecto
estado: verificado
---

# Troubleshooting — crash del flujo verde (push provisioning)

> [!bug] Síntoma
> El push provisioning in-app ([[Fluxo verde (00)|flujo verde]]) **crashea** o no se completa al enrolar la tarjeta desde la billetera del banco.

## Diagnóstico (en este orden)
1. **¿La config de Visa está OK?** Si el [[Fluxo amarelo (85)|flujo amarillo]] funciona, los T&C están cargados y ya funciona en Google Pay → la config de Visa probablemente está bien.
2. **¿Dónde muere la llamada?** Si el intento **no llega a Visa** (queda en el [[ITSP]]/SDK), el problema es del lado del ITSP/app, no de Visa.
3. **Comparar logs** vía [[Vital Sign]] (Correlation ID / Token Reference ID).

## Causa raíz más común
**Payload / token de login expirado** entre la app del banco y el [[ITSP]] — la sesión de autenticación usada para iniciar el enrolamiento venció.

## Acciones
- Publicar la app en **[[TestFlight]]** (no correr solo el release local en el device).
- Reenviar e-mail a Apple confirmando la vigencia del **[[AID (Apple)|AID]]**.
- Compartir **Correlation ID / Token Reference ID** con el [[ITSP]] para rastrear.

## Variante: crédito pasa, débito falla

Cuando la misma app enrola **crédito con éxito** pero **débito falla**, el problema deja de ser de la app o de la sesión y pasa a ser de **elegibilidad/digitalización del producto** — la diferencia está en lo que el procesador/emisor responde para ese BIN.

- Síntoma típico: **HTTP 400** devuelto por el procesador/emisor, en `checkCardEligibility` ([[Check Eligibility]]) o `requestCardDigitization`, con **`responseCode 911 — Operation failed`**.
- El owner del cierre tiende a ser el **[[Processador|procesador]] / emisor**, no Visa ni el [[ITSP]] — pero confirme el owner explícitamente: es el punto que suele quedar sin dueño entre tres partes.
- No lo trate como el mismo incidente del crash de flujo verde: aquel es sesión/token, este es producto/BIN.

## Variante: se enroló, pero la app no lo sabe

El provisioning concluye con éxito y aun así la app del banco sigue mostrando la tarjeta como **no enrolada**, dejando que el usuario repita la operación. Aquí el defecto está en la **devolución del estado del token** a la app después del enrolamiento — verificar la actualización de estado en las plataformas involucradas antes de tocar la app.

> [!example] Visto en producción
> [[Banco de Corrientes — dossiê|Banco de Corrientes]] (Apple Pay) — flujo verde trabado; config de Visa OK, la llamada no llegaba a Visa.
> [[Banco de Corrientes — dossiê|Banco de Corrientes]], 30/jul/2026 — crédito enrolando OK tras el ajuste de [[Prisma]]; **débito** con HTTP 400 / responseCode 911, y **estado posprovisioning** que no se reflejaba en la app.

---
[[Home]]
