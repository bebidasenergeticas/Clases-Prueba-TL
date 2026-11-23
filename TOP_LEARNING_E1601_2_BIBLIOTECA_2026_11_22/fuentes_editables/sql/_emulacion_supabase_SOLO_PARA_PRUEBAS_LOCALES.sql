-- =============================================================================
-- EMULACION MINIMA DE SUPABASE PARA PROBAR SQL EN POSTGRESQL LOCAL
-- NO EJECUTAR EN UN PROYECTO SUPABASE REAL (ya trae todo esto).
-- Fecha de elaboracion: 23/11/2026. Etiqueta: RECONSTRUCCION PEDAGOGICA (entorno de prueba).
--
-- Que emula (y solo esto):
--   * roles anon, authenticated, service_role (este ultimo con BYPASSRLS)
--   * schema auth con auth.users (minima), auth.uid() y auth.jwt()
--   * "privilegios por defecto" de proyectos existentes: todo concedido a los 3 roles
--     en tablas nuevas de public (ver https://supabase.com/docs/guides/api/securing-your-api#default-privileges
--     verificado 23/11/2026). Es el PEOR CASO: nuestros scripts deben quedar seguros igualmente.
-- Que NO emula: PostgREST, Auth real (GoTrue), JWT firmado, Realtime, Storage, pooler.
-- =============================================================================

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then
    create role anon nologin noinherit;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    create role authenticated nologin noinherit;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then
    create role service_role nologin noinherit bypassrls;
  end if;
end $$;

create schema if not exists auth;

create table if not exists auth.users (
  id           uuid primary key default gen_random_uuid(),
  email        text,
  is_anonymous boolean not null default false,
  created_at   timestamptz not null default now()
);

-- Misma logica que la funcion real: lee el claim "sub" del JWT que PostgREST publica
-- en la sesion (request.jwt.claim.sub o request.jwt.claims->>'sub'). Devuelve NULL sin sesion.
create or replace function auth.uid() returns uuid
language sql stable as $$
  select coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;

create or replace function auth.jwt() returns jsonb
language sql stable as $$
  select coalesce(
    nullif(current_setting('request.jwt.claims', true), ''),
    jsonb_build_object('sub', nullif(current_setting('request.jwt.claim.sub', true), ''))::text
  )::jsonb
$$;

grant usage on schema public to anon, authenticated, service_role;
grant usage on schema auth   to anon, authenticated, service_role;
grant execute on function auth.uid(), auth.jwt() to anon, authenticated, service_role;

-- Privilegios por defecto de un proyecto "existente" (peor caso, ver cabecera)
alter default privileges in schema public grant all on tables    to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema public grant execute on functions to anon, authenticated, service_role;
