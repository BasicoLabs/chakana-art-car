from __future__ import annotations

from pathlib import Path
from textwrap import wrap

from PIL import Image, ImageDraw, ImageFont
from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.style import WD_STYLE_TYPE
from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT, WD_ROW_HEIGHT_RULE, WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK, WD_LINE_SPACING
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Inches, Pt, RGBColor

ROOT = Path("/Users/martinmarquez/projects/chakana-art-car")
OUT = ROOT / "output"
VIS = OUT / "visuals"
BUILD = ROOT / "build"
DOCX = OUT / "Chakana_Art_Car_Anteproyecto_Prefactibilidad.docx"

NAVY = "15283B"
BLUE = "1F5A75"
CYAN = "56C6C6"
AMBER = "F0A43A"
CREAM = "F5F0E8"
PALE = "E9F3F3"
INK = "17212B"
GRAY = "61707D"
GREEN = "DCEBDD"
RED = "F5D9D5"
LINE = "C9D2D8"
WHITE = "FFFFFF"

FONT_REG = "/System/Library/Fonts/Supplemental/Arial.ttf"
FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"


def font(size: int, bold: bool = False):
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REG, size)


def rgb(hex_value: str):
    return tuple(int(hex_value[i:i+2], 16) for i in (0, 2, 4))


def draw_wrapped(draw, xy, text, fnt, fill, width_chars, spacing=8, anchor=None):
    lines = []
    for paragraph in text.split("\n"):
        lines.extend(wrap(paragraph, width=width_chars) or [""])
    draw.multiline_text(xy, "\n".join(lines), font=fnt, fill=fill, spacing=spacing, anchor=anchor)


def arrow(draw, p1, p2, color, width=6):
    draw.line([p1, p2], fill=color, width=width)
    x2, y2 = p2
    x1, y1 = p1
    dx, dy = x2 - x1, y2 - y1
    mag = max((dx * dx + dy * dy) ** 0.5, 1)
    ux, uy = dx / mag, dy / mag
    px, py = -uy, ux
    head = 18
    pts = [
        (x2, y2),
        (x2 - ux * head + px * head * 0.55, y2 - uy * head + py * head * 0.55),
        (x2 - ux * head - px * head * 0.55, y2 - uy * head - py * head * 0.55),
    ]
    draw.polygon(pts, fill=color)


def box(draw, bounds, title, detail, fill, accent):
    x1, y1, x2, y2 = bounds
    draw.rounded_rectangle(bounds, radius=22, fill=fill, outline=rgb(LINE), width=3)
    draw.rectangle((x1, y1, x1 + 12, y2), fill=accent)
    draw.text((x1 + 30, y1 + 24), title, font=font(27, True), fill=rgb(INK))
    draw_wrapped(draw, (x1 + 30, y1 + 67), detail, font(20), rgb(GRAY), 34, 6)


def make_figures():
    VIS.mkdir(parents=True, exist_ok=True)

    # Architecture
    im = Image.new("RGB", (1600, 980), rgb(CREAM))
    d = ImageDraw.Draw(im)
    d.text((70, 52), "Arquitectura funcional · una batería, tres dominios", font=font(45, True), fill=rgb(NAVY))
    d.text((70, 112), "El entretenimiento puede fallar sin quitar tracción ni luces de seguridad.", font=font(25), fill=rgb(GRAY))
    box(d, (80, 250, 400, 460), "LFP 72 V · 15 kWh", "BMS, fusible, seccionador de servicio, precharge y contactor.", rgb(WHITE), rgb(AMBER))
    box(d, (630, 205, 1030, 380), "Tracción 4WD", "Dos ejes o cuatro motores · 12 kW continuos · 18 kW pico.", rgb(PALE), rgb(CYAN))
    box(d, (630, 420, 1030, 595), "Seguridad 12/24 V", "DC/DC dedicado · E-stops · luces 360° · bocina · radios.", rgb(WHITE), rgb(AMBER))
    box(d, (630, 635, 1030, 830), "DJ + audio 230 V", "Contactor auxiliar · inversor 3 kVA · RCD · DSP · PA pasivo.", rgb(PALE), rgb(CYAN))
    box(d, (1190, 205, 1515, 380), "Motores", "Torque cero ante falla o E-stop.", rgb(WHITE), rgb(AMBER))
    box(d, (1190, 420, 1515, 595), "Función vital", "Permanece encendida al cortar audio.", rgb(WHITE), rgb(AMBER))
    box(d, (1190, 635, 1515, 830), "Carga flexible", "Mute piloto · límite SOC · preset móvil.", rgb(WHITE), rgb(AMBER))
    for y in (292, 507, 727):
        arrow(d, (400, 355), (630, y), rgb(BLUE))
    for y in (292, 507, 727):
        arrow(d, (1030, y), (1190, y), rgb(BLUE))
    d.text((75, 910), "Anteproyecto: el esquema de neutro/tierra del inversor se valida con electricista matriculado.", font=font(21), fill=rgb(GRAY))
    im.save(VIS / "04_arquitectura_funcional.png")

    # Mass and package
    im = Image.new("RGB", (1600, 940), rgb(WHITE))
    d = ImageDraw.Draw(im)
    d.text((70, 52), "Presupuesto de masa · caso de diseño", font=font(45, True), fill=rgb(NAVY))
    d.text((70, 112), "Tara proyectada 1.135 kg + carga útil 500 kg = 1.635 kg operativos", font=font(25), fill=rgb(GRAY))
    masses = [("Rolling chassis", 550, BLUE), ("Batería", 135, AMBER), ("Estructura", 170, CYAN), ("Arte", 85, "9275A8"), ("Audio/DJ", 160, "D36B4A"), ("Luces/seg.", 35, GRAY), ("Carga útil", 500, "6B9E78")]
    x, y, total_w = 80, 270, 1440
    total = sum(v for _, v, _ in masses)
    for label, val, color in masses:
        w = total_w * val / total
        d.rectangle((x, y, x + w, y + 145), fill=rgb(color))
        if w > 90:
            d.text((x + w / 2, y + 50), f"{val} kg", font=font(25, True), fill=rgb(WHITE), anchor="mm")
        x += w
    y0 = 500
    for i, (label, val, color) in enumerate(masses):
        col = i % 4
        row = i // 4
        lx = 90 + col * 375
        ly = y0 + row * 105
        d.rounded_rectangle((lx, ly, lx + 38, ly + 38), radius=6, fill=rgb(color))
        d.text((lx + 55, ly - 2), label, font=font(23, True), fill=rgb(INK))
        d.text((lx + 55, ly + 34), f"{val} kg", font=font(21), fill=rgb(GRAY))
    d.rounded_rectangle((80, 745, 1520, 875), radius=22, fill=rgb(CREAM), outline=rgb(LINE), width=3)
    d.text((110, 775), "Gate decisivo", font=font(28, True), fill=rgb(NAVY))
    draw_wrapped(d, (340, 772), "Si el donor supera 550 kg o no certifica GVWR ≥1,7 t, reducir plazas/arte o cambiar de plataforma antes de comprar.", font(24), rgb(INK), 74)
    im.save(VIS / "05_balance_masa.png")

    # Energy chart
    im = Image.new("RGB", (1600, 1000), rgb(CREAM))
    d = ImageDraw.Draw(im)
    d.text((70, 50), "Energía para misión de 5 km", font=font(45, True), fill=rgb(NAVY))
    d.text((70, 110), "Masa 1.600 kg · 5 km/h · η 75% · auxiliares 1,45 kW promedio", font=font(25), fill=rgb(GRAY))
    scenarios = [("Firme", 2.61), ("Húmedo", 3.78), ("Húmedo +10%", 6.68), ("Húmedo +15%", 8.14), ("Barro +10%", 8.72)]
    usable = 15 * 0.8 * 0.85
    x0, y0, w, h = 180, 230, 1320, 620
    d.line((x0, y0 + h, x0 + w, y0 + h), fill=rgb(NAVY), width=4)
    for tick in range(0, 13, 2):
        yy = y0 + h - h * tick / 12
        d.line((x0, yy, x0 + w, yy), fill=rgb(LINE), width=2)
        d.text((x0 - 25, yy), str(tick), font=font(20), fill=rgb(GRAY), anchor="rm")
    bw = 150
    gap = (w - len(scenarios) * bw) / (len(scenarios) + 1)
    for i, (name, value) in enumerate(scenarios):
        x = x0 + gap + i * (bw + gap)
        top = y0 + h - h * value / 12
        d.rounded_rectangle((x, top, x + bw, y0 + h), radius=12, fill=rgb(CYAN if i < 4 else AMBER))
        d.text((x + bw / 2, top - 20), f"{value:.2f}", font=font(23, True), fill=rgb(INK), anchor="ms")
        draw_wrapped(d, (x + bw / 2, y0 + h + 28), name, font(19, True), rgb(INK), 12, 4, "ma")
    yy = y0 + h - h * usable / 12
    d.line((x0, yy, x0 + w, yy), fill=rgb("D36B4A"), width=7)
    d.text((x0 + w - 5, yy - 14), f"usable conservadora = {usable:.1f} kWh", font=font(23, True), fill=rgb("A84432"), anchor="rs")
    d.text((70, 930), "Conclusión: 12,8 kWh es adecuada en terreno moderado; 15 kWh es la base para cubrir barro + pendiente + audio.", font=font(23), fill=rgb(GRAY))
    im.save(VIS / "06_energia_mision.png")

    # Concept decision
    im = Image.new("RGB", (1600, 850), rgb(WHITE))
    d = ImageDraw.Draw(im)
    d.text((70, 50), "Selección de concepto", font=font(45, True), fill=rgb(NAVY))
    d.text((70, 110), "Puntaje ponderado / 5 · el DJ y la mutación radical son criterios principales", font=font(25), fill=rgb(GRAY))
    values = [("Tatú Sonoro", 4.55, AMBER), ("Chakana Resonante", 4.53, CYAN), ("Coatí Nocturno", 4.15, "9275A8")]
    x0, maxw = 390, 1050
    for i, (name, value, color) in enumerate(values):
        y = 260 + i * 165
        d.text((80, y + 45), name, font=font(29, True), fill=rgb(INK))
        d.rounded_rectangle((x0, y, x0 + maxw, y + 90), radius=20, fill=rgb(CREAM))
        d.rounded_rectangle((x0, y, x0 + maxw * value / 5, y + 90), radius=20, fill=rgb(color))
        d.text((x0 + maxw * value / 5 - 20, y + 45), f"{value:.2f}", font=font(29, True), fill=rgb(WHITE), anchor="rm")
    d.text((70, 760), "Decisión: Tatú; construir su caparazón con lógica modular y flat-pack tomada de Chakana.", font=font(27, True), fill=rgb(NAVY))
    im.save(VIS / "07_matriz_conceptos.png")

    # Package diagram
    im = Image.new("RGB", (1600, 1000), rgb(CREAM))
    d = ImageDraw.Draw(im)
    d.text((70, 48), "Paquete funcional · Tatú Sonoro", font=font(45, True), fill=rgb(NAVY))
    d.text((70, 108), "El dibujo muestra zonas y envolvente; no es plano de fabricación.", font=font(25), fill=rgb(GRAY))
    # side silhouette
    d.rounded_rectangle((160, 300, 1435, 680), radius=180, fill=rgb(PALE), outline=rgb(BLUE), width=7)
    d.polygon([(160, 490), (65, 570), (160, 620)], fill=rgb(PALE), outline=rgb(BLUE))
    d.polygon([(1430, 455), (1540, 585), (1420, 610)], fill=rgb(PALE), outline=rgb(BLUE))
    for cx in (360, 1225):
        d.ellipse((cx - 105, 600, cx + 105, 810), fill=rgb(INK))
        d.ellipse((cx - 52, 653, cx + 52, 757), fill=rgb(GRAY))
    zones = [
        ((215, 370, 475, 575), "PILOTO", "visión directa\nen cabeza"),
        ((520, 350, 845, 610), "DJ", "semi-sentado\nsub debajo"),
        ((875, 365, 1325, 590), "3 PASAJEROS", "asientos +\ndos egresos"),
    ]
    for bounds, title, detail in zones:
        d.rounded_rectangle(bounds, radius=24, fill=rgb(WHITE), outline=rgb(LINE), width=3)
        x1, y1, x2, y2 = bounds
        d.text(((x1 + x2) / 2, y1 + 52), title, font=font(28, True), fill=rgb(NAVY), anchor="mm")
        d.multiline_text(((x1 + x2) / 2, y1 + 125), detail, font=font(22), fill=rgb(GRAY), anchor="mm", align="center", spacing=8)
    # dimensions
    d.line((160, 865, 1435, 865), fill=rgb(NAVY), width=4)
    arrow(d, (785, 865), (160, 865), rgb(NAVY), 4); arrow(d, (810, 865), (1435, 865), rgb(NAVY), 4)
    d.text((800, 840), "3,85–3,95 m", font=font(25, True), fill=rgb(NAVY), anchor="ms")
    d.line((1490, 300, 1490, 810), fill=rgb(NAVY), width=4)
    arrow(d, (1490, 540), (1490, 300), rgb(NAVY), 4); arrow(d, (1490, 565), (1490, 810), rgb(NAVY), 4)
    d.text((1515, 555), "≤2,4 m", font=font(24, True), fill=rgb(NAVY), anchor="lm")
    im.save(VIS / "08_paquete_funcional.png")


