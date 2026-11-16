---
aliases: ["CAR ID", "Card Reference ID"]
tags: ["glosario/click-to-pay"]
categoria: Click to Pay
fuente: Weekly Banco de Corrientes (7/ago/2026)
estado: parcial
---

# CAR ID

> [!info] [[Click to Pay]]

Identificador con el que la plataforma del [[ITSP]] referencia una **tarjeta registrada** en [[Click to Pay]]. Va en par con el **Consumer ID** (el consumidor al que está asociada la tarjeta).

## Por qué importa
Un **PAN solo puede estar registrado una vez** con un CAR ID dado. Intentar registrarlo de nuevo — con otro CAR ID o bajo otro consumidor — falla. Es la causa más común de error repetido en el [[Register Consumer]] en ambiente de prueba, donde se reutiliza el mismo puñado de tarjetas.

> [!tip] Buena práctica
> El emisor debe mantener una **tabla asociativa propia** entre sus datos y los CAR IDs / Consumer IDs. Sin ella, la app no sabe si la tarjeta ya está registrada y entra en un loop de intentos. [[Thales]] expone la API **`getCard`** (entra el CAR ID, devuelve el PAN asociado) para conciliar.

> [!warning] En ambiente de prueba, no insista en el registro
> Si el objetivo es probar [[Click to Pay]] y no el alta, use el par CAR ID + Consumer ID ya registrado, o datos limpios, o saltee la etapa de registro. Fue la recomendación explícita del [[ITSP]] al [[Banco de Corrientes — dossiê|Banco de Corrientes]].

> [!note] Estado de esta nota
> Nombre y rol vienen de una minuta de reunión, no de la especificación. **Contrato exacto y formato del identificador no confirmados** contra la documentación del [[ITSP]].

**Categoría:** [[MOC — Click to Pay]]

---
[[Home]]
