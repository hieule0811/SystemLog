
CREATE TABLE client
(
    id int,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(30),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(30),
    code VARCHAR(6) NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    birthday DATE,
    country VARCHAR(20) NOT NULL,
    city VARCHAR(20) NOT NULL,
    unloco VARCHAR(20) NOT NULL,
    office_address VARCHAR(256) NOT NULL,
    suburb VARCHAR(20) NOT NULL,
    state VARCHAR(20) NOT NULL,
    postal_code INT NOT NULL,
    email VARCHAR(30),
    status boolean NOT NULL
) ;

CREATE TABLE activity_log(
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(30) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(30),
    event_source VARCHAR(30) NOT NULL,
    source_code VARCHAR(256),
    event_type VARCHAR(6) NOT NULL,
    changed_data TEXT,
    data_old TEXT,
    data_new TEXT
);

	-- Tạo hàm log_client_changes để log các thay đổi trên bảng client
-- Tạo hàm tính toán sự khác biệt giữa hai đối tượng JSON
CREATE OR REPLACE FUNCTION json_diff(old_json JSONB, new_json JSONB)
RETURNS TEXT AS $$
DECLARE
    diff TEXT := '';
    key TEXT;
BEGIN
    FOR key IN SELECT * FROM jsonb_object_keys(old_json) LOOP
        IF new_json -> key IS DISTINCT FROM old_json -> key THEN
            diff := diff || key || ': ' || COALESCE(old_json ->> key, 'NULL') || ' -> ' || COALESCE(new_json ->> key, 'NULL') || '; ';
        END IF;
    END LOOP;
    RETURN diff;
END;
$$ LANGUAGE plpgsql;

-- Tạo hàm log_client_changes để log các thay đổi trên bảng client
CREATE OR REPLACE FUNCTION log_client_changes()
	RETURNS TRIGGER AS $$
	DECLARE
	    old_data JSONB;
	    new_data JSONB;
	    changed_data TEXT;
	BEGIN
	    IF TG_OP = 'INSERT' THEN
	        new_data := to_jsonb(NEW.*);
	        
	        INSERT INTO activity_log (
	            created_at, created_by, updated_at, event_source, source_code, event_type, data_new,client_id
	        ) VALUES (
	            CURRENT_TIMESTAMP, NEW.created_by,null, 'Trigger', NEW.code, 'INSERT', new_data::text,new.id 
	        );
	        RETURN NEW;
	    ELSIF TG_OP = 'UPDATE' THEN
	        old_data := to_jsonb(OLD.*);
	        new_data := to_jsonb(NEW.*);
	        
	        changed_data := json_diff(old_data, new_data);
	        
	        INSERT INTO activity_log (
	            created_at, created_by, updated_at,updated_by,event_source, source_code, event_type, changed_data, data_old, data_new,client_id
	        ) VALUES (
	            CURRENT_TIMESTAMP, OLD.created_by,CURRENT_TIMESTAMP,NEW.updated_by, 'Trigger', NEW.code, 'UPDATE', changed_data, old_data::text, new_data::text,new.id 
	        );
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



--==============================================================
--UPDATE  Ngày 23/7
--có sửa lại trigger
--thêm id và khóa ngoại
ALTER TABLE client
ADD COLUMN id SERIAL UNIQUE;

ALTER TABLE activity_log
ADD COLUMN client_id INT;

-- Thêm khóa ngoại cho cột client_id
ALTER TABLE activity_log
ADD CONSTRAINT fk_client
FOREIGN KEY (client_id) REFERENCES client(id)
ON DELETE SET null;
--==============================================================
--UPDATE  Ngày 24/7
-- SEQUENCE tăng tự động cho id
CREATE SEQUENCE client_id_seq;
CREATE OR REPLACE FUNCTION set_client_id()
RETURNS TRIGGER AS $$
BEGIN
    NEW.id := nextval('client_id_seq');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_client_id_before_insert
BEFORE INSERT ON client
FOR EACH ROW
EXECUTE FUNCTION set_client_id();



