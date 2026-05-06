from fastapi import APIRouter

router = APIRouter()


@router.get('')
def index():
    return {'module': 'appointments', 'status': 'ready'}
