import fs from "node:fs/promises";
import { Workbook, SpreadsheetFile } from "@oai/artifact-tool";

const OUT = "/Users/martinmarquez/projects/chakana-art-car/output";
await fs.mkdir(`${OUT}/visuals`, { recursive: true });

const wb = Workbook.create();
wb.comments.setSelf({ displayName: "Equipo de anteproyecto" });

const C = {
  navy: "#15283B", blue: "#1F5A75", cyan: "#56C6C6", amber: "#F0A43A",
  cream: "#F5F0E8", pale: "#E9F3F3", ink: "#17212B", gray: "#61707D",
  green: "#DCEBDD", red: "#F5D9D5", white: "#FFFFFF", line: "#C9D2D8",
};

function title(sheet, text, subtitle, lastCol = "H") {
  sheet.mergeCells(`A1:${lastCol}1`);
  sheet.getRange("A1").values = [[text]];
  sheet.getRange("A1").format = {
    fill: C.navy, font: { name: "Arial", bold: true, color: C.white, size: 18 },
    rowHeight: 34, verticalAlignment: "center",
  };
  sheet.mergeCells(`A2:${lastCol}2`);
  sheet.getRange("A2").values = [[subtitle]];
  sheet.getRange("A2").format = {
    fill: C.cream, font: { name: "Arial", italic: true, color: C.gray, size: 10 },
    rowHeight: 28, wrapText: true, verticalAlignment: "center",
  };
  sheet.freezePanes.freezeRows(3);
}

function header(range) {
  range.format = {
    fill: C.blue, font: { name: "Arial", bold: true, color: C.white, size: 10 },
    verticalAlignment: "center", wrapText: true, rowHeight: 28,
    borders: { bottom: { color: C.navy, style: "thin" } },
  };
}

function body(range) {
  range.format = {
    font: { name: "Arial", color: C.ink, size: 10 }, verticalAlignment: "top", wrapText: true,
    borders: {
      bottom: { color: C.line, style: "hair" },
      right: { color: C.line, style: "hair" },
    },
  };
}

function money(range) { range.format.numberFormat = "$#,##0"; }
function integer(range) { range.format.numberFormat = "#,##0"; }
function percent(range) { range.format.numberFormat = "0.0%"; }

// RESUMEN
{
  const s = wb.worksheets.add("Resumen");
  title(s, "CHAKANA ART CAR · MODELO ECONÓMICO", "Prefactibilidad · valores de referencia en USD · agosto de 2026", "J");
  s.getRange("A4:B4").values = [["Decisión", "Valor base"]]; header(s.getRange("A4:B4"));
  s.getRange("A5:A13").values = [
    ["Concepto recomendado"], ["Masa de diseño (kg)"], ["Carga útil (kg)"],
    ["CAPEX neto"], ["Caja máxima estimada"], ["Caja a ARS base"],
    ["OPEX por evento"], ["Potencia tracción continua (kW)"], ["Batería nominal (kWh)"],
  ];
  s.getRange("B5:B13").formulas = [
    ["='Matriz'!A5"], ["='Masa_Energía'!B13"], ["='Supuestos'!B7"],
    ["='Escenarios'!M6"], ["='Escenarios'!O6"], ["=B9*'Supuestos'!B4"],
    ["='OPEX'!C12"], ["='Supuestos'!B10"], ["='Supuestos'!B11"],
  ];
  body(s.getRange("A5:B13")); money(s.getRange("B8:B11"));
  s.getRange("B6:B7").format.numberFormat = "#,##0";
  s.getRange("B12:B13").format.numberFormat = "0.0";
  s.getRange("B5:B13").format.fill = C.pale;

  s.getRange("D4:H4").values = [["Escenario", "CAPEX neto", "Caja", "ARS @ base", "Lectura"]];
  header(s.getRange("D4:H4"));
  s.getRange("D5:D8").formulas = [["='Escenarios'!A5"], ["='Escenarios'!A6"], ["='Escenarios'!A7"], ["='Escenarios'!A8"]];
  s.getRange("E5:G8").formulas = [
    ["='Escenarios'!M5", "='Escenarios'!O5", "=F5*'Supuestos'!B4"],
    ["='Escenarios'!M6", "='Escenarios'!O6", "=F6*'Supuestos'!B4"],
    ["='Escenarios'!M7", "='Escenarios'!O7", "=F7*'Supuestos'!B4"],
    ["='Escenarios'!M8", "='Escenarios'!O8", "=F8*'Supuestos'!B4"],
  ];
  s.getRange("H5:H8").values = [
    ["Compacta: voluntariado y audio local menor"],
    ["Base recomendada: 4WD 12 kW + DJ direccional"],
    ["Estrés: arancel alto y fabricación contratada"],
    ["Orugas: integración, transporte y seguridad complejos"],
  ];
  body(s.getRange("D5:H8")); money(s.getRange("E5:F8")); integer(s.getRange("G5:G8"));

  s.mergeCells("A16:H16"); s.getRange("A16").values = [["Semáforo de decisión"]]; header(s.getRange("A16:H16"));
  s.getRange("A17:B22").values = [
    ["GO", "RFQ confirma GVWR ≥1,7 t, carga estructural ≥1,1 t sobre rolling chassis y frenos mecánicos 4 ruedas."],
    ["GO", "Pesaje proyectado: tara ≤1.200 kg; carga útil 500 kg; CG cargado ≤0,75 m."],
    ["GO", "Misión 5 km con PA/luces activos termina ≥20% SOC."],
    ["NO-GO", "Producto sin masa, GVWR, curvas de torque, freno de estacionamiento o UN38.3."],
    ["NO-GO", "DJ de pie o pasajeros de pie mientras el vehículo se mueve."],
    ["NO-GO", "Ruedas encerradas sin recorrido, drenaje y acceso de inspección."],
  ];
  s.mergeCells("B17:H17"); s.mergeCells("B18:H18"); s.mergeCells("B19:H19");
  s.mergeCells("B20:H20"); s.mergeCells("B21:H21"); s.mergeCells("B22:H22");
  body(s.getRange("A17:H22"));
  s.getRange("A17:A19").format = { fill: C.green, font: { bold: true, color: C.ink } };
  s.getRange("A20:A22").format = { fill: C.red, font: { bold: true, color: C.ink } };
  s.getRange("A:A").format.columnWidth = 28; s.getRange("B:B").format.columnWidth = 18;
  s.getRange("C:C").format.columnWidth = 3; s.getRange("D:D").format.columnWidth = 20;
  s.getRange("E:G").format.columnWidth = 17; s.getRange("H:H").format.columnWidth = 38;
  s.getRange("I:J").format.columnWidth = 3;
  const chart = s.charts.add("bar", s.getRange("D4:F8"));
  chart.title = "CAPEX neto vs caja por escenario"; chart.hasLegend = true;
  chart.xAxis = { axisType: "textAxis", textStyle: { fontSize: 9 } };
  chart.yAxis = { numberFormatCode: "$#,##0" };
  chart.setPosition("J4", "Q20");
}

