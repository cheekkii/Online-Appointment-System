from flask.cli import FlaskGroup
from app import app, db
from app.models.form import Form, PrivateFormItem, PrivateFormParticipant
from app.models.formitem import FormItem
from app.models.formparticipant import FormParticipant, PrivateFormParticipantChoice
from app.models.formparticipantchoice import FormParticipantChoice

#from datetime import datetime

from werkzeug.security import generate_password_hash
from app.models.authuser import AuthUser, PrivateForm

cli = FlaskGroup(app)


@cli.command("create_db")
def create_db():
    db.drop_all()
    db.create_all()
    db.session.commit()


@cli.command("seed_db")
def seed_db():
    # seed initial user (id = 1 user)
    db.session.add(AuthUser(email="gamsasivimon@gmail.com", name='Gam',
                            password=generate_password_hash('12345678',
                                                            method='sha256'),
                            avatar_url="/static/img/avatar3.png"))
    # seed initial form (id = 1 form)
    db.session.add(PrivateForm(title="party", description="my birthday party", location="bankok bangmod uni", duration="2 hour", form_type="sign-up-sheet", owner_id=1))

    # seed initial form item (id = 1 form item)
    db.session.add(PrivateFormItem(title="party" ,date="2025-02-04", start_time="13:15", end_time="15:40", score=0, maxcap=10, owner_id=1))

    # seed initial form participant
    db.session.add(PrivateFormParticipant(name="somchai", email="flask@204212", owner_id=1))

    db.session.commit()


if __name__ == "__main__":
    cli()
