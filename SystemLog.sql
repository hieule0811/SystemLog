
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
		SELECT now(), OLD.updated_by,'CLIENT',OLD.name,'DELETE',changed_columns,old_data,new_data,null;
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
		SELECT now(), NEW.updated_by,'CLIENT',NEW.name,'UPDATE',changed_columns,old_data,new_data,NEW.id;
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
		SELECT now(), NEW.created_by,'CLIENT',NEW.name,'INSERT',changed_columns,old_data,new_data,NEW.id;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$BODY$;


INSERT INTO clients (
    created_by,
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

ALTER TABLE clients ALTER COLUMN updated_at DROP DEFAULT;

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

---------------------------------------- NEW SYSTEM LOG ----------------------------------------

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

    EXECUTE format('CREATE TRIGGER %s_log AFTER INSERT OR UPDATE OR DELETE ON %s
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
        VALUES (now(), OLD.updated_by, event_source, source_code, 'DELETE', changed_columns, old_data, new_data, OLD.id);

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
    created_by, status, container_number, seal_number, description, tare, net, gross_weight,
    is_empty, is_full, container_invoice_status, is_overweight_level1, is_overweight_level2,
    level1_kg, level2_kg, title_level1, title_level2, standard_kg
)
VALUES
    ('admin', true, 'CN0001', 'S12345', 'Container for electronics', 100.00, 200.00, 300.00,
     false, true, 'Pending', false, false, 50.00, 75.00, 'Level 1 Title', 'Level 2 Title', 150.00),

    ('admin', true, 'CN0002', 'S12346', 'Container for clothing', 150.00, 250.00, 400.00,
     false, true, 'Completed', true, false, 60.00, 80.00, 'Level 1 Title', 'Level 2 Title', 160.00),

    ('admin', false, 'CN0003', 'S12347', 'Container for furniture', 200.00, 300.00, 500.00,
     true, false, 'Shipped', false, true, 70.00, 90.00, 'Level 1 Title', 'Level 2 Title', 170.00),

    ('admin', true, 'CN0004', 'S12348', 'Container for machinery', 120.00, 220.00, 340.00,
     false, true, 'In Transit', true, true, 80.00, 100.00, 'Level 1 Title', 'Level 2 Title', 180.00),

    ('admin', false, 'CN0005', 'S12349', 'Container for food products', 130.00, 230.00, 360.00,
     true, false, 'Delivered', false, false, 90.00, 110.00, 'Level 1 Title', 'Level 2 Title', 190.00);

UPDATE public.job_container
SET
    status = false,
    description = 'Updated description for container'
WHERE id = 1;

SELECT * FROM client
SELECT * FROM activity_log
SELECT * FROM setting_logs

--------------------------------- NEW DATA BASE ---------------------------------------------------
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