import fs from "node:fs/promises";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const ROOT = "/Users/martinmarquez/projects/chakana-art-car";
const OUT = `${ROOT}/output/presentaciones`;
const QA = `${ROOT}/qa/presentaciones`;
const VIS = `${ROOT}/output/visuals`;

const W = 1280;
const H = 720;
const M = 72;
const P = {
  navy: "#071624",
  navy2: "#0E2637",
  cream: "#F3EEE5",
  paper: "#FCFAF6",
  ink: "#132433",
  gray: "#62717C",
  pale: "#DCEBED",
  cyan: "#4BC0C8",
  amber: "#F3A333",
  copper: "#B86632",
  green: "#7EA486",
  red: "#C75E4B",
  white: "#FFFFFF",
  line: "#C9D1D4",
};

await fs.mkdir(OUT, { recursive: true });
await fs.mkdir(QA, { recursive: true });

async function imageBytes(path) {
  const bytes = await fs.readFile(path);
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}

function shape(slide, geometry, position, fill = "none", lineFill = "none", lineWidth = 0, name = undefined) {
  return slide.shapes.add({
    geometry,
    ...(name ? { name } : {}),
    position,
    fill,
    line: { style: "solid", fill: lineFill, width: lineWidth },
  });
}

function rect(slide, position, fill, name, radius = 0, lineFill = "none", lineWidth = 0) {
  const s = shape(slide, radius ? "roundRect" : "rect", position, fill, lineFill, lineWidth, name);
  if (radius) s.borderRadius = radius;
  return s;
}

function text(slide, value, position, options = {}) {
  const s = shape(slide, "textbox", position, "none", "none", 0, options.name);
  s.text = value;
  s.text.style = {
    typeface: options.typeface || "Arial",
    fontSize: options.fontSize ?? 24,
    bold: options.bold ?? false,
    italic: options.italic ?? false,
    color: options.color || P.ink,
    alignment: options.alignment || "left",
    verticalAlignment: options.verticalAlignment || "top",
    autoFit: options.autoFit || "shrinkText",
    wrap: "square",
    insets: options.insets || { left: 0, right: 0, top: 0, bottom: 0 },
    ...(options.lineSpacing ? { lineSpacing: options.lineSpacing } : {}),
  };
  return s;
}

function rule(slide, left, top, width, height = 3, fill = P.amber, name = "rule") {
  return rect(slide, { left, top, width, height }, fill, name);
}

function base(slide, dark = false) {
  slide.background.fill = dark ? P.navy : P.paper;
}

function title(slide, value, dark = false, eyebrow = "TATÚ SONORO") {
  text(slide, eyebrow, { left: M, top: 35, width: 310, height: 24 }, { fontSize: 14, bold: true, color: dark ? P.cyan : P.copper, name: "eyebrow" });
  text(slide, value, { left: M, top: 70, width: 1136, height: 58 }, { fontSize: 38, bold: true, color: dark ? P.white : P.navy, name: "slide-title" });
  rule(slide, M, 140, 88, 4, P.amber, "title-rule");
}

function footer(slide, number, dark = false, label = "PREFactibilidad · agosto 2026") {
  text(slide, label, { left: M, top: 681, width: 430, height: 18 }, { fontSize: 12, color: dark ? "#9EB2C0" : P.gray, name: "footer-label" });
  text(slide, String(number).padStart(2, "0"), { left: 1150, top: 678, width: 58, height: 22 }, { fontSize: 13, bold: true, color: dark ? P.white : P.navy, alignment: "right", name: "slide-number" });
}

function bulletList(slide, items, position, options = {}) {
  const gap = options.gap || 56;
  items.forEach((item, i) => {
    const y = position.top + i * gap;
    rect(slide, { left: position.left, top: y + 7, width: 9, height: 9 }, options.bulletColor || P.amber, `bullet-${i}`, 3);
    text(slide, item, { left: position.left + 26, top: y, width: position.width - 26, height: gap - 4 }, {
      fontSize: options.fontSize || 20,
      color: options.color || P.ink,
      bold: options.bold || false,
      name: `bullet-text-${i}`,
    });
  });
}

function metric(slide, left, top, width, big, label, dark = false, accent = P.amber) {
  text(slide, big, { left, top, width, height: 74 }, { fontSize: 50, bold: true, color: accent, name: `metric-${big}` });
  text(slide, label, { left, top: top + 78, width, height: 58 }, { fontSize: 19, color: dark ? P.white : P.ink, name: `metric-label-${big}` });
}

async function addImage(slide, path, position, alt, fit = "cover", radius = 0, crop = undefined, name = undefined) {
  const img = slide.images.add({
    blob: await imageBytes(path),
    contentType: "image/png",
    alt,
    fit,
    position,
    geometry: radius ? "roundRect" : "rect",
    ...(radius ? { borderRadius: radius } : {}),
    ...(crop ? { crop } : {}),
    prompt: "Project-owned ImageGen concept visual; see source-notes.txt",
  });
  if (name) img.name = name;
  return img;
}

function notes(slide, sources, presenter = "") {
  const block = `${presenter}${presenter ? "\n\n" : ""}[Sources]\n${sources.map((s) => `- ${s}`).join("\n")}\n[/Sources]`;
  slide.speakerNotes.textFrame.setText(block);
  slide.speakerNotes.setVisible(false);
}

function addScoreBar(slide, label, value, top, color, dark = false) {
  text(slide, label, { left: 86, top: top + 4, width: 285, height: 38 }, { fontSize: 20, bold: true, color: dark ? P.white : P.ink });
  rect(slide, { left: 370, top, width: 720, height: 38 }, dark ? P.navy2 : P.cream, `score-bg-${label}`, 15);
  rect(slide, { left: 370, top, width: 720 * value / 5, height: 38 }, color, `score-${label}`, 15);
  text(slide, value.toFixed(2), { left: 1110, top: top + 1, width: 70, height: 40 }, { fontSize: 22, bold: true, color: dark ? P.white : P.navy, alignment: "right" });
}

