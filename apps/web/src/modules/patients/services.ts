import { apiGet, apiPost } from '../../shared/api/httpClient';
import type { Patient } from './types';

export function listPatients() {
  return apiGet<Patient[]>('/patients');
}

export function createPatient(payload: { full_name: string; document?: string }) {
  return apiPost<Patient>('/patients', payload);
}
