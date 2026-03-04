DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='integrations' AND column_name='portal_payload'
    ) THEN
        ALTER TABLE integrations ADD COLUMN portal_payload TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='integrations' AND column_name='protocolo'
    ) THEN
        ALTER TABLE integrations ADD COLUMN protocolo VARCHAR(50);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='integrations' AND column_name='status'
    ) THEN
        ALTER TABLE integrations ADD COLUMN status VARCHAR(50);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='integrations' AND column_name='response_json'
    ) THEN
        ALTER TABLE integrations ADD COLUMN response_json JSONB;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='integrations' AND column_name='created_at'
    ) THEN
        ALTER TABLE integrations ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_integrations_protocolo 
ON integrations(protocolo);
