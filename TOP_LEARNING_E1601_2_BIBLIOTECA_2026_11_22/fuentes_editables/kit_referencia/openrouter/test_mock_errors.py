#!/usr/bin/env python3
"""
Prueba de la LOGICA de reintentos/fallback contra un servidor LOCAL SIMULADO (no es OpenRouter).
Sirve para comprobar las ramas 401/402/404/429/503 sin gastar creditos ni usar clave real.
Uso:  python test_mock_errors.py        (ejecuta ademas test_openrouter.js si hay Node)
"""
import json, os, subprocess, sys, threading
from http.server import BaseHTTPRequestHandler, HTTPServer

# guion: modelo -> lista de (status, cuerpo, cabeceras) que se consumen en orden (el ultimo se repite)
SCRIPT = {}
HITS = []

class H(BaseHTTPRequestHandler):
    def log_message(self, *a): pass
    def do_POST(self):
        body = json.loads(self.rfile.read(int(self.headers["Content-Length"])))
        m = body["model"]; HITS.append(m)
        seq = SCRIPT[m]; st, payload, hdr = seq.pop(0) if len(seq) > 1 else seq[0]
        self.send_response(st); self.send_header("Content-Type", "application/json")
        for k, v in hdr.items(): self.send_header(k, v)
        self.end_headers(); self.wfile.write(json.dumps(payload).encode())

def err(code, msg): return {"error": {"code": code, "message": msg}}
OK = {"model": "mock/ok:free", "choices": [{"message": {"content": "respuesta simulada"}}]}

srv = HTTPServer(("127.0.0.1", 0), H); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
os.environ["OPENROUTER_BASE_URL"] = f"http://127.0.0.1:{port}/api/v1"
os.environ.pop("HTTPS_PROXY", None); os.environ["NO_PROXY"] = "127.0.0.1"
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import test_openrouter as t

fallos = 0
def check(nombre, cond):
    global fallos
    print(("PASA  " if cond else "FALLA ") + nombre); fallos += (not cond)

nosleep = lambda s: None
# 1) 429 con Retry-After y luego 200 -> reintenta el mismo modelo
SCRIPT["a:free"] = [(429, err(429, "Rate limit exceeded"), {"Retry-After": "1"}), (200, OK, {})]
HITS.clear(); r = t.preguntar("sk-or-v1-XXXXXXXX", "hola", modelos=["a:free"], sleep=nosleep)
check("429 -> reintento -> 200", r == "respuesta simulada" and HITS == ["a:free", "a:free"])
# 2) 404 en el primero -> fallback al segundo
SCRIPT["b:free"] = [(404, err(404, "No endpoints found"), {})]; SCRIPT["c:free"] = [(200, OK, {})]
HITS.clear(); r = t.preguntar("k", "hola", modelos=["b:free", "c:free"], sleep=nosleep)
check("404 -> fallback", r == "respuesta simulada" and HITS == ["b:free", "c:free"])
# 3) 401 y 402 son fatales: no reintenta ni hace fallback
for code in (401, 402, 403):
    SCRIPT["d:free"] = [(code, err(code, "x"), {})]; SCRIPT["e:free"] = [(200, OK, {})]
    HITS.clear()
    try: t.preguntar("k", "hola", modelos=["d:free", "e:free"], sleep=nosleep); ok = False
    except t.FatalError as e: ok = e.status == code and HITS == ["d:free"]
    check(f"{code} fatal sin reintento ni fallback", ok)
# 4) 503 persistente -> agota 3 intentos -> siguiente modelo
SCRIPT["f:free"] = [(503, err(503, "no provider"), {})]; SCRIPT["g:free"] = [(200, OK, {})]
HITS.clear(); r = t.preguntar("k", "hola", modelos=["f:free", "g:free"], sleep=nosleep)
check("503 x3 -> fallback", HITS == ["f:free"] * 3 + ["g:free"])
# 5) error dentro de un 200
SCRIPT["h:free"] = [(200, {"error": {"code": 502, "message": "upstream"}}, {}), (200, OK, {})]
HITS.clear(); r = t.preguntar("k", "hola", modelos=["h:free"], sleep=nosleep)
check("error dentro de 200 -> reintento", r == "respuesta simulada")
# 6) todos fallan -> RuntimeError
SCRIPT["i:free"] = [(404, err(404, "x"), {})]
try: t.preguntar("k", "hola", modelos=["i:free"], sleep=nosleep); ok = False
except RuntimeError: ok = True
check("todos fallan -> RuntimeError", ok)

# 7) mismo escenario 429->200 con la version Node
if subprocess.run(["node", "--version"], capture_output=True).returncode == 0:
    SCRIPT["n:free"] = [(429, err(429, "Rate limit exceeded"), {"Retry-After": "1"}), (200, OK, {})]
    HITS.clear()
    env = dict(os.environ, OPENROUTER_API_KEY="sk-or-v1-XXXXXXXX", OPENROUTER_MODEL="n:free")
    p = subprocess.run(["node", os.path.join(os.path.dirname(os.path.abspath(__file__)), "test_openrouter.js"), "hola"],
                       env=env, capture_output=True, text=True, timeout=30)
    check("node: 429 -> reintento -> 200", p.returncode == 0 and "respuesta simulada" in p.stdout and HITS == ["n:free", "n:free"])
print("RESULTADO:", "TODO OK" if not fallos else f"{fallos} fallos"); sys.exit(1 if fallos else 0)
