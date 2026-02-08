-- ============================================
-- DATABASE SCHEMA: Pemalang Tourism WebGIS
-- ============================================

-- Enable PostGIS Extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================
-- 1. TABEL USERS (Admin Authentication)
-- ============================================
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE,
    full_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- ============================================
-- 2. TABEL KATEGORI WISATA
-- ============================================
CREATE TABLE kategori (
    kategori_id SERIAL PRIMARY KEY,
    nama_kategori VARCHAR(50) UNIQUE NOT NULL,
    deskripsi TEXT,
    icon_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. TABEL WISATA (Main Table dengan PostGIS)
-- ============================================
CREATE TABLE wisata (
    wisata_id SERIAL PRIMARY KEY,
    nama_wisata VARCHAR(100) NOT NULL,
    kecamatan VARCHAR(50),
    kategori_id INTEGER REFERENCES kategori(kategori_id) ON DELETE SET NULL,
    deskripsi TEXT,
    alamat TEXT,
    
    -- Informasi Operasional
    harga_tiket INTEGER DEFAULT 0,
    jam_buka VARCHAR(50),
    jam_tutup VARCHAR(50),
    
    -- Koordinat Spasial (WGS 84 - EPSG:4326)
    lokasi GEOMETRY(Point, 4326) NOT NULL,
    
    -- Data Statistik Pengunjung
    pengunjung_2022 INTEGER DEFAULT 0,
    pengunjung_2023 INTEGER DEFAULT 0,
    pengunjung_2024 INTEGER DEFAULT 0,
    
    -- Media
    foto_utama VARCHAR(255),
    galeri JSONB,
    
    -- Status & Metadata
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(user_id)
);

-- ============================================
-- 4. TABEL FASILITAS
-- ============================================
CREATE TABLE fasilitas (
    fasilitas_id SERIAL PRIMARY KEY,
    nama_fasilitas VARCHAR(50) NOT NULL,
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 5. TABEL RELASI: WISATA-FASILITAS (Many-to-Many)
-- ============================================
CREATE TABLE wisata_fasilitas (
    wisata_id INTEGER REFERENCES wisata(wisata_id) ON DELETE CASCADE,
    fasilitas_id INTEGER REFERENCES fasilitas(fasilitas_id) ON DELETE CASCADE,
    PRIMARY KEY (wisata_id, fasilitas_id)
);

-- ============================================
-- 6. TABEL ULASAN (Optional)
-- ============================================
CREATE TABLE ulasan (
    ulasan_id SERIAL PRIMARY KEY,
    wisata_id INTEGER REFERENCES wisata(wisata_id) ON DELETE CASCADE,
    nama_pengunjung VARCHAR(100),
    email VARCHAR(100),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    komentar TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_approved BOOLEAN DEFAULT FALSE
);

-- ============================================
-- INDEXES untuk Performa
-- ============================================

-- Spatial Index (CRITICAL untuk performa Haversine)
CREATE INDEX idx_wisata_lokasi ON wisata USING GIST(lokasi);

-- Text Search Index
CREATE INDEX idx_wisata_nama ON wisata USING GIN(to_tsvector('indonesian', nama_wisata));

-- Foreign Key Indexes
CREATE INDEX idx_wisata_kategori ON wisata(kategori_id);
CREATE INDEX idx_wisata_status ON wisata(status);
CREATE INDEX idx_ulasan_wisata ON ulasan(wisata_id);

-- ============================================
-- TRIGGER: Auto-update timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER wisata_update_timestamp
BEFORE UPDATE ON wisata
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- ============================================
-- INSERT DATA AWAL
-- ============================================

-- 1. Insert Admin Default
INSERT INTO users (username, password_hash, email, full_name, role) VALUES
('admin', '$2a$10$8K1p/a0dL3LKzYjKzYjKz.eN7Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0', 'admin@pemalang.go.id', 'Administrator', 'admin');
-- Password: admin123 (akan di-hash dengan bcrypt saat production)

-- 2. Insert Kategori
INSERT INTO kategori (nama_kategori, deskripsi, icon_url) VALUES
('Wisata Bahari', 'Pantai dan wisata air laut', '🏖️'),
('Wisata Alam', 'Gunung, air terjun, dan alam terbuka', '⛰️'),
('Wisata Buatan', 'Taman rekreasi, kolam renang, dan taman bermain', '🎡'),
('Wisata Religi', 'Makam, masjid, dan tempat ibadah bersejarah', '🕌');

-- 3. Insert Fasilitas Umum
INSERT INTO fasilitas (nama_fasilitas, icon) VALUES
('Toilet', '🚻'),
('Parkir', '🅿️'),
('Mushola', '🕌'),
('Warung Makan', '🍽️'),
('Spot Foto', '📸'),
('Gazebo', '🏕️'),
('Penginapan', '🏨');

-- ============================================
-- 4. INSERT DATA 25 WISATA dari Dokumen Anda
-- ============================================

-- Wisata Bahari (Kategori ID = 1)
INSERT INTO wisata (nama_wisata, kecamatan, kategori_id, lokasi, pengunjung_2022, pengunjung_2023, pengunjung_2024, harga_tiket, status) VALUES
('Pantai Widuri', 'Pemalang', 1, ST_SetSRID(ST_MakePoint(109.3835, -6.8615), 4326), 327063, 274096, 239528, 5000, 'active'),
('Pantai Nyamplungsari', 'Petarukan', 1, ST_SetSRID(ST_MakePoint(109.4650, -6.8300), 4326), 44809, 70090, 31721, 3000, 'active'),
('Pantai Sumur Pandan', 'Petarukan', 1, ST_SetSRID(ST_MakePoint(109.4720, -6.8250), 4326), 5450, 14750, 12070, 3000, 'active');

-- Wisata Buatan (Kategori ID = 3)
INSERT INTO wisata (nama_wisata, kecamatan, kategori_id, lokasi, pengunjung_2022, pengunjung_2023, pengunjung_2024, harga_tiket, status) VALUES
('Gatra Kencana', 'Pemalang', 3, ST_SetSRID(ST_MakePoint(109.3712, -6.9145), 4326), 330938, 169352, 109935, 10000, 'active'),
('WIPPAS (Pangeran Purbaya)', 'Pemalang', 3, ST_SetSRID(ST_MakePoint(109.3750, -6.9630), 4326), 18708, 0, 14329, 5000, 'active'),
('Taman Benowo Park', 'Pemalang', 3, ST_SetSRID(ST_MakePoint(109.4105, -6.9520), 4326), 90012, 42629, 22724, 15000, 'active'),
('Kolam Renang Zatobay', 'Pemalang', 3, ST_SetSRID(ST_MakePoint(109.4020, -6.9050), 4326), 45397, 38857, 35132, 20000, 'active'),
('Kolam Renang Bening', 'Ulujami', 3, ST_SetSRID(ST_MakePoint(109.5320, -6.8750), 4326), 43876, 30566, 19427, 15000, 'active'),
('Kolam Renang Seruni', 'Comal', 3, ST_SetSRID(ST_MakePoint(109.5350, -6.8750), 4326), 0, 59778, 43270, 10000, 'active');

-- Wisata Religi (Kategori ID = 4)
INSERT INTO wisata (nama_wisata, kecamatan, kategori_id, lokasi, pengunjung_2022, pengunjung_2023, pengunjung_2024, harga_tiket, status) VALUES
('Makam Mbah Syamsudin', 'Pemalang', 4, ST_SetSRID(ST_MakePoint(109.3820, -6.8640), 4326), 171374, 77425, 81610, 0, 'active'),
('Makam Pandan Djati', 'Bantarbolang', 4, ST_SetSRID(ST_MakePoint(109.3650, -7.0050), 4326), 2501, 3255, 2769, 0, 'active');

-- Wisata Alam (Kategori ID = 2)
INSERT INTO wisata (nama_wisata, kecamatan, kategori_id, lokasi, pengunjung_2022, pengunjung_2023, pengunjung_2024, harga_tiket, status) VALUES
('Purena Farmland', 'Bantarbolang', 2, ST_SetSRID(ST_MakePoint(109.3350, -7.0210), 4326), 0, 0, 14562, 25000, 'active'),
('Gunung Gajah', 'Randudongkal', 2, ST_SetSRID(ST_MakePoint(109.3050, -7.0080), 4326), 14303, 12858, 9364, 5000, 'active'),
('Rainbow Rafting', 'Randudongkal', 2, ST_SetSRID(ST_MakePoint(109.2650, -7.1020), 4326), 8117, 9904, 11005, 150000, 'active'),
('Candi Batur', 'Belik', 2, ST_SetSRID(ST_MakePoint(109.3150, -7.1550), 4326), 12491, 12664, 12310, 3000, 'active'),
('Curug Bengkawah', 'Belik', 2, ST_SetSRID(ST_MakePoint(109.3320, -7.1180), 4326), 38882, 7503, 10568, 5000, 'active'),
('Jambe Kembar', 'Belik', 2, ST_SetSRID(ST_MakePoint(109.3300, -7.1850), 4326), 39995, 6424, 19637, 5000, 'active'),
('Bendungan Mejagong', 'Moga', 2, ST_SetSRID(ST_MakePoint(109.2950, -7.1050), 4326), 40251, 59356, 84971, 0, 'active'),
('Curug Sibedil', 'Moga', 2, ST_SetSRID(ST_MakePoint(109.2350, -7.1320), 4326), 29842, 28732, 41030, 5000, 'active'),
('Bukit Gambangan', 'Moga', 2, ST_SetSRID(ST_MakePoint(109.2550, -7.1350), 4326), 20755, 18496, 14339, 5000, 'active'),
('Curug Sidok', 'Moga', 2, ST_SetSRID(ST_MakePoint(109.2300, -7.1250), 4326), 16835, 3942, 15282, 5000, 'active'),
('Kampung Semugih', 'Moga', 2, ST_SetSRID(ST_MakePoint(109.2250, -7.1480), 4326), 20833, 18263, 14040, 10000, 'active'),
('Bukit Tangkeban', 'Pulosari', 2, ST_SetSRID(ST_MakePoint(109.2350, -7.1620), 4326), 157842, 152496, 93398, 5000, 'active'),
('Bukit Igir Kandang', 'Pulosari', 2, ST_SetSRID(ST_MakePoint(109.2050, -7.1550), 4326), 12180, 19804, 14544, 5000, 'active'),
('Bukit Mentek', 'Watukumpul', 2, ST_SetSRID(ST_MakePoint(109.4700, -7.1500), 4326), 13536, 17563, 26184, 5000, 'active');

-- ============================================
-- VERIFY DATA
-- ============================================
SELECT 'Total Wisata:', COUNT(*) FROM wisata;
SELECT 'Total Kategori:', COUNT(*) FROM kategori;
SELECT 'Total Fasilitas:', COUNT(*) FROM fasilitas;

-- Test Spatial Query
SELECT 
    nama_wisata, 
    ST_AsText(lokasi) as koordinat,
    ST_X(lokasi) as longitude,
    ST_Y(lokasi) as latitude
FROM wisata
LIMIT 5;