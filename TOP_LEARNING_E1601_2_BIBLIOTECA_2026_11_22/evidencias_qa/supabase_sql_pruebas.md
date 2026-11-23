# Evidencia: pruebas SQL de Supabase (PostgreSQL local con emulacion minima)

**Fecha de ejecucion:** 23/11/2026 · **Agente F** (investigador Supabase / arquitecto PostgreSQL) · Biblioteca E1601.2

## Alcance y limites honestos (leer primero)

| Que SI se probo | Que NO se probo (PENDIENTE DE COMPROBAR) |
|---|---|
| SQL de `00`, `01`, `02` ejecutado sin errores en **PostgreSQL 16.15 (Ubuntu 16.15-0ubuntu0.24.04.1) on x86_64-pc-linux-gnu, compiled by gcc (Ubuntu 13.3.0-6ubuntu2~24.04.1) 13.3.0, 64-bit** (instalado en el contenedor, cluster temporal). | Ejecucion en un proyecto **Supabase real** (SQL Editor, version de Postgres de produccion, Table Editor). No hubo cuenta ni sesion. |
| RLS, grants, CHECK, FK/cascada, trigger, funcion de purga con roles `anon`, `authenticated`, `service_role` creados a mano y suplantacion de identidad con `request.jwt.claim.sub` (el mismo mecanismo que usa la propia documentacion de Supabase en sus pruebas). | PostgREST/Data API real, GoTrue/Auth real, JWT firmados, Realtime, pooler. (No se ejecuto el binario de PostgREST: descargas de internet = datos no confiables segun reglas del encargo.) |
| `memoria.py`: 18 pruebas unitarias con cliente simulado + una prueba contra un servidor HTTP local de juguete usando **supabase-py 2.34.1** real (comprueba que el JWT viaja en `Authorization`). | Latencia real, pausa de proyecto, API logs, importacion CSV, anonymous sign-in real. |

La emulacion esta en `fuentes_editables/sql/_emulacion_supabase_SOLO_PARA_PRUEBAS_LOCALES.sql` (roles `anon`/`authenticated`/`service_role`, schema `auth` con `auth.users` minima, `auth.uid()` y `auth.jwt()`, y los *privilegios por defecto* de proyectos existentes: peor caso). **No debe ejecutarse en Supabase real.**

Los tests de `03` insertan usuarios en `auth.users` con `id` inventado; en un proyecto real `auth.users` tiene mas columnas y su insercion manual desde el SQL Editor **no fue verificada** (PENDIENTE DE COMPROBAR). La prueba real recomendada: dos sesiones anonimas distintas desde la app (ver guia).

### Transparencia sobre la primera ejecucion
La primera corrida de `03` dio **56 PASS / 1 FAIL**: la prueba T44 esperaba `23502` (NOT NULL) y Postgres devolvio `42501` (la politica WITH CHECK se evalua antes que NOT NULL). La expectativa estaba mal; se corrigio a `42501` y se documento en el propio test. No se tocaron SQL ni politicas para "hacer pasar" la prueba.

## Resumen de escenarios

| # | Escenario | Archivos | Resultado |
|---|---|---|---|
| E1 | Primera practica simple | emulacion + `00` + `00b_prueba_simple_aislamiento.sql` | **7 PASS / 0 FAIL** |
| E2 | Esquema completo, privilegios por defecto = TODO concedido a los 3 roles (peor caso, proyectos existentes) | emulacion + `01` + `02` + `03` | **57 PASS / 0 FAIL** |
| E3 | Idempotencia: `00` y luego `01`, `02`, `03` sobre las mismas tablas | emulacion + `00` + `01` + `02` + `03` | **57 PASS / 0 FAIL** |
| E4 | Sin grants automaticos (el nuevo comportamiento que la documentacion anuncia) | emulacion + `ALTER DEFAULT PRIVILEGES ... REVOKE` + `01`+`02`+`03` | **57 PASS / 0 FAIL** |
| E5 | **Control negativo (sabotaje):** `ALTER TABLE messages DISABLE ROW LEVEL SECURITY` + `GRANT SELECT, INSERT ... TO anon` | `01`+`02`, sabotaje, `03` | **49 PASS / 8 FAIL** (las pruebas SI detectan la fuga) |

