from app import db
from sqlalchemy_serializer import SerializerMixin
from .formparticipantchoice import FormParticipantChoice

class PrivateFormParticipantChoice(FormParticipantChoice, SerializerMixin):
    owner_id = db.Column(db.Integer, db.ForeignKey('form_participants.id'))

    def __init__(self, form_item_id, owner_id):
        super().__init__(form_item_id)
        self.owner_id = owner_id


class FormParticipant(db.Model, SerializerMixin):
    __tablename__ = "form_participants"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100))

    def __init__(self, name, email):
        self.name = name
        self.email = email

    def update(self, name, email):
        self.name = name
        self.email = email
