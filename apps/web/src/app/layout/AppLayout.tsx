import { Link, Outlet } from "react-router-dom";
import { env } from "../../shared/config/env";

export function AppLayout() {
  return (
    <main className="shell">
      <aside className="sidebar">
        <strong>Client System</strong>
        <small>
          {env.clientCode} / {env.appEnv}
        </small>
        <nav>
          <Link to="/patients">Pacientes</Link>
        </nav>
      </aside>
      <section className="content">
        <Outlet />
      </section>
    </main>
  );
}