## E1 - Primera practica (00 + 00b)

```
NOTICE:  database "supa_e1" does not exist, skipping
### psql -f _emulacion_supabase_SOLO_PARA_PRUEBAS_LOCALES.sql
CREATE FUNCTION
GRANT
### psql -f 00_primera_practica_simple.sql
CREATE INDEX
GRANT
psql:00_primera_practica_simple.sql:51: NOTICE:  policy "conversations_select_own" for relation "public.conversations" does not exist, skipping
psql:00_primera_practica_simple.sql:52: NOTICE:  policy "conversations_insert_own" for relation "public.conversations" does not exist, skipping
psql:00_primera_practica_simple.sql:53: NOTICE:  policy "conversations_delete_own" for relation "public.conversations" does not exist, skipping
CREATE POLICY
psql:00_primera_practica_simple.sql:61: NOTICE:  policy "messages_select_own" for relation "public.messages" does not exist, skipping
psql:00_primera_practica_simple.sql:62: NOTICE:  policy "messages_insert_own" for relation "public.messages" does not exist, skipping
psql:00_primera_practica_simple.sql:63: NOTICE:  policy "messages_delete_own" for relation "public.messages" does not exist, skipping
CREATE POLICY
   tablename   | rls_activado 
---------------+--------------
 conversations | t
 messages      | t
(2 rows)

### psql -f 00b_prueba_simple_aislamiento.sql
Output format is unaligned.
psql:_helpers_pruebas.sql:3: NOTICE:  schema "t" does not exist, skipping
GRANT
CREATE FUNCTION
SET
PASS S01 A crea conversacion  -> filas afectadas=1 (esperadas 1)
PASS S02 A guarda un mensaje  -> filas afectadas=1 (esperadas 1)
PASS S03 A lee 1 mensaje  -> valor=1 (esperado 1)
PASS S10 B ve 0 mensajes  -> valor=0 (esperado 0)
PASS S11 B ve 0 conversaciones  -> valor=0 (esperado 0)
PASS S12 B no puede escribir en la conversacion de A  -> SQLSTATE 42501 (new row violates row-level security policy for table "messages")
PASS S20 anon sin sesion no puede leer  -> SQLSTATE 42501 (permission denied for table messages)
7 PASS / 0 FAIL de 7 pruebas
```

## E2 - Salida completa de `03_pruebas_aislamiento.sql`