// SUPUESTOS
{
  const s = wb.worksheets.add("Supuestos");
  title(s, "SUPUESTOS CONTROLABLES", "Celdas azules = entradas; cambie una hipótesis y el modelo recalcula.", "E");
  s.getRange("A3:E3").values = [["Variable", "Base", "Bajo", "Alto", "Unidad / criterio"]]; header(s.getRange("A3:E3"));
  const rows = [
    ["Tipo de cambio", 1700, 1500, 1860, "ARS/USD; escenario, no cotización contractual"],
    ["GVWR mínimo", 1700, 1500, 2000, "kg"],
    ["Tara objetivo", 1150, 900, 1300, "kg; se confirma por pesaje"],
    ["Carga útil", 500, 500, 500, "kg: piloto + DJ + 3 pasajeros + pertenencias"],
    ["Misión", 5, 5, 5, "km por carga"],
    ["Velocidad operativa", 5, 5, 8, "km/h; 10 km/h tope duro"],
    ["Potencia tracción continua", 12, 10, 16, "kW; 4WD"],
    ["Batería LFP nominal", 15, 12.8, 18, "kWh; una batería, ramas protegidas"],
    ["Reserva SOC", 0.20, 0.20, 0.25, "%"],
    ["Derating envejecimiento/temperatura", 0.15, 0.10, 0.20, "%"],
    ["Audio promedio móvil", 1.00, 0.50, 1.45, "kW promedio; PA 1,8 kW RMS instalado"],
    ["DJ + iluminación artística", 0.45, 0.30, 0.70, "kW promedio"],
    ["Arancel importación", 0.18, 0.00, 0.35, "% del CIF; confirmar NCM"],
    ["Tasa estadística", 0.03, 0.03, 0.03, "% del CIF"],
    ["IVA importación", 0.21, 0.21, 0.21, "%; crédito fiscal potencial"],
    ["Percepción IVA", 0.20, 0.00, 0.20, "%; confirmar condición fiscal"],
    ["Percepción Ganancias", 0.06, 0.00, 0.11, "%"],
    ["IIBB percepción", 0.025, 0.00, 0.04, "%; jurisdicción dependiente"],
    ["Contingencia importados", 0.10, 0.10, 0.15, "%"],
    ["Contingencia local", 0.20, 0.15, 0.25, "%"],
    ["Techo de decisión neto", 68000, 48000, 85000, "USD"],
    ["Caja máxima de decisión", 80000, 58000, 100000, "USD"],
  ];
  s.getRange(`A4:E${rows.length + 3}`).values = rows; body(s.getRange(`A4:E${rows.length + 3}`));
  s.getRange(`B4:D${rows.length + 3}`).format.fill = "#DDEBF7";
  s.getRange("B12:D13").format.numberFormat = "0.0";
  percent(s.getRange("B14:D21")); money(s.getRange("B24:D25"));
  s.getRange("A:A").format.columnWidth = 38; s.getRange("B:D").format.columnWidth = 14; s.getRange("E:E").format.columnWidth = 46;
  wb.comments.addThread({ cell: s.getRange("B4") }, "Fuente/criterio: BCRA; usar tipo contractual del día de pago. Base de planeamiento deliberadamente superior a la referencia observada.");
  wb.comments.addThread({ cell: s.getRange("B16") }, "Fuente: Decreto 1140/2024. La tasa estadística se mantiene como supuesto editable.");
  wb.comments.addThread({ cell: s.getRange("B15") }, "No comprar por este supuesto: el despachante debe emitir clasificación NCM escrita antes de la orden de compra.");
}

