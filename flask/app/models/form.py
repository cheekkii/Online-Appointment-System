from app import db
from sqlalchemy_serializer import SerializerMixin
from .formitem import FormItem
from .formparticipant import FormParticipant

class PrivateFormItem(FormItem, SerializerMixin):
    owner_id = db.Column(db.Integer, db.ForeignKey('forms.id'))

    def __init__(self, title, date, start_time, end_time, score, maxcap, owner_id):
        super().__init__(title, date, start_time, end_time, score, maxcap)
        self.owner_id = owner_id

class PrivateFormParticipant(FormParticipant, SerializerMixin):
    owner_id = db.Column(db.Integer, db.ForeignKey('forms.id'))

    def __init__(self, name, email, owner_id):
        super().__init__(name, email)
        self.owner_id = owner_id

class Form(db.Model, SerializerMixin):
    __tablename__ = "forms"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    description = db.Column(db.String(100))
    location = db.Column(db.String(100))
    duration = db.Column(db.String(100))
    form_type = db.Column(db.String(100))

    def __init__(self, title, description, location, duration, form_type):
        self.title = title
        self.description = description
        self.location = location
        self.duration = duration
        self.form_type = form_type

    def update(self, title, description, location, duration, form_type):
        self.title = title
        self.description = description
        self.location = location
        self.duration = duration
        self.form_type = form_type