```
### psql -f 03_pruebas_aislamiento.sql
Output format is unaligned.
psql:_helpers_pruebas.sql:3: NOTICE:  schema "t" does not exist, skipping
GRANT
CREATE FUNCTION

===== BLOQUE 0: configuracion estatica (como postgres) =====
PASS T00a las 5 tablas tienen RLS activado  -> valor=5 (esperado 5)
PASS T00b ninguna politica menciona al rol anon  -> valor=0 (esperado 0)
PASS T00c anon no tiene ningun privilegio de tabla en las 5 tablas  -> valor=0 (esperado 0)
PASS T00d authenticated no tiene UPDATE en ninguna tabla  -> valor=0 (esperado 0)

===== BLOQUE 1: usuario A (rol authenticated, sub = A) - pruebas POSITIVAS =====
PASS T01 A crea su conversacion (owner_id = auth.uid() por defecto)  -> filas afectadas=1 (esperadas 1)
PASS T02 A guarda 2 mensajes (usuario + asistente) en su conversacion  -> filas afectadas=2 (esperadas 2)
PASS T03 A lee sus 2 mensajes  -> valor=2 (esperado 2)
PASS T03b A lee su 1 conversacion  -> valor=1 (esperado 1)
PASS T04 el trigger actualizo updated_at (> created_at)  -> valor=1 (esperado 1)
PASS T05 A crea un pedido DEMO (estado por defecto solicitud_demo)  -> filas afectadas=1 (esperadas 1)
PASS T06 A agrega un renglon a su pedido  -> filas afectadas=1 (esperadas 1)
PASS T07 A crea una solicitud de reserva DEMO  -> filas afectadas=1 (esperadas 1)
PASS T07b A lee su pedido, su renglon y su reserva (3 filas)  -> valor=3 (esperado 3)

===== BLOQUE 2: usuario A - restricciones (constraints) y reglas de politica =====
PASS T08 pedido con estado confirmado desde el cliente -> bloqueado por RLS  -> SQLSTATE 42501 (new row violates row-level security policy for table "orders")
PASS T09 reserva con estado confirmado desde el cliente -> bloqueada por RLS  -> SQLSTATE 42501 (new row violates row-level security policy for table "reservations")
PASS T10 A intenta crear conversacion a nombre de B -> bloqueado (WITH CHECK)  -> SQLSTATE 42501 (new row violates row-level security policy for table "conversations")
PASS T11 total negativo -> CHECK  -> SQLSTATE 23514 (new row for relation "orders" violates check constraint "orders_total_check")
PASS T12a reserva con 0 personas -> CHECK  -> SQLSTATE 23514 (new row for relation "reservations" violates check constraint "reservations_personas_check")
PASS T12b reserva con 21 personas -> CHECK  -> SQLSTATE 23514 (new row for relation "reservations" violates check constraint "reservations_personas_check")
PASS T13a mensaje con rol admin -> CHECK  -> SQLSTATE 23514 (new row for relation "messages" violates check constraint "messages_role_check")
PASS T13b mensaje vacio -> CHECK  -> SQLSTATE 23514 (new row for relation "messages" violates check constraint "messages_body_check")
PASS T13c mensaje de 4001 caracteres -> CHECK  -> SQLSTATE 23514 (new row for relation "messages" violates check constraint "messages_body_check")
PASS T14 cantidad 0 en order_items -> CHECK  -> SQLSTATE 23514 (new row for relation "order_items" violates check constraint "order_items_cantidad_check")
PASS T15 A no puede hacer UPDATE (no hay grant) -> permission denied  -> SQLSTATE 42501 (permission denied for table orders)
PASS T15b A no puede llamar a la funcion de purga (REVOKE) -> permission denied  -> SQLSTATE 42501 (permission denied for function purgar_conversaciones_antiguas)

===== BLOQUE 3: usuario B (sub = B) - pruebas NEGATIVAS sobre los datos de A =====
PASS T20 B ve 0 conversaciones  -> valor=0 (esperado 0)
PASS T21 B ve 0 mensajes  -> valor=0 (esperado 0)
PASS T22 B ve 0 pedidos + 0 renglones + 0 reservas  -> valor=0 (esperado 0)
PASS T23 B pide por ID EXACTO la conversacion de A -> 0 filas (no filtra ni existencia)  -> valor=0 (esperado 0)
PASS T24 B inserta un mensaje en la conversacion de A -> bloqueado (WITH CHECK)  -> SQLSTATE 42501 (new row violates row-level security policy for table "messages")
PASS T25 B agrega renglon al pedido de A -> bloqueado  -> SQLSTATE 42501 (new row violates row-level security policy for table "order_items")
PASS T26 B crea reserva a nombre de A -> bloqueado  -> SQLSTATE 42501 (new row violates row-level security policy for table "reservations")
PASS T27 B intenta BORRAR la conversacion de A -> 0 filas, SIN error (filtrado silencioso)  -> filas afectadas=0 (esperadas 0)
PASS T28 B intenta BORRAR mensajes de A -> 0 filas, SIN error  -> filas afectadas=0 (esperadas 0)
PASS T29 B crea su propia conversacion (positiva)  -> filas afectadas=1 (esperadas 1)
PASS T30 B guarda un mensaje en SU conversacion (positiva)  -> filas afectadas=1 (esperadas 1)
PASS T31 B ve solo SU mensaje (1)  -> valor=1 (esperado 1)
PASS T32 (como postgres) la conversacion de A sigue intacta con 2 mensajes  -> valor=2 (esperado 2)

===== BLOQUE 4: rol anon SIN sesion =====
PASS T40a auth.uid() es NULL sin sesion  -> valor=1 (esperado 1)
PASS T40b anon SELECT conversations -> permission denied  -> SQLSTATE 42501 (permission denied for table conversations)
PASS T40c anon SELECT messages -> permission denied  -> SQLSTATE 42501 (permission denied for table messages)
PASS T40d anon SELECT orders -> permission denied  -> SQLSTATE 42501 (permission denied for table orders)
PASS T40e anon SELECT order_items -> permission denied  -> SQLSTATE 42501 (permission denied for table order_items)
PASS T40f anon SELECT reservations -> permission denied  -> SQLSTATE 42501 (permission denied for table reservations)
PASS T41 anon INSERT conversations -> permission denied  -> SQLSTATE 42501 (permission denied for table conversations)
PASS T41b anon INSERT messages -> permission denied  -> SQLSTATE 42501 (permission denied for table messages)
PASS T42 anon CON grant accidental pero sin politica -> 0 filas (RLS sigue protegiendo)  -> valor=0 (esperado 0)

===== BLOQUE 5: sesion caducada (rol authenticated con sub vacio -> auth.uid() NULL) =====
PASS T43 authenticated sin sub ve 0 conversaciones (null = owner_id nunca es verdadero)  -> valor=0 (esperado 0)
PASS T44 authenticated sin sub no puede insertar (owner_id NULL; RLS WITH CHECK lo rechaza antes que NOT NULL)  -> SQLSTATE 42501 (new row violates row-level security policy for table "conversations")

===== BLOQUE 6: service_role (secret key en backend) - por que es peligroso =====
PASS T50 service_role (BYPASSRLS) ve las 2 conversaciones de A y B  -> valor=2 (esperado 2)
PASS T51 service_role confirma un pedido (unico camino a estado confirmado)  -> filas afectadas=1 (esperadas 1)
PASS T52 purga con 36500 dias no borra nada  -> valor=0 (esperado 0)
PASS T53 purga de 90 dias borra la conversacion antigua de B (1)  -> valor=1 (esperado 1)
PASS T54 (como postgres) los mensajes de B se borraron en cascada  -> valor=0 (esperado 0)

===== BLOQUE 7: derecho a borrar (A borra su propia memoria) =====
PASS T60 A borra su conversacion (positiva)  -> filas afectadas=1 (esperadas 1)
PASS T61 A ya no ve mensajes (borrado en cascada)  -> valor=0 (esperado 0)
PASS T62 (como postgres) el pedido de A sobrevive y su conversation_id quedo NULL (ON DELETE SET NULL)  -> valor=1 (esperado 1)

===== RESUMEN =====
57 PASS / 0 FAIL de 57 pruebas
```

