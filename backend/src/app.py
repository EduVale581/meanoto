from flask import Flask, jsonify, request
from flask_cors import CORS
from bson.json_util import ObjectId
import json
import db
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager

class MyEncoder(json.JSONEncoder):

    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super(MyEncoder, self).default(obj)

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "super-secret"
app.json_encoder = MyEncoder

jwt = JWTManager(app)

CORS(app)

# Routes

# Crea una ruta para autenticar a los usuarios y devolver el token JWT.
# La función create_access_token() se utiliza para generar el JWT.
@app.route("/token", methods=["POST"])
def create_token():
    rut = request.json['rut']
    password = request.json['password']
    # Query your database for username and password
    user = db.db.usuarios.find_one({"rut": rut, "contrasena": password })
    if user is None:
        # the user was not found on the database
        return jsonify({'message': 'Nombre de usuario o contraseña incorrectos'}), 401
    
    # create a new token with the user id inside
    access_token = create_access_token(identity=user['_id'], expires_delta=False)
    return jsonify({ "token": access_token, "user_id": user['_id'] })



@app.route('/')
def flask_mongodb_atlas():
    return "flask mongodb atlas!"

@app.route('/modulos/<id>', methods=['PUT'])
@jwt_required()
def actualizarNumAlumnos(id):
    db.db.modulos.update_one({'_id': ObjectId(id)}, {"$set": {
        'nro_alumnos': request.json['nro_alumnos'],
        'profesor': request.json['profesor']
    }})
    return jsonify({'message': 'Módulo Actualizado'}), 200

@app.route('/modulos', methods=['POST'])
@jwt_required()
def agregarNuevoModulo():
    moduloExistente = db.db.modulos.find_one({"facultad": request.json['facultad'], "carrera": request.json['carrera'] })
    if moduloExistente is None:
        id = db.db.modulos.insert({
            'nombre': request.json['nombre'],
            'profesor': request.json['profesor'],
            'facultad': request.json['facultad'],
            'nro_alumnos':request.json['nro_alumnos'],
            'eventos':request.json['eventos'],
            'carrera':request.json['carrera'],
        })
        return jsonify({'message': 'Módulo ingresado con éxito'}), 200
    else:
        return jsonify({'message': 'El módulo ingresado, ya se encuentra en nuestro registros'}), 200


@app.route('/modulos/<id>', methods=['DELETE'])
@jwt_required()
def eliminarModulo(id):
    db.db.modulos.delete_one({'_id': ObjectId(id)})
    return jsonify({'message': 'Módulo Eliminado'}), 200



@app.route('/modulos', methods=['GET'])
@jwt_required()
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
    return jsonify(modulos), 200

@app.route('/profesores', methods=['GET'])
@jwt_required()
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
    return jsonify(profesores), 200

@app.route('/usuario', methods=['POST'])
@jwt_required()
def getUsuario():
    usuario = db.db.usuarios.find_one({"_id": ObjectId(request.json['id'])})
    if usuario is not None:
        return jsonify(usuario), 200
    else:
        return jsonify({'message': 'Ha ocurrido un error al obtener el usuario'}), 401


if __name__ == '__main__':
    app.run(port=8000, debug=True)
