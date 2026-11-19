# 02 Investigación técnica E1577 "Café Horizonte"

Fecha de consulta: 2026-11-19. Público: adultos principiantes, español de México.

## Aviso de verificación (leer primero)
En esta sesión la red bloqueó (error de resolución de nombre) docs.github.com, vercel.com, supabase.com, openrouter.ai y opencode.ai al intentar abrirlos. Solo funcionó una búsqueda web que devolvió un resumen de resultados oficiales de Vercel. Marcas usadas:
- **[Verificado parcial]**: confirmado por el resumen de búsqueda de hoy, no por lectura directa de la página.
- **[No verificado en esta sesión]**: conocimiento general estable; hay que confirmarlo en la doc oficial antes de publicarlo como dato vigente. No se incluyen precios, planes ni límites numéricos.
Para completar: permitir esos dominios en la red de la sesión y repetir la consulta.

## 1. GitHub
- **Qué es** [No verificado]: sitio web que guarda repositorios Git en la nube y permite colaborar (ramas, pull requests, issues).
- **Repositorio**: carpeta de proyecto con todo su historial de cambios.
- **Git vs GitHub**: Git es la herramienta local que lleva el historial; GitHub es un servicio en línea que aloja repositorios Git. Se puede usar Git sin GitHub.
- **GitHub CLI (`gh`)** [No verificado]: programa de terminal. Instalar según el sistema desde cli.github.com; iniciar sesión con `gh auth login` (pregunta cuenta, método y autoriza en navegador); crear repo con `gh repo create` (pide nombre y visibilidad).
- **Commit / push / branch**: commit = foto guardada de los cambios (`git commit`); push = subirla a GitHub (`git push`); branch = línea paralela de trabajo para probar sin tocar la principal.
- **Recuperar versiones**: ver historial con `git log`; volver sin borrar historial con `git revert <commit>`; los comandos que descartan cambios (`git reset --hard`) son destructivos y conviene evitarlos al inicio.
- **GitHub Pages** [No verificado hoy]: hospeda sitios estáticos (HTML, CSS, JavaScript que corre en el navegador). **No ejecuta un backend** como Express (Node en servidor), porque solo sirve archivos ya hechos. Para backend usar otro servicio (p. ej. Vercel).
- Seguridad: activar verificación en dos pasos en la cuenta (mencionado en clase como buena práctica).

## 2. Vercel
- **Qué es**: plataforma para publicar sitios y funciones de servidor desde un repositorio [Verificado parcial: sus docs tienen guías de frameworks y backends].
- **Desplegar / conectar repo** [No verificado]: importar el repositorio de GitHub en el panel de Vercel, o usar la CLI con el comando `vercel`. Cada push dispara un despliegue.
- **Vista previa vs producción** [No verificado]: los pushes a ramas distintas de la principal generan URLs de vista previa para probar; la rama de producción publica el sitio real.
- **Express en Vercel** [Verificado parcial, vía resumen de búsqueda]: la doc "Express on Vercel" indica que la app Express se convierte en una sola Vercel Function, con Fluid compute por defecto y sin configuración extra para un despliegue básico; Vercel detecta el archivo que exporta la app. La guía de backends recomienda guardar estado persistente en un almacén externo, no en memoria. Leer la página directa antes de enseñar pasos exactos.
- **Variables de entorno** [No verificado]: se configuran en el panel del proyecto (Settings) y no se suben al repositorio; tras cambiarlas hay que volver a desplegar.
- **Problemas típicos**: rutas que funcionan en local y fallan en producción; archivos escritos en disco (JSON, imágenes) no persisten entre ejecuciones, por eso se guardan en base de datos o Storage [coherente con la recomendación de estado externo, verificado parcial]; funciones con tiempo máximo (timeouts), cuyo valor depende del plan y no se cita aquí.