## E3 - Idempotencia (00 -> 01 -> 02 -> 03)
```
as 1)
PASS T61 A ya no ve mensajes (borrado en cascada)  -> valor=0 (esperado 0)
PASS T62 (como postgres) el pedido de A sobrevive y su conversation_id quedo NULL (ON DELETE SET NULL)  -> valor=1 (esperado 1)

===== RESUMEN =====
57 PASS / 0 FAIL de 57 pruebas
```

## E4 - Sin privilegios automaticos
```
as 1)
PASS T61 A ya no ve mensajes (borrado en cascada)  -> valor=0 (esperado 0)
PASS T62 (como postgres) el pedido de A sobrevive y su conversation_id quedo NULL (ON DELETE SET NULL)  -> valor=1 (esperado 1)

===== RESUMEN =====
57 PASS / 0 FAIL de 57 pruebas
```

## E5 - Control negativo (RLS desactivado en `messages` + grant a `anon`): fallos esperados
```
FAIL T00a las 5 tablas tienen RLS activado  -> valor=4 (esperado 5)
FAIL T00c anon no tiene ningun privilegio de tabla en las 5 tablas  -> valor=1 (esperado 0)
FAIL T21 B ve 0 mensajes  -> valor=2 (esperado 0)
FAIL T24 B inserta un mensaje en la conversacion de A -> bloqueado (WITH CHECK)  -> la sentencia NO fallo (se esperaba 42501)
FAIL T28 B intenta BORRAR mensajes de A -> 0 filas, SIN error  -> filas afectadas=3 (esperadas 0)
FAIL T32 (como postgres) la conversacion de A sigue intacta con 2 mensajes  -> valor=0 (esperado 2)
FAIL T40c anon SELECT messages -> permission denied  -> la sentencia NO fallo (se esperaba 42501)
FAIL T41b anon INSERT messages -> permission denied  -> la sentencia NO fallo (se esperaba 42501)
49 PASS / 8 FAIL de 57 pruebas
FALLO: T00a las 5 tablas tienen RLS activado -> valor=4
FALLO: T00c anon no tiene ningun privilegio de tabla en las 5 tablas -> valor=1
FALLO: T21 B ve 0 mensajes -> valor=2
FALLO: T24 B inserta un mensaje en la conversacion de A -> bloqueado (WITH CHECK) -> no hubo error
FALLO: T28 B intenta BORRAR mensajes de A -> 0 filas, SIN error -> filas afectadas=3
FALLO: T32 (como postgres) la conversacion de A sigue intacta con 2 mensajes -> valor=0
FALLO: T40c anon SELECT messages -> permission denied -> no hubo error
FALLO: T41b anon INSERT messages -> permission denied -> no hubo error
```
Lectura: B ve mensajes ajenos (T21), puede insertar en conversacion ajena (T24), puede borrar mensajes ajenos (T28, T32) y `anon` lee/escribe (T40c, T41b). Es exactamente lo que ocurre si alguien "arregla" un error desactivando RLS: **no hacerlo**.

