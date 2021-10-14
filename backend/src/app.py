from flask import Flask, jsonify, request
from flask_cors import CORS
from bson.json_util import ObjectId
import json
import db

class MyEncoder(json.JSONEncoder):

    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super(MyEncoder, self).default(obj)

app = Flask(__name__)
app.json_encoder = MyEncoder

CORS(app)

# Routes

@app.route('/')
def flask_mongodb_atlas():
    return "flask mongodb atlas!"

@app.route('/modulos/<id>', methods=['PUT'])
def actualizarNumAlumnos(id):
    db.db.modulos.update_one({'_id': ObjectId(id)}, {"$set": {
        'nro_alumnos': request.json['nro_alumnos']
    }})
    return jsonify({'message': 'Módulo Actualizado'})


@app.route('/modulos/<id>', methods=['DELETE'])
def eliminarModulo(id):
    db.db.modulos.delete_one({'_id': ObjectId(id)})
    return jsonify({'message': 'Módulo Eliminado'})



@app.route('/modulos', methods=['GET'])
def getModulos():
    modulos = []
    for doc in db.db.modulos.find():    
        profesor = db.db.profesores.find_one({"_id": doc['profesor']})
        nombreProfesor = ""
        if profesor is not None:
            nombreProfesor = profesor['nombre']+" "+profesor['apellido']
        modulos.append({
            'id': doc['_id'],
            'nombre': doc['nombre'],
            'profesor': nombreProfesor,
            'facultad': doc['facultad'],
            'nro_alumnos': doc['nro_alumnos'],
            'carrera': doc['carrera'],
            'eventos': doc['eventos']
        })
    return jsonify(modulos)


if __name__ == '__main__':
    app.run(port=8000, debug=True)