// IMPORTACIÓN
{
  const s = wb.worksheets.add("Importación");
  title(s, "COSTO DE IMPORTACIÓN · ESCENARIO BASE", "El NCM puede cambiar por uso, configuración y carácter esencial. Tributos recuperables afectan caja, no costo neto.", "E");
  s.getRange("A3:E3").values = [["Partida", "USD", "Fórmula / base", "Tratamiento", "Observación"]]; header(s.getRange("A3:E3"));
  const labels = [
    ["Rolling chassis 4WD 12 kW", 12000, "Oferta objetivo", "FOB", "GVWR ≥1,7 t; payload estructural ≥1,1 t"],
    ["Configuración, documentación y limitador", 900, "RFQ", "FOB", "Manual, curvas, software y parámetros"],
    ["Repuestos críticos", 1200, "RFQ", "FOB", "Controlador, sensores, pastillas, rótulas y rodamientos"],
    ["Inspección preembarque y embalaje", 700, "Servicio", "FOB", "Pesaje, video FAT, placa y embalaje DG"],
    ["FOB total", null, "=SUM(B4:B7)", "Subtotal", ""],
    ["Flete, origen, seguro y DG", 2800, "Estimación", "Hasta CIF", "Cotizar por volumen/peso real"],
    ["CIF", null, "=B8+B9", "Base aduanera", ""],
    ["Derecho de importación", null, "=B10*'Supuestos'!B16", "Costo", "NCM escrito previo a PO"],
    ["Tasa estadística", null, "=B10*'Supuestos'!B17", "Costo", "3% supuesto"],
    ["Terminal, despachante e inland", 2800, "Estimación", "Costo", "No incluye demoras"],
    ["Importado puesto en taller · neto", null, "=SUM(B10:B13)", "Costo neto", "Antes de contingencia"],
    ["Base tributaria estimada", null, "=SUM(B10:B12)", "Caja", "Simplificación de prefactibilidad"],
    ["IVA", null, "=B15*'Supuestos'!B18", "Crédito potencial", "Validar situación fiscal"],
    ["Percepción IVA", null, "=B15*'Supuestos'!B19", "Crédito potencial", "Puede haber exclusiones"],
    ["Percepción Ganancias", null, "=B15*'Supuestos'!B20", "Crédito potencial", ""],
    ["Percepción IIBB", null, "=B15*'Supuestos'!B21", "Crédito potencial", "Jurisdicción dependiente"],
    ["Caja tributaria recuperable", null, "=SUM(B16:B19)", "Caja", "No tratar como costo sin asesor fiscal"],
    ["Caja importado puesto en taller", null, "=B14+B20", "Caja", ""],
  ];
  s.getRange("A4:E21").values = labels.map(r => [r[0], r[1], r[2], r[3], r[4]]);
  for (let row = 4; row <= 21; row++) {
    const f = labels[row - 4][2]; if (typeof f === "string" && f.startsWith("=")) s.getRange(`B${row}`).formulas = [[f]];
  }
  body(s.getRange("A4:E21")); money(s.getRange("B4:B21"));
  s.getRange("A8:E8").format.fill = C.pale; s.getRange("A10:E10").format.fill = C.pale;
  s.getRange("A14:E14").format = { fill: C.green, font: { bold: true, color: C.ink } };
  s.getRange("A20:E21").format = { fill: C.cream, font: { bold: true, color: C.ink } };
  s.getRange("A:A").format.columnWidth = 39; s.getRange("B:B").format.columnWidth = 16;
  s.getRange("C:C").format.columnWidth = 30; s.getRange("D:D").format.columnWidth = 20; s.getRange("E:E").format.columnWidth = 48;
}