## Comprobaciones extra (ad hoc, mismo PostgreSQL)

1. **Politica RESTRICTIVE para exigir usuario permanente** (ejemplo opcional de `02`, forma de la doc de anonymous sign-ins): con `request.jwt.claims = {"sub": "...", "is_anonymous": false}` el `INSERT` en `orders` funciono; con `"is_anonymous": true` fallo con `ERROR: new row violates row-level security policy "orders_solo_permanentes" for table "orders"`.
2. **`(select auth.uid())` genera InitPlan** (EXPLAIN de `select * from messages order by created_at desc limit 20` como usuario con 2 000 mensajes): el plan muestra `InitPlan 4 (returns $4)` / `InitPlan 5 (returns $5)` y `Filter: (hashed SubPlan 6)`, es decir la llamada a `auth.uid()` no se evalua por fila. No se midio tiempo (volumen demasiado pequeno para ser significativo).
3. **Semantica de errores observada** (coincide con la tabla de la doc de RLS): grant faltante -> `42501 permission denied for table ...`; WITH CHECK violado en INSERT -> `42501 new row violates row-level security policy ...`; DELETE/SELECT filtrado por USING -> **0 filas sin error**; CHECK constraint -> `23514`. Nota importante: en INSERT el rechazo por RLS **si lanza error**; lo "silencioso" es el filtrado en SELECT/UPDATE/DELETE.

## Pruebas unitarias de `memoria.py`

Comando: `python -m unittest -v test_memoria` en `fuentes_editables/kit_referencia/supabase_memoria/` (Python 3.13, supabase-py 2.34.1; sin la libreria instalada la prueba 18 se omite y las otras 17 pasan).

