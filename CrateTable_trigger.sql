
CREATE TABLE client
(
    action VARCHAR(6) NOT NULL,
    code VARCHAR(15) NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    country VARCHAR(20) NOT NULL,
    city VARCHAR(20) NOT NULL,
    unloco VARCHAR(20) NOT NULL,
    office_address VARCHAR(256) NOT NULL,
    suburb VARCHAR(20) NOT NULL,
    state VARCHAR(20) NOT NULL,
    postal_code INT NOT NULL,
    email VARCHAR(30),
    status boolean NOT NULL
)


CREATE TABLE activity_log(
  id SERIAL PRIMARY KEY,
  event_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(15) NOT NULL,
  event_source VARCHAR(30) NOT NULL,
  source_code VARCHAR(256),
  event_type VARCHAR(6) NOT NULL,
  changed_data TEXT,
  data_old TEXT,
  data_new TEXT
)

	CREATE EXTENSION IF NOT EXISTS hstore;
	
	-- Tạo hàm log_client_changes để log các thay đổi trên bảng client
	CREATE OR REPLACE FUNCTION log_client_changes()
	RETURNS TRIGGER AS $$
	DECLARE
	    changed_data TEXT := '';
	BEGIN
	    IF TG_OP = 'INSERT' THEN
	        INSERT INTO activity_log (created_by, event_source, source_code, event_type, data_new)
	        VALUES (NEW.code, 'Client API', NEW.code, 'INSERT', row_to_json(NEW)::text);
	        RETURN NEW;
	    ELSIF TG_OP = 'UPDATE' THEN
	        -- Kiểm tra sự thay đổi của từng cột và tạo chuỗi thay đổi
	        IF NEW.code IS DISTINCT FROM OLD.code THEN
	            changed_data := changed_data || 'code: ' || OLD.code || ' --> ' || NEW.code || '; ';
	        END IF;
	        IF NEW.name IS DISTINCT FROM OLD.name THEN
	            changed_data := changed_data || 'name: ' || OLD.name || ' --> ' || NEW.name || '; ';
	        END IF;
	        IF NEW.country IS DISTINCT FROM OLD.country THEN
	            changed_data := changed_data || 'country: ' || OLD.country || ' --> ' || NEW.country || '; ';
	        END IF;
	        IF NEW.city IS DISTINCT FROM OLD.city THEN
	            changed_data := changed_data || 'city: ' || OLD.city || ' --> ' || NEW.city || '; ';
	        END IF;
	        IF NEW.unloco IS DISTINCT FROM OLD.unloco THEN
	            changed_data := changed_data || 'unloco: ' || OLD.unloco || ' --> ' || NEW.unloco || '; ';
	        END IF;
	        IF NEW.office_address IS DISTINCT FROM OLD.office_address THEN
	            changed_data := changed_data || 'office_address: ' || OLD.office_address || ' --> ' || NEW.office_address || '; ';
	        END IF;
	        IF NEW.suburb IS DISTINCT FROM OLD.suburb THEN
	            changed_data := changed_data || 'suburb: ' || OLD.suburb || ' --> ' || NEW.suburb || '; ';
	        END IF;
	        IF NEW.state IS DISTINCT FROM OLD.state THEN
	            changed_data := changed_data || 'state: ' || OLD.state || ' --> ' || NEW.state || '; ';
	        END IF;
	        IF NEW.postal_code IS DISTINCT FROM OLD.postal_code THEN
	            changed_data := changed_data || 'postal_code: ' || OLD.postal_code || ' --> ' || NEW.postal_code || '; ';
	        END IF;
	        IF NEW.email IS DISTINCT FROM OLD.email THEN
	            changed_data := changed_data || 'email: ' || OLD.email || ' --> ' || NEW.email || '; ';
	        END IF;
	        IF NEW.status IS DISTINCT FROM OLD.status THEN
	            changed_data := changed_data || 'status: ' || OLD.status || ' --> ' || NEW.status || '; ';
	        END IF;
	        -- Lưu log cập nhật
	        INSERT INTO activity_log (created_by, event_source, source_code, event_type, changed_data, data_old, data_new)
	        VALUES (NEW.code, 'Client API', NEW.code, 'UPDATE', changed_data, row_to_json(OLD)::text, row_to_json(NEW)::text);
	        RETURN NEW;
	    END IF;
	    RETURN NULL;
	END;
	$$ LANGUAGE plpgsql;
	
	-- Tạo trigger để log các hoạt động INSERT và UPDATE trên bảng client
	CREATE TRIGGER client_changes_trigger
	AFTER INSERT OR UPDATE ON client
	FOR EACH ROW
	EXECUTE FUNCTION log_client_changes();
/*CREATE TRIGGER client_delete_trigger
AFTER DELETE ON client
FOR EACH ROW
EXECUTE FUNCTION log_client_changes();*/
/*DROP TRIGGER IF EXISTS client_changes_trigger ON client;
DROP TRIGGER IF EXISTS client_delete_trigger ON client;
ALTER TABLE client DROP COLUMN action;
--Insert
INSERT INTO client (
    action, code, name, country, city, unloco, office_address, suburb, state, postal_code, email, status
) VALUES (
    'insert', 'A0403', 'John Doe', 'USA', 'New York', 'USNYC', '123 Main St', 'Manhattan', 'NY', 10001, 'john.doe@example.com', TRUE
);
insert into editor (username,password,role)	values ('tuongpra112','123456','2');
--update
UPDATE client
SET name = 'John A. Doe', city = 'Los Angeles'
WHERE code = 'C001';
-- Xoa
DELETE FROM client
WHERE name = 'Tướng';
delete from activity_log 
where created_by = '1003';
SELECT * FROM activity_log;

ALTER TABLE activity_log
ALTER COLUMN changed_data TYPE TEXT;

-- Đổi kiểu dữ liệu của cột data_old từ VARCHAR(256) sang TEXT
ALTER TABLE activity_log
ALTER COLUMN data_old TYPE TEXT;

-- Đổi kiểu dữ liệu của cột data_new từ VARCHAR(256) sang TEXT
ALTER TABLE activity_log
ALTER COLUMN data_new TYPE TEXT;
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'activity_log';


CREATE TABLE activity_log_tmp (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(15) NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(15) NOT NULL,
    event_source VARCHAR(30) NOT NULL,
    source_code VARCHAR(256),
    event_type VARCHAR(6) NOT NULL,
    changed_data TEXT,
    data_old TEXT,
    data_new TEXT
);
INSERT INTO activity_log_tmp (id, event_time, created_by, event_source, source_code, event_type, changed_data, data_old, data_new)
SELECT id, event_time, created_by, event_source, source_code, event_type, changed_data, data_old, data_new
FROM activity_log;

CREATE TABLE editor (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL
);
DROP TABLE users;
DELETE FROM editor
WHERE username = 'tuongpra112';*/
