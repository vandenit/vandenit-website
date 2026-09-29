#!/usr/bin/env python3
"""Generate Filip's CV as a PDF from the markdown CV source.

Source (in order of preference):
  1. ~/documentation/career/cv.md        (canonical, with contact details)
  2. content/pages/fullcv.md             (fallback, website version)

Output: CV-Filip-Van-den-Broeck.pdf in the repo root.
The PDF contains personal data and the repo is public: it is gitignored.

Design: light print layout based on the Vanden IT design tokens
(styles.css) — amber accent rules, Geist typeface, ATS-friendly single
column with real text.

Usage: python3 scripts/generate-cv.py [source.md] [-o out.pdf]
"""
from __future__ import annotations

import argparse
import glob
import json
import os
import re
import sys

from reportlab.lib import colors
from reportlab.lib.enums import TA_RIGHT
from reportlab.lib.fonts import addMapping
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas as canvas_module
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    HRFlowable,
    KeepTogether,
    PageTemplate,
    Paragraph,
    Table,
    TableStyle,
)

# ── Design tokens (light adaptation of styles.css midnight palette) ──────
INK = colors.HexColor("#16232e")        # near --vdit-color-surface
BODY = colors.HexColor("#2a3742")
MUTED = colors.HexColor("#5f6f7d")
SUBTLE = colors.HexColor("#8695a3")
AMBER = colors.HexColor("#d98b32")      # --vdit-color-human
RULE = colors.HexColor("#dfe4e9")

ML = MR = 1.7 * cm
MT = 1.5 * cm
MB = 1.7 * cm
PAGE_W, PAGE_H = A4
AVAIL = PAGE_W - ML - MR
DATE_W = 126

SRC_CANDIDATES = [
    os.path.expanduser("~/documentation/career/cv.md"),
    "content/pages/fullcv.md",
]


# ── Fonts ─────────────────────────────────────────────────────────────────
def register_fonts(repo_root: str) -> None:
    pat = os.path.join(
        repo_root, "node_modules", ".pnpm", "geist@*",
        "node_modules", "geist", "dist", "fonts", "geist-sans", "Geist-*.ttf",
    )
    found = {os.path.basename(p)[:-4]: p for p in glob.glob(pat)}
    need = {
        "Geist-Regular": "Geist",
        "Geist-Medium": "Geist-Medium",
        "Geist-SemiBold": "Geist-SemiBold",
        "Geist-Bold": "Geist-Bold",
    }
    for base, psname in need.items():
        if base not in found:
            sys.exit(f"Font not found: {base} (searched {pat})")
        pdfmetrics.registerFont(TTFont(psname, found[base]))
    # <b>/<i> resolution inside Paragraph markup
    addMapping("Geist", 0, 0, "Geist")
    addMapping("Geist", 1, 0, "Geist-SemiBold")
    addMapping("Geist", 0, 1, "Geist")            # no italic face: upright
    addMapping("Geist", 1, 1, "Geist-SemiBold")
    # styles reference these faces directly: register each as its own family
    for face in ("Geist-Medium", "Geist-SemiBold", "Geist-Bold"):
        for bold in (0, 1):
            for italic in (0, 1):
                addMapping(face, bold, italic, face)


