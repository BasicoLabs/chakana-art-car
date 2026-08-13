# Comparativa de movilidad para la Chakana 2027

Fecha de corte: 13 de agosto de 2026.

## Decisión actual

En 2026 no se compra ni se integra movilidad. Se construye la Chakana estática y desmontable de madera. Durante esa temporada se registran masa real por módulo, tiempos de montaje, respuesta del público, ergonomía DJ, necesidades de audio, transporte y comportamiento al viento.

La movilidad se reabre en 2027 con datos reales. El shortlist queda compuesto por:

1. donor local eléctrico usado completo;
2. chasis local fabricado alrededor de un kit de eje 60-72 V / 5 kW;
3. plataforma/rolling chassis industrial pequeño, sólo si llega con documentación contractual completa.

El chasis de ómnibus eléctrico de 12 m queda descartado por escala.

## Comparación

| Opción | Qué entrega | Ventaja | Trabajo faltante | Riesgo principal | Veredicto 2027 |
|---|---|---|---|---|---|
| Donor local 48 V usado | chasis, dirección, frenos, suspensión, eje, batería, cargador y controles integrados | menor ingeniería e importación; se prueba antes de pagar | service, ruedas, estructura secundaria e integración artística | batería agotada o capacidad desconocida | **Base de comparación / preferida** |
| Eje Hengna 60-72 V 5 kW | eje trasero, motor/controlador declarado y discos hidráulicos | compacto; anchos 114/123/133/143 cm; muestra USD 733,20 | chasis, eje delantero, dirección, freno delantero, parking independiente, batería, cargador, cableado, suspensión, homologación interna | ficha contradictoria y relación 1:11,24 demasiado rápida para 5-8 km/h | **Shortlist condicionado a RFQ y prototipo 2026** |
| Jujie 60/72 V 5 kW | eje integrado de freno a disco de un fabricante de sistemas | proveedor declara producción integrada y soporte OEM/ODM | precio, relación, carga, dimensiones y contenido exacto no publicados | producto insuficientemente especificado | **RFQ alternativo** |
| Hengna 7,5 kW / 3-6 t | eje de mayor potencia disponible en la misma familia | margen térmico para masa futura | misma integración completa; más batería y control | sobrepeso/sobrecosto para primera movilidad | **Reserva si la madera revela masa alta** |
| Chasis Alibaba 2 kW | eje económico de baja potencia | precio bajo | prácticamente todo lo demás | 2 kW insuficientes y documentación limitada | **Descartado** |
| Chasis de ómnibus eléctrico de 12 m | plataforma vial de transporte masivo | integración automotriz completa | adaptar una escultura pequeña a un sistema industrial enorme | ~12 m, clase 19-20,5 t y 140-250 kW típicos; transporte e importación incompatibles | **Descartado sin RFQ** |

## Hallazgos del eje Hengna

La publicación declara:

- motor 5 kW, 60-72 V;
- discos hidráulicos de 220 mm;
- tamaños 114, 123, 133 y 143 cm;
- límite de 3 toneladas como peso combinado del vehículo y carga;
- velocidad máxima 45 km/h;
- relación publicada `1:11:24` (interpretada como aproximadamente 11,24:1, a confirmar);
- embalaje 1500 × 500 × 600 mm y 60 kg brutos;
- muestra de USD 733,20; otra página indica USD 738-758 con MOQ 2;
- garantía de un año para motor y controlador.

No alcanza para comprar. La ficha también muestra `Model NO. 3kw...` aunque el título y la descripción dicen 5 kW; llama “variable 2 speed” al conjunto sin publicar relaciones de ambas marchas; y no demuestra freno de estacionamiento, neutro mecánico ni curva de torque.

Con neumático 25 pulgadas y relación cercana a 11,24:1, un motor girando a 3000 rpm daría aproximadamente 31,6 km/h teóricos. Limitar electrónicamente a 8 km/h no recupera el torque mecánico que se pierde por usar una relación larga. Para el proyecto debe solicitarse una relación total cercana a 30-36:1, una marcha baja documentada equivalente, o una reducción secundaria.

### RFQ obligatorio del eje

