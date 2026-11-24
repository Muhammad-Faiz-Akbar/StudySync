-- Katalog mata kuliah CONTOH (sintetis). Ganti dengan katalog kampus sungguhan.
insert into public.courses (code, name, study_program) values
  ('MAT101', 'Kalkulus I', 'Umum'),
  ('MAT102', 'Kalkulus II', 'Umum'),
  ('MAT201', 'Aljabar Linear', 'Umum'),
  ('STA201', 'Statistika dan Probabilitas', 'Umum'),
  ('FIS101', 'Fisika Dasar I', 'Umum'),
  ('KIM101', 'Kimia Dasar', 'Umum'),
  ('IF101', 'Pengantar Pemrograman', 'Informatika'),
  ('IF201', 'Struktur Data', 'Informatika'),
  ('IF202', 'Algoritma dan Kompleksitas', 'Informatika'),
  ('IF301', 'Basis Data', 'Informatika'),
  ('IF302', 'Jaringan Komputer', 'Informatika'),
  ('IF303', 'Pemrograman Web', 'Informatika'),
  ('IF304', 'Sistem Operasi', 'Informatika'),
  ('EL201', 'Rangkaian Listrik', 'Teknik Elektro'),
  ('EL202', 'Sistem Digital', 'Teknik Elektro'),
  ('SI101', 'Pengantar Sistem Informasi', 'Sistem Informasi'),
  ('EKO101', 'Ekonomi Mikro', 'Manajemen'),
  ('EKO102', 'Ekonomi Makro', 'Manajemen'),
  ('AKT101', 'Pengantar Akuntansi', 'Akuntansi'),
  ('MNJ201', 'Manajemen Pemasaran', 'Manajemen')
on conflict (code) do nothing;

-- Domain email yang diizinkan (isi sebelum mengaktifkan trigger enforce_email_domain)
-- insert into public.allowed_email_domains (domain) values ('mahasiswa.contoh.ac.id');
