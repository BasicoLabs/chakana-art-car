from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A3, landscape
from reportlab.lib.utils import ImageReader
import subprocess

ROOT = Path("/Users/martinmarquez/projects/chakana-art-car")
OUT = ROOT / "output/pdf/Chakana_Madera_2026_Planos_Preliminares.pdf"
TMP = ROOT / "qa/planos_madera"
TMP.mkdir(parents=True, exist_ok=True)
svgs = [
    ROOT / "planos/PM-001_Chakana_Madera_Modulos.svg",
    ROOT / "planos/PM-002_Bases_Arriostramiento.svg",
    ROOT / "planos/PM-003_Uniones_Montaje.svg",
]

pngs = []
for svg in svgs:
    png = TMP / f"{svg.stem}.png"
    subprocess.run(["magick", "-background", "white", "-density", "192", str(svg), "-resize", "2378x1682!", str(png)], check=True)
    pngs.append(png)

w, h = landscape(A3)
c = canvas.Canvas(str(OUT), pagesize=(w, h), pageCompression=1)
c.setTitle("Chakana de madera 2026 - planos preliminares")
for png in pngs:
    c.drawImage(ImageReader(str(png)), 0, 0, width=w, height=h, preserveAspectRatio=True, anchor="c")
    c.showPage()
c.save()
assert OUT.exists() and OUT.stat().st_size > 100_000
print(OUT)
