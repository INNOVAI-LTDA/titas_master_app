from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config.settings import get_settings
from core.config.client_config import get_client_config
from modules.auth.routes import router as auth_router
from modules.patients.routes import router as patients_router
from modules.appointments.routes import router as appointments_router
from modules.reports.routes import router as reports_router


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title='Client System API', version='0.1.0')
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=['*'],
        allow_headers=['*'],
    )

    app.include_router(auth_router, prefix='/auth', tags=['auth'])
    app.include_router(patients_router, prefix='/patients', tags=['patients'])
    app.include_router(appointments_router, prefix='/appointments', tags=['appointments'])
    app.include_router(reports_router, prefix='/reports', tags=['reports'])

    @app.get('/health')
    def health():
        return {'status': 'ok'}

    @app.get('/runtime-info')
    def runtime_info():
        client = get_client_config().get('client', {})
        return {
            'app_env': settings.app_env,
            'deploy_target': settings.deploy_target,
            'client_code': settings.client_code,
            'client_name': client.get('clientName'),
            'storage_backend': settings.storage_backend,
            'version': '0.1.0',
        }

    return app


app = create_app()
