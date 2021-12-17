from flask import Flask
from flask_pymongo import pymongo
from app import app
CONNECTION_STRING = "mongodb+srv://admin:tecweb2021@meanoto.va35h.mongodb.net/test"
client = pymongo.MongoClient(CONNECTION_STRING)
db = client.meanoto
modulos = pymongo.collection.Collection(db, 'modulos')
profesores = pymongo.collection.Collection(db, 'profesores')
eventos = pymongo.collection.Collection(db, 'eventos')
