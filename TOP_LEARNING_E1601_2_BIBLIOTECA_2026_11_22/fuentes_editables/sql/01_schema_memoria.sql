-- =============================================================================
-- 01 - ESQUEMA COMPLETO: memoria de chat + pedidos y reservas DEMO
-- Puerto A&M (restaurante ficticio) - SIMULACION ACADEMICA - Top Learning E1601.2
-- Ejecutar en Supabase SQL Editor ANTES de 02_rls_politicas.sql.
-- Idempotente respecto a 00_primera_practica_simple.sql (usa IF NOT EXISTS).
--
-- Reglas de diseno:
--  * Todo dato de negocio es DEMO. Estado inicial 'solicitud_demo'. NO se procesa dinero.
--  * Un pedido o reserva "confirmado" solo existe cuando el BACKEND lo valida y lo escribe
--    (ver 02: el cliente solo puede crear filas 'solicitud_demo').
--  * No se piden DNI, tarjeta ni datos bancarios. Solo lo minimo para la demo.
--  * owner_id = quien (usuario de Supabase Auth, incluso anonimo) es dueno de la fila.
-- =============================================================================

-- ---------- Conversaciones y mensajes (memoria) ----------
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

create index if not exists conversations_owner_idx       on public.conversations (owner_id);
create index if not exists messages_conv_created_idx     on public.messages (conversation_id, created_at desc);

-- ---------- Pedidos DEMO ----------
create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  owner_id        uuid not null default auth.uid() references auth.users (id) on delete cascade,
  conversation_id uuid references public.conversations (id) on delete set null,
  estado          text not null default 'solicitud_demo'
                  check (estado in ('solicitud_demo', 'confirmado', 'cancelado')),
  total           numeric(10,2) not null default 0 check (total >= 0),
  created_at      timestamptz not null default now()
);

create table if not exists public.order_items (
  id              uuid primary key default gen_random_uuid(),
  order_id        uuid not null references public.orders (id) on delete cascade,
  producto        text not null check (char_length(producto) between 1 and 120),
  cantidad        integer not null check (cantidad between 1 and 100),
  precio_unitario numeric(10,2) not null check (precio_unitario >= 0),
  created_at      timestamptz not null default now()
);

-- ---------- Reservas DEMO ----------
create table if not exists public.reservations (
  id              uuid primary key default gen_random_uuid(),
  owner_id        uuid not null default auth.uid() references auth.users (id) on delete cascade,
  conversation_id uuid references public.conversations (id) on delete set null,
  personas        integer not null check (personas between 1 and 20),
  fecha           date not null,
  hora            time not null,
  notas           text check (notas is null or char_length(notas) <= 500),
  estado          text not null default 'solicitud_demo'
                  check (estado in ('solicitud_demo', 'confirmado', 'cancelado')),
  created_at      timestamptz not null default now()
);

-- ---------- Indices (las politicas RLS filtran por estas columnas) ----------
create index if not exists orders_owner_idx          on public.orders (owner_id, created_at desc);
create index if not exists order_items_order_idx     on public.order_items (order_id);
create index if not exists reservations_owner_idx    on public.reservations (owner_id, fecha);
create index if not exists orders_conversation_idx   on public.orders (conversation_id);
create index if not exists reservations_conv_idx     on public.reservations (conversation_id);

-- ---------- updated_at de la conversacion al llegar un mensaje ----------
-- SECURITY DEFINER + search_path vacio: el usuario no tiene permiso UPDATE sobre
-- conversations, pero el trigger si puede tocar updated_at. Sin EXECUTE para clientes.
create or replace function public.tg_touch_conversation() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  update public.conversations set updated_at = now() where id = new.conversation_id;
  return new;
end $$;
revoke all on function public.tg_touch_conversation() from public, anon, authenticated;

drop trigger if exists messages_touch_conversation on public.messages;
create trigger messages_touch_conversation
  after insert on public.messages
  for each row execute function public.tg_touch_conversation();

-- ---------- Retencion: funcion SOLO para servidor/administrador ----------
-- Borra conversaciones (y sus mensajes por ON DELETE CASCADE) sin actividad en N dias.
-- No es invocable por anon/authenticated (REVOKE). Programarla con pg_cron es OPCIONAL
-- y PENDIENTE DE COMPROBAR en la interfaz (docs: https://supabase.com/docs/guides/cron).
create or replace function public.purgar_conversaciones_antiguas(dias integer)
returns integer language plpgsql security invoker set search_path = '' as $$
declare n integer;
begin
  if dias is null or dias < 1 then
    raise exception 'dias debe ser >= 1';
  end if;
  delete from public.conversations
   where updated_at < now() - make_interval(days => dias);
  get diagnostics n = row_count;
  return n;
end $$;
revoke all on function public.purgar_conversaciones_antiguas(integer) from public, anon, authenticated;
grant execute on function public.purgar_conversaciones_antiguas(integer) to service_role;