function timeline(slide, items, top, dark = false) {
  const start = 110;
  const end = 1170;
  rule(slide, start, top + 30, end - start, 4, dark ? P.cyan : P.navy, "timeline");
  const step = (end - start) / (items.length - 1);
  items.forEach((item, i) => {
    const x = start + step * i;
    shape(slide, "ellipse", { left: x - 13, top: top + 18, width: 26, height: 26 }, i === items.length - 1 ? P.amber : P.cyan, "none", 0, `timeline-dot-${i}`);
    text(slide, item.week, { left: x - 45, top: top - 32, width: 90, height: 28 }, { fontSize: 17, bold: true, color: dark ? P.white : P.navy, alignment: "center" });
    text(slide, item.label, { left: x - 82, top: top + 64, width: 164, height: 70 }, { fontSize: 17, bold: true, color: dark ? P.white : P.ink, alignment: "center" });
  });
}

function horizontalBand(slide, top, index, heading, body, color = P.cyan, dark = false) {
  text(slide, String(index).padStart(2, "0"), { left: 82, top: top + 1, width: 58, height: 42 }, { fontSize: 22, bold: true, color });
  rule(slide, 150, top + 18, 100, 3, color, `band-rule-${index}`);
  text(slide, heading, { left: 275, top, width: 310, height: 42 }, { fontSize: 22, bold: true, color: dark ? P.white : P.navy });
  text(slide, body, { left: 610, top, width: 570, height: 64 }, { fontSize: 18, color: dark ? "#DCE7ED" : P.ink });
}

