import fs from "node:fs/promises";
import { Workbook, SpreadsheetFile } from "@oai/artifact-tool";

const ROOT = "/Users/martinmarquez/projects/chakana-art-car";
const OUT = `${ROOT}/output/Tatu_Sonoro_Minimo_Presupuesto_15K.xlsx`;
const QA = `${ROOT}/qa/budget_minimal`;
await fs.mkdir(QA,{recursive:true});

const wb=Workbook.create();
const C={navy:"#071624",blue:"#174D64",cyan:"#4BC0C8",amber:"#F3A333",paper:"#FCFAF6",pale:"#DCEBED",green:"#DDEBDD",red:"#F5D9D5",ink:"#132433",gray:"#62717C",white:"#FFFFFF",line:"#C9D1D4",input:"#DDEBF7"};
const fmt={font:{name:"Arial",size:10,color:C.ink},verticalAlignment:"top",wrapText:true,borders:{bottom:{color:C.line,style:"hair"}}};
function title(s,text,sub,last="H"){s.mergeCells(`A1:${last}1`);s.getRange("A1").values=[[text]];s.getRange("A1").format={fill:C.navy,font:{name:"Arial",size:18,bold:true,color:C.white},rowHeight:36,verticalAlignment:"center"};s.mergeCells(`A2:${last}2`);s.getRange("A2").values=[[sub]];s.getRange("A2").format={fill:C.paper,font:{name:"Arial",size:10,italic:true,color:C.gray},rowHeight:28,verticalAlignment:"center",wrapText:true};s.freezePanes.freezeRows(3)}
function header(r){r.format={fill:C.blue,font:{name:"Arial",size:10,bold:true,color:C.white},rowHeight:30,verticalAlignment:"center",wrapText:true,borders:{bottom:{color:C.navy,style:"thin"}}}}
function body(r){r.format=fmt}
function usd(r){r.format.numberFormat="$#,##0"}

// BOM: one editable source of truth.
{
 const s=wb.worksheets.add("BOM");title(s,"TATÚ SONORO MÍNIMO · PRESUPUESTO","Azul = cotización editable. Escenario base con donor local usado, PA alquilado y trabajo mayormente voluntario.","J");
 s.getRange("A3:J3").values=[["#","Rubro","Bajo USD","Base USD","Alto USD","Cotizado USD","Desvío vs base","Crítico","Gate","Criterio"]];header(s.getRange("A3:J3"));
 const rows=[
  [1,"Donor 48 V usado con batería/cargador",2200,3500,5400,"Sí","G1","No comprar si necesita banco completo"],
  [2,"Inspección, traslado y documentación",250,400,700,"Sí","G1","Prueba de 5 km y pesaje antes de señar"],
  [3,"Frenos, dirección, rodamientos y service",500,850,1400,"Sí","G1","Freno y parking no se recortan"],
  [4,"Batería: prueba/reparación",200,600,3200,"Sí","G1","Reemplazo total excluido del caso base"],
  [5,"Ruedas, llantas, cámaras y montaje",950,1450,1900,"Sí","G2","Carga certificada ≥1,25× carga medida/rueda"],
  [6,"Relación, despejes y Tow/neutro",300,650,1200,"Sí","G2","Empujable con llave fuera"],
  [7,"Tow points, gato, amarres y recuperación",250,450,700,"Sí","G2","Puntos unidos al bastidor"],
  [8,"Estructura y piel artística",800,1400,2500,"No","G4","80–130 kg; sin fibra pesada"],
  [9,"E-stop, luces de seguridad y cableado",450,750,1200,"Sí","G3","Separado del audio AC"],
  [10,"Generador: alquiler/compra",150,800,1200,"Sí","G3","5,5 kW continuos; opera en tierra"],
  [11,"Tablero AC, cables, bandeja y extinción",250,450,700,"Sí","G3","RCD 30 mA y térmicas"],
  [12,"Estación DJ desplegable",150,300,500,"No","G3","Mesa con patas propias"],
  [13,"PA: primer alquiler",120,250,3000,"No","G3","Comprar queda fuera de fase 1"],
  [14,"Fabricación y consumibles",600,1000,1800,"No","G4","Contratar sólo uniones críticas"],
  [15,"Ensayos, trámite y logística",300,500,900,"Sí","G4","No decorar antes del rolling test"],
  [16,"Contingencia reservada",900,1300,2200,"Sí","G5","No comprometer antes de la prueba final"],
 ];
 s.getRange("A4:J19").values=rows.map(r=>[r[0],r[1],r[2],r[3],r[4],null,null,r[5],r[6],r[7]]);
 for(let r=4;r<=19;r++){s.getRange(`G${r}`).formulas=[[`=IF(F${r}="",0,F${r}-D${r})`]]}
 s.getRange("A21:B24").values=[["","Subtotal sin contingencia"],["","Total base"],["","Techo duro"],["","Margen disponible"]];
 s.getRange("C21:E24").formulas=[["=SUM(C4:C18)","=SUM(D4:D18)","=SUM(E4:E18)"],["=SUM(C4:C19)","=SUM(D4:D19)","=SUM(E4:E19)"],[15000,15000,15000],["=C23-C22","=D23-D22","=E23-E22"]];
 s.getRange("F21:F24").formulas=[["=SUM(D4:D18)+SUM(G4:G18)"],["=SUM(D4:D19)+SUM(G4:G19)"],[15000],["=F23-F22"]];
 body(s.getRange("A4:J24"));s.getRange("F4:F19").format.fill=C.input;usd(s.getRange("C4:G24"));
 s.getRange("A21:J24").format={fill:C.pale,font:{name:"Arial",size:11,bold:true,color:C.ink},borders:{bottom:{color:C.line,style:"thin"}}};
 s.getRange("D22:D24").format.fill=C.green;s.getRange("F24").conditionalFormats.addCellIs({operator:"lessThan",formula:0,format:{fill:C.red,font:{bold:true,color:C.ink}}});
 s.getRange("A:A").format.columnWidth=6;s.getRange("B:B").format.columnWidth=43;s.getRange("C:G").format.columnWidth=15;s.getRange("H:H").format.columnWidth=11;s.getRange("I:I").format.columnWidth=9;s.getRange("J:J").format.columnWidth=45;
}

