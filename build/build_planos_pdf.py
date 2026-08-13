from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A3, landscape
from reportlab.lib.utils import ImageReader
import subprocess

ROOT = Path("/Users/martinmarquez/projects/chakana-art-car")
OUT = ROOT / "output/pdf/Chakana_Art_Car_Planos_Preliminares.pdf"
TMP = ROOT / "qa/planos"
TMP.mkdir(parents=True, exist_ok=True)

svgs = [
    ROOT / "planos/PL-001_Envolvente_General.svg",
    ROOT / "planos/PL-002_Fachada_DJ.svg",
    ROOT / "planos/PL-003_Interfaces_Donor.svg",
]

pngs = []
for svg in svgs:
    png = TMP / f"{svg.stem}.png"
    subprocess.run(["magick", "-background", "white", "-density", "192", str(svg), "-resize", "2378x1682!", str(png)], check=True)
    pngs.append(png)

w, h = landscape(A3)
c = canvas.Canvas(str(OUT), pagesize=(w, h), pageCompression=1)
for png in pngs:
    c.drawImage(ImageReader(str(png)), 0, 0, width=w, height=h, preserveAspectRatio=True, anchor="c")
    c.showPage()
c.save()

assert OUT.exists() and OUT.stat().st_size > 100_000
print(OUT)