def set_cell_shading(cell, fill):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = tc_pr.find(qn("w:shd"))
    if shd is None:
        shd = OxmlElement("w:shd")
        tc_pr.append(shd)
    shd.set(qn("w:fill"), fill)


def set_cell_margins(cell, top=70, start=90, bottom=70, end=90):
    tc = cell._tc
    tc_pr = tc.get_or_add_tcPr()
    tc_mar = tc_pr.first_child_found_in("w:tcMar")
    if tc_mar is None:
        tc_mar = OxmlElement("w:tcMar")
        tc_pr.append(tc_mar)
    for m, value in (("top", top), ("start", start), ("bottom", bottom), ("end", end)):
        node = tc_mar.find(qn(f"w:{m}"))
        if node is None:
            node = OxmlElement(f"w:{m}")
            tc_mar.append(node)
        node.set(qn("w:w"), str(value))
        node.set(qn("w:type"), "dxa")


def set_table_fixed(table, widths):
    table.autofit = False
    table.alignment = WD_TABLE_ALIGNMENT.LEFT
    tbl_pr = table._tbl.tblPr
    layout = tbl_pr.find(qn("w:tblLayout"))
    if layout is None:
        layout = OxmlElement("w:tblLayout")
        tbl_pr.append(layout)
    layout.set(qn("w:type"), "fixed")
    indent = tbl_pr.find(qn("w:tblInd"))
    if indent is None:
        indent = OxmlElement("w:tblInd")
        tbl_pr.append(indent)
    indent.set(qn("w:w"), "120")
    indent.set(qn("w:type"), "dxa")
    grid = table._tbl.tblGrid
    for child in list(grid):
        grid.remove(child)
    for width in widths:
        col = OxmlElement("w:gridCol")
        col.set(qn("w:w"), str(int(width * 1440)))
        grid.append(col)
    for i, width in enumerate(widths):
        for cell in table.columns[i].cells:
            cell.width = Inches(width)
            tc_pr = cell._tc.get_or_add_tcPr()
            tc_w = tc_pr.find(qn("w:tcW"))
            if tc_w is None:
                tc_w = OxmlElement("w:tcW")
                tc_pr.append(tc_w)
            tc_w.set(qn("w:w"), str(int(width * 1440)))
            tc_w.set(qn("w:type"), "dxa")
            set_cell_margins(cell)


def repeat_header(row):
    tr_pr = row._tr.get_or_add_trPr()
    hdr = OxmlElement("w:tblHeader")
    hdr.set(qn("w:val"), "true")
    tr_pr.append(hdr)


def cant_split(row):
    tr_pr = row._tr.get_or_add_trPr()
    node = OxmlElement("w:cantSplit")
    tr_pr.append(node)


def add_page_number(paragraph):
    run = paragraph.add_run()
    begin = OxmlElement("w:fldChar"); begin.set(qn("w:fldCharType"), "begin")
    instr = OxmlElement("w:instrText"); instr.set(qn("xml:space"), "preserve"); instr.text = " PAGE "
    end = OxmlElement("w:fldChar"); end.set(qn("w:fldCharType"), "end")
    run._r.extend([begin, instr, end])


def hyperlink(paragraph, text, url):
    part = paragraph.part
    rel_id = part.relate_to(url, "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink", is_external=True)
    link = OxmlElement("w:hyperlink")
    link.set(qn("r:id"), rel_id)
    run = OxmlElement("w:r")
    r_pr = OxmlElement("w:rPr")
    color = OxmlElement("w:color"); color.set(qn("w:val"), BLUE)
    underline = OxmlElement("w:u"); underline.set(qn("w:val"), "single")
    r_pr.extend([color, underline])
    run.append(r_pr)
    text_node = OxmlElement("w:t"); text_node.text = text
    run.append(text_node); link.append(run); paragraph._p.append(link)


def set_run_font(run, name="Arial", size=10, bold=False, color=INK, italic=False):
    run.font.name = name
    run._element.rPr.rFonts.set(qn("w:eastAsia"), name)
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.italic = italic
    run.font.color.rgb = RGBColor.from_string(color)


def setup_styles(doc):
    styles = doc.styles
    normal = styles["Normal"]
    normal.font.name = "Arial"; normal._element.rPr.rFonts.set(qn("w:eastAsia"), "Arial")
    normal.font.size = Pt(10); normal.font.color.rgb = RGBColor.from_string(INK)
    normal.paragraph_format.space_after = Pt(8)
    normal.paragraph_format.line_spacing = 1.25
    normal.paragraph_format.widow_control = True

    for name, size, color, before, after in [
        ("Title", 34, NAVY, 0, 12), ("Subtitle", 16, GRAY, 0, 16),
        ("Heading 1", 22, NAVY, 18, 9), ("Heading 2", 15, BLUE, 14, 6),
        ("Heading 3", 11, NAVY, 10, 4),
    ]:
        st = styles[name]
        st.font.name = "Arial"; st._element.rPr.rFonts.set(qn("w:eastAsia"), "Arial")
        st.font.size = Pt(size); st.font.bold = True; st.font.color.rgb = RGBColor.from_string(color)
        st.paragraph_format.space_before = Pt(before); st.paragraph_format.space_after = Pt(after)
        st.paragraph_format.keep_with_next = True

    if "Eyebrow" not in styles:
        st = styles.add_style("Eyebrow", WD_STYLE_TYPE.PARAGRAPH)
        st.font.name = "Arial"; st._element.rPr.rFonts.set(qn("w:eastAsia"), "Arial")
        st.font.size = Pt(9); st.font.bold = True; st.font.color.rgb = RGBColor.from_string(AMBER)
        st.paragraph_format.space_after = Pt(8)
    if "Deck" not in styles:
        st = styles.add_style("Deck", WD_STYLE_TYPE.PARAGRAPH)
        st.font.name = "Arial"; st._element.rPr.rFonts.set(qn("w:eastAsia"), "Arial")
        st.font.size = Pt(13); st.font.color.rgb = RGBColor.from_string(GRAY)
        st.paragraph_format.space_after = Pt(14); st.paragraph_format.line_spacing = 1.2
    if "CaptionCustom" not in styles:
        st = styles.add_style("CaptionCustom", WD_STYLE_TYPE.PARAGRAPH)
        st.font.name = "Arial"; st._element.rPr.rFonts.set(qn("w:eastAsia"), "Arial")
        st.font.size = Pt(8.5); st.font.italic = True; st.font.color.rgb = RGBColor.from_string(GRAY)
        st.paragraph_format.space_before = Pt(4); st.paragraph_format.space_after = Pt(9)
        st.paragraph_format.keep_with_next = False


def add_p(doc, text="", style=None, bold_lead=None, keep=False):
    p = doc.add_paragraph(style=style)
    if bold_lead and text.startswith(bold_lead):
        r = p.add_run(bold_lead); set_run_font(r, bold=True)
        r2 = p.add_run(text[len(bold_lead):]); set_run_font(r2)
    else:
        r = p.add_run(text); set_run_font(r)
    p.paragraph_format.keep_together = keep
    return p


def add_bullets(doc, items):
    for item in items:
        p = doc.add_paragraph(style="List Bullet")
        p.paragraph_format.left_indent = Inches(0.375)
        p.paragraph_format.first_line_indent = Inches(-0.194)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing = 1.15
        r = p.add_run(item); set_run_font(r)


def add_numbers(doc, items):
    numbering = doc.part.numbering_part.element
    abstract_ids = [int(x.get(qn("w:abstractNumId"))) for x in numbering.findall(qn("w:abstractNum"))]
    num_ids = [int(x.get(qn("w:numId"))) for x in numbering.findall(qn("w:num"))]
    abstract_id = max(abstract_ids or [0]) + 1
    num_id = max(num_ids or [0]) + 1
    abstract = OxmlElement("w:abstractNum"); abstract.set(qn("w:abstractNumId"), str(abstract_id))
    multi = OxmlElement("w:multiLevelType"); multi.set(qn("w:val"), "singleLevel"); abstract.append(multi)
    lvl = OxmlElement("w:lvl"); lvl.set(qn("w:ilvl"), "0")
    start = OxmlElement("w:start"); start.set(qn("w:val"), "1"); lvl.append(start)
    fmt = OxmlElement("w:numFmt"); fmt.set(qn("w:val"), "decimal"); lvl.append(fmt)
    txt = OxmlElement("w:lvlText"); txt.set(qn("w:val"), "%1."); lvl.append(txt)
    suff = OxmlElement("w:suff"); suff.set(qn("w:val"), "space"); lvl.append(suff)
    p_pr = OxmlElement("w:pPr")
    tabs = OxmlElement("w:tabs"); tab = OxmlElement("w:tab"); tab.set(qn("w:val"), "num"); tab.set(qn("w:pos"), "540"); tabs.append(tab); p_pr.append(tabs)
    ind = OxmlElement("w:ind"); ind.set(qn("w:left"), "540"); ind.set(qn("w:hanging"), "280"); p_pr.append(ind)
    lvl.append(p_pr); abstract.append(lvl); numbering.append(abstract)
    num = OxmlElement("w:num"); num.set(qn("w:numId"), str(num_id))
    abstract_ref = OxmlElement("w:abstractNumId"); abstract_ref.set(qn("w:val"), str(abstract_id)); num.append(abstract_ref); numbering.append(num)
    for item in items:
        p = doc.add_paragraph()
        p_pr = p._p.get_or_add_pPr()
        num_pr = OxmlElement("w:numPr")
        ilvl = OxmlElement("w:ilvl"); ilvl.set(qn("w:val"), "0")
        num_ref = OxmlElement("w:numId"); num_ref.set(qn("w:val"), str(num_id))
        num_pr.extend([ilvl, num_ref]); p_pr.append(num_pr)
        p.paragraph_format.space_after = Pt(4)
        r = p.add_run(item); set_run_font(r)


