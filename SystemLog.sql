
CREATE TABLE employees
(
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    tentk VARCHAR(255) UNIQUE NOT NULL,
    matkhau VARCHAR(255) NOT NULL,
    phonenumber VARCHAR(20) NOT NULL
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

CREATE TRIGGER generate_random_code
    BEFORE INSERT
    ON clients
    FOR EACH ROW
    EXECUTE FUNCTION generate_random_code();

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

INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user2','user2','John Doe 2','1990-02-03', 'Canada', 'Quebec','QB23895','234 Main St','Montreal','Quebec',23895,'john.doe2@example.com','0397063102',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user3','user3','John Doe 3','1990-03-04', 'London', 'England','LD32589','345 Main St','Brent','London',32589,'john.doe3@example.com','0397063103',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user4','user4','John Doe 4','1990-04-05', 'USA', 'New York','NY10001','456 Main St','Brooklyn','NY',10001,'john.doe4@example.com','0397063104',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user5','user5','John Doe 5','1990-05-06', 'Canada', 'Quebec','QB23895','567 Main St','Montreal','Quebec',23895,'john.doe5@example.com','0397063105',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user6','user6','John Doe 6','1990-06-07', 'London', 'England','LD32589','678 Main St','Brent','London',32589,'john.doe6@example.com','0397063106',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user7','user7','John Doe 7','1990-07-08', 'USA', 'New York','NY10001','789 Main St','Brooklyn','NY',10001,'john.doe7@example.com','0397063107',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user8','user8','John Doe 8','1990-08-09', 'Canada', 'Quebec','QB23895','890 Main St','Montreal','Quebec',23895,'john.doe8@example.com','0397063108',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user9','user9','John Doe 9','1990-09-13', 'London', 'England','LD32589','901 Main St','Brent','London',32589,'john.doe9@example.com','0397063109',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user0','user0','John Doe 10','1990-01-02', 'USA', 'New York','NY10001','123 Main St','Brooklyn','NY',10001,'john.doe10@example.com','0397063110',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user1','user1','John Doe 11','1990-02-03', 'Canada', 'Quebec','QB23895','234 Main St','Montreal','Quebec',23895,'john.doe11@example.com','0397063111',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user2','user2','John Doe 12','1990-03-04', 'London', 'England','LD32589','345 Main St','Brent','London',32589,'john.doe12@example.com','0397063112',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user3','user3','John Doe 13','1990-04-05', 'USA', 'New York','NY10001','456 Main St','Brooklyn','NY',10001,'john.doe13@example.com','0397063113',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user4','user4','John Doe 14','1990-05-06', 'Canada', 'Quebec','QB23895','567 Main St','Montreal','Quebec',23895,'john.doe14@example.com','0397063114',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user5','user5','John Doe 15','1990-06-07', 'London', 'England','LD32589','678 Main St','Brent','London',32589,'john.doe15@example.com','0397063115',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user6','user6','John Doe 16','1990-07-08', 'USA', 'New York','NY10001','789 Main St','Brooklyn','NY',10001,'john.doe16@example.com','0397063116',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user7','user7','John Doe 17','1990-08-09', 'Canada', 'Quebec','QB23895','890 Main St','Montreal','Quebec',23895,'john.doe17@example.com','0397063117',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user8','user8','John Doe 18','1990-09-17', 'London', 'England','LD32589','901 Main St','Brent','London',32589,'john.doe18@example.com','0397063118',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user9','user9','John Doe 19','1990-04-01', 'USA', 'New York','NY10001','012 Main St','Brooklyn','NY',10001,'john.doe19@example.com','0397063119',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user0','user0','John Doe 20','1990-02-03', 'Canada', 'Quebec','QB23895','234 Main St','Montreal','Quebec',23895,'john.doe20@example.com','0397063120',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user1','user1','John Doe 21','1990-03-04', 'London', 'England','LD32589','345 Main St','Brent','London',32589,'john.doe21@example.com','0397063121',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user2','user2','John Doe 22','1990-04-05', 'USA', 'New York','NY10001','456 Main St','Brooklyn','NY',10001,'john.doe22@example.com','0397063122',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user3','user3','John Doe 23','1990-05-06', 'Canada', 'Quebec','QB23895','567 Main St','Montreal','Quebec',23895,'john.doe23@example.com','0397063123',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user4','user4','John Doe 24','1990-06-07', 'London', 'England','LD32589','678 Main St','Brent','London',32589,'john.doe24@example.com','0397063124',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user5','user5','John Doe 25','1990-07-08', 'USA', 'New York','NY10001','789 Main St','Brooklyn','NY',10001,'john.doe25@example.com','0397063125',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user6','user6','John Doe 26','1990-08-09', 'Canada', 'Quebec','QB23895','890 Main St','Montreal','Quebec',23895,'john.doe26@example.com','0397063126',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user7','user7','John Doe 27','1990-09-19', 'London', 'England','LD32589','901 Main St','Brent','London',32589,'john.doe27@example.com','0397063127',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user8','user8','John Doe 28','1990-12-01', 'USA', 'New York','NY10001','012 Main St','Brooklyn','NY',10001,'john.doe28@example.com','0397063128',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user9','user9','John Doe 29','1990-01-02', 'Canada', 'Quebec','QB23895','123 Main St','Montreal','Quebec',23895,'john.doe29@example.com','0397063129',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user0','user0','John Doe 30','1990-03-04', 'London', 'England','LD32589','345 Main St','Brent','London',32589,'john.doe30@example.com','0397063130',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user1','user1','John Doe 31','1990-04-05', 'USA', 'New York','NY10001','456 Main St','Brooklyn','NY',10001,'john.doe31@example.com','0397063131',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user2','user2','John Doe 32','1990-05-06', 'Canada', 'Quebec','QB23895','567 Main St','Montreal','Quebec',23895,'john.doe32@example.com','0397063132',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user3','user3','John Doe 33','1990-06-07', 'London', 'England','LD32589','678 Main St','Brent','London',32589,'john.doe33@example.com','0397063133',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user4','user4','John Doe 34','1990-07-08', 'USA', 'New York','NY10001','789 Main St','Brooklyn','NY',10001,'john.doe34@example.com','0397063134',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user5','user5','John Doe 35','1990-08-09', 'Canada', 'Quebec','QB23895','890 Main St','Montreal','Quebec',23895,'john.doe35@example.com','0397063135',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user6','user6','John Doe 36','1990-09-10', 'London', 'England','LD32589','901 Main St','Brent','London',32589,'john.doe36@example.com','0397063136',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user7','user7','John Doe 37','1990-11-01', 'USA', 'New York','NY10001','012 Main St','Brooklyn','NY',10001,'john.doe37@example.com','0397063137',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user8','user8','John Doe 38','1990-01-02', 'Canada', 'Quebec','QB23895','123 Main St','Montreal','Quebec',23895,'john.doe38@example.com','0397063138',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user9','user9','John Doe 39','1990-02-03', 'London', 'England','LD32589','234 Main St','Brent','London',32589,'john.doe39@example.com','0397063139',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user0','user0','John Doe 40','1990-04-05', 'USA', 'New York','NY10001','456 Main St','Brooklyn','NY',10001,'john.doe40@example.com','0397063140',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user1','user1','John Doe 41','1990-05-06', 'Canada', 'Quebec','QB23895','567 Main St','Montreal','Quebec',23895,'john.doe41@example.com','0397063141',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user2','user2','John Doe 42','1990-06-07', 'London', 'England','LD32589','678 Main St','Brent','London',32589,'john.doe42@example.com','0397063142',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user3','user3','John Doe 43','1990-07-08', 'USA', 'New York','NY10001','789 Main St','Brooklyn','NY',10001,'john.doe43@example.com','0397063143',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user4','user4','John Doe 44','1990-08-09', 'Canada', 'Quebec','QB23895','890 Main St','Montreal','Quebec',23895,'john.doe44@example.com','0397063144',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user5','user5','John Doe 45','1990-09-15', 'London', 'England','LD32589','901 Main St','Brent','London',32589,'john.doe45@example.com','0397063145',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user6','user6','John Doe 46','1990-06-01', 'USA', 'New York','NY10001','012 Main St','Brooklyn','NY',10001,'john.doe46@example.com','0397063146',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user7','user7','John Doe 47','1990-01-02', 'Canada', 'Quebec','QB23895','123 Main St','Montreal','Quebec',23895,'john.doe47@example.com','0397063147',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user8','user8','John Doe 48','1990-02-03', 'London', 'England','LD32589','234 Main St','Brent','London',32589,'john.doe48@example.com','0397063148',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user9','user9','John Doe 49','1990-03-04', 'USA', 'New York','NY10001','345 Main St','Brooklyn','NY',10001,'john.doe49@example.com','0397063149',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user0','user0','John Doe 50','1990-05-06', 'Canada', 'Quebec','QB23895','567 Main St','Montreal','Quebec',23895,'john.doe50@example.com','0397063150',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user1','user1','John Doe 51','1990-06-07', 'London', 'England','LD32589','678 Main St','Brent','London',32589,'john.doe51@example.com','0397063151',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user2','user2','John Doe 52','1990-07-08', 'USA', 'New York','NY10001','789 Main St','Brooklyn','NY',10001,'john.doe52@example.com','0397063152',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user3','user3','John Doe 53','1990-08-09', 'Canada', 'Quebec','QB23895','890 Main St','Montreal','Quebec',23895,'john.doe53@example.com','0397063153',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user4','user4','John Doe 54','1990-09-18', 'London', 'England','LD32589','901 Main St','Brent','London',32589,'john.doe54@example.com','0397063154',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user5','user5','John Doe 55','1990-03-01', 'USA', 'New York','NY10001','012 Main St','Brooklyn','NY',10001,'john.doe55@example.com','0397063155',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user6','user6','John Doe 56','1990-01-02', 'Canada', 'Quebec','QB23895','123 Main St','Montreal','Quebec',23895,'john.doe56@example.com','0397063156',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user7','user7','John Doe 57','1990-02-03', 'London', 'England','LD32589','234 Main St','Brent','London',32589,'john.doe57@example.com','0397063157',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user8','user8','John Doe 58','1990-03-04', 'USA', 'New York','NY10001','345 Main St','Brooklyn','NY',10001,'john.doe58@example.com','0397063158',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user9','user9','John Doe 59','1990-04-05', 'Canada', 'Quebec','QB23895','456 Main St','Montreal','Quebec',23895,'john.doe59@example.com','0397063159',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user0','user0','John Doe 60','1990-06-07', 'London', 'England','LD32589','678 Main St','Brent','London',32589,'john.doe60@example.com','0397063160',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user1','user1','John Doe 61','1990-07-08', 'USA', 'New York','NY10001','789 Main St','Brooklyn','NY',10001,'john.doe61@example.com','0397063161',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user2','user2','John Doe 62','1990-08-09', 'Canada', 'Quebec','QB23895','890 Main St','Montreal','Quebec',23895,'john.doe62@example.com','0397063162',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user3','user3','John Doe 63','1990-09-27', 'London', 'England','LD32589','901 Main St','Brent','London',32589,'john.doe63@example.com','0397063163',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user4','user4','John Doe 64','1990-04-01', 'USA', 'New York','NY10001','012 Main St','Brooklyn','NY',10001,'john.doe64@example.com','0397063164',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user5','user5','John Doe 65','1990-01-02', 'Canada', 'Quebec','QB23895','123 Main St','Montreal','Quebec',23895,'john.doe65@example.com','0397063165',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user6','user6','John Doe 66','1990-02-03', 'London', 'England','LD32589','234 Main St','Brent','London',32589,'john.doe66@example.com','0397063166',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user7','user7','John Doe 67','1990-03-04', 'USA', 'New York','NY10001','345 Main St','Brooklyn','NY',10001,'john.doe67@example.com','0397063167',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user8','user8','John Doe 68','1990-04-05', 'Canada', 'Quebec','QB23895','456 Main St','Montreal','Quebec',23895,'john.doe68@example.com','0397063168',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user9','user9','John Doe 69','1990-05-06', 'London', 'England','LD32589','567 Main St','Brent','London',32589,'john.doe69@example.com','0397063169',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user0','user0','John Doe 70','1990-07-08', 'USA', 'New York','NY10001','789 Main St','Brooklyn','NY',10001,'john.doe70@example.com','0397063170',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user1','user1','John Doe 71','1990-08-09', 'Canada', 'Quebec','QB23895','890 Main St','Montreal','Quebec',23895,'john.doe71@example.com','0397063171',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user2','user2','John Doe 72','1990-09-29', 'London', 'England','LD32589','901 Main St','Brent','London',32589,'john.doe72@example.com','0397063172',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user3','user3','John Doe 73','1990-12-01', 'USA', 'New York','NY10001','012 Main St','Brooklyn','NY',10001,'john.doe73@example.com','0397063173',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user4','user4','John Doe 74','1990-01-02', 'Canada', 'Quebec','QB23895','123 Main St','Montreal','Quebec',23895,'john.doe74@example.com','0397063174',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user5','user5','John Doe 75','1990-02-03', 'London', 'England','LD32589','234 Main St','Brent','London',32589,'john.doe75@example.com','0397063175',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user6','user6','John Doe 76','1990-03-04', 'USA', 'New York','NY10001','345 Main St','Brooklyn','NY',10001,'john.doe76@example.com','0397063176',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user7','user7','John Doe 77','1990-04-05', 'Canada', 'Quebec','QB23895','456 Main St','Montreal','Quebec',23895,'john.doe77@example.com','0397063177',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user8','user8','John Doe 78','1990-05-06', 'London', 'England','LD32589','567 Main St','Brent','London',32589,'john.doe78@example.com','0397063178',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user9','user9','John Doe 79','1990-06-07', 'USA', 'New York','NY10001','678 Main St','Brooklyn','NY',10001,'john.doe79@example.com','0397063179',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user0','user0','John Doe 80','1990-08-09', 'Canada', 'Quebec','QB23895','890 Main St','Montreal','Quebec',23895,'john.doe80@example.com','0397063180',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user1','user1','John Doe 81','1990-09-20', 'London', 'England','LD32589','901 Main St','Brent','London',32589,'john.doe81@example.com','0397063181',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user2','user2','John Doe 82','1990-11-01', 'USA', 'New York','NY10001','012 Main St','Brooklyn','NY',10001,'john.doe82@example.com','0397063182',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user3','user3','John Doe 83','1990-01-02', 'Canada', 'Quebec','QB23895','123 Main St','Montreal','Quebec',23895,'john.doe83@example.com','0397063183',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user4','user4','John Doe 84','1990-02-03', 'London', 'England','LD32589','234 Main St','Brent','London',32589,'john.doe84@example.com','0397063184',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user5','user5','John Doe 85','1990-03-04', 'USA', 'New York','NY10001','345 Main St','Brooklyn','NY',10001,'john.doe85@example.com','0397063185',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user6','user6','John Doe 86','1990-04-05', 'Canada', 'Quebec','QB23895','456 Main St','Montreal','Quebec',23895,'john.doe86@example.com','0397063186',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user7','user7','John Doe 87','1990-05-06', 'London', 'England','LD32589','567 Main St','Brent','London',32589,'john.doe87@example.com','0397063187',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user8','user8','John Doe 88','1990-06-07', 'USA', 'New York','NY10001','678 Main St','Brooklyn','NY',10001,'john.doe88@example.com','0397063188',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user9','user9','John Doe 89','1990-07-08', 'Canada', 'Quebec','QB23895','789 Main St','Montreal','Quebec',23895,'john.doe89@example.com','0397063189',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user0','user0','John Doe 90','1990-09-25', 'London', 'England','LD32589','901 Main St','Brent','London',32589,'john.doe90@example.com','0397063190',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user1','user1','John Doe 91','1990-06-01', 'USA', 'New York','NY10001','012 Main St','Brooklyn','NY',10001,'john.doe91@example.com','0397063191',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user2','user2','John Doe 92','1990-01-02', 'Canada', 'Quebec','QB23895','123 Main St','Montreal','Quebec',23895,'john.doe92@example.com','0397063192',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user3','user3','John Doe 93','1990-02-03', 'London', 'England','LD32589','234 Main St','Brent','London',32589,'john.doe93@example.com','0397063193',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user4','user4','John Doe 94','1990-03-04', 'USA', 'New York','NY10001','345 Main St','Brooklyn','NY',10001,'john.doe94@example.com','0397063194',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user5','user5','John Doe 95','1990-04-05', 'Canada', 'Quebec','QB23895','456 Main St','Montreal','Quebec',23895,'john.doe95@example.com','0397063195',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user6','user6','John Doe 96','1990-05-06', 'London', 'England','LD32589','567 Main St','Brent','London',32589,'john.doe96@example.com','0397063196',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user7','user7','John Doe 97','1990-06-07', 'USA', 'New York','NY10001','678 Main St','Brooklyn','NY',10001,'john.doe97@example.com','0397063197',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user8','user8','John Doe 98','1990-07-08', 'Canada', 'Quebec','QB23895','789 Main St','Montreal','Quebec',23895,'john.doe98@example.com','0397063198',FALSE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user9','user9','John Doe 99','1990-08-09', 'London', 'England','LD32589','890 Main St','Brent','London',32589,'john.doe99@example.com','0397063199',TRUE);
INSERT INTO clients (created_by, updated_by, name, birthdate, country, city, unloco, office_address, suburb, state, postal_code, email, telephone, status) VALUES ('user0','user0','John Doe 100','1990-08-01', 'USA', 'New York','NY10001','012 Main St','Brooklyn','NY',10001,'john.doe100@example.com','0397063200',FALSE);
INSERT INTO employees (email, tentk, matkhau, phonenumber) VALUES ('nha.quang@gmail.com', 'Quang Nha', 'quangnha', '0127472843');
INSERT INTO employees (email, tenTk, matKhau, phonenumber) VALUES ('linh.nhat@gmail.com', 'Nhat Linh', 'nhatlinh', '0247428532');
INSERT INTO employees (email, tenTk, matKhau, phonenumber) VALUES ('hieu.trung@gmail.com', 'Trung Hieu' ,'trunghieu', '0248742872');
