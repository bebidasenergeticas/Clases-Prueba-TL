-- =============================================================================
-- 02 - RLS Y PERMISOS DE MINIMO PRIVILEGIO (ejecutar DESPUES de 01)
-- Puerto A&M (restaurante ficticio) - SIMULACION ACADEMICA - Top Learning E1601.2
--
-- Modelo: cada fila pertenece a un owner_id. El usuario (Supabase Auth, incluso
-- "anonymous sign-in") solo ve e inserta filas suyas. El rol 'anon' (sin sesion) NO
-- tiene ningun permiso. El BACKEND con secret key (rol service_role, BYPASSRLS) es el
-- unico que puede confirmar pedidos/reservas.
--
-- Referencias oficiales (verificado 23/11/2026):
--  RLS:     https://supabase.com/docs/guides/database/postgres/row-level-security
--  Grants:  https://supabase.com/docs/guides/api/securing-your-api#grants-and-rls
--  Anonimo: https://supabase.com/docs/guides/auth/auth-anonymous
--           (un usuario anonimo usa el rol 'authenticated'; NO es el rol 'anon')
--
-- NUNCA desactives RLS ("disable row level security") para arreglar un error.
-- =============================================================================

alter table public.conversations enable row level security;
alter table public.messages      enable row level security;
alter table public.orders        enable row level security;
alter table public.order_items   enable row level security;
alter table public.reservations  enable row level security;

-- ---------- Grants explicitos (no depender de los privilegios por defecto) ----------
revoke all on table public.conversations, public.messages, public.orders,
                    public.order_items, public.reservations
  from anon, authenticated;

grant select, insert, delete on table public.conversations to authenticated;  -- derecho a borrar su memoria
grant select, insert, delete on table public.messages      to authenticated;
grant select, insert         on table public.orders        to authenticated;  -- sin update/delete: lo gestiona el servidor
grant select, insert         on table public.order_items   to authenticated;
grant select, insert         on table public.reservations  to authenticated;

grant select, insert, update, delete on table public.conversations, public.messages,
      public.orders, public.order_items, public.reservations to service_role;

-- ---------- conversations ----------
drop policy if exists conversations_select_own on public.conversations;
drop policy if exists conversations_insert_own on public.conversations;
drop policy if exists conversations_delete_own on public.conversations;
create policy conversations_select_own on public.conversations
  for select to authenticated using (owner_id = (select auth.uid()));
create policy conversations_insert_own on public.conversations
  for insert to authenticated with check (owner_id = (select auth.uid()));
create policy conversations_delete_own on public.conversations
  for delete to authenticated using (owner_id = (select auth.uid()));

-- ---------- messages (acceso por JOIN a la conversacion del usuario) ----------
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

-- ---------- orders: el cliente solo crea SOLICITUDES DEMO propias ----------
drop policy if exists orders_select_own on public.orders;
drop policy if exists orders_insert_own on public.orders;
create policy orders_select_own on public.orders
  for select to authenticated using (owner_id = (select auth.uid()));
create policy orders_insert_own on public.orders
  for insert to authenticated with check (
    owner_id = (select auth.uid()) and estado = 'solicitud_demo');

-- ---------- order_items (por JOIN al pedido propio) ----------
drop policy if exists order_items_select_own on public.order_items;
drop policy if exists order_items_insert_own on public.order_items;
create policy order_items_select_own on public.order_items
  for select to authenticated using (
    exists (select 1 from public.orders o
            where o.id = order_items.order_id and o.owner_id = (select auth.uid())));
create policy order_items_insert_own on public.order_items
  for insert to authenticated with check (
    exists (select 1 from public.orders o
            where o.id = order_items.order_id and o.owner_id = (select auth.uid())
              and o.estado = 'solicitud_demo'));

-- ---------- reservations ----------
drop policy if exists reservations_select_own on public.reservations;
drop policy if exists reservations_insert_own on public.reservations;
create policy reservations_select_own on public.reservations
  for select to authenticated using (owner_id = (select auth.uid()));
create policy reservations_insert_own on public.reservations
  for insert to authenticated with check (
    owner_id = (select auth.uid()) and estado = 'solicitud_demo');

-- ---------- Verificacion rapida: RLS activo en todas las tablas ----------
select c.relname as tabla, c.relrowsecurity as rls_activado,
       (select count(*) from pg_policies p where p.schemaname = 'public' and p.tablename = c.relname) as politicas
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'r'
  and c.relname in ('conversations','messages','orders','order_items','reservations')
order by c.relname;

-- ---------- Nota sobre usuarios anonimos (Auth > "Anonymous sign-ins") ----------
-- Si activas el inicio de sesion anonimo, esos usuarios usan el rol 'authenticated' y
-- estas politicas les aplican igual: cada usuario anonimo ve SOLO sus filas. El usuario
-- anonimo pierde su cuenta si borra datos del navegador o cambia de dispositivo.
-- Para distinguirlos: (select (auth.jwt() ->> 'is_anonymous')::boolean). Ejemplo OPCIONAL,
-- no ejecutado por defecto: politica RESTRICTIVE que exija usuario permanente en orders.
--   create policy orders_solo_permanentes on public.orders as restrictive
--     for insert to authenticated
--     with check (coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false) = false);
