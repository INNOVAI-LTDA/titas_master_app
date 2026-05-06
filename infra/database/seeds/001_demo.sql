INSERT INTO patients (id, full_name, document, is_active)
VALUES ('demo-patient-1', 'Paciente Demo', NULL, TRUE)
ON CONFLICT (id) DO NOTHING;
