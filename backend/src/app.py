from flask import Flask, jsonify, request
from flask_cors import CORS
from bson.json_util import ObjectId
import json
import db
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager
from flask_mail import Mail,  Message

from io import StringIO

import dropbox

from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfdocument import PDFDocument
from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.pdfpage import PDFPage
from pdfminer.pdfparser import PDFParser
import requests

class MyEncoder(json.JSONEncoder):

    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super(MyEncoder, self).default(obj)

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "super-secret"
app.config["MAIL_SERVER"] = 'smtp.gmail.com'
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USERNAME"] = 'meanoto2021@gmail.com'
app.config["MAIL_PASSWORD"] = 'meanoto123'
app.json_encoder = MyEncoder

jwt = JWTManager(app)
mail = Mail(app)
dbx = dropbox.Dropbox("tqNg1q6lWygAAAAAAAAAARN-TPPDgpDCV18QtmdhiG_61Xk3zZFQwFPvKFjv5FdU")
CORS(app)

def obtenerTextoPDF(numMatricula):
    dbx.files_download_to_file("CertificadosAlumnoRegular/"+numMatricula+".pdf", "/CertificadosAlumnoRegular/"+numMatricula+".pdf")
    output_string = StringIO()
    with open("CertificadosAlumnoRegular/"+numMatricula+".pdf", 'rb') as in_file:
        parser = PDFParser(in_file)
        doc = PDFDocument(parser)
        rsrcmgr = PDFResourceManager()
        device = TextConverter(rsrcmgr, output_string, laparams=LAParams())
        interpreter = PDFPageInterpreter(rsrcmgr, device)
        for page in PDFPage.create_pages(doc):
            interpreter.process_page(page)

    textoPdf = output_string.getvalue()

    if numMatricula in textoPdf:
        return True
    else:
        return False

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
    return jsonify({ "token": access_token, "user_id": user['_id'] }),200

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
        idModulo =  doc['_id']
        profesor = db.db.profesores.find_one({"_id": doc['profesor']})
        facultad = db.db.facultades.find_one({"_id": doc['facultad']})
        estudiantesArreglo = []
        for doc2 in db.db.estudiantes.find({"modulos": idModulo}):
            estudiantesArreglo.append({
                'id': doc2['_id'],
                'nombre': doc2['nombre'],
                'apellidos': doc2['apellido'],
                'modulos': doc2['modulos'],
                'rut': doc2['rut'],
                'correo': doc2['correo'],
                'matricula': doc2['matricula'],
                'eventos': doc2['eventos'],
            })
        nombreProfesor = ""
        nombreFacultad = ""
        if profesor is not None:
            nombreProfesor = profesor['nombre']+" "+profesor['apellido']
        if facultad is not None:
            nombreFacultad = facultad['nombre']

        modulos.append({
            'id': idModulo,
            'nombre': doc['nombre'],
            'profesor': nombreProfesor,
            'facultad': nombreFacultad,
            'id_Profesor': doc['profesor'],
            'id_Facultad': doc['facultad'],
            'nro_alumnos': doc['nro_alumnos'],
            'carrera': doc['carrera'],
            'eventos': doc['eventos'],
            'estudiantes': estudiantesArreglo,
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


@app.route('/profesores', methods=['POST'])
@jwt_required()
def agregarNuevoProfesor():
    profesorExistente = db.db.profesores.find_one({"rut": request.json['rut']})
    if profesorExistente is None:
        id = db.db.profesores.insert_one({
            'nombre': request.json['nombre'],
            'apellido': request.json['apellido'],
            'rut': request.json['rut'],
            'correo':request.json['correo'],
            'contrasena':request.json['contrasena'],
            'eventos':request.json['eventos'],
            'modulos':request.json['modulos'],
        })
        return jsonify({'message': 'Profesor ingresado con éxito', 'id':id}), 200
    else:
        return jsonify({'message': 'El profesor ingresado ya se encuentra en nuestros registros'}), 200

@app.route('/profesores/<id>', methods=['DELETE'])
@jwt_required()
def eliminarProfesor(id):
    db.db.profesores.delete_one({'_id': ObjectId(id)})
    return jsonify({'message': 'Profesor Eliminado'}), 200

@app.route('/usuario', methods=['POST'])
@jwt_required()
def getUsuario():
    usuario = db.db.usuarios.find_one({"_id": ObjectId(request.json['id'])})
    if usuario is not None:
        if usuario['tipo_usuario']=="ESTUDIANTE" and usuario['validado']:
            return jsonify(usuario), 200
        else:
            return jsonify(usuario), 200
    else:
        return jsonify({'message': 'Ha ocurrido un error al obtener el usuario'}), 401


@app.route('/registro', methods=['POST'])
def iniciarRegistro():
    usuario = db.db.usuarios.find_one({"rut": request.json['rut']})
    estudiante = db.db.estudiantes.find_one({"rut": request.json['rut']})
    if usuario is not None:
        return jsonify({'message': 'Usuario ya existe'}), 300
    elif estudiante is not None:
        return jsonify({'message': 'Usuario ya existe'}), 300
    else:
        if request.json['url_doc_alumno_reg'] != "" or request.json['url_doc_alumno_reg'] != " ":
            validado = obtenerTextoPDF(request.json['matricula'])

        id = db.db.estudiantes.insert({
            'nombre': request.json['nombre'],
            'apellido': request.json['apellido'],
            'carrera': request.json['carrera'],
            'contrasena':request.json['contrasena'],
            'correo':request.json['correo'],
            'facultad':request.json['facultad'],
            'matricula':request.json['matricula'],
            'rut':request.json['rut'],
            'modulos':request.json['modulos'],
            'url_doc_alumno_reg':request.json['url_doc_alumno_reg'],
            'validado':validado,
            'eventos':request.json['eventos'],
        })
        id2 = db.db.usuarios.insert({
            'contrasena': request.json['contrasena'],
            'correo': request.json['correo'],
            'rut': request.json['rut'],
            'tipo_usuario':request.json['tipo_usuario'],
            'validado':validado,
            'refId':ObjectId(id),
            })
        if validado:
            msg = mail.send_message(
            'Bienvenid@',
            sender='meanoto2021@gmail.com',
            recipients=[request.json['correo']],
            body="Cuenta creada, ya puedes ingresar a tu cuenta."
        )
        else:
            msg = mail.send_message(
                'Bienvenid@',
                sender='meanoto2021@gmail.com',
                recipients=[request.json['correo']],
                body="Cuenta creada, Falta verificar datos."
            )
        return jsonify({'message': 'Estudiante ingresado con éxito'}), 200



if __name__ == '__main__':
    app.run(port=8000, debug=True)