async function buildExecutive() {
  const deck = Presentation.create({ slideSize: { width: W, height: H } });

  // 1 — Hero
  {
    const s = deck.slides.add(); base(s, true);
    await addImage(s, `${VIS}/09_tatu_hero_presentacion.png`, { left: 0, top: 0, width: W, height: H }, "Tatú Sonoro iluminado de noche, con DJ central y silueta de armadillo.");
    text(s, "IDEA + ANTEPROYECTO", { left: 72, top: 76, width: 400, height: 28 }, { fontSize: 15, bold: true, color: P.cyan });
    text(s, "Tatú\nSonoro", { left: 72, top: 130, width: 420, height: 185 }, { fontSize: 66, bold: true, color: P.white, lineSpacing: 0.88, name: "deck-title" });
    rule(s, 74, 340, 108, 5, P.amber);
    text(s, "Una criatura musical móvil\npara barro, pasto y noche", { left: 72, top: 370, width: 410, height: 102 }, { fontSize: 25, color: P.white });
    text(s, "Argentina · prefactibilidad · agosto 2026", { left: 72, top: 650, width: 400, height: 24 }, { fontSize: 13, color: "#A8BBC7" });
    notes(s, [`${VIS}/09_tatu_hero_presentacion.png`, `${ROOT}/output/Chakana_Art_Car_Anteproyecto_Prefactibilidad.pdf`], "Abrir con la criatura y el propósito, no con el chasis.");
  }

  // 2 — Idea
  {
    const s = deck.slides.add(); base(s, false); title(s, "Una criatura, no un vehículo decorado");
    text(s, "CRIATURA", { left: 80, top: 205, width: 500, height: 80 }, { fontSize: 58, bold: true, color: P.navy });
    text(s, "MÚSICA", { left: 80, top: 300, width: 500, height: 80 }, { fontSize: 58, bold: true, color: P.copper });
    text(s, "MOVIMIENTO", { left: 80, top: 395, width: 620, height: 80 }, { fontSize: 58, bold: true, color: P.cyan });
    rule(s, 730, 215, 4, 320, P.amber);
    text(s, "La máquina desaparece detrás de una anatomía continua. El DJ, los parlantes y las personas forman parte del cuerpo; no se agregan arriba de un carrito.", { left: 790, top: 210, width: 390, height: 240 }, { fontSize: 25, color: P.ink, lineSpacing: 1.15 });
    text(s, "Prueba de lectura", { left: 790, top: 490, width: 260, height: 30 }, { fontSize: 18, bold: true, color: P.copper });
    text(s, "A 20 metros debe verse primero un tatú. Si se ve un UTV, el arte todavía no terminó.", { left: 790, top: 528, width: 390, height: 78 }, { fontSize: 20, color: P.gray });
    footer(s, 2);
    notes(s, ["https://burningman.org/black-rock-city/bring-your-mutant-vehicle/mv-criteria-and-licensing/", `${ROOT}/output/Chakana_Art_Car_Anteproyecto_Prefactibilidad.pdf`]);
  }

  // 3 — Mission metrics
  {
    const s = deck.slides.add(); base(s, true); title(s, "La misión exige poco alcance y mucha capacidad", true);
    metric(s, 85, 205, 220, "5 km", "por carga", true, P.amber);
    rule(s, 320, 210, 3, 270, "#365162");
    metric(s, 365, 205, 220, "500 kg", "carga útil neta", true, P.cyan);
    rule(s, 600, 210, 3, 270, "#365162");
    metric(s, 645, 205, 220, "5 km/h", "velocidad normal", true, P.amber);
    rule(s, 880, 210, 3, 270, "#365162");
    metric(s, 925, 205, 260, "5", "piloto + DJ + 3 pasajeros", true, P.cyan);
    text(s, "Pasto · rastrojo · barro · 10% continuo · 15% corto", { left: 85, top: 545, width: 1100, height: 50 }, { fontSize: 25, bold: true, color: P.white, alignment: "center" });
    text(s, "Límite duro: 10 km/h. Con público, noche o irregularidades: 5 km/h y spotters.", { left: 170, top: 610, width: 940, height: 42 }, { fontSize: 18, color: "#BFD1DA", alignment: "center" });
    footer(s, 3, true);
    notes(s, [`${ROOT}/output/Chakana_Art_Car_Anteproyecto_Prefactibilidad.pdf`, "https://www.afrikaburn.org/event/participation/mutant-vehicles/", "https://www.goingnowhere.org/participate/artomobiles/"]);
  }

  // 4 — Concepts
  {
    const s = deck.slides.add(); base(s, false); title(s, "Tatú y Chakana casi empatan");
    const imgs = [
      [`${VIS}/01_tatu_sonoro.png`, "Tatú Sonoro", "4,55", P.amber],
      [`${VIS}/02_chakana_resonante.png`, "Chakana Resonante", "4,53", P.cyan],
      [`${VIS}/03_coati_nocturno.png`, "Coatí Nocturno", "4,15", "#9275A8"],
    ];
    for (let i = 0; i < imgs.length; i++) {
      const left = 72 + i * 384;
      await addImage(s, imgs[i][0], { left, top: 180, width: 350, height: 310 }, imgs[i][1], "cover", 18);
      rule(s, left, 505, 350, 5, imgs[i][3], `concept-line-${i}`);
      text(s, imgs[i][1], { left, top: 530, width: 260, height: 32 }, { fontSize: 20, bold: true, color: P.navy });
      text(s, imgs[i][2], { left: left + 275, top: 522, width: 75, height: 46 }, { fontSize: 27, bold: true, color: imgs[i][3], alignment: "right" });
    }
    text(s, "Tatú gana por mutación y seguridad. Chakana aporta la lógica modular y flat-pack.", { left: 170, top: 610, width: 940, height: 40 }, { fontSize: 21, bold: true, color: P.ink, alignment: "center" });
    footer(s, 4);
    notes(s, [`${VIS}/01_tatu_sonoro.png`, `${VIS}/02_chakana_resonante.png`, `${VIS}/03_coati_nocturno.png`, `${ROOT}/output/Chakana_Art_Car_Presupuesto_Modelo.xlsx`]);
  }

  // 5 — Why Tatú
  {
    const s = deck.slides.add(); base(s, true); title(s, "Tatú esconde mejor la máquina", true);
    text(s, "4,55", { left: 78, top: 175, width: 430, height: 140 }, { fontSize: 102, bold: true, color: P.amber });
    text(s, "/ 5", { left: 355, top: 247, width: 130, height: 50 }, { fontSize: 34, bold: true, color: P.white });
    text(s, "Puntaje ponderado", { left: 86, top: 330, width: 330, height: 34 }, { fontSize: 19, color: "#BFD1DA" });
    rule(s, 540, 180, 4, 365, P.cyan);
    horizontalBand(s, 190, 1, "Silueta", "Caparazón continuo: no hay capot, cabina ni plataforma reconocible.", P.amber, true);
    horizontalBand(s, 310, 2, "Packaging", "Piloto en la cabeza; DJ en la madriguera; pasajeros en alcobas laterales.", P.cyan, true);
    horizontalBand(s, 430, 3, "Taller", "Escamas removibles: rueda, freno, batería y rescate siguen accesibles.", P.amber, true);
    footer(s, 5, true);
    notes(s, [`${ROOT}/output/Chakana_Art_Car_Presupuesto_Modelo.xlsx`, `${ROOT}/output/Chakana_Art_Car_Anteproyecto_Prefactibilidad.pdf`]);
  }

  // 6 — DJ
  {
    const s = deck.slides.add(); base(s, true);
    await addImage(s, `${VIS}/10_cabina_dj_presentacion.png`, { left: 0, top: 0, width: W, height: H }, "Cabina DJ semi-sentada integrada al caparazón del Tatú Sonoro.");
    rect(s, { left: 835, top: 0, width: 445, height: 720 }, P.navy, "dj-text-panel");
    text(s, "El DJ forma\nparte del cuerpo", { left: 880, top: 85, width: 340, height: 135 }, { fontSize: 45, bold: true, color: P.white });
    rule(s, 880, 242, 90, 5, P.amber);
    bulletList(s, [
      "Semi-sentado y contenido en movimiento",
      "PA 1,8 kW RMS · ≤1 kW promedio",
      "Sub bajo y tops dentro de los hombros",
      "Mute físico y DSP con presets",
    ], { left: 880, top: 290, width: 335 }, { fontSize: 19, gap: 72, color: P.white, bulletColor: P.cyan });
    text(s, "De pie, sólo estacionado.", { left: 880, top: 610, width: 330, height: 35 }, { fontSize: 20, bold: true, color: P.amber });
    text(s, "Visual conceptual · no es plano", { left: 40, top: 674, width: 320, height: 18 }, { fontSize: 12, color: "#BFD1DA" });
    notes(s, [`${VIS}/10_cabina_dj_presentacion.png`, "https://www.afrikaburn.org/afrikaburn-sound-policy/", "https://www.who.int/publications/i/item/9789240043114", `${ROOT}/output/Chakana_Art_Car_Anteproyecto_Prefactibilidad.pdf`]);
  }

  // 7 — Cutaway
  {
    const s = deck.slides.add(); base(s, true); title(s, "La ingeniería queda debajo de la escultura", true);
    await addImage(s, `${VIS}/11_cutaway_presentacion.png`, { left: 60, top: 155, width: 790, height: 470 }, "Corte visual conceptual del Tatú Sonoro con caparazón abierto.", "contain", 12);
    text(s, "Bajo y centrado", { left: 890, top: 185, width: 300, height: 36 }, { fontSize: 22, bold: true, color: P.amber });
    bulletList(s, ["Batería LFP", "Subwoofer", "Inversor y rack"], { left: 895, top: 235, width: 290 }, { fontSize: 20, gap: 52, color: P.white, bulletColor: P.amber });
    text(s, "Alto y liviano", { left: 890, top: 420, width: 300, height: 36 }, { fontSize: 22, bold: true, color: P.cyan });
    bulletList(s, ["Escamas desmontables", "Iluminación", "Canopy permeable"], { left: 895, top: 470, width: 290 }, { fontSize: 20, gap: 52, color: P.white, bulletColor: P.cyan });
    text(s, "Packaging final a validar en CAD", { left: 80, top: 645, width: 420, height: 20 }, { fontSize: 12, color: "#BFD1DA" });
    footer(s, 7, true);
    notes(s, [`${VIS}/11_cutaway_presentacion.png`, `${ROOT}/output/Chakana_Art_Car_Anteproyecto_Prefactibilidad.pdf`]);
  }

  // 8 — Energy chart
  {
    const s = deck.slides.add(); base(s, false); title(s, "15 kWh cierran la misión más exigente");
    s.charts.add("bar", {
      position: { left: 72, top: 190, width: 780, height: 390 },
      categories: ["Firme", "Húmedo", "Húm. +10%", "Húm. +15%", "Barro +10%"],
      series: [{ name: "Misión kWh", values: [2.61, 3.78, 6.68, 8.14, 8.72], fill: P.cyan, points: [{ idx: 4, fill: P.amber }] }],
      barOptions: { direction: "column", grouping: "clustered", gapWidth: 55 },
      hasLegend: false,
      chartFill: P.paper,
      plotAreaFill: P.paper,
      xAxis: { textStyle: { fill: P.ink, fontSize: 16, bold: true }, line: { style: "solid", fill: P.line, width: 1 } },
      yAxis: { min: 0, max: 12, majorUnit: 2, textStyle: { fill: P.gray, fontSize: 14 }, majorGridlines: { style: "solid", fill: P.line, width: 1 } },
      dataLabels: { showValue: true, position: "outEnd", textStyle: { fill: P.navy, fontSize: 17, bold: true } },
      chartLine: { style: "solid", fill: "none", width: 0 },
      plotAreaLine: { style: "solid", fill: "none", width: 0 },
    });
    rule(s, 93, 243, 720, 4, P.red, "usable-line");
    text(s, "10,2 kWh utilizables", { left: 650, top: 217, width: 180, height: 24 }, { fontSize: 14, bold: true, color: P.red, alignment: "right" });
    metric(s, 900, 210, 270, "1,48", "kWh de margen en barro +10%", false, P.amber);
    text(s, "La distancia sola no dimensiona la batería. El peor caso combina masa, rodadura, pendiente y 1,45 kW de auxiliares.", { left: 900, top: 405, width: 285, height: 145 }, { fontSize: 22, color: P.ink });
    footer(s, 8);
    notes(s, [`${ROOT}/output/Chakana_Art_Car_Presupuesto_Modelo.xlsx`, `${ROOT}/output/Chakana_Art_Car_Anteproyecto_Prefactibilidad.pdf`]);
  }

  // 9 — Budget
  {
    const s = deck.slides.add(); base(s, true); title(s, "El presupuesto compra margen", true);
    s.charts.add("bar", {
      position: { left: 70, top: 190, width: 780, height: 385 },
      categories: ["Económico", "Recomendado", "Estrés", "Orugas + DJ"],
      series: [
        { name: "CAPEX neto", values: [43.6, 65.9, 93.6, 63.8], fill: P.cyan },
        { name: "Caja", values: [50.5, 76.5, 109.3, 70.3], fill: P.amber },
      ],
      barOptions: { direction: "bar", grouping: "clustered", gapWidth: 38 },
      hasLegend: true,
      legend: { position: "bottom", overlay: false, textStyle: { fill: P.white, fontSize: 16 } },
      chartFill: P.navy,
      plotAreaFill: P.navy,
      xAxis: { min: 0, max: 120, majorUnit: 20, textStyle: { fill: "#AFC1CB", fontSize: 14 }, majorGridlines: { style: "solid", fill: "#294052", width: 1 }, numberFormatCode: "$0\"k\"" },
      yAxis: { textStyle: { fill: P.white, fontSize: 17, bold: true }, line: { style: "solid", fill: "none", width: 0 } },
      dataLabels: { showValue: true, position: "outEnd", textStyle: { fill: P.white, fontSize: 15, bold: true } },
      chartLine: { style: "solid", fill: "none", width: 0 },
      plotAreaLine: { style: "solid", fill: "none", width: 0 },
    });
    text(s, "USD 65,9k", { left: 905, top: 210, width: 290, height: 60 }, { fontSize: 44, bold: true, color: P.amber });
    text(s, "costo neto base", { left: 910, top: 280, width: 270, height: 30 }, { fontSize: 19, color: P.white });
    text(s, "USD 76,5k", { left: 905, top: 365, width: 290, height: 60 }, { fontSize: 44, bold: true, color: P.cyan });
    text(s, "necesidad de caja", { left: 910, top: 435, width: 270, height: 30 }, { fontSize: 19, color: P.white });
    text(s, "Caja ≠ costo: IVA y percepciones pueden recuperarse.", { left: 905, top: 530, width: 275, height: 70 }, { fontSize: 18, color: "#BFD1DA" });
    footer(s, 9, true);
    notes(s, [`${ROOT}/output/Chakana_Art_Car_Presupuesto_Modelo.xlsx`, "https://www.argentina.gob.ar/normativa/nacional/norma-407914", "https://www.argentina.gob.ar/node/196822"]);
  }

  // 10 — no buy
  {
    const s = deck.slides.add(); base(s, false); title(s, "No comprar todavía");
    horizontalBand(s, 190, 1, "4 ruedas", "USD 530,40, pero no demuestra carga, frenos, masa ni 4WD real.", P.red, false);
    horizontalBand(s, 315, 2, "Orugas", "La ficha no prueba frenado ni aptitud para pasajeros; logística y masa crecen.", P.red, false);
    horizontalBand(s, 440, 3, "Eje 2 kW", "Insuficiente para 1,6 t, barro y pendiente. El claim de 900 kg no es payload.", P.red, false);
    rect(s, { left: 82, top: 585, width: 1095, height: 58 }, P.pale, "no-buy-summary", 12);
    text(s, "Comprar especificaciones verificadas, no títulos de publicación.", { left: 115, top: 600, width: 1030, height: 30 }, { fontSize: 23, bold: true, color: P.navy, alignment: "center" });
    footer(s, 10);
    notes(s, ["https://www.alibaba.com/product-detail/Four-Wheel-Unmanned-Autonomous-Wire-Control_1601605765591.html", "https://www.alibaba.com/product-detail/OEM-Custom-Remote-Controlled-Rubber-Track_1601864041467.html", "https://www.alibaba.com/product-detail/100CM-2000W-Shift-Differential-Rear-Axle_1601869479511.html", `${ROOT}/output/Chakana_Art_Car_Anteproyecto_Prefactibilidad.pdf`]);
  }

  // 11 — timeline
  {
    const s = deck.slides.add(); base(s, true); title(s, "De idea a misión validada en 7–9 meses", true);
    timeline(s, [
      { week: "1–2", label: "Brief y reglas" },
      { week: "2–8", label: "RFQ + donor" },
      { week: "7–16", label: "Ingeniería + fábrica" },
      { week: "16–29", label: "Importar + integrar" },
      { week: "29–36", label: "Ensayar + operar" },
    ], 290, true);
    text(s, "La secuencia evita esconder fallas debajo del arte: primero rolling chassis, después estructura, audio y por último caparazón.", { left: 190, top: 545, width: 900, height: 70 }, { fontSize: 22, color: "#DCE7ED", alignment: "center" });
    footer(s, 11, true);
    notes(s, [`${ROOT}/output/Chakana_Art_Car_Anteproyecto_Prefactibilidad.pdf`]);
  }

  // 12 — ask
  {
    const s = deck.slides.add(); base(s, false);
    text(s, "PRÓXIMA DECISIÓN", { left: 78, top: 70, width: 420, height: 30 }, { fontSize: 16, bold: true, color: P.copper });
    text(s, "Aprobar primero\nUSD 2–4 mil", { left: 78, top: 125, width: 620, height: 170 }, { fontSize: 60, bold: true, color: P.navy });
    rule(s, 82, 330, 110, 6, P.amber);
    bulletList(s, ["RFQ técnico comparable", "Clasificación NCM escrita", "Layout CAD", "Prueba / alquiler de PA"], { left: 82, top: 380, width: 490 }, { fontSize: 22, gap: 52, bulletColor: P.cyan });
    rect(s, { left: 760, top: 95, width: 400, height: 500 }, P.navy, "ask-block", 26);
    text(s, "NO", { left: 815, top: 145, width: 290, height: 80 }, { fontSize: 62, bold: true, color: P.amber, alignment: "center" });
    text(s, "autorizar todavía\nel CAPEX completo", { left: 805, top: 245, width: 310, height: 105 }, { fontSize: 28, bold: true, color: P.white, alignment: "center" });
    rule(s, 855, 390, 210, 3, P.cyan);
    text(s, "El proyecto es viable.\nEl donor todavía no está probado.", { left: 820, top: 430, width: 280, height: 90 }, { fontSize: 21, color: "#DCE7ED", alignment: "center" });
    text(s, "Tatú Sonoro · prefactibilidad", { left: 80, top: 670, width: 380, height: 18 }, { fontSize: 12, color: P.gray });
    notes(s, [`${ROOT}/output/Chakana_Art_Car_Anteproyecto_Prefactibilidad.pdf`, `${ROOT}/output/Chakana_Art_Car_Presupuesto_Modelo.xlsx`]);
  }

  return deck;
}

