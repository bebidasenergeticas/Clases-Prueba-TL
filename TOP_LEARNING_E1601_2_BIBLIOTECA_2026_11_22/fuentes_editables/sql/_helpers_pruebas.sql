-- Ayudantes de prueba compartidos (solo PostgreSQL local con psql). Ver 03_pruebas_aislamiento.sql
-- ---------- ayudantes de prueba (esquema t, solo local) ----------
drop schema if exists t cascade;
create schema t;
create table t.results (n serial primary key, ok boolean not null, label text not null, detalle text);
grant usage on schema t to anon, authenticated, service_role;
grant all on t.results to public;
grant usage on sequence t.results_n_seq to public;

-- Espera que la sentencia lance un error con ese SQLSTATE.
create function t.expect_error(label text, q text, expected_state text) returns text
language plpgsql as $$
declare st text; msg text;
begin
  begin
    execute q;
  exception when others then
    get stacked diagnostics st = returned_sqlstate, msg = message_text;
    insert into t.results(ok,label,detalle) values (st = expected_state, label, 'SQLSTATE '||st||' - '||msg);
    return (case when st = expected_state then 'PASS ' else 'FAIL ' end)||label||'  -> SQLSTATE '||st||' ('||msg||')';
  end;
  insert into t.results(ok,label,detalle) values (false, label, 'no hubo error');
  return 'FAIL '||label||'  -> la sentencia NO fallo (se esperaba '||expected_state||')';
end $$;

-- Espera que la sentencia termine sin error y afecte exactamente N filas.
create function t.expect_affected(label text, q text, expected bigint) returns text
language plpgsql as $$
declare n bigint;
begin
  execute q;
  get diagnostics n = row_count;
  insert into t.results(ok,label,detalle) values (n = expected, label, 'filas afectadas='||n);
  return (case when n = expected then 'PASS ' else 'FAIL ' end)||label||'  -> filas afectadas='||n||' (esperadas '||expected||')';
exception when others then
  insert into t.results(ok,label,detalle) values (false, label, SQLSTATE||' '||SQLERRM);
  return 'FAIL '||label||'  -> error inesperado '||SQLSTATE||' '||SQLERRM;
end $$;

-- Espera que un SELECT de un solo valor entero devuelva N.
create function t.expect_count(label text, q text, expected bigint) returns text
language plpgsql as $$
declare n bigint;
begin
  execute q into n;
  insert into t.results(ok,label,detalle) values (n = expected, label, 'valor='||n);
  return (case when n = expected then 'PASS ' else 'FAIL ' end)||label||'  -> valor='||n||' (esperado '||expected||')';
exception when others then
  insert into t.results(ok,label,detalle) values (false, label, SQLSTATE||' '||SQLERRM);
  return 'FAIL '||label||'  -> error inesperado '||SQLSTATE||' '||SQLERRM;
end $$;