// CAPEX LOCAL
{
  const s = wb.worksheets.add("CAPEX");
  title(s, "CAPEX · DETALLE LOCAL E INTEGRADO", "Rangos antes de IVA local. El audio recomendado es compacto, direccional y limitado; no es un PA de festival.", "F");
  s.getRange("A3:F3").values = [["Sistema", "Bajo", "Base", "Alto", "Origen preferido", "Alcance"]]; header(s.getRange("A3:F3"));
  const rows = [
    ["Importado puesto en taller", 13000, null, 33000, "China + Argentina", "Ver hoja Importación"],
    ["Subchasis, piso y soportes", 3000, 4200, 6500, "Argentina", "Acero local y mecanizado"],
    ["Caparazón radical modular", 2200, 3500, 6000, "Argentina", "Panel perforado, costillas y registros"],
    ["Asientos, barandas, puertas y acceso", 1600, 2500, 4000, "Argentina", "5 ocupantes totales"],
    ["Seguridad LV, E-stops y comunicaciones", 1100, 1600, 2500, "Argentina", "Separado de arte/audio"],
    ["Iluminación funcional y artística", 800, 1200, 2200, "Mixto", "360°, perímetro y control"],
    ["PA, DJ, DSP y medición", 5000, 7500, 11500, "Argentina", "1,8 kW RMS instalado; 1 kW promedio"],
    ["Inversor, rack y distribución 230 V", 1500, 2500, 4200, "Argentina", "Senoidal, RCD, IP54/IP65"],
    ["Ingeniería eléctrica y EMC", 700, 1250, 2400, "Argentina", "Diseño, pruebas y legajo"],
    ["Ingeniería, fabricación y ensayos", 5000, 8500, 13500, "Argentina", "Mecánica, soldadura, pruebas a GVWR"],
    ["Terminación, fijaciones y recuperación", 900, 1600, 2800, "Argentina", "Pintura, tethers, eslingas y placas"],
    ["Subtotal antes de contingencia", null, null, null, "", ""],
    ["Contingencia", null, null, null, "", "10% importado + 20% local en base"],
    ["CAPEX neto", null, null, null, "", ""],
  ];
  s.getRange("A4:F17").values = rows;
  s.getRange("C4").formulas = [["='Importación'!B14"]];
  s.getRange("B15:D15").formulas = [["=SUM(B4:B14)", "=SUM(C4:C14)", "=SUM(D4:D14)"]];
  s.getRange("B16:D16").formulas = [["=B4*10%+SUM(B5:B14)*15%", "=C4*'Supuestos'!B22+SUM(C5:C14)*'Supuestos'!B23", "=D4*15%+SUM(D5:D14)*25%"]];
  s.getRange("B17:D17").formulas = [["=B15+B16", "=C15+C16", "=D15+D16"]];
  body(s.getRange("A4:F17")); money(s.getRange("B4:D17"));
  s.getRange("A15:F17").format = { fill: C.cream, font: { bold: true, color: C.ink } };
  s.getRange("A17:F17").format.fill = C.green;
  s.getRange("A:A").format.columnWidth = 39; s.getRange("B:D").format.columnWidth = 15;
  s.getRange("E:E").format.columnWidth = 22; s.getRange("F:F").format.columnWidth = 48;
}

