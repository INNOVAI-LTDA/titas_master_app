import { useEffect, useState } from 'react';
import { listPatients } from './services';
import type { Patient } from './types';

export function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    listPatients().then(setPatients).catch(console.error);
  }, []);

  return (
    <section className="page-card">
      <h1>Pacientes</h1>
      <p>Modulo exemplo consumindo a API via configuracao de ambiente.</p>
      <ul>
        {patients.map((patient) => (
          <li key={patient.id}>{patient.full_name}</li>
        ))}
      </ul>
    </section>
  );
}
