from flask import Blueprint

bp = Blueprint("general", __name__)

@bp.route('/')
def index():
    return "Hello World!"