async function buildTechnical() {
  const deck = Presentation.create({ slideSize: { width: W, height: H } });

  // 1 — cover
  {
    const s = deck.slides.add(); base(s, true);
    await addImage(s, `${VIS}/11_cutaway_presentacion.png`, { left: 0, top: 0, width: W, height: H }, "Corte técnico conceptual del Tatú Sonoro.");
    rect(s, { left: 0, top: 0, width: 470, height: 720 }, P.navy, "cover-panel");
    text(s, "DOSSIER TÉCNICO", { left: 65, top: 86, width: 330, height: 28 }, { fontSize: 15, bold: true, color: P.cyan });
    text(s, "Tatú Sonoro", { left: 65, top: 145, width: 350, height: 125 }, { fontSize: 54, bold: true, color: P.white });
    rule(s, 68, 292, 100, 5, P.amber);
    text(s, "Base de diseño, compras, importación y pruebas", { left: 65, top: 330, width: 330, height: 110 }, { fontSize: 26, color: P.white });
    text(s, "Prefactibilidad · Argentina · agosto 2026", { left: 65, top: 645, width: 350, height: 24 }, { fontSize: 13, color: "#9EB2C0" });
    notes(s, [`${VIS}/11_cutaway_presentacion.png`, `${ROOT}/output/Chakana_Art_Car_Anteproyecto_Prefactibilidad.pdf`]);
  }

  // 2 — basis
  {
    const s = deck.slides.add(); base(s, false); title(s, "El caso de diseño es 1,6 toneladas", false, "BASE TÉCNICA");
    metric(s, 80, 190, 250, "1.635", "kg operativos proyectados", false, P.copper);
    metric(s, 400, 190, 220, "12", "kW continuos 4WD", false, P.cyan);
    metric(s, 700, 190, 220, "15", "kWh LFP nominales", false, P.copper);
    metric(s, 990, 190, 210, "1,7", "t GVWR mínimo", false, P.cyan);
    rule(s, 80, 415, 1120, 2, P.line);
    bulletList(s, [
      "10% continua · 15% corta · pendiente lateral operativa ≤8°",
      "5 km/h normal · 8 km/h traslado · 10 km/h límite duro",
      "Carga útil 500 kg: piloto, DJ, tres pasajeros y pertenencias",
    ], { left: 145, top: 465, width: 1000 }, { fontSize: 22, gap: 58, bulletColor: P.amber });
    footer(s, 2, false, "DOSSIER TÉCNICO · caso de cálculo redondeado a 1.600 kg");
    notes(s, [`${ROOT}/output/Chakana_Art_Car_Anteproyecto_Prefactibilidad.pdf`, `${ROOT}/output/Chakana_Art_Car_Presupuesto_Modelo.xlsx`]);
  }

  // 3 — package
  {
    const s = deck.slides.add(); base(s, true); title(s, "Cinco personas caben sin romper la silueta", true, "PACKAGING");
    await addImage(s, `${VIS}/01_tatu_sonoro.png`, { left: 560, top: 155, width: 650, height: 440 }, "Tatú Sonoro con piloto, DJ y pasajeros integrados.", "cover", 18);
    horizontalBand(s, 180, 1, "Cabeza", "Piloto oculto; visión directa frontal y lateral.", P.amber, true);
    horizontalBand(s, 300, 2, "Centro", "DJ semi-sentado; sub e inversor bajos.", P.cyan, true);
    horizontalBand(s, 420, 3, "Cuerpo", "Tres pasajeros; acceso ≥900 mm; egreso ≥750 mm.", P.amber, true);
    horizontalBand(s, 540, 4, "Piel", "Escamas livianas, abiertas y desmontables.", P.cyan, true);
    text(s, "3,85–3,95 m × 1,90–1,95 m × ≤2,40 m", { left: 615, top: 610, width: 540, height: 30 }, { fontSize: 20, bold: true, color: P.white, alignment: "center" });
    footer(s, 3, true, "DOSSIER TÉCNICO · visual conceptual, no plano");
    notes(s, [`${VIS}/01_tatu_sonoro.png`, `${ROOT}/output/Chakana_Art_Car_Anteproyecto_Prefactibilidad.pdf`]);
  }

  // 4 — mass
  {
    const s = deck.slides.add(); base(s, false); title(s, "El donor debe certificar 1,7 t de GVWR", false, "MASA");
    const data = [
      ["Rolling", 550, P.navy], ["Batería", 135, P.amber], ["Estructura", 170, P.cyan],
      ["Arte", 85, "#9275A8"], ["Audio / DJ", 160, P.copper], ["Luces", 35, P.gray], ["Carga útil", 500, P.green],
    ];
    const total = 1635;
    let x = 80;
    const width = 1120;
    for (let i = 0; i < data.length; i++) {
      const w = width * data[i][1] / total;
      rect(s, { left: x, top: 240, width: w, height: 105 }, data[i][2], `mass-${i}`);
      if (w > 78) text(s, `${data[i][1]} kg`, { left: x + 4, top: 272, width: w - 8, height: 32 }, { fontSize: 17, bold: true, color: P.white, alignment: "center" });
      x += w;
    }
    for (let i = 0; i < data.length; i++) {
      const left = 85 + (i % 4) * 285;
      const top = 410 + Math.floor(i / 4) * 90;
      rect(s, { left, top: top + 4, width: 18, height: 18 }, data[i][2], `mass-key-${i}`, 4);
      text(s, data[i][0], { left: left + 30, top, width: 130, height: 28 }, { fontSize: 17, bold: true, color: P.ink });
      text(s, `${data[i][1]} kg`, { left: left + 155, top, width: 82, height: 28 }, { fontSize: 17, color: P.gray, alignment: "right" });
    }
    rect(s, { left: 80, top: 590, width: 1120, height: 54 }, P.pale, "mass-gate", 10);
    text(s, "Gate: tara ≤1.200 kg · masa operativa ≤1.700 kg · CG cargado ≤0,75 m", { left: 110, top: 604, width: 1060, height: 28 }, { fontSize: 22, bold: true, color: P.navy, alignment: "center" });
    footer(s, 4, false, "DOSSIER TÉCNICO · masa preliminar");
    notes(s, [`${ROOT}/output/Chakana_Art_Car_Presupuesto_Modelo.xlsx`]);
  }

  // 5 — power
  {
    const s = deck.slides.add(); base(s, true); title(s, "12 kW cubren barro y pendiente", true, "TRACCIÓN");
    s.charts.add("bar", {
      position: { left: 70, top: 185, width: 810, height: 420 },
      categories: ["Firme", "Húmedo", "Húm. +10%", "Húm. +15%", "Barro +10%"],
      series: [
        { name: "@5 km/h", values: [1.16, 2.33, 5.23, 6.69, 7.27], fill: P.cyan },
        { name: "@8 km/h", values: [1.86, 3.72, 8.37, 10.70, 11.63], fill: P.amber },
      ],
      barOptions: { direction: "bar", grouping: "clustered", gapWidth: 38 },
      hasLegend: true,
      legend: { position: "bottom", textStyle: { fill: P.white, fontSize: 16 } },
      chartFill: P.navy, plotAreaFill: P.navy,
      xAxis: { min: 0, max: 13, majorUnit: 2, textStyle: { fill: "#AFC1CB", fontSize: 14 }, majorGridlines: { style: "solid", fill: "#294052", width: 1 }, title: { text: "kW de tracción", textStyle: { fill: "#AFC1CB", fontSize: 14 } } },
      yAxis: { textStyle: { fill: P.white, fontSize: 16, bold: true }, line: { style: "solid", fill: "none", width: 0 } },
      dataLabels: { showValue: true, position: "outEnd", textStyle: { fill: P.white, fontSize: 14, bold: true } },
      chartLine: { style: "solid", fill: "none", width: 0 }, plotAreaLine: { style: "solid", fill: "none", width: 0 },
    });
    text(s, "4WD", { left: 930, top: 210, width: 220, height: 70 }, { fontSize: 56, bold: true, color: P.amber });
    text(s, "no es opcional", { left: 935, top: 285, width: 245, height: 34 }, { fontSize: 21, color: P.white });
    text(s, "Con µ = 0,25, el límite ideal 4WD apenas alcanza el peor caso. En 2WD queda ~5,8% de pendiente residual sobre húmedo.", { left: 930, top: 370, width: 265, height: 150 }, { fontSize: 21, color: "#DCE7ED" });
    footer(s, 5, true, "DOSSIER TÉCNICO · m=1.600 kg · η=0,75");
    notes(s, [`${ROOT}/output/Chakana_Art_Car_Presupuesto_Modelo.xlsx`, `${ROOT}/output/Chakana_Art_Car_Anteproyecto_Prefactibilidad.pdf`]);
  }

  // 6 — energy
  {
    const s = deck.slides.add(); base(s, false); title(s, "15 kWh dejan 1,5 kWh de margen", false, "ENERGÍA");
    s.charts.add("bar", {
      position: { left: 72, top: 185, width: 780, height: 410 },
      categories: ["Firme", "Húmedo", "+10%", "+15%", "Barro +10%"],
      series: [{ name: "Misión kWh", values: [2.61, 3.78, 6.68, 8.14, 8.72], fill: P.cyan, points: [{ idx: 4, fill: P.amber }] }],
      barOptions: { direction: "column", grouping: "clustered", gapWidth: 55 },
      hasLegend: false, chartFill: P.paper, plotAreaFill: P.paper,
      xAxis: { textStyle: { fill: P.ink, fontSize: 16, bold: true }, line: { style: "solid", fill: P.line, width: 1 } },
      yAxis: { min: 0, max: 12, majorUnit: 2, textStyle: { fill: P.gray, fontSize: 14 }, majorGridlines: { style: "solid", fill: P.line, width: 1 } },
      dataLabels: { showValue: true, position: "outEnd", textStyle: { fill: P.navy, fontSize: 17, bold: true } },
      chartLine: { style: "solid", fill: "none", width: 0 }, plotAreaLine: { style: "solid", fill: "none", width: 0 },
    });
    metric(s, 915, 195, 250, "10,2", "kWh utilizables con 20% SOC y 15% derating", false, P.copper);
    text(s, "Deslastre", { left: 920, top: 410, width: 220, height: 32 }, { fontSize: 22, bold: true, color: P.cyan });
    bulletList(s, ["Audio primero", "Arte después", "Seguridad nunca"], { left: 920, top: 458, width: 250 }, { fontSize: 20, gap: 52, bulletColor: P.amber });
    footer(s, 6, false, "DOSSIER TÉCNICO · auxiliares 1,45 kW promedio");
    notes(s, [`${ROOT}/output/Chakana_Art_Car_Presupuesto_Modelo.xlsx`]);
  }

  // 7 — architecture
  {
    const s = deck.slides.add(); base(s, true); title(s, "El audio puede fallar sin apagar seguridad", true, "ARQUITECTURA");
    // connectors first
    rect(s, { left: 330, top: 325, width: 145, height: 4 }, "#456172", "conn-main");
    rect(s, { left: 470, top: 205, width: 4, height: 245 }, "#456172", "conn-vertical");
    rect(s, { left: 470, top: 205, width: 145, height: 4 }, "#456172", "conn-top");
    rect(s, { left: 470, top: 325, width: 145, height: 4 }, "#456172", "conn-mid");
    rect(s, { left: 470, top: 445, width: 145, height: 4 }, "#456172", "conn-bottom");
    rect(s, { left: 870, top: 205, width: 145, height: 4 }, "#456172", "conn-top-out");
    rect(s, { left: 870, top: 325, width: 145, height: 4 }, "#456172", "conn-mid-out");
    rect(s, { left: 870, top: 445, width: 145, height: 4 }, "#456172", "conn-bottom-out");
    const nodes = [
      [90, 265, 240, 130, "LFP 72 V · 15 kWh", "BMS · fusible · precharge · contactor", P.amber],
      [615, 155, 255, 105, "Tracción 4WD", "12 kW continuos", P.cyan],
      [615, 275, 255, 105, "Seguridad 12/24 V", "E-stops · luces · radio", P.amber],
      [615, 395, 255, 105, "DJ + audio 230 V", "Contactor · inversor · RCD", P.cyan],
      [1015, 155, 190, 105, "Motores", "Torque cero ante falla", P.cyan],
      [1015, 275, 190, 105, "Función vital", "Permanece encendida", P.amber],
      [1015, 395, 190, 105, "Carga flexible", "Mute + límite SOC", P.cyan],
    ];
    nodes.forEach((n, i) => {
      rect(s, { left: n[0], top: n[1], width: n[2], height: n[3] }, P.navy2, `arch-node-${i}`, 16, "#456172", 1);
      rule(s, n[0], n[1], 8, n[3], n[6], `arch-accent-${i}`);
      text(s, n[4], { left: n[0] + 24, top: n[1] + 20, width: n[2] - 40, height: 34 }, { fontSize: 20, bold: true, color: P.white });
      text(s, n[5], { left: n[0] + 24, top: n[1] + 62, width: n[2] - 40, height: 38 }, { fontSize: 16, color: "#BFD1DA" });
    });
    text(s, "E-stop corta tracción en ≤0,5 s; las luces y la radio continúan.", { left: 170, top: 570, width: 940, height: 40 }, { fontSize: 22, bold: true, color: P.white, alignment: "center" });
    footer(s, 7, true, "DOSSIER TÉCNICO · diagrama funcional preliminar");
    notes(s, [`${ROOT}/output/Chakana_Art_Car_Anteproyecto_Prefactibilidad.pdf`]);
  }

  // 8 — safety
  {
    const s = deck.slides.add(); base(s, false); title(s, "Frenos y egresos mandan el detalle", false, "SEGURIDAD");
    horizontalBand(s, 175, 1, "Frenos", "Hidráulicos en 4 ruedas; parking mecánico; no depender de regeneración.", P.red, false);
    horizontalBand(s, 280, 2, "Dirección", "Mecánica con EPS; pérdida de señal = torque cero.", P.cyan, false);
    horizontalBand(s, 385, 3, "Ocupantes", "Todos contenidos; DJ semi-sentado; ninguna persona de pie.", P.amber, false);
    horizontalBand(s, 490, 4, "Egresos", "Principal ≥900 mm; secundario ≥750 mm; salida completa ≤15 s.", P.cyan, false);
    text(s, "Objetivos SAT", { left: 84, top: 610, width: 200, height: 30 }, { fontSize: 18, bold: true, color: P.copper });
    text(s, "≤1,5 m seco · ≤2,0 m mojado · parking 20% · lateral operativa ≤8°", { left: 295, top: 607, width: 875, height: 34 }, { fontSize: 21, bold: true, color: P.navy });
    footer(s, 8, false, "DOSSIER TÉCNICO · criterios de anteproyecto");
    notes(s, [`${ROOT}/output/Chakana_Art_Car_Anteproyecto_Prefactibilidad.pdf`, "https://www.goingnowhere.org/participate/artomobiles/"]);
  }

  // 9 — products
  {
    const s = deck.slides.add(); base(s, true); title(s, "Los tres links todavía no son comprables", true, "SCREENING DE PRODUCTOS");
    horizontalBand(s, 175, 1, "Wire-control", "≈USD 530 · sin masa, GVWR, frenos ni 4WD verificable.", P.red, true);
    horizontalBand(s, 295, 2, "Orugas", "Ficha crítica incompleta · mayor masa, transporte y mantenimiento.", P.red, true);
    horizontalBand(s, 415, 3, "Eje 2 kW", "2 kW insuficientes · “900 kg” no define payload de vehículo.", P.red, true);
    rect(s, { left: 82, top: 570, width: 1095, height: 60 }, P.navy2, "screening-summary", 12, "#456172", 1);
    text(s, "GO sólo con GVWR ≥1,7 t + 12 kW continuos + 4 frenos + parking mecánico + UN38.3", { left: 105, top: 586, width: 1050, height: 30 }, { fontSize: 21, bold: true, color: P.white, alignment: "center" });
    footer(s, 9, true, "DOSSIER TÉCNICO · marketplace ≠ conformidad");
    notes(s, ["https://www.alibaba.com/product-detail/Four-Wheel-Unmanned-Autonomous-Wire-Control_1601605765591.html", "https://www.alibaba.com/product-detail/OEM-Custom-Remote-Controlled-Rubber-Track_1601864041467.html", "https://www.alibaba.com/product-detail/100CM-2000W-Shift-Differential-Rear-Axle_1601869479511.html", "https://www.phmsa.dot.gov/lithiumbatteries"]);
  }

  // 10 — import/cost
  {
    const s = deck.slides.add(); base(s, false); title(s, "Costo neto y caja no son lo mismo", false, "IMPORTACIÓN + CAPEX");
    text(s, "USD 24,1k", { left: 80, top: 185, width: 330, height: 70 }, { fontSize: 48, bold: true, color: P.copper });
    text(s, "importado puesto en taller · neto", { left: 84, top: 260, width: 360, height: 48 }, { fontSize: 20, color: P.ink });
    text(s, "+ USD 10,5k", { left: 80, top: 355, width: 330, height: 70 }, { fontSize: 48, bold: true, color: P.cyan });
    text(s, "tributos recuperables · caja", { left: 84, top: 430, width: 350, height: 48 }, { fontSize: 20, color: P.ink });
    rule(s, 500, 175, 4, 350, P.amber);
    bulletList(s, [
      "FOB + documentación + repuestos: USD 14,8k",
      "Flete/origen/seguro/DG: USD 2,8k",
      "Derecho supuesto: 18% · estadística: 3%",
      "Clasificación NCM escrita antes de la PO",
    ], { left: 555, top: 190, width: 610 }, { fontSize: 21, gap: 78, bulletColor: P.amber });
    rect(s, { left: 550, top: 535, width: 610, height: 70 }, P.pale, "cost-total", 12);
    text(s, "Proyecto base: USD 65,9k netos / USD 76,5k caja", { left: 575, top: 554, width: 560, height: 34 }, { fontSize: 23, bold: true, color: P.navy, alignment: "center" });
    footer(s, 10, false, "DOSSIER TÉCNICO · confirmar NCM, condición fiscal y tipo de cambio");
    notes(s, [`${ROOT}/output/Chakana_Art_Car_Presupuesto_Modelo.xlsx`, "https://www.argentina.gob.ar/normativa/nacional/norma-407914", "https://www.argentina.gob.ar/node/196822", "https://www.argentina.gob.ar/obtener-licencia-de-configuracion-de-modelo"]);
  }

  // 11 — verification
  {
    const s = deck.slides.add(); base(s, true); title(s, "Nadie sube antes de cerrar once ensayos", true, "VERIFICACIÓN");
    horizontalBand(s, 165, 1, "Ingreso", "Identidad · pesaje · documentos · aislamiento.", P.cyan, true);
    horizontalBand(s, 270, 2, "Dinámica", "Frenado · pendiente · descenso · giro · E-stop.", P.amber, true);
    horizontalBand(s, 375, 3, "Arte + audio", "Holguras · anclajes · RCD · temperatura · SPL.", P.cyan, true);
    horizontalBand(s, 480, 4, "Misión", "5 km a masa total + 25 km de durabilidad.", P.amber, true);
    rect(s, { left: 82, top: 595, width: 1095, height: 46 }, P.navy2, "test-gate", 10, "#456172", 1);
    text(s, "PASS final: ≥20% SOC · sin fade · sin fisuras · sin resets · evacuación ≤15 s", { left: 105, top: 606, width: 1050, height: 26 }, { fontSize: 20, bold: true, color: P.white, alignment: "center" });
    footer(s, 11, true, "DOSSIER TÉCNICO · FAT proveedor + SAT local");
    notes(s, [`${ROOT}/output/Chakana_Art_Car_Anteproyecto_Prefactibilidad.pdf`]);
  }

  // 12 — RFQ closing
  {
    const s = deck.slides.add(); base(s, false);
    text(s, "PRÓXIMO GATE", { left: 78, top: 72, width: 330, height: 28 }, { fontSize: 16, bold: true, color: P.copper });
    text(s, "El RFQ debe eliminar\nla incertidumbre", { left: 78, top: 125, width: 680, height: 155 }, { fontSize: 52, bold: true, color: P.navy });
    rule(s, 82, 320, 105, 6, P.amber);
    bulletList(s, [
      "Masa, GVWR y cargas por eje",
      "Curvas de torque, corriente y temperatura",
      "Frenos 4 ruedas y parking 20%",
      "UN38.3, esquemas, software y repuestos",
    ], { left: 82, top: 370, width: 620 }, { fontSize: 21, gap: 54, bulletColor: P.cyan });
    rect(s, { left: 785, top: 110, width: 390, height: 470 }, P.navy, "rfq-block", 24);
    text(s, "GO", { left: 850, top: 160, width: 260, height: 80 }, { fontSize: 62, bold: true, color: P.cyan, alignment: "center" });
    text(s, "si el proveedor responde\ncada línea con evidencia", { left: 835, top: 270, width: 290, height: 100 }, { fontSize: 25, bold: true, color: P.white, alignment: "center" });
    rule(s, 870, 410, 220, 3, P.amber);
    text(s, "NO-GO", { left: 850, top: 445, width: 260, height: 50 }, { fontSize: 34, bold: true, color: P.amber, alignment: "center" });
    text(s, "ante claims sin método de ensayo", { left: 845, top: 505, width: 270, height: 50 }, { fontSize: 18, color: "#DCE7ED", alignment: "center" });
    text(s, "Anexo A del anteproyecto: RFQ bilingüe completo", { left: 82, top: 650, width: 540, height: 28 }, { fontSize: 16, color: P.gray });
    notes(s, [`${ROOT}/output/Chakana_Art_Car_Anteproyecto_Prefactibilidad.pdf`, "https://www.phmsa.dot.gov/lithiumbatteries"]);
  }

  return deck;
}