# ── Markdown → reportlab inline markup ────────────────────────────────────
def esc(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def md_inline(s: str) -> str:
    s = s.replace("Gerkin", "Gherkin")  # source typo
    s = esc(s)

    def link_repl(m):
        text, url = m.group(1), m.group(2)
        disp = re.sub(r"^https?://", "", url).rstrip("/")
        if disp.lower() in text.lower():
            return text
        return f"{text} ({disp})"

    s = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", link_repl, s)
    s = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", s)
    s = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<i>\1</i>", s)
    return s


# ── Parser ────────────────────────────────────────────────────────────────
def parse_cv(md: str) -> dict:
    lines = [l.rstrip() for l in md.splitlines()]
    name, contacts, role = None, [], None
    sections: list[dict] = []
    cur_sec = None
    cur_entry = None

    def close_entry():
        nonlocal cur_entry
        if cur_sec is not None and cur_entry is not None:
            cur_sec["blocks"].append(cur_entry)
            cur_entry = None

    for line in lines:
        stripped = line.strip()
        if stripped.startswith("### "):
            close_entry()
            if cur_sec is not None:
                sections.append(cur_sec)
            cur_sec = {"name": stripped[4:].strip(), "blocks": []}
        elif stripped.startswith("#### "):
            close_entry()
            t = stripped[5:].strip()
            if " - " in t:
                title, company = (p.strip() for p in t.split(" - ", 1))
            else:
                title, company = t, ""
            cur_entry = {"title": title, "company": company,
                         "date": None, "blocks": []}
        elif cur_sec is None:
            # header block
            if stripped.startswith("## ") and name is None:
                name = stripped[3:].strip()
            m = re.match(
                r"^- \*\*(Address|Phone|Email|Website):\*\*\s*(.*)$", stripped)
            if m:
                contacts.append(md_inline(m.group(2).strip()))
        elif not stripped or stripped == "---":
            continue
        else:
            target = cur_entry["blocks"] if cur_entry is not None \
                else cur_sec["blocks"]
            m_date = re.match(r"^\*\*([^*]+)\*\*$", stripped)
            if cur_entry is not None and m_date and not cur_entry["blocks"]:
                cur_entry["date"] = m_date.group(1).strip()
            elif stripped.startswith("- "):
                indent = len(line) - len(line.lstrip())
                level = 2 if indent >= 2 else 1
                target.append(("bullet", level, stripped[2:].strip()))
            elif re.match(r"^\*\*", stripped):
                target.append(("subhead", stripped))
            else:
                target.append(("para", stripped))

    close_entry()
    if cur_sec is not None:
        sections.append(cur_sec)

    # role subtitle = title of the first Experience entry
    for sec in sections:
        if sec["name"].lower() == "experience":
            for blk in sec["blocks"]:
                if isinstance(blk, dict):
                    role = blk["title"]
                    break
            break
    return {"name": name, "contacts": contacts, "role": role,
            "sections": sections}


# ── Styles ───────────────────────────────────────────────────────────────
def make_styles():
    from reportlab.lib.styles import ParagraphStyle
    return {
        "name": ParagraphStyle(
            "name", fontName="Geist-Bold", fontSize=21, leading=25,
            textColor=INK),
        "role": ParagraphStyle(
            "role", fontName="Geist-Medium", fontSize=10, leading=13,
            textColor=MUTED, spaceBefore=1),
        "contact": ParagraphStyle(
            "contact", fontName="Geist", fontSize=8.5, leading=11.5,
            textColor=MUTED, spaceBefore=3),
        "section": ParagraphStyle(
            "section", fontName="Geist-SemiBold", fontSize=11, leading=14,
            textColor=INK, spaceBefore=11, spaceAfter=1, keepWithNext=1),
        "jobtitle": ParagraphStyle(
            "jobtitle", fontName="Geist-SemiBold", fontSize=10, leading=13,
            textColor=INK),
        "company": ParagraphStyle(
            "company", fontName="Geist", fontSize=9.3, leading=12,
            textColor=MUTED, spaceBefore=0.5),
        "date": ParagraphStyle(
            "date", fontName="Geist", fontSize=8.5, leading=12,
            textColor=MUTED, alignment=TA_RIGHT),
        "subhead": ParagraphStyle(
            "subhead", fontName="Geist-SemiBold", fontSize=9.3, leading=12.3,
            textColor=INK, spaceBefore=5, spaceAfter=1),
        "bullet": ParagraphStyle(
            "bullet", fontName="Geist", fontSize=9, leading=12.3,
            textColor=BODY, leftIndent=11, bulletIndent=0,
            spaceBefore=0, spaceAfter=1.5, bulletFontSize=9,
            bulletColor=AMBER),
        "subbullet": ParagraphStyle(
            "subbullet", fontName="Geist", fontSize=9, leading=12.3,
            textColor=BODY, leftIndent=23, bulletIndent=11,
            spaceBefore=0, spaceAfter=1.5, bulletFontSize=9,
            bulletColor=SUBTLE),
        "para": ParagraphStyle(
            "para", fontName="Geist", fontSize=9, leading=12.3,
            textColor=BODY, spaceBefore=2, spaceAfter=2),
    }


def bullet_block(block, st) -> list:
    kind, payload = block[0], block[-1]
    level = block[1] if kind == "bullet" else 1
    if kind == "bullet":
        style = st["subbullet"] if level == 2 else st["bullet"]
        glyph = "\u2013" if level == 2 else "\u2022"
        return [Paragraph(md_inline(payload), style, bulletText=glyph)]
    if kind == "subhead":
        return [Paragraph(md_inline(payload), st["subhead"])]
    return [Paragraph(md_inline(payload), st["para"])]


def entry_flowables(entry, st) -> list:
    left = [Paragraph(md_inline(entry["title"]), st["jobtitle"])]
    if entry["company"]:
        left.append(Paragraph(md_inline(entry["company"]), st["company"]))
    date_p = Paragraph(md_inline(entry["date"] or ""), st["date"])
    tbl = Table([[left, date_p]], colWidths=[AVAIL - DATE_W, DATE_W])
    tbl.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    inner = [tbl]
    for b in entry["blocks"]:
        inner += bullet_block(b, st)
    # keep the whole entry on one page where possible
    return [KeepTogether(inner)]


# ── Canvas with "page X / Y" footer ──────────────────────────────────────
class NumberedCanvas(canvas_module.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved: list[dict] = []
        self.total_pages = 0

    def showPage(self):
        self._saved.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        total = len(self._saved)
        self.total_pages = total
        for state in self._saved:
            self.__dict__.update(state)
            self._draw_footer(total)
            super().showPage()
        super().save()

    def _draw_footer(self, total):
        self.saveState()
        self.setFont("Geist", 7.3)
        self.setFillColor(SUBTLE)
        self.drawString(ML, 0.95 * cm, "Filip Van den Broeck \u00b7 Curriculum Vitae")
        self.drawRightString(PAGE_W - MR, 0.95 * cm,
                              f"page {self._pageNumber} / {total}")
        self.restoreState()


# ── Build ────────────────────────────────────────────────────────────────
def build_pdf(cv: dict, out_path: str) -> int:
    st = make_styles()
    story: list = []

    story.append(Paragraph(esc(cv["name"] or ""), st["name"]))
    if cv["role"]:
        story.append(Paragraph(esc(cv["role"]), st["role"]))
    if cv["contacts"]:
        story.append(Paragraph(" \u00b7 ".join(cv["contacts"]), st["contact"]))
    story.append(HRFlowable(width="100%", thickness=1.1, color=AMBER,
                            spaceBefore=8, spaceAfter=2))

    for sec in cv["sections"]:
        story.append(Paragraph(esc(sec["name"].upper()), st["section"]))
        story.append(HRFlowable(width="100%", thickness=0.9, color=AMBER,
                                spaceBefore=0, spaceAfter=4))
        entries = [b for b in sec["blocks"] if isinstance(b, dict)]
        for i, blk in enumerate(sec["blocks"]):
            if isinstance(blk, dict):
                story.extend(entry_flowables(blk, st))
                if i < len(sec["blocks"]) - 1:
                    story.append(HRFlowable(width="100%", thickness=0.4,
                                            color=RULE, spaceBefore=6,
                                            spaceAfter=6))
            else:
                story.extend(bullet_block(blk, st))

    doc = BaseDocTemplate(
        out_path, pagesize=A4,
        title="Filip Van den Broeck \u2014 Curriculum Vitae",
        author="Filip Van den Broeck", subject="Curriculum Vitae",
        creator="scripts/generate-cv.py", leftMargin=ML, rightMargin=MR,
        topMargin=MT, bottomMargin=MB)
    frame = Frame(ML, MB, AVAIL, PAGE_H - MT - MB, id="main",
                  leftPadding=0, rightPadding=0, topPadding=0,
                  bottomPadding=0)
    doc.addPageTemplates([PageTemplate(id="cv", frames=[frame])])
    doc.build(story, canvasmaker=NumberedCanvas)
    try:
        from pypdf import PdfReader
        pages = len(PdfReader(out_path).pages)
    except Exception:
        pages = -1
    print(json.dumps({"output": out_path, "pages": pages}))
    return 0


def main() -> int:
    for stream in (sys.stdout, sys.stderr):
        try:
            stream.reconfigure(encoding="utf-8")
        except Exception:
            pass
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("source", nargs="?",
                    help="markdown CV source (default: first existing of "
                         + " / ".join(SRC_CANDIDATES))
    ap.add_argument("-o", "--output", default="CV-Filip-Van-den-Broeck.pdf")
    args = ap.parse_args()

    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(repo_root)
    register_fonts(repo_root)

    src = args.source
    if not src:
        src = next((p for p in SRC_CANDIDATES if os.path.isfile(p)), None)
        if src is None:
            sys.exit(f"No CV source found; tried: {SRC_CANDIDATES}")
    with open(src, encoding="utf-8") as fh:
        cv = parse_cv(fh.read())
    if not cv["name"]:
        sys.exit(f"Could not parse a name from {src}")
    print(f"source: {src}", file=sys.stderr)
    return build_pdf(cv, args.output)


if __name__ == "__main__":
    sys.exit(main())