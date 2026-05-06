function text(value: string | undefined, fallback: string): string {
  const candidate = (value || '').trim();
  return candidate || fallback;
}

export const env = {
  appEnv: text(import.meta.env.VITE_APP_ENV, 'local'),
  deployTarget: text(import.meta.env.VITE_DEPLOY_TARGET, 'local'),
  clientCode: text(import.meta.env.VITE_CLIENT_CODE, 'default'),
  apiBaseUrl: text(import.meta.env.VITE_API_BASE_URL, 'http://localhost:8000').replace(/\/$/, ''),
  webBaseUrl: text(import.meta.env.VITE_WEB_BASE_URL, 'http://localhost:5173').replace(/\/$/, '')
};