// One-page decision summary.
{
 const s=wb.worksheets.add("Resumen");title(s,"TATÚ SONORO MÍNIMO · DECISIÓN","Versión compatible con techo duro de USD 15.000. Los antiguos 500 kg útiles dejan de aplicar.","H");
 s.getRange("A4:B4").values=[["Métrica","Valor"]];header(s.getRange("A4:B4"));
 s.getRange("A5:A12").values=[["Arquitectura"],["Total base"],["Margen al techo"],["Donor objetivo"],["Velocidad"],["Misión"],["Ocupación en marcha"],["DJ"]];
 s.getRange("B5:B12").values=[["Donor local 48 V · eje trasero 2WD"],[null],[null],["USD 3.500; máximo absoluto USD 4.000"],["5–8 km/h; 10 km/h tope"],["5 km por carga demostrados"],["Sólo piloto sentado"],["De pie sobre el suelo, vehículo detenido"]];
 s.getRange("B6").formulas=[["=BOM!D22"]];s.getRange("B7").formulas=[["=BOM!D24"]];body(s.getRange("A5:B12"));usd(s.getRange("B6:B7"));s.getRange("B6:B7").format.fill=C.green;
 s.getRange("D4:H4").values=[["Modo","Vehículo","DJ / PA","Generador","Condición"]];header(s.getRange("D4:H4"));
 s.getRange("D5:H6").values=[["MARCHA","Cerrado; sólo piloto","Guardados","Apagado","No pasajeros"],["FIESTA","Freno + calzos; tracción inhibida","DJ en tierra; PA alquilado","En tierra, afuera","Sin movimiento"]];body(s.getRange("D5:H6"));s.getRange("D5:H5").format.fill=C.pale;s.getRange("D6:H6").format.fill=C.green;
 s.mergeCells("D9:H9");s.getRange("D9").values=[["DICTAMEN"]];header(s.getRange("D9:H9"));s.mergeCells("D10:H13");s.getRange("D10").values=[["GO condicionado: comprar un donor usado sólo si frena, gira, tiene Tow/neutro verificable y recorre 5 km cargado. Si necesita batería completa, reconstrucción del transaxle o una mejora mayor de frenos, se rechaza."]];s.getRange("D10").format={fill:C.green,font:{name:"Arial",size:13,bold:true,color:C.ink},wrapText:true,verticalAlignment:"center"};
 s.getRange("A:A").format.columnWidth=30;s.getRange("B:B").format.columnWidth=42;s.getRange("C:C").format.columnWidth=3;s.getRange("D:H").format.columnWidth=22;
}

