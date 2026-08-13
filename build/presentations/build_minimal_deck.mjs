import fs from "node:fs/promises";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const ROOT = "/Users/martinmarquez/projects/chakana-art-car";
const OUT = `${ROOT}/output/presentaciones`;
const QA = `${ROOT}/qa/presentaciones/03_Tatu_Sonoro_Minimo_15K`;
const VIS = `${ROOT}/output/visuals`;
const W = 1280, H = 720, M = 72;
const P = { navy:"#071624", navy2:"#0E2637", paper:"#FCFAF6", cream:"#F3EEE5", ink:"#132433", gray:"#62717C", cyan:"#4BC0C8", amber:"#F3A333", copper:"#B86632", red:"#C75E4B", green:"#7EA486", pale:"#DCEBED", white:"#FFFFFF", line:"#C9D1D4" };

await fs.mkdir(OUT,{recursive:true}); await fs.mkdir(QA,{recursive:true});
async function bytes(path){const b=await fs.readFile(path);return b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength)}
function sh(slide,geometry,position,fill="none",name){return slide.shapes.add({geometry,name,position,fill,line:{style:"solid",fill:"none",width:0}})}
function rect(slide,p,fill,name,r=0){const s=sh(slide,r?"roundRect":"rect",p,fill,name);if(r)s.borderRadius=r;return s}
function tx(slide,value,p,o={}){const s=sh(slide,"textbox",p,"none",o.name);s.text=value;s.text.style={typeface:"Arial",fontSize:o.fontSize??24,bold:o.bold??false,italic:o.italic??false,color:o.color||P.ink,alignment:o.alignment||"left",verticalAlignment:o.verticalAlignment||"top",autoFit:"shrinkText",wrap:"square",insets:{left:0,right:0,top:0,bottom:0},...(o.lineSpacing?{lineSpacing:o.lineSpacing}:{})};return s}
function rule(slide,l,t,w,h=4,fill=P.amber,name="rule"){return rect(slide,{left:l,top:t,width:w,height:h},fill,name)}
function base(slide,dark=false){slide.background.fill=dark?P.navy:P.paper}
function title(slide,value,dark=false,eyebrow="TATÚ SONORO MÍNIMO"){tx(slide,eyebrow,{left:M,top:36,width:350,height:24},{fontSize:14,bold:true,color:dark?P.cyan:P.copper});tx(slide,value,{left:M,top:72,width:1136,height:58},{fontSize:38,bold:true,color:dark?P.white:P.navy});rule(slide,M,140,90,4,P.amber)}
function footer(slide,n,dark=false){tx(slide,"PREFactibilidad mínima · agosto 2026",{left:M,top:681,width:430,height:18},{fontSize:12,color:dark?"#AFC1CB":P.gray});tx(slide,String(n).padStart(2,"0"),{left:1148,top:678,width:60,height:22},{fontSize:13,bold:true,color:dark?P.white:P.navy,alignment:"right"})}
async function img(slide,path,p,alt,fit="cover",radius=0){return slide.images.add({blob:await bytes(path),contentType:"image/png",alt,fit,position:p,geometry:radius?"roundRect":"rect",...(radius?{borderRadius:radius}:{}),prompt:"Built-in ImageGen project concept visual"})}
function notes(slide,sources,presenter=""){slide.speakerNotes.textFrame.setText(`${presenter}${presenter?"\n\n":""}[Sources]\n${sources.map(x=>`- ${x}`).join("\n")}\n[/Sources]`);slide.speakerNotes.setVisible(false)}
function bullet(slide,items,p,o={}){const gap=o.gap||58;items.forEach((item,i)=>{const y=p.top+i*gap;rect(slide,{left:p.left,top:y+8,width:9,height:9},o.bulletColor||P.amber,`b${i}`,3);tx(slide,item,{left:p.left+26,top:y,width:p.width-26,height:gap-4},{fontSize:o.fontSize||20,bold:o.bold||false,color:o.color||P.ink})})}
function metric(slide,l,t,w,big,label,dark=false,color=P.amber){tx(slide,big,{left:l,top:t,width:w,height:74},{fontSize:50,bold:true,color});tx(slide,label,{left:l,top:t+78,width:w,height:60},{fontSize:19,color:dark?P.white:P.ink})}
function band(slide,top,num,heading,body,color=P.cyan,dark=false){tx(slide,String(num).padStart(2,"0"),{left:82,top:top+1,width:58,height:42},{fontSize:22,bold:true,color});rule(slide,150,top+18,90,3,color,`r${num}`);tx(slide,heading,{left:265,top,width:280,height:44},{fontSize:22,bold:true,color:dark?P.white:P.navy});tx(slide,body,{left:560,top,width:620,height:64},{fontSize:18,color:dark?"#DCE7ED":P.ink})}

