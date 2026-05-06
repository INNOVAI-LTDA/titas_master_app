from functools import lru_cache
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', extra='ignore')

    app_env: str = Field(default='local', alias='APP_ENV')
    deploy_target: str = Field(default='local', alias='DEPLOY_TARGET')
    client_code: str = Field(default='default', alias='CLIENT_CODE')

    database_url: str = Field(alias='DATABASE_URL')
    api_base_url: str = Field(default='http://localhost:8000', alias='API_BASE_URL')
    web_base_url: str = Field(default='http://localhost:5173', alias='WEB_BASE_URL')
    cors_allowed_origins: str = Field(default='http://localhost:5173', alias='CORS_ALLOWED_ORIGINS')

    jwt_secret: str = Field(alias='JWT_SECRET')
    jwt_expires_minutes: int = Field(default=120, alias='JWT_EXPIRES_MINUTES')

    storage_backend: str = Field(default='local', alias='STORAGE_BACKEND')
    file_storage_path: str | None = Field(default='./storage', alias='FILE_STORAGE_PATH')
    file_storage_bucket: str | None = Field(default=None, alias='FILE_STORAGE_BUCKET')
    log_level: str = Field(default='info', alias='LOG_LEVEL')

    @property
    def cors_origins_list(self) -> list[str]:
        return [item.strip() for item in self.cors_allowed_origins.split(',') if item.strip()]

    @property
    def is_local(self) -> bool:
        return self.app_env == 'local' or self.deploy_target == 'local'


@lru_cache
def get_settings() -> Settings:
    return Settings()
