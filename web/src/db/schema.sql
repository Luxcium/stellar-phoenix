-- Basic Image Information (Tier 1)
CREATE TABLE basic_image_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thumbnail_path TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_basic_image_info_hash ON basic_image_info(hash);
CREATE INDEX idx_basic_image_info_file_path ON basic_image_info(file_path);

-- Image Metadata (Tier 2)
CREATE TABLE image_metadata (
    id UUID PRIMARY KEY REFERENCES basic_image_info(id) ON DELETE CASCADE,
    width INTEGER,
    height INTEGER,
    format TEXT,
    color_space TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tags for images
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Image-Tag relationships
CREATE TABLE image_tags (
    image_id UUID REFERENCES basic_image_info(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (image_id, tag_id)
);

-- Semantic groups
CREATE TABLE semantic_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Image-Group relationships
CREATE TABLE image_groups (
    image_id UUID REFERENCES basic_image_info(id) ON DELETE CASCADE,
    group_id UUID REFERENCES semantic_groups(id) ON DELETE CASCADE,
    confidence FLOAT NOT NULL DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (image_id, group_id)
);

-- Custom metadata key-value pairs
CREATE TABLE custom_metadata (
    image_id UUID REFERENCES basic_image_info(id) ON DELETE CASCADE,
    key TEXT NOT NULL,
    value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (image_id, key)
);

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Update triggers
CREATE TRIGGER update_basic_image_info_updated_at
    BEFORE UPDATE ON basic_image_info
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_image_metadata_updated_at
    BEFORE UPDATE ON image_metadata
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_metadata_updated_at
    BEFORE UPDATE ON custom_metadata
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_image_tags_image_id ON image_tags(image_id);
CREATE INDEX idx_image_tags_tag_id ON image_tags(tag_id);
CREATE INDEX idx_image_groups_image_id ON image_groups(image_id);
CREATE INDEX idx_image_groups_group_id ON image_groups(group_id);
CREATE INDEX idx_custom_metadata_image_id ON custom_metadata(image_id);