// ESCENARIOS
{
  const s = wb.worksheets.add("Escenarios");
  title(s, "ESCENARIOS DE INVERSIÓN", "Las columnas de cálculo distinguen costo neto de necesidad de caja.", "P");
  s.getRange("A4:P4").values = [["Escenario", "FOB", "Flete/CIF", "Arancel", "Destino", "Local", "Cont. imp.", "Cont. local", "CIF", "Derecho", "Estadística", "Neto import.", "CAPEX neto", "Tributos recup.", "Caja", "Caja ARS base"]]; header(s.getRange("A4:P4"));
  s.getRange("A5:H8").values = [
    ["Económico", 10000, 1800, 0.14, 1800, 23000, 0.10, 0.15],
    ["Recomendado", 14800, 2800, 0.18, 2800, 32850, 0.10, 0.20],
    ["Estrés", 18000, 5000, 0.35, 4000, 42000, 0.15, 0.25],
    ["Orugas", 7000, 4000, 0.18, 3000, 36000, 0.15, 0.25],
  ];
  for (let r = 5; r <= 8; r++) {
    s.getRange(`I${r}:P${r}`).formulas = [[
      `=B${r}+C${r}`, `=I${r}*D${r}`, `=I${r}*'Supuestos'!B17`, `=SUM(I${r}:K${r})+E${r}`,
      `=L${r}*(1+G${r})+F${r}*(1+H${r})`,
      `=(I${r}+J${r}+K${r})*SUM('Supuestos'!B18:B21)`, `=M${r}+N${r}`, `=O${r}*'Supuestos'!B4`,
    ]];
  }
  body(s.getRange("A5:P8")); money(s.getRange("B5:C8")); percent(s.getRange("D5:D8")); money(s.getRange("E5:F8")); percent(s.getRange("G5:H8")); money(s.getRange("I5:O8")); integer(s.getRange("P5:P8"));
  s.getRange("A6:P6").format.fill = C.green; s.getRange("A:A").format.columnWidth = 19;
  s.getRange("B:O").format.columnWidth = 14; s.getRange("P:P").format.columnWidth = 18;
  const chart = s.charts.add("bar", s.getRange("A4:A8"));
  chart.setData(s.getRange("A4:A8"));
  chart.series.deleteAll();
  const n = chart.series.add("CAPEX neto"); n.categoryFormula = "'Escenarios'!$A$5:$A$8"; n.formula = "'Escenarios'!$M$5:$M$8"; n.fill = C.cyan;
  const c = chart.series.add("Caja"); c.categoryFormula = "'Escenarios'!$A$5:$A$8"; c.formula = "'Escenarios'!$O$5:$O$8"; c.fill = C.amber;
  chart.title = "Costo neto y caja"; chart.hasLegend = true; chart.yAxis = { numberFormatCode: "$#,##0" };
  chart.setPosition("A11", "H28");
  s.mergeCells("I11:P17"); s.getRange("I11").values = [["Interpretación\n\nEconómico: requiere fuerte trabajo voluntario y aceptar menor reserva.\nRecomendado: especificación que conserva 500 kg útiles y audio DJ real.\nEstrés: arancel 35%, fabricación contratada y mayores contingencias.\nOrugas: el precio de compra engaña; integración, peso, transporte y seguridad elevan el total."]];
  s.getRange("I11").format = { fill: C.cream, font: { color: C.ink, size: 11 }, wrapText: true, verticalAlignment: "top" };
}

// OPEX
{
  const s = wb.worksheets.add("OPEX");
  title(s, "COSTO OPERATIVO", "No incluye honorarios artísticos ni viaje internacional.", "F");
  s.getRange("A3:F3").values = [["Partida por evento", "Bajo", "Base", "Alto", "Frecuencia", "Notas"]]; header(s.getRange("A3:F3"));
  const rows = [
    ["Transporte y carga", 500, 1000, 1800, "evento", "Trailer/camión; arte desmontado"],
    ["Inspección, seguro y permisos", 200, 600, 1200, "evento", "Depende del predio"],
    ["Técnico de sonido / DJ", 250, 700, 1500, "evento", "Puede ser voluntario"],
    ["Mantenimiento neumáticos/frenos", 250, 450, 800, "evento", "Reserva de desgaste"],
    ["Limpieza y consumibles", 100, 220, 400, "evento", "Barro y polvo"],
    ["Electricidad de carga", 15, 30, 60, "evento", "Energía menor; logística mayor"],
    ["Radios, EPP y protección auditiva", 80, 160, 300, "evento", "Tripulación"],
    ["Contingencia operativa", 100, 250, 500, "evento", ""],
    ["OPEX por evento", null, null, null, "", ""],
    ["Almacenaje anual", 600, 1200, 2400, "año", "Seco y seguro"],
    ["Reserva batería y preventivo anual", 600, 1200, 2200, "año", "Ensayo + reemplazos"],
  ];
  s.getRange("A4:F14").values = rows;
  s.getRange("B12:D12").formulas = [["=SUM(B4:B11)", "=SUM(C4:C11)", "=SUM(D4:D11)"]];
  body(s.getRange("A4:F14")); money(s.getRange("B4:D14")); s.getRange("A12:F12").format = { fill: C.green, font: { bold: true, color: C.ink } };
  s.getRange("A:A").format.columnWidth = 39; s.getRange("B:D").format.columnWidth = 15; s.getRange("E:E").format.columnWidth = 15; s.getRange("F:F").format.columnWidth = 44;
}

