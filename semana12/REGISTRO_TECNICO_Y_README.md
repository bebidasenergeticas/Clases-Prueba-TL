# Semana 12 · E1601.2 — Entregables

| Archivo | Contenido |
|---|---|
| `E1601_2_GUIA_MAESTRA_SEMANA_12_OPENCODE_CLAUDE_GITHUB.pdf` | Guía maestra para estudiantes (A4, 94 págs., 20 capítulos + Anexos B1/B2). |
| `fuente/` | Fuente editable: `capitulos/*.html`, `estilos.css`, `build.py` (compila), `render.js` (Chromium/Playwright), `prompts_originales/*.txt` (texto literal del chat). |
| `auditoria_prompts/01…05_*.md` | Trabajo del subagente PROMPT_AUDITOR_E1601: inventario literal, auditoría, prompts V1 y V2, trazabilidad. |
| `MATRIZ_DE_COBERTURA.md` | Tema → sección → página → fuente → prompt → estado. |

## Recompilar el PDF
```bash
cd semana12/fuente && pip install markdown && python3 build.py
```
Requiere Node + Playwright (Chromium), `pdftotext`/`pdfinfo` (poppler) y las fuentes Inter y JetBrains Mono.
Los Anexos B1/B2 se generan automáticamente desde `auditoria_prompts/03` y `04`: si editas esos .md, recompila.

## Registro de problemas técnicos y correcciones
1. **Marcadores del índice invisibles a pdftotext** (`width:0; overflow:hidden` los eliminaba): se cambiaron a texto transparente de 2 pt con posición absoluta.
2. **Página huérfana en la ficha** (caja suelta en la pág. 3): se reubicó la caja en la columna izquierda.
3. **Portada**: el gráfico orbital se encimaba con el título; se movió y redujo.
4. **Gráfica ROI/payback**: coordenadas recalculadas para que el cruce coincida con 7 meses (escenario B).
5. **Fidelidad de prompts**: los prompts originales se insertan desde `prompts_originales/*.txt`, extraídos programáticamente del chat; se comprobó que las transcripciones manuales de P01, P02, P06 y P07 eran idénticas.
6. **P11 cortado**: el primer mensaje mide exactamente 4 000 caracteres (probable límite del chat); se reproduce sin rellenar.

## Hallazgos técnicos relevantes (documentación consultada el 22-nov-2026)
- OpenCode: **GLM-5.3-Flash Free retirado el 18-nov-2026** y MiniMax M3.1 Flash Free el 17-nov-2026 (recomendados/mencionados en clase).
- GitHub Pages en cuentas Free solo en repositorios **públicos** (P11 pedía repo privado → conflicto con P12).
- `gh auth login --clipboard` existe; el código de dispositivo no llega por correo y caduca (~15 min).
- Cursor es de Anysphere (corrección a lo dicho en clase).

## No verificado
Enlaces github.io/web.app de la clase, Google Flow y console.x.ai (el proxy del entorno no permite esos dominios); precios mencionados en clase; periodo de restablecimiento del límite gratuito; presentación oficial (no proporcionada).

## Privacidad
El PDF y los .md usan solo roles («Profesor», «Estudiante N»). El prompt íntegro de Stilís (autoría estudiantil) se omitió del repositorio público; solo se analiza su estructura.
