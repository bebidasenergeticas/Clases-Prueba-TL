-- =============================================================================
-- 00b - Prueba de aislamiento para la PRIMERA PRACTICA (solo conversations + messages)
-- Script de psql para PostgreSQL local con la emulacion + 00_primera_practica_simple.sql.
-- =============================================================================
\set ON_ERROR_STOP on
\pset tuples_only on
\pset format unaligned
\i _helpers_pruebas.sql

delete from auth.users where id in ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb');
insert into auth.users (id, is_anonymous) values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', true), ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', true);

select set_config('request.jwt.claim.sub','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', false) \gset
set role authenticated;
select t.expect_affected('S01 A crea conversacion', $q$insert into public.conversations (id) values ('c0000000-0000-4000-8000-0000000000a1')$q$, 1);
select t.expect_affected('S02 A guarda un mensaje', $q$insert into public.messages (conversation_id, role, body) values ('c0000000-0000-4000-8000-0000000000a1','user','Hola (DEMO)')$q$, 1);
select t.expect_count('S03 A lee 1 mensaje', $q$select count(*) from public.messages$q$, 1);
reset role;

select set_config('request.jwt.claim.sub','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', false) \gset
set role authenticated;
select t.expect_count('S10 B ve 0 mensajes', $q$select count(*) from public.messages$q$, 0);
select t.expect_count('S11 B ve 0 conversaciones', $q$select count(*) from public.conversations$q$, 0);
select t.expect_error('S12 B no puede escribir en la conversacion de A',
  $q$insert into public.messages (conversation_id, role, body) values ('c0000000-0000-4000-8000-0000000000a1','user','intruso')$q$, '42501');
reset role;

select set_config('request.jwt.claim.sub','', false) \gset
set role anon;
select t.expect_error('S20 anon sin sesion no puede leer', $q$select * from public.messages$q$, '42501');
reset role;

select count(*) filter (where ok) || ' PASS / ' || count(*) filter (where not ok) || ' FAIL de ' || count(*) || ' pruebas' from t.results;
select 'FALLO: ' || label || ' -> ' || coalesce(detalle,'') from t.results where not ok order by n;