def add_callout(doc, title, body, fill=PALE, accent=CYAN):
    table = doc.add_table(rows=1, cols=2)
    set_table_fixed(table, [0.12, 6.15])
    table.cell(0, 0).text = ""
    set_cell_shading(table.cell(0, 0), accent)
    set_cell_shading(table.cell(0, 1), fill)
    p = table.cell(0, 1).paragraphs[0]
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run(title + "\n"); set_run_font(r, size=10.5, bold=True, color=NAVY)
    r = p.add_run(body); set_run_font(r, size=9.5, color=INK)
    table.cell(0, 1).vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
    repeat_header(table.rows[0])
    for row in table.rows: cant_split(row)
    doc.add_paragraph().paragraph_format.space_after = Pt(1)


def add_table(doc, headers, rows, widths, font_size=8.2, header_fill=BLUE, highlight_rows=None):
    table = doc.add_table(rows=1, cols=len(headers))
    set_table_fixed(table, widths)
    table.alignment = WD_TABLE_ALIGNMENT.LEFT
    hdr = table.rows[0]
    repeat_header(hdr); cant_split(hdr)
    for i, value in enumerate(headers):
        set_cell_shading(hdr.cells[i], header_fill)
        hdr.cells[i].vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
        p = hdr.cells[i].paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(str(value)); set_run_font(r, size=font_size, bold=True, color=WHITE)
    for idx, row in enumerate(rows):
        cells = table.add_row().cells
        cant_split(table.rows[-1])
        if idx % 2 == 1:
            for cell in cells: set_cell_shading(cell, "F7F9FA")
        if highlight_rows and idx in highlight_rows:
            for cell in cells: set_cell_shading(cell, highlight_rows[idx])
        for i, value in enumerate(row):
            cells[i].vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.TOP
            p = cells[i].paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(str(value)); set_run_font(r, size=font_size, color=INK)
    doc.add_paragraph().paragraph_format.space_after = Pt(1)
    return table


def add_picture(doc, path, caption, alt, width=6.5):
    p = doc.add_paragraph()
    p.paragraph_format.keep_together = True
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run()
    shape = run.add_picture(str(path), width=Inches(width))
    shape._inline.docPr.set("descr", alt)
    shape._inline.docPr.set("title", caption)
    cp = doc.add_paragraph(caption, style="CaptionCustom")
    cp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    return shape


def section(doc, number, title, deck=None, page_break=False):
    if page_break:
        doc.add_page_break()
    doc.add_heading(f"{number}. {title}", level=1)
    if deck:
        p = doc.add_paragraph(deck, style="Deck")
        p.paragraph_format.keep_with_next = True


def source_p(doc, number, title, url, note):
    p = doc.add_paragraph()
    r = p.add_run(f"{number}. {title}. "); set_run_font(r, bold=True)
    hyperlink(p, "Abrir fuente", url)
    r = p.add_run(f" — {note}"); set_run_font(r, size=9, color=GRAY)
    p.paragraph_format.space_after = Pt(6)


