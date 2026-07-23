#!/usr/bin/env python3
# Laminador MDJ — compone lamina = escena (foto) + texto (fuentes reales) + overlay de marca.
# El texto lo renderiza el navegador (hebreo/yidish perfectos), no la IA.
# Uso: python3 laminar.py manifest.json
import json, subprocess, sys, os, html, time, shutil

BASE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(BASE, "assets")
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
# Perfil propio: aísla el Chrome headless del laminador del Chrome real del usuario
# (si comparten perfil, el headless se cuelga por el lock). Ver incidente mié 5.
PROFILE = os.path.join(BASE, "_chrome_prof")
FONTLINK = ('<link rel="preconnect" href="https://fonts.googleapis.com">'
            '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
            '<link href="https://fonts.googleapis.com/css2?'
            'family=Frank+Ruhl+Libre:ital,wght@0,500;0,700;1,500'
            '&family=Plus+Jakarta+Sans:wght@500;700;800&display=swap" rel="stylesheet">')

SCRIM = ("linear-gradient(180deg, rgba(18,11,4,0) 28%, rgba(18,11,4,0.14) 45%,"
         " rgba(18,11,4,0.50) 62%, rgba(18,11,4,0.58) 80%, rgba(18,11,4,0.32) 100%)")

def esc(s): return html.escape(str(s), quote=False)

def build(p):
    fmt = p["format"]                       # feed | story
    W, H = (1080, 1350) if fmt == "feed" else (1080, 1920)
    top    = p.get("top", "52%" if fmt == "feed" else "27%")
    bigsz  = p.get("big_size", 74 if fmt == "feed" else 66)
    eyesz  = p.get("eye_size", 27)
    trsz   = p.get("tr_size", 23)
    frsz   = p.get("fr_size", 39 if fmt == "feed" else 34)
    maxw   = p.get("max_w", 820)
    bgpos  = p.get("bg_pos", "center 42%")
    scene  = p["scene"]
    overlay = "assets/overlay_%s_%s.png" % (fmt, p["lang"])

    # Paleta de texto. fondo="claro" -> tinta AZUL dusk, sin sombra oscura ni scrim (no tapa la foto,
    # y el azul contrasta sobre fondo claro). Por defecto (fondo oscuro/foto) -> crema + contorno.
    if p.get("fondo") == "claro":
        c_eye = c_big = c_fr = "#12315B"; c_tr = "#2C4E82"
        edshadow = "0 0 6px rgba(255,255,255,0.62), 0 1px 2px rgba(255,255,255,0.55)"
        scrim = "transparent"
    else:
        c_eye, c_big, c_tr, c_fr = "#F8EFDC", "#FCF6E8", "#E8C594", "#F8EFDB"
        edshadow = ("0 0 5px rgba(0,0,0,0.60), 0 2px 5px rgba(0,0,0,0.88),"
                    " 0 3px 22px rgba(0,0,0,0.55)")
        scrim = SCRIM

    # big_ltr=true -> el "big" es texto latino (ladino/yiddish translit), no hebreo: dirección LTR.
    bigdir = "ltr" if p.get("big_ltr") else "rtl"

    inner = '<div class="eyebrow">%s</div>' % esc(p["eyebrow"])
    inner += '<div class="big">%s</div>' % esc(p["big"])
    if p.get("translit"):
        inner += '<div class="translit">%s</div>' % esc(p["translit"])
    if p.get("frase"):
        inner += '<div class="frase">%s</div>' % esc(p["frase"])
    if p.get("sticker"):
        inner += '<div class="sticker">%s</div>' % esc(p["sticker"])

    css = """
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:%(W)spx;height:%(H)spx;overflow:hidden;}
.canvas{position:relative;width:%(W)spx;height:%(H)spx;font-family:'Plus Jakarta Sans',sans-serif;}
.scene{position:absolute;inset:0;background:url('%(scene)s') %(bgpos)s / cover no-repeat;}
.scrim{position:absolute;inset:0;background:%(scrim)s;}
.editorial{position:absolute;left:0;right:0;top:%(top)s;display:flex;flex-direction:column;
  align-items:center;text-align:center;padding:0 92px;
  text-shadow:%(edshadow)s;}
.eyebrow{font-weight:700;font-size:%(eyesz)spx;letter-spacing:7px;text-transform:uppercase;color:%(c_eye)s;}
.big{font-family:'Frank Ruhl Libre',serif;font-weight:700;font-size:%(bigsz)spx;color:%(c_big)s;
  direction:%(bigdir)s;line-height:1.12;margin-top:16px;letter-spacing:1px;}
.translit{font-weight:700;font-size:%(trsz)spx;letter-spacing:6px;text-transform:uppercase;color:%(c_tr)s;margin-top:13px;}
.frase{font-family:'Frank Ruhl Libre',serif;font-style:italic;font-weight:500;font-size:%(frsz)spx;
  color:%(c_fr)s;line-height:1.3;margin-top:26px;max-width:%(maxw)spx;}
.sticker{margin-top:32px;background:rgba(9,13,28,0.82);border:1.5px solid #E8C594;border-radius:22px;
  padding:20px 30px;color:#F1E6CB;font-weight:600;font-size:26px;max-width:720px;line-height:1.36;}
.overlay{position:absolute;inset:0;width:%(W)spx;height:%(H)spx;}
""" % dict(W=W, H=H, scene=scene, bgpos=bgpos, scrim=scrim, top=top,
           eyesz=eyesz, bigsz=bigsz, trsz=trsz, frsz=frsz, maxw=maxw,
           edshadow=edshadow, c_eye=c_eye, c_big=c_big, c_tr=c_tr, c_fr=c_fr, bigdir=bigdir)

    return ("<!doctype html><html lang='%s'><head><meta charset='utf-8'>%s<style>%s</style></head>"
            "<body><div class='canvas'><div class='scene'></div><div class='scrim'></div>"
            "<div class='editorial'>%s</div><img class='overlay' src='%s' alt=''></div></body></html>"
            % (p["lang"], FONTLINK, css, inner, overlay)), W, H