## 3. Supabase
Todo en esta sección: [No verificado en esta sesión].
- **Qué es**: servicio con base de datos PostgreSQL, autenticación, Storage y API automática.
- **Tablas / registros / relaciones**: tabla = hoja con columnas fijas; registro = una fila; relación = una columna que apunta al id de otra tabla (p. ej. pedidos.cliente_id).
- **Database vs Storage**: Database guarda datos estructurados (filas); Storage guarda archivos (imágenes, PDF).
- **Conectar**: librería `supabase-js` con la URL del proyecto y una clave.
- **Row Level Security (RLS)**: reglas por fila en PostgreSQL que deciden quién puede leer o escribir; con RLS activada y sin políticas, el acceso público queda bloqueado.
- **Claves**: pública (anon, hoy también llamada publishable) puede ir en el navegador solo si RLS protege las tablas. De servicio (service_role, hoy también llamada secret) se salta RLS: solo en servidor (variables de entorno), nunca en el navegador ni en GitHub. Confirmar nombres vigentes en supabase.com/docs/guides/api/api-keys.
- **Retención y borrado**: depende del plan y de la configuración del proyecto; no se afirma nada. Consultar la doc antes de prometer respaldos.

## 4. OpenRouter
Todo en esta sección: [No verificado en esta sesión].
- **API**: punto de entrada único a muchos modelos, con formato compatible con chat completions de OpenAI (cambia la URL base y la clave).
- **Claves**: se crean en el panel; puede existir límite de crédito por clave, confirmar en la doc.
- **Modelos gratuitos**: el id termina en `:free`; su disponibilidad cambia y tienen límites de uso; el modelo puede devolver contenido vacío o dejar de existir (la clase mostró que un modelo free respondía 200 con `content` vacío). Siempre probar el modelo antes y tener alternativa. No se citan cifras.
- **Errores comunes**: 401 clave inválida o ausente; 402 falta de crédito; 404 modelo inexistente o sin proveedor disponible; 429 demasiadas solicitudes (esperar y reintentar con pausa).

## 5. OpenCode
Todo en esta sección: [No verificado en esta sesión].
- **Qué es**: agente de programación con IA que corre en terminal, con modelos configurables (p. ej. vía OpenRouter).
- **AGENTS.md**: archivo en la raíz del proyecto con instrucciones persistentes para el agente (convenciones, comandos, reglas).
- **Modos Build y Plan**: Plan analiza y propone sin modificar archivos; Build puede editar y ejecutar. Confirmar nombres y comportamiento exactos en opencode.ai/docs.

## 6. Pagos (Stripe, PayPal, Mercado Pago)
Todo en esta sección: [No verificado en esta sesión].
- Las tres ofrecen modo de prueba o sandbox con claves de prueba distintas de las reales; usar siempre esas en la clase, nunca tarjetas reales.
- **Confirmar el pago** por webhook: la pasarela avisa a una URL de tu servidor cuando el pago cambia de estado; no confiar solo en que el navegador regresó a la página de "gracias".
- **Verificar la firma** del webhook con el secreto que da la pasarela, para rechazar avisos falsos.
- **Idempotencia**: guardar el id del evento o pedido para que un aviso repetido no cree dos pedidos ni dos cobros.
- Claves secretas solo en variables de entorno del servidor.

## 7. Arquitectura integrada
OpenCode (escribe y modifica el código en tu computadora) → GitHub (guarda el código y su historial) → Vercel (toma el repo, lo publica y corre el backend) → Supabase (base de datos y archivos persistentes) + OpenRouter (el servicio al que el backend llama para obtener respuestas de IA).
- No confundir: OpenCode no es hosting; GitHub no ejecuta la app; Vercel no es base de datos permanente; OpenRouter no guarda datos del negocio.
- GitHub Pages solo sirve sitios estáticos; si la app necesita backend (Express, claves secretas, webhooks), va en Vercel.
- Las claves (OpenRouter, service_role, pasarelas) viven en variables de entorno del backend, nunca en el código del navegador.

