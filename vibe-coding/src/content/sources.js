// Fuentes citadas. `status` indica cómo se verificó cada una al preparar la
// presentación (oct-2026): «primaria» = referencia proporcionada por Top Learning
// y contrastada por búsqueda; «búsqueda» = confirmada mediante varias fuentes
// coincidentes; consulte el README para el detalle.

export const SOURCES = [
  {
    id: 'karpathy',
    group: 'Origen del término',
    cite: 'Karpathy, A. (2 de febrero de 2025). Publicación en X que acuña «vibe coding».',
    url: 'https://x.com/karpathy/status/1886192184808149383',
  },
  {
    id: 'willison',
    group: 'Origen del término',
    cite: 'Willison, S. (19 de marzo de 2025). «Not all AI-assisted programming is vibe coding (but vibe coding rocks)».',
    url: 'https://simonwillison.net/2025/Mar/19/vibe-coding/',
  },
  {
    id: 'fowler',
    group: 'Origen del término',
    cite: 'Fowler, M. «Vibe Coding» (bliki). Uso adecuado y riesgos.',
    url: 'https://martinfowler.com/bliki/VibeCoding.html',
  },
  {
    id: 'collins',
    group: 'Origen del término',
    cite: 'Collins Dictionary. «vibe coding», palabra del año 2025 (anuncio del 6 de noviembre de 2025; cobertura de I Programmer).',
    url: 'https://www.i-programmer.info/news/85-humour-/18446-vibe-coding-is-collins-word-of-the-year-2025.html',
  },
  {
    id: 'vscode',
    group: 'Buenas prácticas y riesgos',
    cite: 'Microsoft. «Best practices for using AI in VS Code». Documentación de Visual Studio Code.',
    url: 'https://code.visualstudio.com/docs/agents/best-practices',
  },
  {
    id: 'spracklen',
    group: 'Buenas prácticas y riesgos',
    cite: 'Spracklen, J. et al. (2025). «We Have a Package for You! A Comprehensive Analysis of Package Hallucinations by Code Generating LLMs». USENIX Security Symposium.',
    url: 'https://www.usenix.org/conference/usenixsecurity25/presentation/spracklen',
  },
  {
    id: 'claude-code',
    group: 'Documentación de herramientas',
    cite: 'Anthropic. Claude Code — documentación.',
    url: 'https://code.claude.com/docs/en/overview',
  },
  {
    id: 'codex',
    group: 'Documentación de herramientas',
    cite: 'OpenAI. Codex — documentación.',
    url: 'https://developers.openai.com/codex',
  },
  {
    id: 'opencode',
    group: 'Documentación de herramientas',
    cite: 'OpenCode — documentación (proyecto de código abierto).',
    url: 'https://opencode.ai/docs',
  },
  {
    id: 'cursor',
    group: 'Documentación de herramientas',
    cite: 'Anysphere. Cursor — documentación.',
    url: 'https://docs.cursor.com',
  },
  {
    id: 'lovable',
    group: 'Documentación de herramientas',
    cite: 'Lovable — documentación.',
    url: 'https://docs.lovable.dev',
  },
  {
    id: 'bolt',
    group: 'Documentación de herramientas',
    cite: 'StackBlitz. Bolt — centro de soporte.',
    url: 'https://support.bolt.new',
  },
  {
    id: 'v0',
    group: 'Documentación de herramientas',
    cite: 'Vercel. v0 — documentación.',
    url: 'https://v0.app/docs',
  },
];

export const sourceById = Object.fromEntries(SOURCES.map((s) => [s.id, s]));