// Gates keep the hard cap honest.
{
 const s=wb.worksheets.add("Gates");title(s,"GATES DE COMPRA Y ENSAYO","No compensar un gate excedido eliminando frenos, E-stop, extinción o ensayos.","G");
 s.getRange("A3:G3").values=[["Gate","Decisión","Valor base","Límite","Margen","Estado","Evidencia"]];header(s.getRange("A3:G3"));
 s.getRange("A4:B9").values=[["G1","Donor + service + reparación batería"],["G2","Donor + ruedas + Tow/recuperación"],["G3","Seguridad + generador + AC + DJ + PA"],["G4","Arte + fabricación + ensayos"],["G5","Reserva final"],["TOTAL","Proyecto completo"]];
 s.getRange("C4:C9").formulas=[["=BOM!D4+BOM!D6+BOM!D7"],["=BOM!D4+BOM!D8+BOM!D9+BOM!D10"],["=SUM(BOM!D12:D16)"],["=BOM!D11+BOM!D17+BOM!D18"],["=BOM!D19"],["=BOM!D22"]];
 s.getRange("D4:D9").values=[[4950],[6500],[2550],[2900],[1300],[15000]];
 for(let r=4;r<=9;r++){s.getRange(`E${r}`).formulas=[[`=D${r}-C${r}`]];s.getRange(`F${r}`).formulas=[[`=IF(E${r}>=0,"PASS","STOP")`]]}
 s.getRange("G4:G9").values=[["Prueba batería + frenos + dirección"],["Carga de neumático + Tow con llave fuera"],["RCD, puesta a tierra y tracción inhibida"],["Pesaje y rolling test antes de piel"],["No comprometida"],["Cotizaciones aprobadas"]];body(s.getRange("A4:G9"));usd(s.getRange("C4:E9"));
 s.getRange("F4:F9").conditionalFormats.addCustom("=F4=\"PASS\"",{fill:C.green,font:{bold:true,color:C.ink}});s.getRange("F4:F9").conditionalFormats.addCustom("=F4=\"STOP\"",{fill:C.red,font:{bold:true,color:C.ink}});
 s.getRange("A:A").format.columnWidth=12;s.getRange("B:B").format.columnWidth=46;s.getRange("C:E").format.columnWidth=17;s.getRange("F:F").format.columnWidth=12;s.getRange("G:G").format.columnWidth=48;
}

// Short technical acceptance sheet.
{
 const s=wb.worksheets.add("Especificación");title(s,"ESPECIFICACIÓN DE PREFACTIBILIDAD","Criterios para inspección del donor y rolling test. No habilita vía pública ni reemplaza ingeniería de detalle.","F");
 s.getRange("A3:F3").values=[["Sistema","Base","Preferido","No-go","Ensayo","Responsable"]];header(s.getRange("A3:F3"));
 const rows=[
  ["Donor","Carro de golf/utilitario 48 V 2WD","Carga fabricante ≥350 kg","Sin placa/capacidad o chasis fisurado","5 km cargado; pesaje por eje","Mecánica"],
  ["Tracción","Eje trasero 3–5 kW nominal","Diferencial bloqueable/LSD","Open diff que queda con una rueda","Arranque en pasto y +10% seco","Mecánica"],
  ["Ruedas","25×10-12 atrás; 24×8-12 adelante","6PR, safety bead, offset OEM","Sin tabla de carga o interferencia","Giro/full bump; temperatura; huella","Rodaje"],
  ["Presión","8–10 psi inicial","Ajuste según fabricante","<5 psi sin retención/ensayo","Manómetro baja presión","Rodaje"],
  ["Frenos","Servicio + parking funcional","Revisados antes de ruedas grandes","Compensar costo recortando frenos","Parada recta y retención en pendiente","Frenos"],
  ["Empuje","Tow/neutro verificado","<150 N continuo; <250 N arranque","Neutral sólo electrónico","2 adultos, llave fuera, piso firme","Ensayos"],
  ["Audio","PA alquilado en fase 1","2 tops + 1 sub","Comprar PA dentro del CAPEX","4 h con generador y RCD","Sonido"],
  ["DJ","De pie sobre el suelo","Mesa nivelable con patas","A bordo o de pie en movimiento","Interlock de despliegue","Operación"],
  ["Generador","5,5 kW continuos","Inverter/THD <5% si alcanza","Encendido en movimiento/encerrado","4 h, tensión, frecuencia y temperatura","Eléctrica"],
  ["Arte","80–130 kg; modular","7 bandas atornilladas","Fibra pesada o bloquea ruedas","Pesaje, acceso y bordes","Diseño"],
 ];
 s.getRange("A4:F13").values=rows;body(s.getRange("A4:F13"));s.getRange("A:A").format.columnWidth=19;s.getRange("B:C").format.columnWidth=34;s.getRange("D:D").format.columnWidth=36;s.getRange("E:E").format.columnWidth=38;s.getRange("F:F").format.columnWidth=18;
}

