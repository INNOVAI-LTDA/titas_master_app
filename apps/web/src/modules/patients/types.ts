export type Patient = {
  id: string;
  full_name: string;
  document?: string | null;
  is_active: boolean;
};