// MASA Y ENERGÍA
{
  const s = wb.worksheets.add("Masa_Energía");
  title(s, "PRESUPUESTO DE MASA Y ENERGÍA", "Caso de cálculo: 1.600 kg. La masa real del donor es el primer gate de compra.", "H");
  s.getRange("A3:D3").values = [["Subsistema", "Masa kg", "Altura CG m", "Momento kg·m"]]; header(s.getRange("A3:D3"));
  const mass = [
    ["Rolling chassis 4WD", 550, 0.42], ["Batería LFP 15 kWh", 135, 0.25],
    ["Piso, estructura, asientos y barandas", 170, 0.65], ["Caparazón / piel radical", 85, 1.20],
    ["PA, sub y amplificación", 105, 0.65], ["DJ, inversor, rack y cableado", 55, 0.55],
    ["Luces y seguridad", 35, 0.80], ["Tara proyectada", null, null],
    ["Carga útil", 500, 0.85], ["Masa operativa", null, null], ["Margen hasta GVWR 1.700 kg", null, null],
  ];
  s.getRange("A4:C14").values = mass;
  for (let r = 4; r <= 10; r++) s.getRange(`D${r}`).formulas = [[`=B${r}*C${r}`]];
  s.getRange("B11").formulas = [["=SUM(B4:B10)"]]; s.getRange("D11").formulas = [["=SUM(D4:D10)"]]; s.getRange("C11").formulas = [["=D11/B11"]];
  s.getRange("D12").formulas = [["=B12*C12"]]; s.getRange("B13").formulas = [["=B11+B12"]]; s.getRange("D13").formulas = [["=D11+D12"]]; s.getRange("C13").formulas = [["=D13/B13"]];
  s.getRange("B14").formulas = [["='Supuestos'!B5-B13"]];
  body(s.getRange("A4:D14")); s.getRange("B4:B14").format.numberFormat = "#,##0"; s.getRange("C4:C14").format.numberFormat = "0.00"; s.getRange("D4:D14").format.numberFormat = "#,##0";
  s.getRange("A11:D14").format = { fill: C.cream, font: { bold: true, color: C.ink } };

  s.getRange("A17:H17").values = [["Escenario", "Crr", "Pendiente", "Fuerza N", "P tracción @5 km/h kW", "Aux kWh", "Misión total kWh", "Margen vs usable"]]; header(s.getRange("A17:H17"));
  s.getRange("A18:C22").values = [
    ["Pasto firme", 0.04, 0.00], ["Pasto húmedo", 0.08, 0.00], ["Húmedo + 10%", 0.08, 0.10],
    ["Húmedo + 15%", 0.08, 0.15], ["Barro + 10%", 0.15, 0.10],
  ];
  for (let r = 18; r <= 22; r++) {
    s.getRange(`D${r}:H${r}`).formulas = [[
      `=$B$13*9.81*(B${r}+C${r})`, `=D${r}*(5/3.6)/0.75/1000`, "='Supuestos'!B14+'Supuestos'!B15",
      `=E${r}*('Supuestos'!B8/'Supuestos'!B9)+F${r}*('Supuestos'!B8/'Supuestos'!B9)`,
      `=('Supuestos'!B11*(1-'Supuestos'!B12)*(1-'Supuestos'!B13))-G${r}`,
    ]];
  }
  body(s.getRange("A18:H22")); percent(s.getRange("B18:C22")); s.getRange("D18:D22").format.numberFormat = "#,##0"; s.getRange("E18:H22").format.numberFormat = "0.00";
  s.getRange("A24:B26").values = [["Energía usable conservadora", null], ["Criterio", "Final ≥20% SOC"], ["Conclusión", "15 kWh cubre barro + 10% con margen; 12,8 kWh no lo garantiza con PA completo."]];
  s.getRange("B24").formulas = [["='Supuestos'!B11*(1-'Supuestos'!B12)*(1-'Supuestos'!B13)"]];
  body(s.getRange("A24:B26")); s.getRange("B24").format.numberFormat = "0.00 \"kWh\"";
  s.getRange("A:A").format.columnWidth = 34; s.getRange("B:D").format.columnWidth = 15; s.getRange("E:H").format.columnWidth = 20;
}