1. Plano dimensional 2D/STEP de la variante exacta.
2. Confirmación escrita del contenido: eje, diferencial, motor, controlador, discos, pinzas, mazas, cableado y sensores.
3. Potencia continua y pico, rpm nominal/máxima y curva torque-rpm.
4. Dos relaciones reales si existe caja de dos velocidades; método de selección y enclavamiento.
5. Capacidad continua de eje, por maza y por rodamiento a 8 km/h.
6. PCD, espárragos, offset admisible y tamaño de neumático aprobado.
7. Circuito hidráulico requerido, presión, volumen y cilindro maestro recomendado.
8. Freno de estacionamiento mecánico independiente.
9. Neutro/Tow real, velocidad y distancia máxima de remolque.
10. Grado IP, temperatura, duty cycle, protección térmica y regeneración.
11. Protocolo/controlador, marcha atrás, E-stop y limitación de velocidad bloqueable.
12. Video FAT con masa representativa: arranque, baja, alta, reversa, frenado y Tow.
13. Precio para una unidad de ingeniería, repuestos y envío DAP Buenos Aires.

## Evaluación del chasis de ómnibus

El enlace aportado está titulado como chasis eléctrico de ómnibus urbano de 12 m, pero la página directa devuelve acceso prohibido y no expone una ficha técnica auditable. La misma empresa publica principalmente chasis de camión/ómnibus grandes; una publicación comparable del proveedor muestra 9 m, GVW 10.000 kg y trocha de aproximadamente 1,65-1,68 m. Fuentes técnicas de ómnibus eléctricos de 12 m ubican normalmente la clase alrededor de 19-20,5 toneladas, con 140-250 kW y baterías de 248-424 kWh.

Aunque el precio publicado pareciera atractivo, no es una alternativa comparable con una Chakana de 3,6-4 m y un solo piloto. Exigiría transporte marítimo especial, infraestructura de carga HV, sistemas neumáticos/hidráulicos y una escala de fabricación distinta. No se solicita cotización en esta fase.

## Cómo el prototipo de madera alimenta la decisión

En cada montaje 2026 se registrará:

- masa de cada módulo y masa total;
- volumen embalado y vehículo de transporte utilizado;
- personas-minuto de carga, armado, ajuste y desmontaje;
- flecha y vibración de paneles;
- superficie expuesta al viento y lastre necesario;
- posición y ergonomía real del DJ;
- PA necesario y consumo eléctrico medido;
- daños, tornillos reajustados y piezas reemplazadas;
- recorrido deseado y superficies reales del evento.

El diseño 2027 se dimensiona con esos datos, no con los 3 t publicitarios del eje.

## Fuentes

- [Eje Hengna 60-72 V 5 kW](https://hengna-rear-axle.en.made-in-china.com/product/XJNUiHLMJDYm/China-60-72V-5kw-Suspension-Oil-Brake-Variable-2-Speed-Rear-Axle-3-Tons-Freight-Electric-Tricycle-Truck-Rear-Axle-Conversion-Kit-Rear-Axle.html)
- [Video/ficha de precio Hengna](https://es.made-in-china.com/video-channel/hengna-rear-axle_XJNUiHLMJDYm_60-72V-5kw-Suspensi-n-Aceite-Freno-Variable-2-Velocidad-Eje-Trasero-3-Toneladas-Carga-Triciclo-El-ctrico-Kit-de-Conversi-n-Eje-Trasero-Eje-Trasero.html)
- [Eje alternativo Jujie 60/72 V 5 kW](https://jujiemotor.en.made-in-china.com/product/PAMRecGKYihY/China-60V-72V-5kw-Motor-Controller-Disc-Brake-Rear-Axle-High-Loading-Cargo.html)
- [Familia Hengna 3-6 t](https://hengna-rear-axle.en.made-in-china.com/product-group/XeAtCZVFwlcb/3-6-tons-drive-axle-1.html)
- [Chasis 12 m aportado](https://aftabmotors.en.made-in-china.com/product/OpDYFlwCkzWU/China-China-Factory-High-Quality-12m-Electric-Luxury-City-Commuter-Bus-Chassis.html)
- [Chasis eléctrico 12 m comparable](https://longhuitong.en.made-in-china.com/product/drOUMREKXJck/China-China-Factory-12m-Electric-Luxury-City-Commuter-Bus-Chassis.html)
- [Referencia técnica de ómnibus eléctrico 12 m](https://cms.aptdc.in/fetch?payload=cbdb2974-6831-4def-91bd-26ec36cea2ef.pdf)
- [Inti Huasi en Instagram](https://www.instagram.com/intihuasiorg/): referencia visual/metodológica aportada por el equipo. Sin acceso público a publicaciones o memoria técnica suficiente para atribuir dimensiones, uniones o especie de madera.