def main(manifest_path):
    pieces = json.load(open(manifest_path))
    for p in pieces:
        doc, W, H = build(p)
        htmlp = os.path.join(BASE, "_tmp_%s.html" % p["id"])
        open(htmlp, "w").write(doc)
        out = p["out"]
        if os.path.exists(out):
            try: os.remove(out)
            except OSError: pass
        shutil.rmtree(PROFILE, ignore_errors=True)  # perfil limpio: sin SingletonLock
        # Chrome headless genera el PNG en ~2s pero a veces NO sale (con el Chrome real
        # del usuario abierto). Estrategia: lanzar, esperar el PNG, y matarlo nosotros.
        proc = subprocess.Popen([CHROME, "--headless=new", "--hide-scrollbars",
                        "--no-first-run", "--no-default-browser-check", "--disable-gpu",
                        "--user-data-dir=%s" % PROFILE,
                        "--force-device-scale-factor=1", "--window-size=%d,%d" % (W, H),
                        "--virtual-time-budget=6000", "--screenshot=%s" % out,
                        "file://%s" % htmlp],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        ok = False
        for _ in range(80):                      # hasta ~20s
            if os.path.exists(out) and os.path.getsize(out) > 0:
                time.sleep(0.5)                  # que termine de escribir el archivo
                ok = True
                break
            time.sleep(0.25)
        try:
            proc.terminate(); proc.wait(timeout=5)
        except Exception:
            try: proc.kill()
            except Exception: pass
        print("OK" if ok else "FAIL", p["id"], "->", out, "(%dx%d)" % (W, H))

if __name__ == "__main__":
    main(sys.argv[1])
