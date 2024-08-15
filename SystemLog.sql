--------------------------------- Database name : NewSystemLog ------------------------------------
CREATE TABLE employees
(
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    tentk VARCHAR(255) UNIQUE NOT NULL,
    matkhau VARCHAR(255) NOT NULL,
    phonenumber VARCHAR(20) NOT NULL
)
CREATE TABLE client
(
	id SERIAL PRIMARY KEY,
	code CHAR(6) UNIQUE NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	created_by VARCHAR(255) NOT NULL,
	updated_at TIMESTAMP,
	updated_by VARCHAR(255),
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
    FOREIGN KEY (client_id) REFERENCES client(id)
)
CREATE TABLE activity_log (
    id SERIAL PRIMARY KEY,
    event_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255) NOT NULL,
    event_source VARCHAR(255) NOT NULL,
    source_code VARCHAR(255),
    event_type VARCHAR(255) NOT NULL,
    changed_data TEXT,
    data_old TEXT,
    data_new TEXT,
    source_id INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS public.job_container (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP,
    updated_by VARCHAR(255),
    status BOOLEAN NOT NULL,
    container_number VARCHAR(255) NOT NULL UNIQUE,
    seal_number VARCHAR(255),
    description VARCHAR(255),
    tare NUMERIC(10,2),
    net NUMERIC(10,2),
    gross_weight NUMERIC(10,2),
    is_empty BOOLEAN,
    is_full BOOLEAN,
    container_invoice_status VARCHAR(255),
    is_overweight_level1 BOOLEAN,
    is_overweight_level2 BOOLEAN,
    level1_kg NUMERIC(10,2),
    level2_kg NUMERIC(10,2),
    title_level1 VARCHAR(255),
    title_level2 VARCHAR(255),
    standard_kg NUMERIC(10,2)
);

CREATE TABLE IF NOT EXISTS public.setting_logs (
    table_name VARCHAR(255) NOT NULL PRIMARY KEY,
    source_code_field VARCHAR(255) NOT NULL
);
INSERT INTO public.setting_logs (table_name, source_code_field)
VALUES
    ('client', 'name'),
    ('job_container', 'container_number');

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

CREATE TRIGGER generate_random_code
    BEFORE INSERT
    ON client
    FOR EACH ROW
    EXECUTE FUNCTION generate_random_code();

CREATE OR REPLACE FUNCTION public.f_create_triggers_for_tables(
	)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
        ROW_RES RECORD;
