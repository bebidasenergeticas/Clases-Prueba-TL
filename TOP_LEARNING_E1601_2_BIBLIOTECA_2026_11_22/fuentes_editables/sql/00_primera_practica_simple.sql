-- =============================================================================
-- 00 - PRIMERA PRACTICA SIMPLE: memoria de chat (conversations + messages) + RLS
-- Puerto A&M (restaurante ficticio) - SIMULACION ACADEMICA - Top Learning E1601.2
-- Version didactica: SOLO 2 tablas. El esquema completo esta en 01/02 (se puede
-- ejecutar despues: 01 y 02 son idempotentes sobre estas mismas tablas).
--
-- DONDE EJECUTARLO: Supabase Dashboard > SQL Editor > New query > pegar > Run.
--   (Ruta de interfaz segun docs: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
--    verificado 23/11/2026. La interfaz puede variar.)
-- NO desactives RLS "para que funcione". Si algo falla, revisa grants y politicas.
-- Idea clave: cada fila tiene un owner_id; cada usuario solo ve filas con SU id.
-- Que identifica al usuario: Supabase Auth (incluye "Anonymous sign-ins", sin correo):
--   https://supabase.com/docs/guides/auth/auth-anonymous  (verificado 23/11/2026)
-- =============================================================================

-- 1) Tablas -------------------------------------------------------------------
create table if not exists public.conversations (
  id         uuid primary key default gen_random_uuid(),
  owner_id   uuid not null default auth.uid() references auth.users (id) on delete cascade,
  channel    text not null default 'web' check (char_length(channel) between 1 and 40),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  role            text not null check (role in ('user', 'assistant', 'system')),
  body            text not null check (char_length(body) between 1 and 4000),
  created_at      timestamptz not null default now()
);

create index if not exists conversations_owner_idx on public.conversations (owner_id);
create index if not exists messages_conv_created_idx on public.messages (conversation_id, created_at desc);

-- 2) Seguridad: activar RLS (obligatorio) --------------------------------------
alter table public.conversations enable row level security;
alter table public.messages      enable row level security;

-- 3) Privilegios minimos (grants) ----------------------------------------------
-- Un grant faltante da error 42501 "permission denied"; una politica que no
-- coincide devuelve 0 filas. Doc: https://supabase.com/docs/guides/api/securing-your-api#grants-and-rls
revoke all on table public.conversations, public.messages from anon, authenticated;
grant select, insert, delete on table public.conversations to authenticated;
grant select, insert, delete on table public.messages      to authenticated;
grant select, insert, update, delete on table public.conversations, public.messages to service_role;

-- 4) Politicas (una por operacion, solo para usuarios con sesion) ---------------
-- (select auth.uid()) en lugar de auth.uid(): se evalua una vez por consulta
-- (doc RLS, verificado 23/11/2026).
drop policy if exists conversations_select_own on public.conversations;
drop policy if exists conversations_insert_own on public.conversations;
drop policy if exists conversations_delete_own on public.conversations;
create policy conversations_select_own on public.conversations
  for select to authenticated using (owner_id = (select auth.uid()));
create policy conversations_insert_own on public.conversations
  for insert to authenticated with check (owner_id = (select auth.uid()));
create policy conversations_delete_own on public.conversations
  for delete to authenticated using (owner_id = (select auth.uid()));

drop policy if exists messages_select_own on public.messages;
drop policy if exists messages_insert_own on public.messages;
drop policy if exists messages_delete_own on public.messages;
create policy messages_select_own on public.messages
  for select to authenticated using (
    exists (select 1 from public.conversations c
            where c.id = messages.conversation_id and c.owner_id = (select auth.uid())));
create policy messages_insert_own on public.messages
  for insert to authenticated with check (
    exists (select 1 from public.conversations c
            where c.id = messages.conversation_id and c.owner_id = (select auth.uid())));
create policy messages_delete_own on public.messages
  for delete to authenticated using (
    exists (select 1 from public.conversations c
            where c.id = messages.conversation_id and c.owner_id = (select auth.uid())));

-- 5) Comprobacion visual (Table Editor muestra RLS activado; o esta consulta) ----
select tablename, rowsecurity as rls_activado
from pg_tables where schemaname = 'public' and tablename in ('conversations', 'messages')
order by tablename;