async function exportDeck(deck, stem) {
  const dir = `${QA}/${stem}`;
  await fs.mkdir(dir, { recursive: true });
  for (const [index, slide] of deck.slides.items.entries()) {
    const label = `slide-${String(index + 1).padStart(2, "0")}`;
    const png = await deck.export({ slide, format: "png", scale: 1 });
    await fs.writeFile(`${dir}/${label}.png`, new Uint8Array(await png.arrayBuffer()));
    const layout = await slide.export({ format: "layout" });
    await fs.writeFile(`${dir}/${label}.layout.json`, await layout.text());
  }
  const montage = await deck.export({ format: "webp", montage: true, scale: 1 });
  await fs.writeFile(`${dir}/montage.webp`, new Uint8Array(await montage.arrayBuffer()));
  const inspect = await deck.inspect({ kind: "slide,textbox,shape,image,chart,notes", maxChars: 50000 });
  await fs.writeFile(`${dir}/inspect.ndjson`, inspect.ndjson);
  const pptx = await PresentationFile.exportPptx(deck);
  await pptx.save(`${OUT}/${stem}.pptx`);
  console.log(`Exported ${stem}`);
}

await exportDeck(await buildExecutive(), "01_Tatu_Sonoro_Presentacion_Ejecutiva");
await exportDeck(await buildTechnical(), "02_Tatu_Sonoro_Dossier_Tecnico");