## 8. Recursos oficiales
| Recurso | URL | Consulta | Verificado |
|---|---|---|---|
| Express en Vercel | https://vercel.com/docs/frameworks/backend/express | 2026-11-19 | Sí, parcial (solo resumen de búsqueda; página bloqueada) |
| Backends en Vercel | https://vercel.com/docs/frameworks/backend | 2026-11-19 | Sí, parcial (resumen de búsqueda) |
| Guía Express en Vercel | https://vercel.com/guides/using-express-with-vercel | 2026-11-19 | Sí, parcial (resumen de búsqueda) |
| GitHub Pages | https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages | 2026-11-19 | No (bloqueado) |
| GitHub CLI | https://cli.github.com/manual/ | 2026-11-19 | No (no consultado) |
| Supabase API keys | https://supabase.com/docs/guides/api/api-keys | 2026-11-19 | No (bloqueado) |
| Supabase RLS | https://supabase.com/docs/guides/database/postgres/row-level-security | 2026-11-19 | No (no consultado) |
| OpenRouter FAQ | https://openrouter.ai/docs/faq | 2026-11-19 | No (bloqueado) |
| OpenCode reglas (AGENTS.md) | https://opencode.ai/docs/rules/ | 2026-11-19 | No (bloqueado) |
| Stripe webhooks | https://docs.stripe.com/webhooks | 2026-11-19 | No (no consultado) |
| PayPal desarrolladores | https://developer.paypal.com | 2026-11-19 | No (no consultado) |
| Mercado Pago México | https://www.mercadopago.com.mx/developers | 2026-11-19 | No (no consultado) |

---

## Anexo · Verificación directa del coordinador (2026-11-19)

Las páginas oficiales se leyeron con `curl` después de habilitar los dominios en la red de la sesión. Este anexo prevalece sobre las secciones anteriores marcadas como "no verificado".

| Tema | Lo que dice la documentación oficial | URL leída |
|---|---|---|
| GitHub Pages | Es un servicio de hosting de sitios **estáticos**: toma HTML, CSS y JavaScript de un repositorio y publica un sitio web. No ejecuta un backend Express. | https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages |
| GitHub CLI | `gh repo create [<name>] [flags]` crea un repositorio nuevo. Sin argumentos funciona en modo interactivo. | https://cli.github.com/manual/gh_repo_create |
| OpenCode · AGENTS.md | `AGENTS.md` da guía persistente del proyecto (comandos, arquitectura, convenciones, verificación). OpenCode carga el archivo global y cada `AGENTS.md` del directorio de trabajo hacia el directorio personal. Existe un respaldo hacia `CLAUDE.md`. | https://opencode.ai/docs/rules |
| OpenCode · agentes | *Build* es el agente principal por defecto. *Plan* explora y planifica sin editar archivos normales del proyecto; los comandos de shell siguen sujetos a permisos. Leer archivos de entorno sensibles pide aprobación. | https://opencode.ai/docs/agents |
| Supabase · claves | La clave se elige según dónde corre el código. Todo lo que se distribuye (navegador, app móvil, CLI, script) usa la clave **publishable**. La clave **secret** es "la llave maestra" y nunca sale del servidor. | https://supabase.com/docs/guides/api/api-keys |
| Supabase · RLS | Existe una guía oficial de Row Level Security para proteger filas por usuario. | https://supabase.com/docs/guides/database/postgres/row-level-security |
| OpenRouter · errores | Errores con estructura `{code, message, metadata.error_type}`. Están documentados 402 (sin créditos) y 429 (*rate limit*, con `Retry-After`), entre otros. | https://openrouter.ai/docs/api/reference/errors-and-debugging |
| OpenRouter · modelos gratuitos | Tienen límites propios (peticiones por minuto y por día), que dependen de si la cuenta compró créditos. Hay cabeceras `X-RateLimit-*`. **No se citan cifras**: cambian. | https://openrouter.ai/docs/api/reference/limits |
| Express en Vercel | Una app Express se convierte en **una sola Vercel Function** con Fluid compute por defecto. **`express.static()` se ignora**: los archivos estáticos van en `public/**` y se sirven desde la CDN. | https://vercel.com/docs/frameworks/backend/express |
| Webhooks de Stripe | La firma se verifica con el *payload* JSON, la cabecera `Stripe-Signature` y el secreto `whsec_…`. Se necesita el **cuerpo crudo** de la petición, sin modificar. Hay que responder 2xx rápido, antes de la lógica compleja. | https://docs.stripe.com/webhooks |

**Implicaciones para la guía:**
- Lo que el backend escribe en disco (PDF, CSV, memoria en archivos) no persiste en una función de Vercel. Para producción, la memoria va a Supabase y los archivos a Supabase Storage.
- La URL pública de GitHub Pages que se mostró en clase solo sirve el frontend.
- No se verificaron en esta pasada: los webhooks de PayPal y Mercado Pago. Consulta su documentación oficial antes de implementarlos.
