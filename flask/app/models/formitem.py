from app import db
from sqlalchemy_serializer import SerializerMixin

class FormItem(db.Model, SerializerMixin):
    __tablename__ = "form_items"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    date = db.Column(db.String(100))
    start_time = db.Column(db.String(100))
    end_time = db.Column(db.String(100))
    score = db.Column(db.Integer, default=0)
    maxcap = db.Column(db.Integer, default=10)

    def __init__(self, title, date, start_time, end_time, score, maxcap):
        self.title = title
        self.date = date
        self.start_time = start_time
        self.end_time = end_time
        self.score = score
        self.maxcap = maxcap

    def update(self, title, date, start_time, end_time, score, maxcap):
        self.title = title
        self.date = date
        self.start_time = start_time
        self.end_time = end_time
        self.score = score
        self.maxcap = maxcap
