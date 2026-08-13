# Plan de proyecto - Chakana Art Car

Versión: prefactibilidad v0.2 - agosto de 2026

## Objetivo

Construir un primer art car pequeño, transportable y de bajo riesgo que:

- se desplace a 5-8 km/h durante hasta 5 km por carga;
- opere sobre pasto, rastrojo, tierra firme y barro superficial;
- tenga un solo conductor sentado durante la marcha;
- se convierta, detenido, en una fiesta con el DJ de pie dentro de una única fachada de chakana;
- use un donor eléctrico local 2WD con eje trasero motriz;
- mantenga un techo de inversión de USD 15.000.

El proyecto no incluye circulación por vía pública, pasajeros, DJ de pie en movimiento, barro profundo, pendientes fuertes ni homologación de un vehículo nuevo.

## Estrategia de ejecución

La secuencia protege el presupuesto: primero se prueba el vehículo desnudo y recién después se construye la escultura. Cada etapa termina con una decisión `GO / STOP`.

| Etapa | Duración orientativa | Resultado | Gate de salida |
|---|---:|---|---|
| 0. Definición | 1 semana | Requisitos congelados, roles y techo de USD 15.000 | Alcance firmado; sin pasajeros; DJ sólo detenido |
| 1. Búsqueda de donor | 2-4 semanas | Terna de carros de golf/utilitarios 48 V usados | Modelo, serie, capacidad, frenos, dirección y Tow/neutro verificados |
| 2. Compra e inspección | 1 semana | Donor adquirido y pesado por eje | Donor + reparación inicial <= USD 4.950; 5 km cargado sin falla |
| 3. Rolling prototype | 3-5 semanas | Rodaje, frenos, ruedas y recuperación terminados | Frena recto, retiene en pendiente, no roza y puede empujarse |
| 4. Sistema de fiesta | 2-3 semanas | Generador, tablero AC, PA alquilado y mesa DJ | RCD probado; tracción inhibida; ensayo continuo de 4 h |
| 5. Chakana liviana | 4-6 semanas | Una fachada escalonada modular y registros técnicos | Masa/CG aceptables, visión y ventilación libres, bordes seguros |
| 6. Integración | 2 semanas | Vehículo completo cableado y documentado | Pesaje final, checklist, E-stop, iluminación 360 grados |
| 7. Ensayo de aceptación | 1-2 semanas | SAT en terreno comparable al evento | 5 km, freno, pendiente, despliegue, audio y recuperación aprobados |
| 8. Evento piloto | 1 evento | Operación real con bitácora | Sin incidentes y lista de correcciones cerrada |

Plazo orientativo total: 16-24 semanas, condicionado por disponibilidad del donor y trabajo voluntario.

## Gates económicos

| Gate | Límite | Regla |
|---|---:|---|
| G1 - Donor + puesta a punto | USD 4.950 | Si necesita banco completo de baterías o reconstrucción de transaxle, se rechaza |
| G2 - Donor + rodaje/recuperación | USD 6.500 | No se recortan frenos, capacidad de neumáticos ni puntos de rescate |
| G3 - Fiesta y seguridad eléctrica | USD 2.550 | PA alquilado; generador en tierra; RCD y extinción obligatorios |
| G4 - Arte, fabricación y ensayos | USD 2.900 | Piel modular de 80-130 kg; sin cinética compleja |
| G5 - Contingencia | USD 1.300 | Se mantiene sin comprometer hasta el ensayo final |
| Total | USD 15.000 | Objetivo base USD 14.650; margen USD 350 |

## Estructura del equipo

| Rol | Responsabilidad principal | Participación |
|---|---|---|
| Responsable de proyecto | alcance, presupuesto, gates y calendario | Todas las etapas |
| Ingeniería mecánica | donor, bastidor, ruedas, frenos, dirección y recuperación | 1-7 |
| Electricidad/electrónica | 48 V, E-stop, luces, 230 V, RCD y puesta a tierra | 2-7 |
| Diseño industrial/artístico | fachada, piel, registros, ergonomía y acabados | 0, 4-6 |
| Sonido/DJ | PA alquilado, SPL, consumo, montaje y operación | 4, 6-8 |
| Fabricación | soldadura crítica, costillas, paneles y fijaciones | 3-6 |
| Piloto/seguridad | visibilidad, maniobra, spotters y checklist | 2-8 |
| Compras/logística | donor, cotizaciones, repuestos y transporte | 1-8 |

Una persona puede cubrir varios roles, excepto que las revisiones críticas de frenos y 230 V deben realizarlas especialistas competentes.

## Hitos y entregables

1. `M0 - alcance`: README, plan, presupuesto y planos preliminares aprobados.
2. `M1 - donor`: informe de inspección, fotos, manual, pesaje y prueba de 5 km.
3. `M2 - rolling prototype`: plano de interfaces actualizado, lista de torque y ensayo de freno.
4. `M3 - fiesta estacionaria`: unifilar AC, prueba RCD, distribución PA y procedimiento de generador.
5. `M4 - chakana`: plantilla 1:1 de fachada, despiece y masa real.
6. `M5 - aceptación`: dossier as-built, checklist diario y registro de ensayos.
7. `M6 - evento piloto`: informe de operación y backlog de mejoras.

## Ensayos mínimos

- Pesar cada eje con piloto, arte y equipos en configuración de marcha.
- Verificar que cada neumático tenga capacidad certificada >= 1,25 veces la carga máxima medida de esa rueda.
- Completar 5 km sobre pasto/tierra y registrar tensión inicial/final y temperatura.
- Arrancar y frenar sobre una pendiente seca del 10%; estacionar con freno y calzos.
- Frenar recto desde 10 km/h sin pérdida de dirección.
- Probar giro y recorrido de suspensión completos con al menos 25 mm de despeje dinámico.
- Verificar Tow/neutro con llave fuera; dos adultos deben poder moverlo en suelo firme.
- Operar PA y generador durante cuatro horas con RCD, térmicas y cable protegido.
- Desplegar/replegar la fachada DJ con dos personas, sin ingresar bajo un panel sin puntal mecánico.
- Realizar ensayo nocturno de iluminación funcional 360 grados.

## Riesgos que detienen el proyecto

- Chasis fisurado, capacidad del fabricante desconocida o donor sin identificación.
- Banco de baterías agotado que lleve el total por encima del gate G1.
- Freno de servicio o estacionamiento insuficiente después de aumentar diámetro de rueda.
- Neumáticos sin tabla de carga, interferencias o necesidad de separadores estructuralmente no verificados.
- Tow/neutro sólo electrónico que no desacople ni habilite remolque según el fabricante.
- Fachada que obstruya visión, dirección, ruedas, ventilación, E-stop o salida del piloto.
- Generador funcionando sobre el vehículo, encerrado o durante la marcha.
- DJ o cualquier pasajero de pie con el vehículo en movimiento.

## Control de cambios

Las cotas de los planos son `DE PROYECTO` hasta elegir el donor. En M1 se reemplazan por cotas `AS-BUILT`. Cambios que afecten frenos, ancho de vía, altura del centro de gravedad, masa, 230 V o ocupación deben volver al gate correspondiente.