BEGIN
    FOR ROW_RES IN
    SELECT distinct table_name
    FROM information_schema.tables
    WHERE table_schema = 'public' and table_type = 'BASE TABLE'

    and table_name in
        ('client','job_container')
    LOOP

    EXECUTE format('CREATE OR REPLACE TRIGGER %s_log AFTER INSERT OR UPDATE OR DELETE ON %s
    FOR EACH ROW EXECUTE FUNCTION f_audit_trigger_parents();', ROW_RES.table_name, ROW_RES.table_name);
  END LOOP;
END;
$BODY$;




CREATE EXTENSION IF NOT EXISTS hstore WITH SCHEMA public;

CREATE OR REPLACE FUNCTION public.f_audit_trigger_parents()
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
	source_code VARCHAR(255);
	event_source VARCHAR(255);
    sql_query VARCHAR(255);
BEGIN

    SELECT source_code_field INTO source_code
    FROM setting_logs
    WHERE table_name = TG_TABLE_NAME;

	event_source := replace(upper(TG_TABLE_NAME), '_', ' ');

    sql_query := format('SELECT %I FROM %I WHERE id = $1', source_code, TG_TABLE_NAME);

    IF (TG_OP = 'DELETE') THEN
        changed_columns := '';
        old_data := '';
        new_data := '';
        FOR columnname, column_value IN SELECT key, value FROM each(hstore(OLD)) LOOP
            IF (column_value IS NULL) THEN
                old_data := old_data || columnname || ':' || 'null' || ', ';
            ELSE
                old_data := old_data || columnname || ':' || column_value || ', ';
                changed_columns := changed_columns || columnname || ':' || column_value || ', ';
            END IF;
        END LOOP;
        changed_columns := left(changed_columns, length(changed_columns) - 2);
        old_data := left(old_data, length(old_data) - 2);

        EXECUTE sql_query INTO source_code USING OLD.id;
        INSERT INTO activity_log(event_time, created_by, event_source, source_code, event_type, changed_data, data_old, data_new, source_id)
        VALUES (now(), COALESCE(OLD.updated_by, 'default_user'), event_source, source_code, 'DELETE', changed_columns, old_data, new_data, OLD.id);

        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        changed_columns := '';
        old_data := '';
        new_data := '';
        FOR temprow IN SELECT pre.key AS columnname, pre.value AS prevalue, post.value AS postvalue
					FROM jsonb_each(to_jsonb(OLD)) AS pre
					CROSS JOIN jsonb_each(to_jsonb(NEW)) AS post
					WHERE pre.key = post.key AND pre.value IS DISTINCT FROM post.value
        LOOP
            changed_columns := changed_columns || temprow.columnname || ':' || temprow.prevalue || '->' || temprow.postvalue || ', ';
        END LOOP;
        changed_columns := left(changed_columns, length(changed_columns) - 2);

        FOR columnname, column_value IN SELECT key, value FROM each(hstore(OLD)) LOOP
            IF (column_value IS NULL) THEN
                old_data := old_data || columnname || ':' || 'null' || ', ';
            ELSE
                old_data := old_data || columnname || ':' || column_value || ', ';
            END IF;
        END LOOP;

        FOR columnname, column_value IN SELECT key, value FROM each(hstore(NEW)) LOOP
            IF (column_value IS NULL) THEN
                new_data := new_data || columnname || ':' || 'null' || ', ';
            ELSE
                new_data := new_data || columnname || ':' || column_value || ', ';
            END IF;
        END LOOP;

        old_data := left(old_data, length(old_data) - 2);
        new_data := left(new_data, length(new_data) - 2);

        EXECUTE sql_query INTO source_code USING NEW.id;
        INSERT INTO activity_log(event_time, created_by, event_source, source_code, event_type, changed_data, data_old, data_new, source_id)
        VALUES (now(), NEW.updated_by, event_source, source_code, 'UPDATE', changed_columns, old_data, new_data, NEW.id);

        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        changed_columns := '';
        old_data := '';
        new_data := '';
        FOR columnname, column_value IN SELECT key, value FROM each(hstore(NEW)) LOOP
            IF (column_value IS NOT NULL) THEN
                changed_columns := changed_columns || columnname || ':' || column_value || ', ';
                new_data := new_data || columnname || ':' || column_value || ', ';
            ELSE
                new_data := new_data || columnname || ':null' || ', ';
            END IF;
        END LOOP;
        new_data := left(new_data, length(new_data) - 2);
        changed_columns := left(changed_columns, length(changed_columns) - 2);

        EXECUTE sql_query INTO source_code USING NEW.id;
        INSERT INTO activity_log(event_time, created_by, event_source, source_code, event_type, changed_data, data_old, data_new, source_id)
        VALUES (now(), NEW.created_by, event_source, source_code, 'INSERT', changed_columns, old_data, new_data, NEW.id);

        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$BODY$;

SELECT public.f_create_triggers_for_tables();

CREATE OR REPLACE FUNCTION generate_container_number()
RETURNS TRIGGER AS $$
DECLARE
    container_number TEXT;
BEGIN
    -- Generate a 4-digit random number and prepend 'CN'
    container_number := 'CN' || lpad((floor(random() * 10000)::int)::text, 4, '0');
    NEW.container_number := container_number;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger to use the above function
CREATE TRIGGER generate_container_number
    BEFORE INSERT
    ON job_container
    FOR EACH ROW
    EXECUTE FUNCTION generate_container_number();


CREATE OR REPLACE FUNCTION generate_seal_number()
RETURNS TRIGGER AS $$
DECLARE
    seal_number TEXT;
BEGIN
    -- Generate a 4-digit random number and prepend 'CN'
    seal_number := 'SN' || lpad((floor(random() * 10000)::int)::text, 4, '0');
    NEW.seal_number := seal_number;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger to use the above function
CREATE TRIGGER generate_seal_number
    BEFORE INSERT
    ON job_container
    FOR EACH ROW
    EXECUTE FUNCTION generate_seal_number();

INSERT INTO employees (email, tentk, matkhau, phonenumber) VALUES ('nha.quang@gmail.com', 'Quang Nha', 'quangnha', '0127472843');
INSERT INTO employees (email, tenTk, matKhau, phonenumber) VALUES ('linh.nhat@gmail.com', 'Nhat Linh', 'nhatlinh', '0247428532');
INSERT INTO employees (email, tenTk, matKhau, phonenumber) VALUES ('hieu.trung@gmail.com', 'Trung Hieu' ,'trunghieu', '0248742872');

INSERT INTO client (created_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status)
VALUES
    ('admin', 'John Doe', '1980-01-01', 'USA', 'New York', 'USNYC', '123 Main St', 'Manhattan', 'NY', 10001, 'john.doe@example.com', '123-456-7890', true),
    ('admin', 'Jane Smith', '1990-05-15', 'USA', 'Los Angeles', 'USLAX', '456 Elm St', 'Hollywood', 'CA', 90001, 'jane.smith@example.com', '987-654-3210', false),
    ('admin', 'Alice Johnson', '1985-07-22', 'USA', 'Chicago', 'USCHI', '789 Oak St', 'Lincoln Park', 'IL', 60614, 'alice.johnson@example.com', '555-123-4567', true),
    ('admin', 'Bob Brown', '1978-11-30', 'USA', 'Houston', 'USHOU', '101 Pine St', 'Downtown', 'TX', 77001, 'bob.brown@example.com', '555-234-5678', false),
    ('admin', 'Carol Davis', '1992-09-09', 'USA', 'Phoenix', 'USPHX', '202 Cedar St', 'Camelback', 'AZ', 85001, 'carol.davis@example.com', '555-345-6789', true),
    ('admin', 'David Evans', '1987-03-17', 'USA', 'Philadelphia', 'USPHI', '303 Maple St', 'Center City', 'PA', 19103, 'david.evans@example.com', '555-456-7890', false),
    ('admin', 'Emily White', '1995-12-05', 'USA', 'San Antonio', 'USSA', '404 Birch St', 'Alamo Heights', 'TX', 78201, 'emily.white@example.com', '555-567-8901', true),
    ('admin', 'Frank Harris', '1982-08-14', 'USA', 'San Diego', 'USSD', '505 Spruce St', 'La Jolla', 'CA', 92101, 'frank.harris@example.com', '555-678-9012', false),
    ('admin', 'Grace Lewis', '1989-04-23', 'USA', 'Dallas', 'USDAL', '606 Willow St', 'Uptown', 'TX', 75201, 'grace.lewis@example.com', '555-789-0123', true),
    ('admin', 'Henry Clark', '1975-10-30', 'USA', 'San Jose', 'USSJ', '707 Palm St', 'Downtown', 'CA', 95101, 'henry.clark@example.com', '555-890-1234', false),
    ('admin', 'Ivy Lee', '1991-02-19', 'USA', 'Austin', 'USAUS', '808 Redwood St', 'South Austin', 'TX', 73301, 'ivy.lee@example.com', '555-901-2345', true),
    ('admin', 'Jack Walker', '1986-06-25', 'USA', 'Jacksonville', 'USJAC', '909 Fir St', 'Downtown', 'FL', 32201, 'jack.walker@example.com', '555-012-3456', false),
    ('admin', 'Kathy Hall', '1984-07-30', 'USA', 'San Francisco', 'USSF', '1010 Chestnut St', 'Nob Hill', 'CA', 94101, 'kathy.hall@example.com', '555-123-4568', true),
    ('admin', 'Larry King', '1979-12-12', 'USA', 'Columbus', 'USCOL', '1111 Oakwood Ave', 'West Side', 'OH', 43201, 'larry.king@example.com', '555-234-5679', false),
    ('admin', 'Mona Scott', '1993-05-09', 'USA', 'Indianapolis', 'USIND', '1212 Pine St', 'Broad Ripple', 'IN', 46201, 'mona.scott@example.com', '555-345-6780', true),
    ('admin', 'Nina Adams', '1990-11-17', 'USA', 'Charlotte', 'USCHA', '1313 Elm St', 'Dilworth', 'NC', 28201, 'nina.adams@example.com', '555-456-7891', false),
    ('admin', 'Oscar Nelson', '1987-04-14', 'USA', 'Seattle', 'USSEA', '1414 Birch St', 'Capitol Hill', 'WA', 98101, 'oscar.nelson@example.com', '555-567-8902', true),
    ('admin', 'Paula Carter', '1988-09-25', 'USA', 'Denver', 'USDEN', '1515 Maple St', 'LoDo', 'CO', 80201, 'paula.carter@example.com', '555-678-9013', false),
    ('admin', 'Quincy Green', '1992-06-30', 'USA', 'Washington', 'USWAS', '1616 Cedar St', 'Capitol Hill', 'DC', 20001, 'quincy.green@example.com', '555-789-0124', true),
    ('admin', 'Rita Perez', '1981-01-20', 'USA', 'Boston', 'USBO', '1717 Spruce St', 'Back Bay', 'MA', 02101, 'rita.perez@example.com', '555-890-1235', false),
    ('admin', 'Steve Mitchell', '1976-10-05', 'USA', 'El Paso', 'USELP', '1818 Willow St', 'Central', 'TX', 79901, 'steve.mitchell@example.com', '555-901-2346', true);

UPDATE client
SET
    name = 'Johnathan Doe',
	updated_by = 'Hiu',
    birthdate = '1981-01-01',
    country = 'USA',
    city = 'New York',
    unloco = 'USNYC',
    office_address = '124 Main St',
    suburb = 'Manhattan',
    state = 'NY',
    postal_code = 10002,
    email = 'johnathan.doe@example.com',
    telephone = '123-456-7891',
    status = false
WHERE name = 'John Doe';

INSERT INTO public.job_container (
    created_by, status, description, tare, net, gross_weight,
    is_empty, is_full, container_invoice_status, is_overweight_level1, is_overweight_level2,
    level1_kg, level2_kg, title_level1, title_level2, standard_kg
)
VALUES
    ('admin', true, 'Container for electronics', 100.00, 200.00, 300.00,
     true, true, 'Pending', true, true, 50.00, 75.00, 'Level 1 Title', 'Level 2 Title', 150.00),

    ('admin', true, 'Container for clothing', 150.00, 250.00, 400.00,
     false, true, 'Completed', true, false, 60.00, 80.00, 'Level 1 Title', 'Level 2 Title', 160.00),

    ('admin', false, 'Container for furniture', 200.00, 300.00, 500.00,
     true, false, 'Shipped', false, true, 70.00, 90.00, 'Level 1 Title', 'Level 2 Title', 170.00),

    ('admin', true, 'Container for machinery', 120.00, 220.00, 340.00,
     false, true, 'In Transit', true, true, 80.00, 100.00, 'Level 1 Title', 'Level 2 Title', 180.00),

    ('admin', false, 'Container for food products', 130.00, 230.00, 360.00,
     true, false, 'Delivered', false, false, 90.00, 110.00, 'Level 1 Title', 'Level 2 Title', 190.00);

UPDATE public.job_container
SET
	updated_by = 'Hiu',
    status = false,
    description = 'Updated description for container'
WHERE id = 1;

SELECT * FROM employees
SELECT * FROM client
SELECT * FROM job_container
SELECT * FROM activity_log
SELECT * FROM setting_logs