```
test_clasificar_errores (test_memoria.TestMemoria.test_clasificar_errores) ... ok
test_cliente_admin_exige_secret (test_memoria.TestMemoria.test_cliente_admin_exige_secret) ... ok
test_cliente_usuario_exige_token (test_memoria.TestMemoria.test_cliente_usuario_exige_token) ... ok
test_config_faltante_nombra_variables_no_valores (test_memoria.TestMemoria.test_config_faltante_nombra_variables_no_valores) ... ok
test_config_repr_no_muestra_clave (test_memoria.TestMemoria.test_config_repr_no_muestra_clave) ... ok
test_construir_mensajes_descarta_system_y_recorta_por_caracteres (test_memoria.TestMemoria.test_construir_mensajes_descarta_system_y_recorta_por_caracteres) ... ok
test_crea_conversacion_y_la_reutiliza (test_memoria.TestMemoria.test_crea_conversacion_y_la_reutiliza) ... ok
test_escritura_sin_filas_devueltas_no_se_da_por_guardada (test_memoria.TestMemoria.test_escritura_sin_filas_devueltas_no_se_da_por_guardada) ... ok
test_guardar_en_conversacion_ajena_lanza_permiso (test_memoria.TestMemoria.test_guardar_en_conversacion_ajena_lanza_permiso) ... ok
test_guardar_turno_escribe_dos_filas (test_memoria.TestMemoria.test_guardar_turno_escribe_dos_filas) ... ok
test_id_ajeno_no_se_acepta_ni_se_revela (test_memoria.TestMemoria.test_id_ajeno_no_se_acepta_ni_se_revela) ... ok
test_mensaje_vacio_rechazado (test_memoria.TestMemoria.test_mensaje_vacio_rechazado) ... ok
test_reserva_demo_queda_en_solicitud_demo (test_memoria.TestMemoria.test_reserva_demo_queda_en_solicitud_demo) ... ok
test_responder_turno_guarda_y_recuerda (test_memoria.TestMemoria.test_responder_turno_guarda_y_recuerda) ... ok
test_si_el_modelo_falla_no_se_guarda_nada (test_memoria.TestMemoria.test_si_el_modelo_falla_no_se_guarda_nada) ... ok
test_sin_sesion_lanza_permiso (test_memoria.TestMemoria.test_sin_sesion_lanza_permiso) ... ok
test_ultimos_n_en_orden_cronologico (test_memoria.TestMemoria.test_ultimos_n_en_orden_cronologico) ... ok
test_el_jwt_del_usuario_viaja_en_authorization (test_memoria.TestSupabasePyReal.test_el_jwt_del_usuario_viaja_en_authorization) ... /usr/local/lib/python3.13/unittest/case.py:606: ResourceWarning: unclosed <socket.socket fd=3, family=2, type=1, proto=0, laddr=('127.0.0.1', 35999)>
  if method() is not None:
ResourceWarning: Enable tracemalloc to get the object allocation traceback
ok

----------------------------------------------------------------------
Ran 18 tests in 0.860s

OK
```

Hallazgo durante la prueba: `client.postgrest.auth(token)` de supabase-py 2.34.1 si cambia el encabezado enviado, pero no modifica `session.headers` del objeto ya construido; por robustez `memoria.py` fija el JWT al crear el cliente con `ClientOptions(headers={"Authorization": "Bearer <jwt>"})` y la prueba 18 verifica en el cable (servidor HTTP local) que viajan `Authorization: Bearer <jwt>` y `apikey: <publishable>`.

## Como reproducir
```bash
# PostgreSQL 16 local (cluster temporal), roles se crean con la emulacion
createdb supa_prueba
psql -d supa_prueba -v ON_ERROR_STOP=1 -f _emulacion_supabase_SOLO_PARA_PRUEBAS_LOCALES.sql
psql -d supa_prueba -v ON_ERROR_STOP=1 -f 01_schema_memoria.sql -f 02_rls_politicas.sql
psql -d supa_prueba -f 03_pruebas_aislamiento.sql      # desde la carpeta sql/ (usa \i _helpers_pruebas.sql)
```
