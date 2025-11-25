from app import db
from sqlalchemy_serializer import SerializerMixin

class FormParticipantChoice(db.Model, SerializerMixin):
    __tablename__ = "form_participant_choices"

    id = db.Column(db.Integer, primary_key=True)
    form_item_id = db.Column(db.Integer)

    def __init__(self, form_item_id):
        self.form_item_id = form_item_id

    def update(self, form_item_id):
        self.form_item_id = form_item_id