def build_doc():
    doc = Document()
    sec = doc.sections[0]
    sec.page_width = Inches(8.5); sec.page_height = Inches(11)
    sec.top_margin = Inches(0.8); sec.bottom_margin = Inches(0.75)
    sec.left_margin = Inches(1.0); sec.right_margin = Inches(1.0)
    sec.header_distance = Inches(0.35); sec.footer_distance = Inches(0.35)
    sec.different_first_page_header_footer = True
    setup_styles(doc)

    header = sec.header.paragraphs[0]
    header.text = "CHAKANA ART CAR  /  ANTEPROYECTO DE PREFACTIBILIDAD"
    header.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    for run in header.runs: set_run_font(run, size=7.5, bold=True, color=GRAY)
    footer = sec.footer.paragraphs[0]
    footer.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = footer.add_run("Documento de decisión · no apto para fabricar sin ingeniería de detalle  •  "); set_run_font(r, size=7.5, color=GRAY)
    add_page_number(footer)
    first_footer = sec.first_page_footer.paragraphs[0]
    first_footer.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = first_footer.add_run("Versión 0.2 · 13 de agosto de 2026 · Argentina"); set_run_font(r, size=8, color=GRAY)

    # Cover — editorial proposal preset with Arial portability override.
    p = doc.add_paragraph("IDEA + ANTEPROYECTO + PRESUPUESTO", style="Eyebrow")
    p.paragraph_format.space_before = Pt(4)
    p = doc.add_paragraph("Tatú Sonoro", style="Title")
    p.paragraph_format.space_after = Pt(6)
    p = doc.add_paragraph("Un organismo musical móvil para barro, pasto y noche", style="Subtitle")
    p.paragraph_format.space_after = Pt(10)
    p = doc.add_paragraph("Primer Art Car / vehículo mutante · Argentina · fase de prefactibilidad", style="Deck")
    add_picture(doc, VIS / "01_tatu_sonoro.png", "Dirección visual recomendada: la criatura domina; el chasis desaparece.", "Render conceptual de un tatú gigante metálico con DJ central, parlantes integrados y ruedas parcialmente ocultas sobre terreno húmedo.", 6.45)
    add_callout(doc, "Decisión ejecutiva", "Avanzar a RFQ con Tatú Sonoro sobre rolling chassis 4WD convencional, no autónomo. No comprar todavía ninguno de los tres productos enviados: hoy ninguno prueba masa, frenado y potencia suficientes.", GREEN, AMBER)

    doc.add_page_break()
    doc.add_heading("Control del documento", level=1)
    add_table(doc, ["Campo", "Definición"], [
        ["Estado", "Prefactibilidad / anteproyecto. Sirve para decidir, pedir ofertas y planificar ensayos."],
        ["Configuración base", "Piloto + DJ + 3 pasajeros; 500 kg útiles; 5 km; 5 km/h normal; 10 km/h máximo."],
        ["Caso de cálculo", "1.600 kg redondeados; operación proyectada 1.635 kg; GVWR requerido ≥1.700 kg."],
        ["Concepto", "Tatú Sonoro; Chakana Resonante como alternativa casi equivalente; Coatí Nocturno como reserva."],
        ["Precisión de costo", "Clase 4 / prefactibilidad: rango orientativo, objetivo −20% / +30% hasta recibir cotizaciones."],
        ["Límites", "No es plano constructivo, homologación, cálculo firmado ni autorización para vía pública/evento."],
    ], [1.55, 4.75], 9)
    add_callout(doc, "Supuesto que ordena todo", "La carga útil de 500 kg se interpreta como personas y pertenencias, además de la carrocería, audio y baterías. Si la intención era que los 500 kg incluyeran también esos sistemas, el proyecto puede bajar una categoría de chasis y costo.", CREAM, AMBER)

    doc.add_heading("Contenido", level=2)
    add_table(doc, ["Bloque", "Qué resuelve"], [
        ["1–4", "Decisión, requisitos, criterios de evento y conceptos visuales."],
        ["5–10", "Arquitectura, paquete, mecánica, energía, audio/DJ y experiencia."],
        ["11–15", "Seguridad, productos China, importación, presupuesto y planificación."],
        ["16–18", "Pruebas, operación, riesgos y decisiones abiertas."],
        ["Anexos A–E", "RFQ bilingüe, FAT/SAT, fórmulas, fuentes y prompts visuales."],
    ], [1.1, 5.2], 9)

    section(doc, "1", "Resumen ejecutivo", "La prefactibilidad es positiva, pero sólo para un donor más serio que los componentes originalmente considerados.", page_break=True)
    add_callout(doc, "Recomendación", "Construir el Tatú Sonoro como envolvente modular alrededor de un rolling chassis 4WD de baja velocidad, con dirección mecánica asistida, frenos hidráulicos en las cuatro ruedas, freno de estacionamiento mecánico, 12 kW continuos, 18 kW pico y batería LFP nominal de 15 kWh.", GREEN, AMBER)
    add_table(doc, ["Variable", "Base de anteproyecto", "Criterio de aceptación"], [
        ["Misión", "5 km por carga", "Final ≥20% SOC con audio y luces activos"],
        ["Terreno", "Pasto, rastrojo, barro y pendientes", "10% continua; 15% corta; lateral operativa ≤8°"],
        ["Velocidad", "5 km/h normal; 8 km/h traslado", "Limitador duro 10 km/h"],
        ["Capacidad", "Piloto + DJ + 3 pasajeros", "Todos contenidos; carga total ≤500 kg"],
        ["Masa", "Tara 1.135 kg; operativa 1.635 kg", "GVWR ≥1.700 kg y pesaje por rueda"],
        ["Audio", "2×12\" + sub 15\"; 1,8 kW RMS", "≤1,0 kW promedio móvil; DSP bloqueado"],
        ["CAPEX", "USD 65.900 netos / USD 76.500 caja", "Techos: 68.000 neto / 80.000 caja"],
    ], [1.25, 2.45, 2.55], 8.5, highlight_rows={6: GREEN})
    add_p(doc, "La decisión no depende de encontrar “el chasis más barato”; depende de comprobar una cadena completa: masa real → carga estructural → tracción → frenado → energía → estabilidad → evacuación → políticas del evento.")
    doc.add_heading("Por qué no convienen las orugas para el primer proyecto", level=2)
    add_bullets(doc, [
        "Añaden masa, transporte, consumo y mantenimiento, justo donde el proyecto ya incorpora audio, inversor y piel escultórica.",
        "Los comparables públicos no demuestran freno de servicio y estacionamiento aptos para pasajeros.",
        "La ventaja en barro no compensa la mayor complejidad de integración y rescate para una misión de sólo 5 km.",
    ])

    section(doc, "2", "Necesidad, alcance y criterios de diseño", "El vehículo debe ser simultáneamente transporte lento, escenario musical, escultura nocturna y sistema seguro.")
    doc.add_heading("Requisitos confirmados", level=2)
    add_bullets(doc, [
        "Operar en predios privados sobre pasto, rastrojo, barro y desniveles; no se diseña para circular por vía pública.",
        "Mover aproximadamente 500 kg de carga útil durante hasta 5 km por carga.",
        "Circular entre 5 y 10 km/h; con público cercano, barro o irregularidades, el modo normal es 5 km/h.",
        "Llevar sistema de sonido y un puesto real de DJ, funcional durante la marcha y estacionado.",
        "Parecerse lo menos posible a un vehículo: sin capot, parabrisas, parrilla, guardabarros, cabina o jaula visualmente reconocibles.",
        "Ser pequeño y realizable como primer proyecto, con módulos reparables y repuestos comprables.",
    ])
    doc.add_heading("Interpretación técnica", level=2)
    add_table(doc, ["Necesidad", "Traducción verificable", "Trade-off"], [
        ["No vehicular", "La silueta, la iluminación y la anatomía dominan a 20 m; ruedas y piloto quedan subordinados.", "No ocultar recorrido de rueda, ventilación, visión ni rescate."],
        ["DJ móvil", "Semi-sentado, cinturón, pies retenidos, consola fija y mute al alcance.", "De pie sólo estacionado."],
        ["Barro", "4WD, neumático de baja presión, despeje ≥220 mm del arte y 80 mm extra de barro.", "No usar faldones textiles."],
        ["Autonomía", "15 kWh nominal y deslastre de audio a 25% SOC.", "El caso extremo consume casi toda la reserva útil."],
        ["Primer proyecto", "Dirección mecánica; componentes industriales; arte desmontable.", "Se descartan steer-by-wire y autonomía."],
    ], [1.2, 3.2, 1.9], 8.4)
    doc.add_heading("Fuera de alcance en esta fase", level=2)
    add_bullets(doc, [
        "Homologación vial, matriculación o conducción en calles abiertas.",
        "Ingeniería de detalle de soldaduras, FEA, planos de taller o validación normativa final.",
        "PA de categoría DMZ/club, subwoofers dobles de 18 pulgadas o plataforma elevadora para silla de ruedas.",
        "Conducción remota, autónoma o steer-by-wire sin respaldo mecánico.",
    ])

    section(doc, "3", "Criterios de eventos y marco argentino", "Las licencias internas de evento no convierten al vehículo en legal para vía pública.")
    add_table(doc, ["Ámbito", "Criterios relevantes", "Implicación de diseño"], [
        ["Burning Man", "Mutación radical; 5 mph; iluminación frontal/perimetral; acceso y barandas; política sonora por horario/zona.", "La base no puede seguir reconocible. Limitar a 8 km/h para ese evento y orientar PA."],
        ["AfrikaBurn", "10 km/h; registro e inspección; reglas de sonido y Sound Officer; 95 dB en pista según política publicada.", "Preset de 95 dB y responsable nombrado."],
        ["Nowhere", "10 km/h; frenos/handbrake; luces; asientos/barandas; spotter; declarar sonido.", "Diseñar tripulación con spotters y Artomobile Pass."],
        ["Argentina", "LCM/LCA aplican al marco de vía pública según categoría; importación depende de NCM e intervenciones.", "Operar en predio privado y transportar en trailer; consultar despachante/INTI/asegurador."],
    ], [1.25, 2.7, 2.35], 8.2)
    add_callout(doc, "Regla operativa común", "El límite técnico de 10 km/h no es la velocidad objetivo. Con público, noche, barro o puntos ciegos se circula a 5 km/h con spotters. Las reglas del año y del evento específico se verifican antes de aplicar.", CREAM, AMBER)
    doc.add_heading("Sonido", level=2)
    add_p(doc, "El diseño evita una corona omnidireccional. Los tops quedan detrás de escamas perforadas y pueden orientarse hacia abajo/lateralmente. El DSP guarda presets bloqueados: tránsito/mute, performance local y evento. Un sonómetro registra LAeq,15 min; el operador de sonido tiene autoridad para bajar o apagar.")
    add_table(doc, ["Modo", "Nivel/energía de diseño", "Condición"], [
        ["Movimiento", "≤92 dBA a 5 m; ≤1,0 kW promedio de audio", "Bocina/radio audibles; mute piloto"],
        ["Estacionado", "Hasta el límite autorizado; referencia de salud 100 dB LAeq,15 min", "Zona, horario y orientación aprobados"],
        ["Acceso/emergencia", "Mute automático o manual inmediato", "Órdenes de tripulación prevalecen"],
    ], [1.25, 2.35, 2.7], 8.5)

    section(doc, "4", "Direcciones creativas", "Tres objetos que revelan tarde que son vehículos. Los renders son intención visual, no promesa de geometría construible.")
    doc.add_heading("4.1 Tatú Sonoro — recomendado", level=2)
    add_picture(doc, VIS / "01_tatu_sonoro.png", "Tatú Sonoro: DJ en la madriguera central, piloto en la cabeza y audio dentro de las escamas.", "Concepto visual del Tatú Sonoro en terreno con barro, con caparazón metálico continuo, DJ central, pasajeros protegidos y ruedas discretas.", 6.5)
    add_table(doc, ["Aspecto", "Resolución"], [
        ["Lectura", "Una criatura baja, continua y segmentada; no una plataforma con decoración."],
        ["DJ", "Madriguera central bajo el punto alto; consola 900–1.000 × 450–550 mm."],
        ["Piloto", "Oculto en la cabeza detrás de malla/policarbonato oscuro; visión directa obligatoria."],
        ["Audio", "Tops en hombros y sub central bajo; aperturas perforadas y orientadas."],
        ["Mantenimiento", "Cada banda es un módulo numerado; registros para ruedas, batería, frenos y rescate."],
    ], [1.35, 4.95], 8.8)
    doc.add_heading("4.2 Chakana Resonante — alternativa liviana", level=2)
    add_picture(doc, VIS / "02_chakana_resonante.png", "Chakana Resonante: pabellón escalonado, DJ central y ruedas casi ausentes de la lectura.", "Concepto visual de una escultura móvil geométrica escalonada con DJ central y pasajeros en nichos, sobre pasto húmedo.", 6.5)
    add_p(doc, "Es prácticamente un empate técnico: distribuye muy bien el audio, se fabrica en paneles planos y viaja en flat-pack. Requiere co-diseño remunerado con una persona/artista andino para evitar uso superficial o impropio de símbolos.")
    doc.add_heading("4.3 Coatí Nocturno — reserva estética", level=2)
    add_picture(doc, VIS / "03_coati_nocturno.png", "Coatí Nocturno: criatura completa; la cola funciona como canopy y no como torre de sonido.", "Concepto visual de un coatí metálico móvil con cola arqueada, DJ integrado, pasajeros y ruedas tratadas como patas.", 6.5)
    add_p(doc, "Tiene gran carácter, pero la cola agrega superficie al viento, masa alta y tiempo de montaje. Es la opción con mayor riesgo de volver a leerse como buggy caricaturizado.")
    add_picture(doc, VIS / "07_matriz_conceptos.png", "Matriz actualizada después de incorporar DJ y mutación radical.", "Gráfico de barras: Tatú 4,55, Chakana 4,53 y Coatí 4,15 sobre cinco.", 6.5)

    section(doc, "5", "Concepto seleccionado y lenguaje formal", "Tatú por fuera; lógica de módulos planos tipo Chakana por dentro.", page_break=False)
    add_picture(doc, VIS / "08_paquete_funcional.png", "Distribución funcional preliminar del Tatú Sonoro.", "Diagrama lateral con cabeza para piloto, centro para DJ, zona posterior para tres pasajeros y dimensiones generales.", 6.5)
    add_table(doc, ["Parámetro", "Objetivo"], [
        ["Envolvente", "3,85–3,95 m largo × 1,90–1,95 m ancho × ≤2,40 m alto"],
        ["Piso", "450–550 mm sobre suelo"],
        ["Trocha / batalla", "Trocha ≥1,50 m; batalla objetivo 2,1–2,4 m"],
        ["Despeje", "Chasis ≥200 mm; arte ≥220 mm; 80 mm extra respecto a envolvente dinámica de rueda"],
        ["Acceso", "Principal derecho ≥900 mm entre ejes; egreso secundario izquierdo/trasero ≥750 mm"],
        ["Barandas", "1.000–1.100 mm integradas al caparazón; puertas de cierre positivo"],
        ["CG", "Cargado ≤0,75 m; diferencia izquierda/derecha ≤10%"],
    ], [1.6, 4.7], 8.8)
    doc.add_heading("Cómo ocultar sin crear peligros", level=2)
    add_bullets(doc, [
        "Neumáticos y suspensión en negro mate, sin iluminación artística.",
        "El tercio superior de cada rueda queda detrás de una escama rígida; la parte inferior permanece abierta para barro y escape.",
        "A máxima dirección y compresión queda un mínimo de 75 mm, más 80 mm de reserva por barro/rastrojo en la zona crítica.",
        "La cabeza y los ojos dominan la frontal; cámaras suplementan, nunca reemplazan, visión directa.",
        "E-stops, puntos de remolque y paneles de inspección son discretos pero identificables por la tripulación.",
    ])
    add_callout(doc, "Prueba de mutación", "Fotografiar el prototipo de frente, perfil y tres cuartos a 20 m, de día y de noche. Si una persona neutral lo llama “UTV”, “golf cart” o “buggy” antes que “tatú/escultura”, el arte todavía no está terminado.", PALE, CYAN)

    section(doc, "6", "Arquitectura del sistema", "Separar funciones vitales, movimiento y espectáculo reduce el número de fallas comunes.")
    add_picture(doc, VIS / "04_arquitectura_funcional.png", "Arquitectura eléctrica y funcional preliminar.", "Diagrama de batería LFP que alimenta ramas separadas de tracción, seguridad y DJ/audio.", 6.5)
    doc.add_heading("Estados operativos", level=2)
    add_table(doc, ["Estado", "Tracción", "DJ/audio", "Condición de transición"], [
        ["OFF / servicio", "Aislada", "Aislado", "Seccionadores abiertos; calzas"],
        ["Acceso", "Inhibida", "Mute", "Freno de estacionamiento + puertas habilitadas"],
        ["Movimiento", "5 km/h normal", "Preset móvil", "Todos contenidos; puertas cerradas; spotters"],
        ["Performance estacionaria", "Torque cero", "Preset autorizado", "Neutro, parking, calzas, zona definida"],
        ["Emergencia", "Contactor tracción abierto", "Mute/corte independiente", "Luces y radio continúan"],
    ], [1.25, 1.35, 1.45, 2.25], 8.2)
    doc.add_heading("Interlocks mínimos", level=2)
    add_bullets(doc, [
        "Cualquier puerta abierta inhibe tracción; la apertura interior nunca requiere llave.",
        "E-stop de piloto y dos exteriores corta torque en ≤0,5 s, sin apagar luz de seguridad.",
        "Pérdida de CAN, pedal implausible o retorno de acelerador fallido ordena torque cero.",
        "Reversa sólo si la velocidad es <1 km/h; aviso acústico/visual independiente del PA.",
        "SOC ≤25%, subtensión o sobretemperatura deslastra audio antes de afectar conducción.",
    ])

    section(doc, "7", "Masa, carga y estabilidad", "La masa real del donor es el primer dato de compra, no un detalle que pueda corregirse al final.")
    add_picture(doc, VIS / "05_balance_masa.png", "Presupuesto de masa y carga útil.", "Barra apilada con rolling chassis 550 kg, sistemas del vehículo 585 kg y carga útil 500 kg.", 6.5)
    add_table(doc, ["Subsistema", "kg", "Altura CG estimada"], [
        ["Rolling chassis", "550", "0,42 m"], ["Batería 15 kWh", "135", "0,25 m"],
        ["Piso, estructura y asientos", "170", "0,65 m"], ["Caparazón", "85", "1,20 m"],
        ["PA y amplificación", "105", "0,65 m"], ["DJ, inversor, rack/cables", "55", "0,55 m"],
        ["Luces y seguridad", "35", "0,80 m"], ["Tara proyectada", "1.135", "≈0,49 m"],
        ["Carga útil", "500", "≈0,85 m"], ["Masa operativa", "1.635", "≈0,60 m"],
    ], [3.4, 1.1, 1.8], 8.6, highlight_rows={7: CREAM, 9: GREEN})
    add_p(doc, "La estimación de CG es favorable porque batería, subwoofer e inversor van bajo el nivel del asiento. Aun así, se verificará mediante pesaje por rueda y plataforma inclinada; el valor límite del anteproyecto es 0,75 m cargado.")
    doc.add_heading("Carga útil nominal", level=2)
    add_table(doc, ["Componente", "kg"], [["Piloto", "85"], ["DJ", "85"], ["3 pasajeros", "255"], ["Pertenencias / variación", "75"], ["Total", "500"]], [4.8, 1.5], 9, highlight_rows={4: GREEN})
    add_callout(doc, "Regla de aforo", "Cada 85 kg de exceso de tara elimina una plaza. El placard definitivo se basa en el pesaje final, nunca en la cantidad de asientos disponibles.", CREAM, AMBER)

    section(doc, "8", "Mecánica: chasis, dirección, suspensión y frenos", "Convencional, mantenible y verificable: la creatividad va en la envolvente, no en sustituir funciones de seguridad probadas.")
    add_table(doc, ["Sistema", "Especificación de RFQ", "Razón"], [
        ["Estructura", "GVWR ≥1.700 kg; carga sobre rolling chassis ≥1.100 kg; placas y cálculo del proveedor", "Arte + equipos + 500 kg útiles"],
        ["Tracción", "4WD; 12 kW continuos; ≥18 kW pico; curvas torque/corriente/temperatura", "Barro + 10% y margen"],
        ["Dirección", "Mecánica con EPS; radio exterior ≤4,5 m", "Fail-safe y maniobra lenta"],
        ["Frenos", "Hidráulicos 4 ruedas; dos circuitos preferidos; parking mecánico", "Fricción independiente de regeneración"],
        ["Neumáticos", "Baja presión, banda abierta; índice de carga documentado", "Pasto húmedo y baja compactación"],
        ["Despeje", "≥200 mm chasis; protecciones de batería/motores", "Rastrojo, roderas y barro"],
        ["Recuperación", "Dos puntos estructurales, carga objetivo ≥2× GVWR", "Remolque controlado"],
    ], [1.15, 3.25, 1.9], 8.1)
    doc.add_heading("Orden de magnitud estructural", level=2)
    add_p(doc, "Como punto de partida, no como plano: dos largueros de acero 100×50×4 mm y travesaños 50×50×3 mm cada 400–500 mm. La ingeniería de detalle debe usar las cargas reales de suspensión y unión del donor, verificar fatiga, soldaduras y anclajes de asientos/barandas. Las uniones del arte no participan de la seguridad de ocupantes.")
    doc.add_heading("Frenado", level=2)
    add_table(doc, ["Caso a 10 km/h", "Desaceleración", "Distancia física", "+1 s de percepción"], [
        ["Seco objetivo", "0,35 g", "1,12 m", "3,90 m"],
        ["Mojado mínimo", "0,25 g", "1,57 m", "4,35 m"],
    ], [1.7, 1.45, 1.45, 1.7], 8.7)
    add_p(doc, "A 1.600 kg, 0,35 g implica aproximadamente 1,54 kN·m de torque total en ruedas de radio 0,28 m. La regeneración puede colaborar, pero nunca reemplazar el freno por fricción. El parking debe sostener 20% en ambos sentidos con la batería desconectada.")
    doc.add_heading("Estabilidad", level=2)
    add_p(doc, "Con trocha 1,50 m y CG límite 0,75 m, el umbral geométrico ideal de vuelco es 1,0 g; no contempla pozos, deformación del neumático ni movimiento humano. Por eso se limita la pendiente lateral operativa a 8°, el radio mínimo a 10 km/h a 4–4,5 m y se ensaya estáticamente con tether antes de llevar personas.")

    section(doc, "9", "Potencia, tracción y autonomía", "La batería de 15 kWh nace del peor caso combinado, no de la distancia sola.")
    doc.add_heading("Modelo", level=2)
    add_p(doc, "Para una estimación conservadora a baja velocidad: F = m·g·(Crr + i) y Pel = F·v/η. Se usa m = 1.600 kg, radio de rueda 0,28 m y eficiencia total η = 0,75. La aerodinámica es despreciable a 5–10 km/h; el terreno domina.")
    add_table(doc, ["Escenario", "Fuerza", "Torque rueda total", "kW @5", "kW @8"], [
        ["Firme plano, Crr 0,04", "628 N", "176 N·m", "1,16", "1,86"],
        ["Húmedo plano, Crr 0,08", "1.256 N", "352 N·m", "2,33", "3,72"],
        ["Húmedo +10%", "2.825 N", "791 N·m", "5,23", "8,37"],
        ["Húmedo +15%", "3.610 N", "1.011 N·m", "6,69", "10,70"],
        ["Barro Crr 0,15 +10%", "3.924 N", "1.099 N·m", "7,27", "11,63"],
    ], [1.9, 1.05, 1.35, 0.95, 0.95], 8.2)
    add_p(doc, "La especificación de 12 kW continuos se refiere a tracción. Los auxiliares tienen su rama eléctrica y pueden deslastrarse. En el caso severo, no se promete 8–10 km/h: se opera a 5 km/h y se aborta si hay patinamiento, temperatura o consumo anormal.")
    doc.add_heading("Ventaja del 4WD", level=2)
    add_p(doc, "Con µ = 0,25, el límite ideal 4WD es 3.924 N, suficiente apenas para el caso barro +10%. Si sólo 55% del peso carga el eje motriz, el límite 2WD cae a 2.158 N: después de rodadura húmeda queda apenas ~5,8% de pendiente. Esta comparación descarta el eje trasero de 2 kW como base del proyecto.")
    add_picture(doc, VIS / "06_energia_mision.png", "Balance energético de la misión combinada.", "Barras de consumo de 2,61 a 8,72 kWh según terreno y línea de 10,2 kWh de energía conservadoramente utilizable.", 6.5)
    add_callout(doc, "Límite físico", "Quedan sólo ~1,5 kWh de margen en barro +10% con audio y luces completos. La estrategia no es instalar un PA más grande: es medir consumo real, aplicar el preset móvil y definir un punto de retorno por SOC.", CREAM, AMBER)

    section(doc, "10", "Audio, DJ, iluminación e interacción", "El sonido es un sistema con límites, no una colección de watts pico.")
    add_table(doc, ["Elemento", "Base recomendada", "Masa objetivo"], [
        ["Tops", "2×12\" pasivos, ≥500 W AES/RMS cada uno", "≤28 kg total"],
        ["Sub", "1×15\" pasivo, ≥800 W AES/RMS", "≤30 kg"],
        ["Amplificación", "Clase D con DSP, 2–3 kW totales", "≤15 kg"],
        ["Inversor", "Senoidal 3 kVA continuo, pico ≥6 kVA", "≤18 kg"],
        ["DJ", "Controlador 2 canales + laptop + backup cableado", "≤15 kg"],
        ["Rack/cables/soportes", "IP54, RCD, ventilación y tethers", "≤42 kg"],
        ["Total audio/DJ", "PA instalado 1,8 kW RMS", "≤160 kg con inversor/rack"],
    ], [1.25, 3.65, 1.4], 8.3, highlight_rows={6: GREEN})
    doc.add_heading("Puesto DJ", level=2)
    add_bullets(doc, [
        "Superficie 900–1.000 × 450–550 mm, bandeja amortiguada, tapa transparente contra polvo/lluvia y cables cautivos.",
        "En movimiento: percha marina ajustable, cinturón, apoyo de pies, consola inclinada y manos dentro de la baranda.",
        "Estacionado: percha replegable; el DJ puede pararse sólo con torque cero, freno, calzas y perímetro cerrado.",
        "Piloto y DJ nunca comparten mandos. El DJ no bloquea visión, acceso principal ni egreso secundario.",
    ])
    doc.add_heading("Controles de audio", level=2)
    add_bullets(doc, [
        "DSP con contraseña y presets de tránsito, performance y mute.",
        "Mute físico al alcance del piloto; micrófono cableado para avisos; radio/bocina prioritaria.",
        "Medición en 1, 5 y 10 m, ocho direcciones; registro LAeq,15 min.",
        "Prueba térmica de dos horas con música real; consumo AC promedio móvil ≤1,0 kW.",
        "Tops rígidos con tether independiente; sub sobre aisladores cautivos con topes mecánicos.",
    ])
    doc.add_heading("Iluminación", level=2)
    add_table(doc, ["Capa", "Función", "Independencia"], [
        ["Seguridad", "Blanco frontal, rojo posterior, ámbar lateral, perímetro bajo y reversa", "Rama 12/24 V vital"],
        ["Escultura", "Bandas cyan/ámbar que recorren escamas; ojos y respiración", "Puede apagarse por SOC/falla"],
        ["Trabajo", "Luz blanca de acceso, tablero, extintor y puntos de rescate", "Disponible en emergencia"],
    ], [1.15, 3.35, 1.8], 8.5)

    section(doc, "11", "Ocupantes, accesibilidad y experiencia", "Cinco personas totales: piloto, DJ y tres pasajeros. Nadie de pie durante la marcha.")
    add_table(doc, ["Elemento", "Criterio"], [
        ["Asientos", "Contorneados, fijación estructural; cinturones según evaluación de riesgo y dinámica de baja velocidad."],
        ["Anclajes", "Objetivo preliminar 10 kN por punto de asiento/cinturón; verificar con ingeniería final."],
        ["Barandas", "1.000–1.100 mm; carga lateral objetivo 1 kN; sin aristas ni huecos de atrapamiento."],
        ["Puertas", "Cierre mecánico positivo, sensor de inhibición y apertura interior sin llave."],
        ["Egresos", "Principal ≥900 mm y secundario ≥750 mm; evacuación completa ≤15 s."],
        ["Escalón", "Altura objetivo ≤300 mm o estribo intermedio antideslizante y agarraderas."],
        ["Silla de ruedas", "Plaza convertible central con cuatro anclajes y cinturón; rampa asistida 2,4–3 m si la masa lo permite."],
    ], [1.4, 4.9], 8.6)
    add_p(doc, "Una plataforma elevadora pesa aproximadamente 70–100 kg y no entra en el presupuesto base sin reducir otra masa o aumentar GVWR. El anteproyecto reserva el espacio y los puntos; la decisión se toma con la comunidad usuaria antes de ingeniería de detalle.")
    doc.add_heading("Procedimiento de embarque", level=2)
    add_numbers(doc, [
        "Detener, seleccionar neutro, aplicar parking, calzar si corresponde e inhibir tracción.",
        "Silenciar audio para que las instrucciones sean audibles; un host abre la puerta principal.",
        "Ubicar primero a quien necesite más asistencia en la plaza central; asignar asientos restantes.",
        "Cerrar y verificar puertas; confirmar cinturones, manos/pies dentro y corredor libre.",
        "Piloto confirma por radio con spotters y recién entonces habilita movimiento.",
    ])

    section(doc, "12", "Seguridad y análisis de riesgos", "Los riesgos más altos se cierran antes de sentar personas, no con instrucciones posteriores.")
    add_table(doc, ["Riesgo", "RPN inicial", "Control obligatorio", "Gate"], [
        ["GVWR/masa indefinidos", "350", "Certificado, pesaje y cálculo de carga", "Antes de PO"],
        ["Arte atrapa rueda/barro", "225", "Full bump/steer, 80 mm extra, registro", "Antes de dinámico"],
        ["Freno insuficiente", "200", "4 discos, parking mecánico y ensayo cargado", "Antes de personas"],
        ["Punto ciego", "200", "Visión directa, cámaras y spotters", "Siempre"],
        ["Batería sin UN38.3", "192", "Test summary del modelo exacto", "Antes del saldo"],
        ["Parlante/panel suelto", "180", "Montaje 5g, tether, testigo", "FAT/diario"],
        ["Vuelco lateral", "180", "CG, 8°, prueba tethered", "Antes de personas"],
        ["Audio enmascara avisos", "160", "Mute y comunicaciones prioritarias", "SAT"],
        ["230 V mojado", "150", "Rack IP54, RCD 30 mA y prueba", "FAT"],
    ], [1.65, 0.8, 2.7, 1.15], 7.9, highlight_rows={0: RED, 1: RED, 2: RED, 3: RED})
    doc.add_heading("No-go inmediato", level=2)
    add_bullets(doc, [
        "Freno regenerativo como único freno o parking dependiente de energía.",
        "Carga, GVWR, masa, índice de neumáticos o torque sin documentación verificable.",
        "Batería sin test summary UN38.3 del modelo exacto, SDS y manual BMS.",
        "Dirección/propulsión inalámbrica como único canal, o pérdida de comunicación que no vaya a torque cero.",
        "Tara >1.200 kg, CG cargado >0,75 m o masa final >GVWR.",
        "Una sola salida, DJ de pie, pasajeros de pie o rueda encerrada sin acceso/holgura.",
        "Misión de 5 km que termine debajo de 20% SOC o produzca sobretemperatura, reset o fade de frenos.",
    ])
    doc.add_heading("Incendio y alta tensión", level=2)
    add_p(doc, "El plan de emergencia se redacta con el fabricante de batería y bomberos/servicio del predio. Debe incluir desconexión, aislamiento del área, llamada de emergencia, exposición a humo y vigilancia posterior. Un extintor portátil puede controlar fuegos secundarios; no se presenta como método garantizado para detener una fuga térmica de gran batería.")

    section(doc, "13", "Evaluación de alternativas China", "Los precios vistos son disparadores de RFQ; no son evidencia de aptitud.")
    add_table(doc, ["Producto", "Dato visible", "Problema", "Decisión"], [
        ["4 ruedas wire-control", "≈USD 530,40; MOQ 2", "No demuestra carga, batería, frenos, 4WD real ni masa.", "NO COMPRAR sin RFQ/FAT"],
        ["Base con orugas", "Ficha exacta no verificable", "Freno, estabilidad, peso, pasajero y repuestos desconocidos.", "Reserva experimental"],
        ["Eje 100 cm / 2 kW", "USD 272–290; MOQ 2; 1:11,28; claim 900 kg", "2 kW es insuficiente; 900 kg parece carga de eje, no payload.", "DESCARTAR"],
        ["UTV 72 V / 10 kW comparable", "≈USD 6.900–10.300; tara citada 880 kg", "Potencia plausible, pero masa deja poco margen para arte/audio + 500 kg.", "Sólo si GVWR documentado ≥1,7 t"],
        ["Oruga comparable X2", "1.000 kg claim; 7,5 kW; 7 km/h; envío 920 kg", "Logística pesada y frenos no confirmados.", "No base del primer proyecto"],
    ], [1.45, 1.4, 2.35, 1.1], 7.7)
    add_callout(doc, "Hallazgo de mercado", "No se encontró una publicación que, por sí sola, pruebe simultáneamente 4WD, 12 kW continuos, GVWR ≥1,7 t, frenos 4 ruedas, parking mecánico y masa compatible. El próximo paso no es pagar: es emitir el RFQ del Anexo A a 6–10 proveedores.", CREAM, AMBER)
    doc.add_heading("Estrategia de compra", level=2)
    add_bullets(doc, [
        "Importar rolling chassis, batería/controladores integrados y repuestos críticos como un solo sistema probado.",
        "Fabricar estructura de ocupantes y piel artística en Argentina, donde las modificaciones y reparaciones serán frecuentes.",
        "Comprar o alquilar PA/DJ local para escuchar, medir consumo y asegurar repuestos rápidos.",
        "Contratar inspección preembarque independiente; retener saldo hasta recibir documentos y video FAT.",
    ])

    section(doc, "14", "Importación a Argentina", "La clasificación aduanera domina el costo. Debe resolverse por escrito antes de la orden de compra.")
    add_table(doc, ["Posible NCM", "Uso posible", "Advertencia"], [
        ["8703.80", "Vehículo eléctrico para personas", "Puede activar requisitos distintos a un vehículo industrial."],
        ["8704.60", "Vehículo eléctrico para carga", "Depende de configuración y uso principal."],
        ["8709.11", "Carro industrial eléctrico", "No asumir que un art car encaja automáticamente."],
        ["8706.00", "Chasis con motor", "Partes desmontadas pueden tomar carácter esencial de vehículo completo."],
        ["8708.50", "Ejes motrices", "Para componentes sueltos."],
        ["8507.60", "Batería de ion-litio/LFP", "DG, UN38.3, SDS y embalaje específico."],
    ], [1.15, 2.2, 2.95], 8.2)
    doc.add_heading("Caso base de caja", level=2)
    add_table(doc, ["Concepto", "USD"], [
        ["FOB: donor + configuración + repuestos + inspección", "14.800"],
        ["Flete/origen/seguro/DG hasta CIF", "2.800"],
        ["CIF", "17.600"],
        ["Derecho 18% supuesto", "3.168"],
        ["Tasa estadística 3%", "528"],
        ["Terminal/despachante/inland", "2.800"],
        ["Importado puesto en taller · neto", "24.096"],
        ["IVA/percepciones estimadas · caja recuperable", "10.541"],
        ["Importado puesto en taller · caja", "34.637"],
    ], [4.55, 1.75], 8.8, highlight_rows={6: GREEN, 8: CREAM})
    add_p(doc, "La tasa estadística del 3% se mantiene como supuesto a partir del Decreto 1140/2024. El derecho puede ser 0%, 14%, 18% o 35% según clasificación/origen/configuración. IVA y percepciones no se tratan automáticamente como costo: pueden ser créditos, pero requieren caja y análisis fiscal.")
    doc.add_heading("Logística", level=2)
    add_p(doc, "Para LCL desde China se presupuestan USD 2.800 hasta CIF en el caso base y USD 2.500–6.000 como rango integral de origen, flete, DG, seguro y destino, sujeto a volumen/peso. Un chasis pesado o no apilable puede volver conveniente un 20 ft. Las demoras portuarias no están dentro del rango y justifican prealerta documental.")

    section(doc, "15", "Presupuesto y decisión financiera", "El DJ y la mutación radical elevan el proyecto una categoría completa frente a un carrito decorado.")
    add_table(doc, ["Escenario", "CAPEX neto", "Caja", "Uso"], [
        ["Económico", "≈USD 43.600", "≈USD 50.500", "Voluntariado, PA menor, arancel moderado"],
        ["Recomendado", "≈USD 65.900", "≈USD 76.500", "Conserva 500 kg útiles y peor caso energético"],
        ["Estrés", "≈USD 93.600", "≈USD 109.300", "Arancel 35%, mayor contratación y contingencia"],
        ["Orugas + DJ", "≈USD 63.800", "≈USD 70.300", "Costo alto pese a menor compra inicial"],
    ], [1.35, 1.45, 1.45, 2.05], 8.5, highlight_rows={1: GREEN})
    add_callout(doc, "Caja en pesos", "A USD/ARS 1.700, el punto recomendado requiere aproximadamente ARS 130 millones de caja. La banda de decisión USD 56–80 mil equivale a ARS 95–136 millones. Actualizar el tipo contractual antes de cada hito de pago.", CREAM, AMBER)
    doc.add_heading("Composición del caso base", level=2)
    add_table(doc, ["Bloque", "USD base"], [
        ["Importado puesto en taller", "24.096"], ["Contingencia importada", "2.410"],
        ["Fabricación e integración local", "32.850"], ["Contingencia local", "6.570"],
        ["CAPEX neto", "65.926"], ["Tributos recuperables de caja", "10.541"],
        ["Caja total", "76.467"],
    ], [4.55, 1.75], 8.8, highlight_rows={4: GREEN, 6: CREAM})
    doc.add_heading("OPEX", level=2)
    add_p(doc, "El caso base por evento local es aproximadamente USD 3.400, con rango USD 1.500–5.200: transporte, inspección/seguro, técnico/DJ, mantenimiento, limpieza, radios/EPP y contingencia. Almacenaje y preventivo anual agregan alrededor de USD 2.400 base.")
    add_p(doc, "El archivo Excel adjunto mantiene supuestos, CAPEX, importación, masa/energía, matriz y FMEA con fórmulas editables. Es la fuente de verdad económica de este informe.")

    section(doc, "16", "Plan de ejecución y equipo", "Duración indicativa: 7–9 meses desde decisión hasta ensayo de misión, sin contar calendario de eventos.")
    add_table(doc, ["Fase", "Semanas", "Salida / gate"], [
        ["0. Brief + reglas", "1–2", "Requisitos congelados, evento objetivo y dueño de riesgos"],
        ["1. RFQ y concepto", "2–6", "6–10 ofertas comparables; masa/GVWR/documentos"],
        ["2. Selección donor", "6–8", "Inspección y contrato con retenciones"],
        ["3. Ingeniería local", "7–14", "Layout, interfaces, estructura, energía, egresos"],
        ["4. Fabricación China", "9–16", "FAT remoto/independiente aprobado"],
        ["5. Flete y aduana", "16–23", "Donor recibido y control de ingreso"],
        ["6. Integración local", "20–29", "Rolling test → estructura → audio → arte"],
        ["7. SAT y misión", "29–32", "5 km, frenado, estabilidad, sonido y durabilidad"],
        ["8. Cierre/evento", "33–36", "Legajo as-built, entrenamiento e inspección"],
    ], [1.55, 1.05, 3.7], 8.5)
    doc.add_heading("Roles mínimos", level=2)
    add_table(doc, ["Rol", "Responsabilidad decisiva"], [
        ["Responsable de proyecto", "Presupuesto, alcance, gates y relación con evento/asegurador"],
        ["Ingeniería mecánica", "GVWR, estructura, dirección, frenos, ruedas, estabilidad y rescate"],
        ["Ingeniería eléctrica", "LFP, protecciones, contactores, DC/DC, inversor, IP/EMC"],
        ["Diseño industrial/artista", "Mutación, módulos, piel, accesos y mantenibilidad"],
        ["Ingeniería de sonido", "Cobertura, DSP, energía, SPL, montaje y política"],
        ["Piloto + safety lead", "HMI, puntos ciegos, procedimientos y criterios de abortar"],
        ["Compras/despachante", "RFQ, Incoterm, NCM, documentación, inspección y repuestos"],
        ["Soldador/fabricador", "WPS, trazabilidad, control dimensional y registros"],
        ["Electricista matriculado", "230 V, RCD, esquema neutro/tierra y pruebas"],
        ["Asesor cultural", "Co-diseño si se usa Chakana o referencias andinas"],
    ], [2.05, 4.25], 8.6)
    add_callout(doc, "Secuencia de integración", "Probar primero el rolling chassis desnudo; después estructura/asientos; luego audio/energía; finalmente piel artística. Si se monta el arte antes de medir frenado, consumo y temperatura, se multiplican retrabajos.", PALE, CYAN)

    section(doc, "17", "Plan de verificación y aceptación", "Ninguna prueba con personas hasta cerrar masa, frenos, dirección, alta tensión y anclajes.")
    doc.add_heading("FAT del proveedor", level=2)
    add_table(doc, ["Prueba", "Condición de aceptación"], [
        ["Identidad", "Placa, números de serie, BOM y fotos coinciden con contrato"],
        ["Masa", "Pesaje total y por eje; margen compatible con 500 kg + integración"],
        ["Carga", "Certificado/cálculo de GVWR y puntos de montaje"],
        ["Tracción", "Curva torque/corriente; prueba cargada; 12 kW continuos sin derating anormal"],
        ["Frenos", "Servicio 4 ruedas + parking mecánico; video en pendiente"],
        ["Controles", "E-stop, pedal, reversa, pérdida de CAN y limitadores"],
        ["Batería", "UN38.3, SDS, BMS, manual, celdas y charger exactos"],
        ["Documentación", "Esquemas, repuestos, software, parámetros y diagnóstico"],
    ], [1.35, 4.95], 8.5)
    doc.add_heading("SAT local", level=2)
    add_table(doc, ["Ensayo", "Criterio"], [
        ["Pesaje/CG", "Tara, cuatro ruedas, diferencia lateral ≤10%, CG ≤0,75 m"],
        ["Frenado", "Seco ≤1,5 m; mojado ≤2,0 m desde 10 km/h; 10 paradas sin fade"],
        ["Pendiente", "10% por 500 m ≥5 km/h; cinco arranques en 15%; parking 20%/5 min"],
        ["Descenso", "10% por 500 m ≤5 km/h; luego frenada de emergencia"],
        ["Estabilidad", "Giro cerrado; 8° operativo; prueba estática tethered 20° sin levantar rueda"],
        ["E-stop", "Torque cero ≤0,5 s; luces vitales permanecen"],
        ["Evacuación", "Cinco personas fuera ≤15 s por cualquiera de las rutas previstas"],
        ["Audio térmico", "2 h a preset límite; ≤1 kW promedio; conectores <60 °C; sin protección"],
        ["SPL", "Mapa 1/5/10 m en 8 direcciones; perfiles cumplen objetivo/evento"],
        ["Misión", "5 km a masa total, PA/luces/DJ activos, final ≥20% SOC"],
        ["Durabilidad", "25 km en cinco misiones; sin fisuras, aflojamientos, agua o resets"],
    ], [1.35, 4.95], 8.3)
    doc.add_heading("Criterio de aborto", level=2)
    add_bullets(doc, [
        "Pérdida de dirección/freno, humo/olor anormal, daño de neumático o contacto arte–rueda.",
        "Temperatura fuera de límites de batería/controlador/motor/rack, o diferencia de celdas >10 °C.",
        "Reset de CAN/BMS/inversor, contactor que abre, aislamiento bajo o disparo RCD.",
        "SOC cae más rápido que el corredor aprobado o no permite retorno con 20% final.",
        "Fijación/testigo movido, nueva fisura, ruido estructural o vibración resonante.",
    ])

    section(doc, "18", "Operación, mantenimiento y decisiones abiertas", "Un buen art car se diseña también para parar, recuperar, limpiar y volver a inspeccionar.", page_break=False)
    doc.add_heading("Tripulación", level=2)
    add_table(doc, ["Rol operativo", "Cantidad", "Función"], [
        ["Piloto", "1", "Conducción, decisiones de abortar, mute y E-stop"],
        ["DJ", "1", "Música, nivel dentro del preset y corte de entretenimiento"],
        ["Host", "1", "Acceso, puertas, ocupantes y comunicación interior"],
        ["Spotters", "2", "Frente/lateral y cola; puntos ciegos; ruta peatonal"],
        ["Safety/sound officer", "1", "SPL, entorno, registro y autoridad de apagado"],
    ], [1.65, 0.9, 3.75], 8.5)
    doc.add_heading("Chequeo diario", level=2)
    add_bullets(doc, [
        "Presiones, cortes y barro; giro completo y recorrido libre de ruedas.",
        "Pérdidas de freno, pedal, parking, dirección y fijaciones de suspensión.",
        "SOC, temperaturas, errores BMS, aislamiento, cierres de rack y prueba RCD según plan.",
        "E-stops, llave, neutral, reversa, luces 360°, bocina, radios y cámaras.",
        "Puertas, barandas, asientos, cinturones, tethers, testigos de pintura y paneles.",
        "Mute, presets DSP y medición SPL; extintores, botiquín, calzas y recuperación.",
    ])
    doc.add_heading("Decisiones que faltan", level=2)
    add_table(doc, ["Decisión", "Fecha límite", "Quién decide"], [
        ["Evento objetivo y reglas/año", "Antes de RFQ final", "Proyecto + safety"],
        ["500 kg: útiles o total agregado", "Inmediato", "Promotor"],
        ["Accesibilidad: rampa o plataforma", "Antes de layout", "Promotor + comunidad usuaria"],
        ["Compra vs alquiler de PA", "Antes de CAPEX", "Sonido + finanzas"],
        ["Donor exacto y NCM", "Antes de PO", "Mecánica + despachante"],
        ["Tatú final y asesoría cultural", "Antes de detalle artístico", "Dirección creativa"],
        ["Seguro, límites de viento y predio", "Antes de pruebas públicas", "Safety + asegurador"],
    ], [2.6, 1.45, 2.25], 8.4)
    add_callout(doc, "Próxima autorización recomendada", "Aprobar USD 2.000–4.000 para RFQ técnico, clasificación aduanera escrita, layout CAD, visita de fabricación y prueba/alquiler de PA. No autorizar todavía el CAPEX completo ni un anticipo de chasis.", GREEN, AMBER)

    # Appendices
    section(doc, "A", "RFQ bilingüe para rolling chassis", "Enviar la misma tabla a todos los proveedores y exigir respuesta celda por celda.", page_break=False)
    add_table(doc, ["Tema / Topic", "Requisito / Requirement"], [
        ["Uso / Duty", "Private-event mutant vehicle; grass, stubble, mud; slopes; passenger carrying; no public-road claim."],
        ["Masa / Rating", "State bare rolling mass, curb mass, GVWR, axle ratings and structural payload. Required GVWR ≥1,700 kg."],
        ["Tracción / Drive", "True 4WD; continuous traction power ≥12 kW; peak ≥18 kW; torque/current/thermal curves."],
        ["Velocidad / Speed", "Programmable 5 and 8 km/h modes; hard 10 km/h limit; reverse interlock below 1 km/h."],
        ["Pendiente / Grade", "10% continuous at full GVWR and ≥5 km/h; five starts on 15%; parking on 20%."],
        ["Dirección / Steering", "Mechanical steering linkage with EPS; external turning radius ≤4.5 m; no wireless-only steer-by-wire."],
        ["Frenos / Brakes", "Hydraulic friction brakes on four wheels; state circuits/caliper/disc; mechanical parking brake independent of battery."],
        ["Ruedas / Tires", "Low-pressure off-road tires; load/speed index; rim/PCD; full steer/bump envelope."],
        ["Despeje / Clearance", "Ground clearance ≥200 mm; battery/controller/motor protection; wading/splash limits."],
        ["Batería / Battery", "LFP around 15 kWh; exact cells/BMS; continuous/peak current; UN38.3 test summary and SDS."],
        ["Eléctrico / Electrical", "Main fuse, service disconnect, precharge, contactor, DC/DC, charger, schematics and diagnostic software."],
        ["Seguridad / Safety", "Driver and two external E-stops; traction torque zero ≤0.5 s while safety lights remain on."],
        ["Ambiente / Environment", "Operating temperature, IP ratings, mud/dust limitations, connector series and corrosion protection."],
        ["Interfaces", "3D STEP + 2D drawings; mounting holes and permitted loads; rescue/tow points; center of gravity."],
        ["FAT", "Full-GVWR videos and data: speed, grade, braking, parking, temperature, current and fault tests."],
        ["Commercial", "MOQ 1; FOB and CIF Buenos Aires; lead time; payment milestones; warranty; commissioning support."],
        ["Repuestos / Spares", "Controller, BMS, sensors, brake pads, bearings, tie rods, CV joints/axles and connectors for two years."],
    ], [1.65, 4.65], 7.9)
    doc.add_heading("Texto de apertura", level=2)
    add_callout(doc, "ES", "Solicitamos cotización para un rolling chassis eléctrico 4WD de baja velocidad destinado exclusivamente a un vehículo artístico en predios privados. No aceptaremos valores de carga o potencia sin definición de masa/GVWR, método de ensayo y documentación del modelo exacto. Complete cada punto y marque cualquier excepción.", PALE, CYAN)
    add_callout(doc, "EN", "Please quote a low-speed electric 4WD rolling chassis for an art vehicle used exclusively on private event sites. Load and power claims without bare mass/GVWR, test method and exact-model documentation will not be accepted. Please answer every line and identify all exceptions.", PALE, CYAN)
    doc.add_heading("Documentos antes de pagar saldo", level=2)
    add_bullets(doc, [
        "Commercial invoice, packing list, serial/VIN identification as applicable and origin details.",
        "Signed technical specification, drawings, wiring diagrams, software/parameters and parts list.",
        "Battery UN38.3 test summary, SDS, dangerous-goods declaration and packing evidence.",
        "FAT report, raw logs, photos/video, weigh scale evidence and nonconformity closure.",
        "Warranty terms, remote commissioning contact and shipment list of critical spares.",
    ])

    section(doc, "B", "Checklist de recepción, FAT y SAT", "Copiar esta lista al acta de inspección; cada ítem debe tener evidencia y firma.")
    add_table(doc, ["ID", "Control", "Resultado/evidencia"], [
        ["R-01", "Embalaje, golpes, humedad, precintos y números de serie", "□ OK  □ NC  Evidencia: ______"],
        ["R-02", "Contenido contra packing list y repuestos", "□ OK  □ NC  Evidencia: ______"],
        ["R-03", "Pesaje total, por eje y por rueda", "□ OK  □ NC  Evidencia: ______"],
        ["R-04", "Torque de ruedas, suspensión, dirección y frenos", "□ OK  □ NC  Evidencia: ______"],
        ["R-05", "Aislamiento, polaridad, fusible, desconectores y BMS", "□ OK  □ NC  Evidencia: ______"],
        ["R-06", "Software, parámetros, límites y respaldo", "□ OK  □ NC  Evidencia: ______"],
        ["S-01", "Frenado seco/mojado y fade", "□ PASS  □ FAIL  Dato: ______"],
        ["S-02", "10% continuo / 15% arranque / parking 20%", "□ PASS  □ FAIL  Dato: ______"],
        ["S-03", "Full steer/full bump con arte y barro simulado", "□ PASS  □ FAIL  Dato: ______"],
        ["S-04", "E-stop, puertas, reversa y pérdida de CAN", "□ PASS  □ FAIL  Dato: ______"],
        ["S-05", "Audio 2 h, RCD, temperatura y consumo", "□ PASS  □ FAIL  Dato: ______"],
        ["S-06", "Evacuación ≤15 s", "□ PASS  □ FAIL  Dato: ______"],
        ["S-07", "Misión 5 km; SOC final", "□ PASS  □ FAIL  Dato: ______"],
        ["S-08", "25 km durabilidad e inspección NDT/visual", "□ PASS  □ FAIL  Dato: ______"],
    ], [0.7, 3.85, 1.75], 8.1)

    section(doc, "C", "Fórmulas y supuestos", "Cálculos transparentes para que el equipo pueda reemplazar cada supuesto con datos medidos.")
    add_table(doc, ["Tema", "Expresión", "Uso"], [
        ["Resistencia", "F = m·g·(Crr + i)", "Rodadura + pendiente a baja velocidad"],
        ["Potencia eléctrica", "Pel = F·v / η", "η total motor/control/transmisión = 0,75"],
        ["Torque rueda", "T = F·r", "r dinámico supuesto 0,28 m"],
        ["Energía tracción", "E = P·distancia/velocidad", "Misión de 5 km"],
        ["Energía usable", "En·(1−reserva)·(1−derating)", "15·0,80·0,85 = 10,2 kWh"],
        ["Frenado", "d = v²/(2a)", "Sin sumar reacción del piloto"],
        ["Vuelco ideal", "ay/g = trocha/(2·hCG)", "Sólo orden geométrico"],
        ["RPN", "Severidad·Ocurrencia·Detección", "Priorizar controles; no predice probabilidad"],
    ], [1.45, 2.4, 2.45], 8.4)
    add_p(doc, "Coeficientes de rodadura usados: 0,04 firme, 0,08 húmedo y 0,15 barro. Son escenarios, no propiedades universales. El ensayo de coast-down/consumo en el predio reemplaza estos valores.")

    section(doc, "D", "Registro de fuentes", "Fuentes oficiales para reglas y marco; publicaciones de proveedores sólo para claims y rangos.")
    sources = [
        ("Burning Man · MV criteria and licensing", "https://burningman.org/black-rock-city/bring-your-mutant-vehicle/mv-criteria-and-licensing/", "mutación, evaluación y licencias"),
        ("Burning Man · Mutant Vehicle Owner’s Handbook", "https://burningman.org/black-rock-city/bring-your-mutant-vehicle/mutant-vehicle-owners-handbook/", "operación y sonido 2026"),
        ("Burning Man · Noise control and sound policy", "https://survival.burningman.org/rules-and-regulations/noise-control-and-sound-policy/", "orientación y horarios"),
        ("AfrikaBurn · Mutant Vehicles", "https://www.afrikaburn.org/event/participation/mutant-vehicles/", "registro, velocidad y seguridad"),
        ("AfrikaBurn · Sound Policy", "https://www.afrikaburn.org/afrikaburn-sound-policy/", "95 dB, Sound Officer y orientación"),
        ("Nowhere · Artomobiles", "https://www.goingnowhere.org/participate/artomobiles/", "10 km/h, spotter, frenos y luces"),
        ("Argentina.gob.ar · Licencia de Configuración de Modelo", "https://www.argentina.gob.ar/obtener-licencia-de-configuracion-de-modelo", "alcance del régimen vial"),
        ("Normativa Argentina · Decreto 1140/2024", "https://www.argentina.gob.ar/normativa/nacional/norma-407914", "tasa estadística"),
        ("VUCE Argentina", "https://www.argentina.gob.ar/node/196822", "intervenciones de importación"),
        ("BCRA · Régimen de bandas cambiarias", "https://www.bcra.gob.ar/regimen-de-bandas-cambiarias/", "referencia cambiaria"),
        ("PHMSA · Lithium batteries", "https://www.phmsa.dot.gov/lithiumbatteries", "UN38.3 test summary"),
        ("OMS · Safe listening venues and events", "https://www.who.int/publications/i/item/9789240043114", "nivel de referencia 100 dB LAeq,15 min"),
        ("NIOSH · Understanding noise exposure limits", "https://www.cdc.gov/niosh/blogs/2016/noise.html", "85 dBA/8 h y tasa de intercambio"),
        ("Alibaba · Four-wheel wire-control product", "https://www.alibaba.com/product-detail/Four-Wheel-Unmanned-Autonomous-Wire-Control_1601605765591.html", "producto aportado; datos insuficientes"),
        ("Alibaba · Rubber-track product", "https://www.alibaba.com/product-detail/OEM-Custom-Remote-Controlled-Rubber-Track_1601864041467.html", "producto aportado; ficha incompleta"),
        ("Alibaba · 2 kW differential axle", "https://www.alibaba.com/product-detail/100CM-2000W-Shift-Differential-Rear-Axle_1601869479511.html", "producto aportado; descartado"),
        ("Olano Customs · Tarifario LCL 2026", "https://www.olanocustoms.com/wp-content/uploads/2026/03/TARIFARIO-LCL-MAR-DIC-2026.pdf", "referencia logística; no cotización total"),
    ]
    add_callout(doc, "Disciplina de uso", "Una publicación de marketplace sólo inicia la conversación. Para comprar, reemplazar cada claim por: modelo exacto, documento firmado, método de ensayo, número de serie, evidencia FAT y condición contractual.", CREAM, AMBER)
    for i, src in enumerate(sources, 1): source_p(doc, i, *src)

    section(doc, "E", "Prompts y alcance de los visuales", "Imágenes generadas con el modo incorporado de ImageGen; sirven para alinear intención, no para dimensionar piezas.")
    prompts = [
        ("Tatú Sonoro", "Render fotorrealista de una criatura tatú argentina continua, sin capot/parabrisas/parrilla/cabina visibles; ruedas 4WD discretas tras escamas abiertas; piloto oculto en la cabeza; DJ semi-sentado en madriguera central; dos tops y un sub integrados; tres pasajeros contenidos; terreno de pasto y barro; iluminación cyan/ámbar; fabricación modular realista."),
        ("Chakana Resonante", "Render fotorrealista de un pabellón móvil geométrico escalonado, no un vehículo decorado; ruedas oscurecidas tras faldones perforados; DJ en el centro; parlantes en los brazos; piloto detrás de portal oscuro; tres pasajeros, dos salidas, luz cyan/magenta/ámbar y construcción flat-pack culturalmente respetuosa."),
        ("Coatí Nocturno", "Render fotorrealista de una criatura coatí completa y baja, sin lenguaje automotriz; ruedas tratadas como patas; piloto oculto en máscara; DJ en la caja torácica; tops en hombros, sub en vientre y cola ligera como canopy; tres pasajeros protegidos; metal perforado sin pieles, plumas ni materiales sueltos."),
    ]
    add_table(doc, ["Visual", "Prompt final resumido"], prompts, [1.35, 4.95], 8.2)
    add_p(doc, "Todos los renders exageran libertad formal y pueden contener geometrías no construibles. El equipo debe preservar la lectura escultórica mientras corrige visión, holguras, barandas, accesos, ventilación, carga y puntos de rescate.")

    # Final decision page
    doc.add_page_break()
    doc.add_heading("Cierre", level=1)
    add_callout(doc, "Sí es viable", "Con un donor 4WD de 12 kW continuos, GVWR ≥1,7 t y masa suficientemente baja, el Tatú Sonoro puede mover 500 kg útiles durante 5 km sobre terreno irregular, con DJ y audio activo, conservando reserva energética y una silueta radicalmente no vehicular.", GREEN, AMBER)
    add_callout(doc, "Todavía no es comprable", "La condición de viabilidad depende de datos que ningún link aportado demuestra. El único gasto inmediato defendible es la fase de reducción de incertidumbre: RFQ comparable, NCM escrito, layout CAD, prueba de PA y revisión estructural/eléctrica.", CREAM, AMBER)
    doc.add_heading("Orden de las próximas cinco decisiones", level=2)
    add_numbers(doc, [
        "Confirmar si los 500 kg son carga útil neta y elegir el evento/año objetivo.",
        "Emitir RFQ a 6–10 proveedores y obtener clasificación aduanera escrita.",
        "Seleccionar tres donors por masa/GVWR/frenos, no por precio o potencia pico.",
        "Probar un PA compacto local y medir consumo/cobertura antes de comprar audio.",
        "Autorizar diseño de detalle sólo si el donor supera los gates de masa, carga, frenado y documentos.",
    ])

    core = doc.core_properties
    core.title = "Tatú Sonoro — Idea, Anteproyecto y Presupuesto"
    core.subject = "Prefactibilidad de Art Car / vehículo mutante para Argentina"
    core.author = "Equipo multidisciplinario de anteproyecto"
    core.keywords = "art car, mutant vehicle, tatú, DJ, 4WD, prefactibilidad, Argentina"
    doc.save(DOCX)
    print(f"Saved {DOCX}")


if __name__ == "__main__":
    make_figures()
    build_doc()
