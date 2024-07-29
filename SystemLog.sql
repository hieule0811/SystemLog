
CREATE TABLE employees
(
    id SERIAL PRIMARY KEY,
    ten_tk VARCHAR(255) UNIQUE NOT NULL,
    mat_khau VARCHAR(255) NOT NULL,
    ten_dn VARCHAR(10) NOT NULL,
    birthdate DATE NOT NULL
)
CREATE TABLE clients
(
	id SERIAL PRIMARY KEY,
	code CHAR(6) UNIQUE NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	created_by VARCHAR(255) NOT NULL,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_by VARCHAR(255) NOT NULL,
	name TEXT NOT NULL,
	birthdate DATE NOT NULL,
	country TEXT NOT NULL,
	city TEXT NOT NULL,
	unloco TEXT NOT NULL,
	office_address TEXT NOT NULL,
	suburb TEXT NOT NULL,
	state TEXT NOT NULL,
	postal_code INT NOT NULL,
	email TEXT,
    telephone VARCHAR(20),
	status boolean NOT NULL
)
CREATE TABLE employees_clients(
    employee_id INT NOT NULL,
    client_id INT NOT NULL,
    PRIMARY KEY (employee_id, client_id),
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (client_id) REFERENCES clients(id)
)
CREATE TABLE activity_log(
    id SERIAL PRIMARY KEY,
    event_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255) NOT NULL,
    event_source VARCHAR(255) NOT NULL,
    source_code VARCHAR(255),
    event_type VARCHAR(255) NOT NULL,
    changed_data TEXT,
    data_old TEXT,
    data_new TEXT,
    client_id INT NOT NULL,
    CONSTRAINT fk_client_id FOREIGN KEY (client_id) REFERENCES clients(id)
)

CREATE OR REPLACE FUNCTION generate_random_code()
RETURNS TRIGGER AS $$
DECLARE
    code TEXT;
BEGIN
    SELECT substr(md5(random()::text), 1, 6) INTO code;
    NEW.code := upper(code);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER clients_trigger
    AFTER INSERT OR DELETE OR UPDATE
    ON clients
    FOR EACH ROW
    EXECUTE FUNCTION public.clients_trigger_function();

CREATE EXTENSION IF NOT EXISTS hstore WITH SCHEMA public;

CREATE OR REPLACE FUNCTION clients_trigger_function()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
	DECLARE
    changed_columns TEXT;
    old_data TEXT;
    new_data TEXT;
	temprow record;
	columnname TEXT;
    column_value TEXT;
BEGIN
    IF (TG_OP = 'DELETE') THEN
        changed_columns:='';
        old_data:='';
        new_data:='';
        FOR columnname, column_value IN SELECT key, value FROM each(hstore(OLD)) LOOP
		   if (column_value is null) then
			   old_data:=old_data||columnname||':'||'null'||', ';
			end if;
		   if (column_value is not null) then
		   		old_data:=old_data||columnname||':'||column_value||', ';
		   		changed_columns:=changed_columns||columnname||':'||column_value||', ';
			end if;
		END LOOP;
		changed_columns:=left(changed_columns, length(changed_columns) - 2);
		old_data:=left(old_data, length(old_data) - 2);
		insert into activity_log(event_time,created_by,event_source,source_code, event_type,changed_data,data_old,data_new,client_id)
		SELECT now(), user,'CLIENT',OLD.name,'DELETE',changed_columns,old_data,new_data,null;
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
		changed_columns:='';
		old_data:='';
        new_data:='';
        FOR temprow IN SELECT pre.key AS columnname, pre.value AS prevalue, post.value AS postvalue
				FROM jsonb_each(to_jsonb(OLD)) AS pre
				CROSS JOIN jsonb_each(to_jsonb(NEW)) AS post
				WHERE pre.key = post.key AND pre.value IS DISTINCT FROM post.value
		LOOP
				changed_columns:=changed_columns||temprow.columnname||':'||temprow.prevalue||'->'||temprow.postvalue||', ';
		END LOOP;
        changed_columns:=left(changed_columns, length(changed_columns) -2);
	    FOR columnname, column_value IN SELECT key, value FROM each(hstore(OLD)) LOOP
		   	if (column_value is null) then
		   		old_data:=old_data||columnname||':'||'null'||', ';
			else
				old_data:=old_data||columnname||':'||column_value||', ';
			end if;
		END LOOP;
		FOR columnname, column_value IN SELECT key, value FROM each(hstore(NEW)) LOOP
		   if (column_value is null) then
				new_data:=new_data||columnname||':'||'null'||', ';
			else
				new_data:=new_data||columnname||':'||column_value||', ';
			end if;
		END LOOP;
		old_data:=left(old_data, length(old_data) - 2);
		new_data:=left(new_data, length(new_data) - 2);
		insert into activity_log(event_time,created_by,event_source,source_code, event_type,changed_data,data_old,data_new,client_id)
		SELECT now(), user,'CLIENT',NEW.name,'UPDATE',changed_columns,old_data,new_data,NEW.id;
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
		changed_columns:='';
 	    old_data:='';
        new_data:='';
       	FOR columnname, column_value IN SELECT key, value FROM each(hstore(NEW)) LOOP
		   	if (column_value is not null) then
		   		changed_columns:=changed_columns||columnname||':'||column_value||', ';
				new_data:=new_data||columnname||':'||column_value||', ';
			else
				new_data:=new_data||columnname||':null'||', ';
			end if;

    	END LOOP;
        new_data:=left(new_data, length(new_data) - 2);
		changed_columns:=left(changed_columns, length(changed_columns) - 2);
		insert into activity_log(event_time,created_by,event_source,source_code, event_type,changed_data,data_old,data_new,client_id)
		SELECT now(), user,'CLIENT',NEW.name,'INSERT',changed_columns,old_data,new_data,NEW.id;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$BODY$;



$$ LANGUAGE plpgsql;
CREATE OR REPLACE TRIGGER clients_trigger
    BEFORE INSERT OR DELETE OR UPDATE
    ON clients
    FOR EACH ROW
    EXECUTE FUNCTION public.clients_trigger_function();

INSERT INTO clients (
    code,
    created_by,
    updated_by,
    name,
    birthdate,
    country,
    city,
    unloco,
    office_address,
    suburb,
    state,
    postal_code,
    email,
    telephone,
    status
) VALUES (
    'FEF123',
    'user1',
    'user1',
    'John Doe',
    '1990-01-01',
    'USA',
    'New York',
    'NY10001',
    '123 Main St',
    'Brooklyn',
    'NY',
    10001,
    'john.doe@example.com',
    '0397063806',
    TRUE
);
UPDATE clients
SET
    email = 'new.email@example.com',
    status = FALSE,
    updated_at = CURRENT_TIMESTAMP,
    updated_by = 'user2'
WHERE
    code = 'FEF123';
SELECT * FROM clients
SELECT * FROM activity_log


ALTER TABLE activity_log DROP CONSTRAINT fk_client_id;


ALTER TABLE activity_log ALTER COLUMN client_id DROP NOT NULL;


ALTER TABLE activity_log
ADD CONSTRAINT fk_client_id
FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL;

ALTER TABLE clients ALTER COLUMN updated_by DROP NOT NULL;

ALTER TABLE clients ALTER COLUMN updated_at DROP NOT NULL;


