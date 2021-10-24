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
        'nro_alumnos': request.json['nro_alumnos'],
        'profesor': request.json['profesor']
    }})
    return jsonify({'message': 'Módulo Actualizado'})

@app.route('/modulos', methods=['POST'])
def agregarNuevoModulo():
    moduloExistente = db.db.modulos.find_one({"facultad": request.json['facultad'], "carrera": request.json['carrera'] })
    print(moduloExistente)
    if moduloExistente is None:
        id = db.db.modulos.insert({
            'nombre': request.json['nombre'],
            'profesor': request.json['profesor'],
            'facultad': request.json['facultad'],
            'nro_alumnos':request.json['nro_alumnos'],
            'eventos':request.json['eventos'],
            'carrera':request.json['carrera'],
        })
        print(id)
        return jsonify({'message': 'Módulo ingresado con éxito'})
    else:
        return jsonify({'message': 'El módulo ingresado, ya se encuentra en nuestro registros'})


@app.route('/modulos/<id>', methods=['DELETE'])
def eliminarModulo(id):
    db.db.modulos.delete_one({'_id': ObjectId(id)})
    return jsonify({'message': 'Módulo Eliminado'})



@app.route('/modulos', methods=['GET'])
def getModulos():
    modulos = []
    for doc in db.db.modulos.find():    
        profesor = db.db.profesores.find_one({"_id": doc['profesor']})
        facultad = db.db.facultades.find_one({"_id": doc['facultad']})
        nombreProfesor = ""
        nombreFacultad = ""
        if profesor is not None:
            nombreProfesor = profesor['nombre']+" "+profesor['apellido']
        if facultad is not None:
            nombreFacultad = facultad['nombre']

        modulos.append({
            'id': doc['_id'],
            'nombre': doc['nombre'],
            'profesor': nombreProfesor,
            'facultad': nombreFacultad,
            'id_Profesor': doc['profesor'],
            'id_Facultad': doc['facultad'],
            'nro_alumnos': doc['nro_alumnos'],
            'carrera': doc['carrera'],
            'eventos': doc['eventos']
        })
    return jsonify(modulos)

@app.route('/profesores', methods=['GET'])
def getProfesores():
    profesores = []
    for doc in db.db.profesores.find():    

        profesores.append({
            'nombreCompleto': doc['nombre']+' ' + doc['apellido'],
            'id': doc['_id'],
            'apellido': doc['apellido'],
            'nombre': doc['nombre'],
            'rut': doc['rut'],
            'correo': doc['correo'],
            'contrasena': doc['contrasena'],
            'modulos': doc['modulos'],
            'eventos': doc['eventos'],
        })
    return jsonify(profesores)


if __name__ == '__main__':
    app.run(port=8000, debug=True)