const deck=Presentation.create({slideSize:{width:W,height:H}});

// 1 cover
{
 const s=deck.slides.add();base(s,true);await img(s,`${VIS}/12_tatu_minimo_marcha.png`,{left:0,top:0,width:W,height:H},"Tatú Sonoro Mínimo cerrado en marcha sobre pasto.");
 tx(s,"REDISEÑO BAJO USD 15.000",{left:72,top:80,width:430,height:28},{fontSize:15,bold:true,color:P.cyan});tx(s,"Tatú Sonoro\nMínimo",{left:72,top:138,width:500,height:170},{fontSize:58,bold:true,color:P.white,lineSpacing:.92});rule(s,74,335,105,5,P.amber);tx(s,"Se mueve. Se abre.\nSe convierte en fiesta.",{left:72,top:370,width:430,height:105},{fontSize:27,color:P.white});tx(s,"2×4 · un piloto · DJ en tierra",{left:72,top:640,width:420,height:24},{fontSize:14,bold:true,color:"#BFD1DA"});notes(s,[`${VIS}/12_tatu_minimo_marcha.png`,`${ROOT}/output/Chakana_Art_Car_Anteproyecto_Prefactibilidad.pdf`]);
}
// 2 pivot
{
 const s=deck.slides.add();base(s,false);title(s,"El recorte correcto es dejar de llevar personas");
 tx(s,"ANTES",{left:86,top:195,width:220,height:36},{fontSize:18,bold:true,color:P.red});tx(s,"1,6 t",{left:82,top:245,width:280,height:85},{fontSize:66,bold:true,color:P.navy});tx(s,"5 ocupantes · 4WD · batería nueva",{left:86,top:340,width:380,height:60},{fontSize:21,color:P.gray});
 rule(s,530,185,4,355,P.amber);
 tx(s,"AHORA",{left:600,top:195,width:220,height:36},{fontSize:18,bold:true,color:P.green});tx(s,"donor local",{left:595,top:245,width:440,height:85},{fontSize:58,bold:true,color:P.copper});tx(s,"Sólo piloto · 2×4 · batería usada aprobada",{left:600,top:340,width:540,height:60},{fontSize:21,color:P.ink});
 rect(s,{left:82,top:505,width:1095,height:75},P.pale,"pivot",14);tx(s,"La fiesta viaja guardada; se despliega únicamente con el vehículo detenido.",{left:120,top:526,width:1020,height:34},{fontSize:24,bold:true,color:P.navy,alignment:"center"});footer(s,2);notes(s,[`${ROOT}/output/Chakana_Art_Car_Anteproyecto_Prefactibilidad.pdf`]);
}
// 3 two modes
{
 const s=deck.slides.add();base(s,true);title(s,"Dos modos, una sola escultura",true);
 await img(s,`${VIS}/12_tatu_minimo_marcha.png`,{left:72,top:180,width:535,height:330},"Tatú mínimo cerrado en modo marcha.","cover",18);await img(s,`${VIS}/13_tatu_minimo_fiesta.png`,{left:673,top:180,width:535,height:330},"Tatú mínimo estacionado con DJ de pie y estación desplegada.","cover",18);
 tx(s,"MARCHA",{left:72,top:535,width:220,height:36},{fontSize:22,bold:true,color:P.cyan});tx(s,"Piloto único · arte cerrado · generador apagado",{left:72,top:578,width:500,height:52},{fontSize:19,color:P.white});
 tx(s,"FIESTA",{left:673,top:535,width:220,height:36},{fontSize:22,bold:true,color:P.amber});tx(s,"DJ parado en tierra · PA abierto · generador afuera",{left:673,top:578,width:500,height:52},{fontSize:19,color:P.white});footer(s,3,true);notes(s,[`${VIS}/12_tatu_minimo_marcha.png`,`${VIS}/13_tatu_minimo_fiesta.png`]);
}
// 4 package
{
 const s=deck.slides.add();base(s,false);title(s,"Siete bandas bastan para esconder el chasis");
 await img(s,`${VIS}/12_tatu_minimo_marcha.png`,{left:560,top:160,width:650,height:420},"Tatú Sonoro Mínimo con siete bandas y ruedas ATV grandes.","cover",18);
 band(s,180,1,"Cabeza","",P.amber,false);tx(s,"Visión por la máscara",{left:265,top:217,width:255,height:28},{fontSize:14,color:P.gray});
 band(s,290,2,"Caparazón","",P.cyan,false);tx(s,"7 costillas atornilladas",{left:265,top:327,width:255,height:28},{fontSize:14,color:P.gray});
 band(s,400,3,"Laterales","",P.amber,false);tx(s,"Mesa + registros de PA",{left:265,top:437,width:255,height:28},{fontSize:14,color:P.gray});
 band(s,510,4,"Cola","",P.cyan,false);tx(s,"Empuje + rescate",{left:265,top:547,width:255,height:28},{fontSize:14,color:P.gray});
 tx(s,"3,6–4,0 m × 1,80–1,95 m × ≤2,10 m",{left:660,top:607,width:460,height:28},{fontSize:20,bold:true,color:P.navy,alignment:"center"});footer(s,4);notes(s,[`${VIS}/12_tatu_minimo_marcha.png`]);
}
// 5 wheels
{
 const s=deck.slides.add();base(s,true);title(s,"Ruedas grandes y baja presión antes que más potencia",true);
 metric(s,80,195,255,"25×10–12","traseras motrices · 8–10 psi",true,P.amber);metric(s,390,195,250,"24×8–12","delanteras · 8–10 psi",true,P.cyan);metric(s,700,195,210,"≥1,25×","carga medida por rueda",true,P.amber);metric(s,975,195,220,"≥25 mm","despeje dinámico",true,P.cyan);
 rule(s,80,400,1120,2,"#365162");bullet(s,["ATV/UTV all-terrain 6PR; no taco extremo","Presión final por tabla de carga, huella y temperatura","Mantener offset OEM; sin separadores ni beadlocks en fase 1","Si exige rehacer transaxle o frenos: rueda OEM en el primer test"],{left:165,top:448,width:980},{fontSize:21,gap:48,color:P.white,bulletColor:P.amber});footer(s,5,true);notes(s,["https://listado.mercadolibre.com.ar/cubiertas-24-8-12","https://www.mercadolibre.com.ar/cubierta-25x1012-honda-polaris-can-am-kawasak-tacos-ref-6-t/up/MLAU298485992"]);
}
// 6 traction and range
{
 const s=deck.slides.add();base(s,false);title(s,"El donor se aprueba en campo, no por catálogo");
 s.charts.add("bar",{position:{left:70,top:185,width:790,height:405},categories:["Pasto plano","Pasto +5%","Pasto +10%","Barro +5%","Barro +10%*"],series:[{name:"@5 km/h",values:[1.02,1.65,2.29,2.54,3.18],fill:P.cyan},{name:"@8 km/h",values:[1.63,2.65,3.66,4.07,5.09],fill:P.amber}],barOptions:{direction:"bar",grouping:"clustered",gapWidth:40},hasLegend:true,legend:{position:"bottom",textStyle:{fill:P.ink,fontSize:16}},chartFill:P.paper,plotAreaFill:P.paper,xAxis:{min:0,max:6,majorUnit:1,textStyle:{fill:P.gray,fontSize:14},majorGridlines:{style:"solid",fill:P.line,width:1},title:{text:"kW de tracción",textStyle:{fill:P.gray,fontSize:14}}},yAxis:{textStyle:{fill:P.ink,fontSize:16,bold:true},line:{style:"solid",fill:"none",width:0}},dataLabels:{showValue:true,position:"outEnd",textStyle:{fill:P.navy,fontSize:14,bold:true}},chartLine:{style:"solid",fill:"none",width:0},plotAreaLine:{style:"solid",fill:"none",width:0}});
 tx(s,"3–5 kW",{left:905,top:205,width:280,height:68},{fontSize:48,bold:true,color:P.copper});tx(s,"nominales\ncon buen pico",{left:925,top:282,width:240,height:70},{fontSize:22,color:P.ink});tx(s,"5 km",{left:920,top:405,width:260,height:55},{fontSize:46,bold:true,color:P.cyan});tx(s,"prueba cargado antes de comprar",{left:925,top:466,width:260,height:58},{fontSize:18,color:P.ink});tx(s,"* Barro +10% queda fuera del uso normal",{left:900,top:555,width:280,height:46},{fontSize:16,color:P.red});footer(s,6);notes(s,["https://www.clubcar.com/-/media/project/milky-way/clubcar/clubcar-documents/pdf/literature/commercial/carryall/comm0045---carryall-300-brochure-lr.pdf"]);
}
// 7 DJ generator
{
 const s=deck.slides.add();base(s,true);await img(s,`${VIS}/13_tatu_minimo_fiesta.png`,{left:0,top:0,width:W,height:H},"Tatú mínimo abierto como fiesta con DJ parado sobre el suelo.");rect(s,{left:0,top:0,width:470,height:720},P.navy,"panel");tx(s,"DJ parado.\nVehículo parado.",{left:62,top:90,width:355,height:130},{fontSize:45,bold:true,color:P.white});rule(s,65,248,95,5,P.amber);bullet(s,["Mesa sobre patas propias","Tracción inhibida al desplegar","PA alquilado: 2 tops + 1 sub","Generador 5,5 kW continuos","Generador opera en tierra y afuera"],{left:66,top:300,width:345},{fontSize:19,gap:56,color:P.white,bulletColor:P.cyan});tx(s,"Nunca transportar al DJ de pie.",{left:66,top:610,width:350,height:32},{fontSize:19,bold:true,color:P.amber});notes(s,[`${VIS}/13_tatu_minimo_fiesta.png`,"https://www.afrikaburn.org/afrikaburn-sound-policy/","https://www.alquilerdecamaras.com.ar/rentals/omrental/"]);
}
// 8 push
{
 const s=deck.slides.add();base(s,false);title(s,"Se puede empujar, pero sólo como recuperación corta");
 band(s,175,1,"Tow / neutro","Modo autorizado por fabricante o neutro mecánico real.",P.cyan,false);band(s,280,2,"Compra","Llave fuera: 2 adultos, <150 N continuos y <250 N de arranque.",P.amber,false);band(s,385,3,"Empuje","Sólo firme · ≤20 m · ≤2 km/h · pendiente ≤2%.",P.cyan,false);band(s,490,4,"Rescate","Si se hunde o supera el esfuerzo: malacate/remolque.",P.red,false);
 rect(s,{left:82,top:600,width:1095,height:46},P.pale,"push-gate",10);tx(s,"Piloto sentado dirige y frena · puntos de recuperación unidos al bastidor",{left:110,top:611,width:1040,height:26},{fontSize:20,bold:true,color:P.navy,alignment:"center"});footer(s,8);notes(s,[`${ROOT}/output/Tatu_Sonoro_Minimo_Presupuesto_15K.xlsx`]);
}
// 9 budget
{
 const s=deck.slides.add();base(s,true);title(s,"La versión simple entra en USD 14.650",true);
 const labels=["Donor + inspección","Rodaje seguro","Arte","Eléctrico seguro","Fiesta","Fab. + pruebas"];const vals=[3900,4000,1400,1200,1350,1500];
 s.charts.add("bar",{position:{left:65,top:180,width:760,height:420},categories:labels,series:[{name:"USD",values:vals,fill:P.cyan,points:[{idx:0,fill:P.amber}]}],barOptions:{direction:"bar",grouping:"clustered",gapWidth:40},hasLegend:false,chartFill:P.navy,plotAreaFill:P.navy,xAxis:{min:0,max:4500,majorUnit:1000,textStyle:{fill:"#AFC1CB",fontSize:14},majorGridlines:{style:"solid",fill:"#294052",width:1},title:{text:"USD",textStyle:{fill:"#AFC1CB",fontSize:14}}},yAxis:{textStyle:{fill:P.white,fontSize:16,bold:true},line:{style:"solid",fill:"none",width:0}},dataLabels:{showValue:true,position:"outEnd",textStyle:{fill:P.white,fontSize:16,bold:true}},chartLine:{style:"solid",fill:"none",width:0},plotAreaLine:{style:"solid",fill:"none",width:0}});
 tx(s,"USD 13.350",{left:880,top:190,width:310,height:60},{fontSize:42,bold:true,color:P.cyan});tx(s,"base con PA alquilado",{left:885,top:255,width:280,height:28},{fontSize:18,color:P.white});tx(s,"+ USD 1.300",{left:880,top:340,width:300,height:60},{fontSize:38,bold:true,color:P.amber});tx(s,"contingencia",{left:885,top:405,width:280,height:28},{fontSize:18,color:P.white});rule(s,880,485,275,3,"#365162");tx(s,"USD 14.650",{left:880,top:515,width:310,height:65},{fontSize:44,bold:true,color:P.white});tx(s,"Margen libre: USD 350",{left:885,top:590,width:285,height:30},{fontSize:19,bold:true,color:P.amber});footer(s,9,true);notes(s,[`${ROOT}/output/Tatu_Sonoro_Minimo_Presupuesto_15K.xlsx`]);
}
// 10 boundaries
{
 const s=deck.slides.add();base(s,false);title(s,"El presupuesto depende de decir no");
 band(s,170,1,"Sin pasajeros","Sólo piloto. Los antiguos 500 kg de carga dejan de aplicar.",P.red,false);band(s,270,2,"Sin batería nueva","El donor entra sólo si supera la prueba de 5 km cargado.",P.cyan,false);band(s,370,3,"Sin PA comprado","Alquiler durante los primeros eventos; DJ siempre en tierra.",P.amber,false);band(s,470,4,"Sin importación mayor","China sólo para repuestos livianos y compatibles.",P.cyan,false);
 rect(s,{left:82,top:585,width:1095,height:62},P.navy,"boundary",12);tx(s,"Donor + reparaciones iniciales: máximo USD 4.950; si excede, no se compra.",{left:115,top:602,width:1030,height:32},{fontSize:22,bold:true,color:P.white,alignment:"center"});footer(s,10);notes(s,[`${ROOT}/output/Tatu_Sonoro_Minimo_Presupuesto_15K.xlsx`]);
}
// 11 build path
{
 const s=deck.slides.add();base(s,true);title(s,"Construir primero lo que lo hace moverse",true);
 band(s,170,1,"Elegir donor","Batería, freno, dirección, Tow y 5 km antes de señar.",P.cyan,true);band(s,275,2,"Rolling test","Ruedas, despejes, frenado, neutral, ojos y malacate.",P.amber,true);band(s,380,3,"Fiesta","Generador, RCD, PA alquilado y mesa sobre el suelo.",P.cyan,true);band(s,485,4,"Criatura","Siete bandas, luces y registros de servicio.",P.amber,true);
 tx(s,"Si falla una prueba, el caparazón todavía no está construido.",{left:190,top:610,width:900,height:32},{fontSize:22,bold:true,color:P.white,alignment:"center"});footer(s,11,true);notes(s,[`${ROOT}/output/Tatu_Sonoro_Minimo_Presupuesto_15K.xlsx`]);
}
// 12 ask
{
 const s=deck.slides.add();base(s,false);tx(s,"DECISIÓN",{left:78,top:74,width:250,height:28},{fontSize:16,bold:true,color:P.copper});tx(s,"Aprobar el\nprototipo mínimo",{left:78,top:125,width:650,height:155},{fontSize:56,bold:true,color:P.navy});rule(s,82,320,105,6,P.amber);bullet(s,["Techo total: USD 15.000","Donor local sano antes que piezas sueltas","Ruedas y frenos antes que decoración","DJ siempre de pie y fuera del vehículo"],{left:82,top:370,width:650},{fontSize:22,gap:54,bulletColor:P.cyan});rect(s,{left:800,top:105,width:360,height:475},P.navy,"ask",24);tx(s,"PRIMERO",{left:850,top:160,width:260,height:48},{fontSize:28,bold:true,color:P.cyan,alignment:"center"});tx(s,"donor + ruedas\n+ frenos + prueba",{left:835,top:245,width:290,height:115},{fontSize:31,bold:true,color:P.white,alignment:"center"});rule(s,870,408,220,3,P.amber);tx(s,"DESPUÉS",{left:850,top:455,width:260,height:45},{fontSize:27,bold:true,color:P.amber,alignment:"center"});tx(s,"PA alquilado + piel",{left:840,top:520,width:280,height:35},{fontSize:20,color:P.white,alignment:"center"});tx(s,"Tatú Sonoro Mínimo · anteproyecto revisado",{left:82,top:660,width:480,height:22},{fontSize:13,color:P.gray});notes(s,[`${ROOT}/output/Tatu_Sonoro_Minimo_Presupuesto_15K.xlsx`]);
}

for(const [i,s] of deck.slides.items.entries()){const label=`slide-${String(i+1).padStart(2,"0")}`;const png=await deck.export({slide:s,format:"png",scale:1});await fs.writeFile(`${QA}/${label}.png`,new Uint8Array(await png.arrayBuffer()));const layout=await s.export({format:"layout"});await fs.writeFile(`${QA}/${label}.layout.json`,await layout.text())}
const montage=await deck.export({format:"webp",montage:true,scale:1});await fs.writeFile(`${QA}/montage.webp`,new Uint8Array(await montage.arrayBuffer()));
const inspect=await deck.inspect({kind:"slide,textbox,shape,image,chart,notes",maxChars:50000});await fs.writeFile(`${QA}/inspect.ndjson`,inspect.ndjson);
const pptx=await PresentationFile.exportPptx(deck);await pptx.save(`${OUT}/03_Tatu_Sonoro_Minimo_15K.pptx`);
console.log("Exported 03_Tatu_Sonoro_Minimo_15K");