// MATRIZ
{
  const s = wb.worksheets.add("Matriz");
  title(s, "MATRIZ DE CONCEPTOS", "El nuevo requisito de DJ y mutación radical casi empata Tatú y Chakana; gana Tatú por lectura no vehicular.", "I");
  s.getRange("A4:I4").values = [["Concepto", "Mutación 25%", "Seguridad 20%", "DJ/audio 20%", "Masa/fab. 15%", "Interacción 10%", "Mant. 10%", "Total", "Decisión"]]; header(s.getRange("A4:I4"));
  s.getRange("A5:G7").values = [
    ["Tatú Sonoro", 5.0, 4.5, 4.5, 4.0, 5.0, 4.0],
    ["Chakana Resonante", 4.5, 4.0, 5.0, 4.5, 4.5, 5.0],
    ["Coatí Nocturno", 4.5, 4.0, 4.5, 3.5, 4.5, 3.5],
  ];
  for (let r = 5; r <= 7; r++) s.getRange(`H${r}`).formulas = [[`=B${r}*25%+C${r}*20%+D${r}*20%+E${r}*15%+F${r}*10%+G${r}*10%`]];
  s.getRange("I5:I7").values = [["RECOMENDADO"], ["ALTERNATIVA LIVIANA"], ["RESERVA ESTÉTICA"]];
  body(s.getRange("A5:I7")); s.getRange("B5:H7").format.numberFormat = "0.00"; s.getRange("A5:I5").format.fill = C.green;
  s.getRange("A:A").format.columnWidth = 26; s.getRange("B:G").format.columnWidth = 17; s.getRange("H:H").format.columnWidth = 13; s.getRange("I:I").format.columnWidth = 24;
  const chart = s.charts.add("bar", s.getRange("A4:A7")); chart.series.deleteAll();
  const ser = chart.series.add("Puntaje"); ser.categoryFormula = "'Matriz'!$A$5:$A$7"; ser.formula = "'Matriz'!$H$5:$H$7"; ser.fill = C.cyan;
  chart.title = "Puntaje ponderado / 5"; chart.hasLegend = false; chart.yAxis = { min: 0, max: 5, numberFormatCode: "0.0" }; chart.setPosition("A10", "H26");
}

// RIESGOS
{
  const s = wb.worksheets.add("Riesgos");
  title(s, "FMEA DE PREFACTIBILIDAD", "S/O/D: 1–10. RPN ≥150 exige acción antes de pruebas con personas.", "I");
  s.getRange("A3:I3").values = [["Riesgo", "Efecto", "S", "O", "D", "RPN", "Control principal", "Responsable", "Gate"]]; header(s.getRange("A3:I3"));
  const rows = [
    ["GVWR o masa de donor indefinida", "Sobrecarga/falla", 10, 5, 7, "Pesaje + certificado + cálculo", "Líder mecánico", "Pre-PO"],
    ["Freno insuficiente", "Atropello/pérdida control", 10, 4, 5, "4 discos + parking mecánico + ensayo", "Frenos", "Pre-personas"],
    ["Rueda atrapada por arte/barro", "Bloqueo o proyección", 9, 5, 5, "Holgura 80 mm + registro + full bump", "Diseño", "Pre-dinámico"],
    ["Audio agota energía de seguridad", "Pérdida de luces/control", 9, 4, 4, "Rama separada + deslastre 25% SOC", "Eléctrico", "FAT"],
    ["230 V accesible o mojado", "Choque/incendio", 10, 3, 5, "Rack IP54, RCD 30 mA, pasivos", "Electricista", "FAT"],
    ["Parlante/panel se desprende", "Impacto a ocupante", 9, 4, 5, "Anclaje 5g + tether + testigo", "Rigging", "Diario"],
    ["DJ de pie en movimiento", "Caída/eyección", 9, 5, 2, "Percha + cinturón; interlock de modo", "Operación", "Siempre"],
    ["Audio enmascara avisos", "Respuesta tardía", 8, 5, 4, "Mute conductor + radio/bocina prioritaria", "Sonido", "SAT"],
    ["Punto ciego por mutación", "Colisión peatón", 10, 5, 4, "Visión directa + cámaras + spotters", "Piloto", "Siempre"],
    ["Batería sin UN38.3", "Retención/no embarque", 8, 4, 6, "Test summary antes de saldo", "Compras", "Pre-embarque"],
    ["Vuelco lateral", "Lesión grave", 10, 3, 6, "CG≤0,75; límite 8°; prueba tethered", "Ensayos", "Pre-personas"],
    ["Sonido fuera de política", "Revocación licencia", 7, 5, 4, "DSP bloqueado + SPL log + responsable", "Sound Officer", "Evento"],
  ];
  s.getRange("A4:E15").values = rows.map(r => r.slice(0, 5));
  s.getRange("G4:I15").values = rows.map(r => r.slice(5));
  for (let r = 4; r <= 15; r++) s.getRange(`F${r}`).formulas = [[`=C${r}*D${r}*E${r}`]];
  body(s.getRange("A4:I15")); integer(s.getRange("C4:F15"));
  s.getRange("F4:F15").conditionalFormats.addCellIs({ operator: "greaterThanOrEqual", formula: 150, format: { fill: C.red, font: { bold: true, color: C.ink } } });
  s.getRange("A:A").format.columnWidth = 34; s.getRange("B:B").format.columnWidth = 30; s.getRange("C:F").format.columnWidth = 9;
  s.getRange("G:G").format.columnWidth = 44; s.getRange("H:I").format.columnWidth = 18;
}

