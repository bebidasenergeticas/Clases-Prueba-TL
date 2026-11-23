-- =============================================================================
-- 03 - PRUEBAS DE AISLAMIENTO RLS (positivas y negativas)
-- Script de psql (usa \set / \pset) para PostgreSQL local con la emulacion
-- _emulacion_supabase_SOLO_PARA_PRUEBAS_LOCALES.sql + 01 + 02.
-- NO esta pensado para pegarse tal cual en el SQL Editor de Supabase: alli la forma real
-- de comprobar es con dos sesiones reales (p. ej. dos usuarios anonimos) desde la app.
-- Suplantacion de identidad: "set role authenticated" + "request.jwt.claim.sub", el mismo
-- mecanismo que usan las pruebas de la propia documentacion de Supabase
-- (https://supabase.com/docs/guides/database/postgres/row-level-security, verificado 23/11/2026).
-- Usuarios de prueba: UUID inventados. Ningun dato real.
-- =============================================================================
\set ON_ERROR_STOP on
\pset tuples_only on
\pset format unaligned

-- ayudantes de prueba (esquema t, solo local): ver _helpers_pruebas.sql
\i _helpers_pruebas.sql

-- ---------- datos de arranque (como el rol postgres = SQL Editor) ----------
delete from auth.users where id in ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb');
insert into auth.users (id, email, is_anonymous) values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', null, true),    -- usuario A (anonimo)
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', null, true);    -- usuario B (anonimo)

\echo
\echo ===== BLOQUE 0: configuracion estatica (como postgres) =====
select t.expect_count('T00a las 5 tablas tienen RLS activado',
  $q$select count(*) from pg_class c join pg_namespace n on n.oid=c.relnamespace
     where n.nspname='public' and c.relname in ('conversations','messages','orders','order_items','reservations') and c.relrowsecurity$q$, 5);
select t.expect_count('T00b ninguna politica menciona al rol anon',
  $q$select count(*) from pg_policies where schemaname='public' and 'anon' = any(roles)$q$, 0);
select t.expect_count('T00c anon no tiene ningun privilegio de tabla en las 5 tablas',
  $q$select count(*) from unnest(array['conversations','messages','orders','order_items','reservations']) x
     where has_table_privilege('anon','public.'||x,'select,insert,update,delete')$q$, 0);
select t.expect_count('T00d authenticated no tiene UPDATE en ninguna tabla',
  $q$select count(*) from unnest(array['conversations','messages','orders','order_items','reservations']) x
     where has_table_privilege('authenticated','public.'||x,'update')$q$, 0);

\echo
\echo ===== BLOQUE 1: usuario A (rol authenticated, sub = A) - pruebas POSITIVAS =====
select set_config('request.jwt.claim.sub','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', false) \gset
set role authenticated;
select t.expect_affected('T01 A crea su conversacion (owner_id = auth.uid() por defecto)',
  $q$insert into public.conversations (id) values ('c0000000-0000-4000-8000-0000000000a1')$q$, 1);
select t.expect_affected('T02 A guarda 2 mensajes (usuario + asistente) en su conversacion',
  $q$insert into public.messages (conversation_id, role, body) values
     ('c0000000-0000-4000-8000-0000000000a1','user','Hola, quiero 10 tostadas de atun (DEMO)'),
     ('c0000000-0000-4000-8000-0000000000a1','assistant','Anotado como solicitud DEMO.')$q$, 2);
select t.expect_count('T03 A lee sus 2 mensajes', $q$select count(*) from public.messages$q$, 2);
select t.expect_count('T03b A lee su 1 conversacion', $q$select count(*) from public.conversations$q$, 1);
select t.expect_count('T04 el trigger actualizo updated_at (> created_at)',
  $q$select count(*) from public.conversations where updated_at > created_at$q$, 1);
select t.expect_affected('T05 A crea un pedido DEMO (estado por defecto solicitud_demo)',
  $q$insert into public.orders (id, conversation_id, total) values ('d0000000-0000-4000-8000-0000000000a1','c0000000-0000-4000-8000-0000000000a1', 450.00)$q$, 1);
select t.expect_affected('T06 A agrega un renglon a su pedido',
  $q$insert into public.order_items (order_id, producto, cantidad, precio_unitario) values ('d0000000-0000-4000-8000-0000000000a1','Tostada de atun (demo)', 10, 45.00)$q$, 1);
select t.expect_affected('T07 A crea una solicitud de reserva DEMO',
  $q$insert into public.reservations (id, personas, fecha, hora) values ('e0000000-0000-4000-8000-0000000000a1', 4, current_date + 7, '20:00')$q$, 1);
select t.expect_count('T07b A lee su pedido, su renglon y su reserva (3 filas)',
  $q$select (select count(*) from public.orders)+(select count(*) from public.order_items)+(select count(*) from public.reservations)$q$, 3);

\echo
\echo ===== BLOQUE 2: usuario A - restricciones (constraints) y reglas de politica =====
select t.expect_error('T08 pedido con estado confirmado desde el cliente -> bloqueado por RLS',
  $q$insert into public.orders (estado) values ('confirmado')$q$, '42501');
select t.expect_error('T09 reserva con estado confirmado desde el cliente -> bloqueada por RLS',
  $q$insert into public.reservations (personas, fecha, hora, estado) values (2, current_date+1, '19:00','confirmado')$q$, '42501');
select t.expect_error('T10 A intenta crear conversacion a nombre de B -> bloqueado (WITH CHECK)',
  $q$insert into public.conversations (owner_id) values ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb')$q$, '42501');
select t.expect_error('T11 total negativo -> CHECK',
  $q$insert into public.orders (total) values (-1)$q$, '23514');
select t.expect_error('T12a reserva con 0 personas -> CHECK',
  $q$insert into public.reservations (personas, fecha, hora) values (0, current_date+1, '19:00')$q$, '23514');
select t.expect_error('T12b reserva con 21 personas -> CHECK',
  $q$insert into public.reservations (personas, fecha, hora) values (21, current_date+1, '19:00')$q$, '23514');
select t.expect_error('T13a mensaje con rol admin -> CHECK',
  $q$insert into public.messages (conversation_id, role, body) values ('c0000000-0000-4000-8000-0000000000a1','admin','x')$q$, '23514');
select t.expect_error('T13b mensaje vacio -> CHECK',
  $q$insert into public.messages (conversation_id, role, body) values ('c0000000-0000-4000-8000-0000000000a1','user','')$q$, '23514');
select t.expect_error('T13c mensaje de 4001 caracteres -> CHECK',
  $q$insert into public.messages (conversation_id, role, body) values ('c0000000-0000-4000-8000-0000000000a1','user',repeat('x',4001))$q$, '23514');
select t.expect_error('T14 cantidad 0 en order_items -> CHECK',
  $q$insert into public.order_items (order_id, producto, cantidad, precio_unitario) values ('d0000000-0000-4000-8000-0000000000a1','x',0,1)$q$, '23514');
select t.expect_error('T15 A no puede hacer UPDATE (no hay grant) -> permission denied',
  $q$update public.orders set estado = 'confirmado'$q$, '42501');
select t.expect_error('T15b A no puede llamar a la funcion de purga (REVOKE) -> permission denied',
  $q$select public.purgar_conversaciones_antiguas(1)$q$, '42501');
reset role;

\echo
\echo ===== BLOQUE 3: usuario B (sub = B) - pruebas NEGATIVAS sobre los datos de A =====
select set_config('request.jwt.claim.sub','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', false) \gset
set role authenticated;
select t.expect_count('T20 B ve 0 conversaciones', $q$select count(*) from public.conversations$q$, 0);
select t.expect_count('T21 B ve 0 mensajes',       $q$select count(*) from public.messages$q$, 0);
select t.expect_count('T22 B ve 0 pedidos + 0 renglones + 0 reservas',
  $q$select (select count(*) from public.orders)+(select count(*) from public.order_items)+(select count(*) from public.reservations)$q$, 0);
select t.expect_count('T23 B pide por ID EXACTO la conversacion de A -> 0 filas (no filtra ni existencia)',
  $q$select count(*) from public.conversations where id = 'c0000000-0000-4000-8000-0000000000a1'$q$, 0);
select t.expect_error('T24 B inserta un mensaje en la conversacion de A -> bloqueado (WITH CHECK)',
  $q$insert into public.messages (conversation_id, role, body) values ('c0000000-0000-4000-8000-0000000000a1','user','intruso')$q$, '42501');
select t.expect_error('T25 B agrega renglon al pedido de A -> bloqueado',
  $q$insert into public.order_items (order_id, producto, cantidad, precio_unitario) values ('d0000000-0000-4000-8000-0000000000a1','intruso',1,1)$q$, '42501');
select t.expect_error('T26 B crea reserva a nombre de A -> bloqueado',
  $q$insert into public.reservations (owner_id, personas, fecha, hora) values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 2, current_date+1, '19:00')$q$, '42501');
select t.expect_affected('T27 B intenta BORRAR la conversacion de A -> 0 filas, SIN error (filtrado silencioso)',
  $q$delete from public.conversations where id = 'c0000000-0000-4000-8000-0000000000a1'$q$, 0);
select t.expect_affected('T28 B intenta BORRAR mensajes de A -> 0 filas, SIN error',
  $q$delete from public.messages where conversation_id = 'c0000000-0000-4000-8000-0000000000a1'$q$, 0);
select t.expect_affected('T29 B crea su propia conversacion (positiva)',
  $q$insert into public.conversations (id) values ('c0000000-0000-4000-8000-0000000000b1')$q$, 1);
select t.expect_affected('T30 B guarda un mensaje en SU conversacion (positiva)',
  $q$insert into public.messages (conversation_id, role, body) values ('c0000000-0000-4000-8000-0000000000b1','user','Hola desde B')$q$, 1);
select t.expect_count('T31 B ve solo SU mensaje (1)', $q$select count(*) from public.messages$q$, 1);
reset role;
select t.expect_count('T32 (como postgres) la conversacion de A sigue intacta con 2 mensajes',
  $q$select count(*) from public.messages where conversation_id='c0000000-0000-4000-8000-0000000000a1'$q$, 2);

\echo
\echo ===== BLOQUE 4: rol anon SIN sesion =====
select set_config('request.jwt.claim.sub','', false) \gset
set role anon;
select t.expect_count('T40a auth.uid() es NULL sin sesion', $q$select count(*) from (select auth.uid() u) s where u is null$q$, 1);
select t.expect_error('T40b anon SELECT conversations -> permission denied', $q$select * from public.conversations$q$, '42501');
select t.expect_error('T40c anon SELECT messages -> permission denied',      $q$select * from public.messages$q$, '42501');
select t.expect_error('T40d anon SELECT orders -> permission denied',        $q$select * from public.orders$q$, '42501');
select t.expect_error('T40e anon SELECT order_items -> permission denied',   $q$select * from public.order_items$q$, '42501');
select t.expect_error('T40f anon SELECT reservations -> permission denied',  $q$select * from public.reservations$q$, '42501');
select t.expect_error('T41 anon INSERT conversations -> permission denied',  $q$insert into public.conversations default values$q$, '42501');
select t.expect_error('T41b anon INSERT messages -> permission denied',
  $q$insert into public.messages (conversation_id, role, body) values ('c0000000-0000-4000-8000-0000000000a1','user','x')$q$, '42501');
reset role;
-- Defensa en profundidad: aunque alguien concediera SELECT a anon por error, RLS (sin politica para anon) devuelve 0 filas.
grant select on public.conversations to anon;
set role anon;
select t.expect_count('T42 anon CON grant accidental pero sin politica -> 0 filas (RLS sigue protegiendo)',
  $q$select count(*) from public.conversations$q$, 0);
reset role;
revoke select on public.conversations from anon;

\echo
\echo ===== BLOQUE 5: sesion caducada (rol authenticated con sub vacio -> auth.uid() NULL) =====
set role authenticated;
select t.expect_count('T43 authenticated sin sub ve 0 conversaciones (null = owner_id nunca es verdadero)',
  $q$select count(*) from public.conversations$q$, 0);
select t.expect_error('T44 authenticated sin sub no puede insertar (owner_id NULL; RLS WITH CHECK lo rechaza antes que NOT NULL)',
  $q$insert into public.conversations default values$q$, '42501');
reset role;

\echo
\echo ===== BLOQUE 6: service_role (secret key en backend) - por que es peligroso =====
set role service_role;
select t.expect_count('T50 service_role (BYPASSRLS) ve las 2 conversaciones de A y B',
  $q$select count(*) from public.conversations$q$, 2);
select t.expect_affected('T51 service_role confirma un pedido (unico camino a estado confirmado)',
  $q$update public.orders set estado='confirmado' where id='d0000000-0000-4000-8000-0000000000a1'$q$, 1);
select t.expect_count('T52 purga con 36500 dias no borra nada',
  $q$select public.purgar_conversaciones_antiguas(36500)$q$, 0);
reset role;
update public.conversations set updated_at = now() - interval '100 days' where id = 'c0000000-0000-4000-8000-0000000000b1';
set role service_role;
select t.expect_count('T53 purga de 90 dias borra la conversacion antigua de B (1)',
  $q$select public.purgar_conversaciones_antiguas(90)$q$, 1);
reset role;
select t.expect_count('T54 (como postgres) los mensajes de B se borraron en cascada',
  $q$select count(*) from public.messages where conversation_id='c0000000-0000-4000-8000-0000000000b1'$q$, 0);

\echo
\echo ===== BLOQUE 7: derecho a borrar (A borra su propia memoria) =====
select set_config('request.jwt.claim.sub','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', false) \gset
set role authenticated;
select t.expect_affected('T60 A borra su conversacion (positiva)',
  $q$delete from public.conversations where id = 'c0000000-0000-4000-8000-0000000000a1'$q$, 1);
select t.expect_count('T61 A ya no ve mensajes (borrado en cascada)', $q$select count(*) from public.messages$q$, 0);
reset role;
select t.expect_count('T62 (como postgres) el pedido de A sobrevive y su conversation_id quedo NULL (ON DELETE SET NULL)',
  $q$select count(*) from public.orders where id='d0000000-0000-4000-8000-0000000000a1' and conversation_id is null$q$, 1);

\echo
\echo ===== RESUMEN =====
select count(*) filter (where ok) || ' PASS / ' || count(*) filter (where not ok) || ' FAIL de ' || count(*) || ' pruebas' from t.results;
select 'FALLO: ' || label || ' -> ' || coalesce(detalle,'') from t.results where not ok order by n;