{
 const s=wb.worksheets.add("Fuentes");title(s,"FUENTES Y COTIZACIONES","Precios de marketplace son indicativos; verificar modelo, fecha, impuestos, entrega y estado antes de comprometer fondos.","D");
 s.getRange("A3:D3").values=[["Tema","Fuente","URL","Uso"]];header(s.getRange("A3:D3"));
 s.getRange("A4:D11").values=[
  ["Donor local usado","MercadoLibre Argentina","https://listado.mercadolibre.com.ar/carros-de-golf-electricos-usados","Rango y disponibilidad"],
  ["Referencia técnica donor","Club Car Carryall 300","https://www.clubcar.com/-/media/project/milky-way/clubcar/clubcar-documents/pdf/literature/commercial/carryall/comm0045---carryall-300-brochure-lr.pdf","Potencia y capacidad del fabricante"],
  ["Neumático trasero","MercadoLibre Argentina","https://www.mercadolibre.com.ar/cubierta-25x1012-honda-polaris-can-am-kawasak-tacos-ref-6-t/up/MLAU298485992","Precio indicativo; no prueba carga"],
  ["Neumático delantero","MercadoLibre Argentina","https://listado.mercadolibre.com.ar/cubiertas-24-8-12","Precio indicativo"],
  ["Generador","MercadoLibre Argentina","https://listado.mercadolibre.com.ar/grupos-electrogenos-6500w","Rango local"],
  ["PA alquilado","OM Rental","https://www.alquilerdecamaras.com.ar/rentals/omrental/","Primeros eventos"],
  ["Criterios Mutant Vehicle","Burning Man","https://burningman.org/black-rock-city/bring-your-mutant-vehicle/mv-criteria-and-licensing/","Mutación radical y operación"],
  ["Pequeños envíos","ARCA","https://www.arca.gob.ar/envios-internacionales/courier/importacion/pequenios-envios.asp","Importación residual"],
 ];body(s.getRange("A4:D11"));s.getRange("A:A").format.columnWidth=27;s.getRange("B:B").format.columnWidth=28;s.getRange("C:C").format.columnWidth=78;s.getRange("D:D").format.columnWidth=38;
}

const out=await SpreadsheetFile.exportXlsx(wb);await out.save(OUT);
for(const name of ["Resumen","BOM","Gates","Especificación","Fuentes"]){const png=await wb.render({sheetName:name,autoCrop:"all",scale:1.15,format:"png"});const safe=name.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();await fs.writeFile(`${QA}/${safe}.png`,new Uint8Array(await png.arrayBuffer()))}
const check=await wb.inspect({kind:"table",range:"BOM!A3:J24",include:"values,formulas",tableMaxRows:30,tableMaxCols:12});await fs.writeFile(`${QA}/inspect.ndjson`,check.ndjson);
const errors=await wb.inspect({kind:"match",searchTerm:"#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",options:{useRegex:true,maxResults:100},summary:"formula error scan"});await fs.writeFile(`${QA}/errors.ndjson`,errors.ndjson);
console.log(`Exported ${OUT}`);