// FUENTES
{
  const s = wb.worksheets.add("Fuentes");
  title(s, "REGISTRO DE FUENTES", "Abrir y verificar fecha/versión antes de compra o inscripción. Los marketplaces son indicativos, no prueba de conformidad.", "D");
  s.getRange("A3:D3").values = [["Tema", "Entidad", "URL", "Uso en el modelo"]]; header(s.getRange("A3:D3"));
  const urls = [
    ["Mutant Vehicle criteria", "Burning Man", "https://burningman.org/black-rock-city/bring-your-mutant-vehicle/mv-criteria-and-licensing/", "Mutación radical, velocidad, luces, acceso"],
    ["Owner handbook 2026", "Burning Man", "https://burningman.org/black-rock-city/bring-your-mutant-vehicle/mutant-vehicle-owners-handbook/", "Operación y sonido"],
    ["Sound policy", "Burning Man", "https://survival.burningman.org/rules-and-regulations/noise-control-and-sound-policy/", "Orientación y horarios"],
    ["Mutant vehicles", "AfrikaBurn", "https://www.afrikaburn.org/event/participation/mutant-vehicles/", "Registro, 10 km/h y seguridad"],
    ["Sound policy", "AfrikaBurn", "https://www.afrikaburn.org/afrikaburn-sound-policy/", "95 dB y Sound Officer"],
    ["Artomobiles", "Nowhere", "https://www.goingnowhere.org/participate/artomobiles/", "10 km/h, spotter, luces y frenos"],
    ["LCM", "Argentina.gob.ar", "https://www.argentina.gob.ar/obtener-licencia-de-configuracion-de-modelo", "Diferencia predio privado/vía pública"],
    ["Tasa estadística", "Normativa Argentina", "https://www.argentina.gob.ar/normativa/nacional/norma-407914", "3% hasta fin de 2027"],
    ["VUCE", "Argentina.gob.ar", "https://www.argentina.gob.ar/node/196822", "Intervenciones de importación"],
    ["Bandas cambiarias", "BCRA", "https://www.bcra.gob.ar/regimen-de-bandas-cambiarias/", "Referencia FX; no sustituye cotización"],
    ["UN38.3", "PHMSA", "https://www.phmsa.dot.gov/lithiumbatteries", "Test summary de baterías"],
    ["Alibaba ruedas", "Huangshan Benma", "https://www.alibaba.com/product-detail/Four-Wheel-Unmanned-Autonomous-Wire-Control_1601605765591.html", "Producto aportado; información insuficiente"],
    ["Alibaba orugas", "Proveedor Alibaba", "https://www.alibaba.com/product-detail/OEM-Custom-Remote-Controlled-Rubber-Track_1601864041467.html", "Producto aportado; RFQ obligatorio"],
    ["Alibaba eje", "Proveedor Alibaba", "https://www.alibaba.com/product-detail/100CM-2000W-Shift-Differential-Rear-Axle_1601869479511.html", "2 kW descartado para misión"],
    ["Ruido recreativo", "OMS", "https://www.who.int/publications/i/item/9789240043114", "100 dB LAeq,15 min como tope de salud"],
    ["Exposición ocupacional", "NIOSH", "https://www.cdc.gov/niosh/blogs/2016/noise.html", "85 dBA/8 h; regla de 3 dB"],
  ];
  s.getRange(`A4:D${urls.length + 3}`).values = urls; body(s.getRange(`A4:D${urls.length + 3}`));
  s.getRange("A:A").format.columnWidth = 28; s.getRange("B:B").format.columnWidth = 24; s.getRange("C:C").format.columnWidth = 72; s.getRange("D:D").format.columnWidth = 44;
}

// Visual consistency and export.
for (const sheet of wb.worksheets.items) {
  sheet.freezePanes.freezeRows(3);
}

const out = await SpreadsheetFile.exportXlsx(wb);
await out.save(`${OUT}/Chakana_Art_Car_Presupuesto_Modelo.xlsx`);

for (const name of ["Resumen", "Supuestos", "Importación", "CAPEX", "Escenarios", "OPEX", "Masa_Energía", "Matriz", "Riesgos", "Fuentes"]) {
  const png = await wb.render({ sheetName: name, autoCrop: "all", scale: 1.1, format: "png" });
  const safe = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Za-z0-9_]/g, "_").toLowerCase();
  await fs.writeFile(`/Users/martinmarquez/projects/chakana-art-car/qa/budget/${safe}.png`, new Uint8Array(await png.arrayBuffer()));
}

// Tiny self-check: these are decision-critical and catch formula drift.
const check = await wb.inspect({
  kind: "table", range: "Resumen!A4:B13", include: "values,formulas", tableMaxRows: 15, tableMaxCols: 4,
});
await fs.writeFile(`/Users/martinmarquez/projects/chakana-art-car/qa/budget/inspect.txt`, check.ndjson);
console.log("Workbook exported:", `${OUT}/Chakana_Art_Car_Presupuesto_Modelo.xlsx`);
