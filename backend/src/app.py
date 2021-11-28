from flask import Flask, jsonify, request
from flask_cors import CORS
from bson.json_util import ObjectId
import json
import db
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager
from flask_mail import Mail,  Message

from io import StringIO
import string
import random
import hashlib

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

## characters to generate password from
characters = list(string.ascii_letters + string.digits)

def generate_random_password(length):
    random.shuffle(characters)
    ## picking random characters from the list
    password = []
    for i in range(length):
        password.append(random.choice(characters))
    random.shuffle(password)
    mostrar = "".join(password)

    return mostrar


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

@app.route('/facultades', methods=['GET'])
@jwt_required()
def getFacultades():
    facultades = []
    for doc in db.db.facultades.find():
        carreras = doc['carreras']
        carrerrasArreglo = []
        for doc2 in carreras:
            carrera = db.db.carreras.find_one({"_id": ObjectId(doc2)})
            if carrera is not None:
                carrerrasArreglo.append({'nombre': carrera['nombre'], 'id':doc2})
        
        facultades.append({
            'id': doc['_id'],
            'nombre': doc['nombre'],
            'carreras': carrerrasArreglo,
        })

    return jsonify(facultades), 200

@app.route('/estudiantes', methods=['GET'])
@jwt_required()
def getEstudiantes():
    estudiantes = []
    for doc in db.db.estudiantes.find():
        modulos = doc['modulos']
        carrera = ""
        facultad = "" 
        modulosArreglo = []
        carrera = db.db.carreras.find_one({"_id": ObjectId(doc['carrera'])})
        facultad = db.db.facultades.find_one({"_id": ObjectId(doc['facultad'])})

        for doc2 in  modulos:
            modulo = db.db.modulos.find_one({"_id": ObjectId(doc2)})
            if modulo is not None:
                profesor = db.db.profesores.find_one({"_id": ObjectId(modulo['profesor'])})
                profesorNombre = ""
                if profesor is None:
                    profesorNombre = ""
                else:
                    profesorNombre = profesor['nombre'] + " " + profesor['apellido']
                modulosArreglo.append({
                    'nombre': modulo['nombre'],
                    'id': modulo['_id'],
                    'id_profesor': modulo['profesor'],
                    'profesor':profesorNombre
                })

        if carrera is None:
            carrera = ""
        else:
            carrera = carrera['nombre']
        
        if facultad is None:
            facultad = ""
        else:
            facultad = facultad['nombre']

        estudiantes.append({
            'nombreEstudiante': doc['nombre']+' ' + doc['apellido'],
            'id': doc['_id'],
            'apellido': doc['apellido'],
            'nombre': doc['nombre'],
            'rut': doc['rut'],
            'correo': doc['correo'],
            'carrera':carrera,
            'facultad':facultad,
            'numMatricula': doc['matricula'],
            'archivo': doc['url_doc_alumno_reg'],
            'validado': doc['validado'],
            'modulos':modulosArreglo
        })

    return jsonify(estudiantes), 200

@app.route('/estudiantes/<id>', methods=['DELETE'])
@jwt_required()
def eliminarEstudiante(id):
    db.db.estudiantes.delete_one({'_id': ObjectId(id)})
    db.db.usuarios.delete_one({'refId': ObjectId(id)})
    return jsonify({'message': 'Estudiante Eliminado'}), 200

@app.route('/estudiantes/<id>', methods=['GET'])
@jwt_required()
def obtenerEstudiante(id):
    estudianteExiste = db.db.estudiantes.find_one({"_id": ObjectId(id)})

    if estudianteExiste is None:
        return jsonify({'message': 'Estudiante no existe'}), 300
    else:
        modulos = estudianteExiste['modulos']
        carrera = ""
        facultad = "" 
        modulosArreglo = []
        carrera = db.db.carreras.find_one({"_id": ObjectId(estudianteExiste['carrera'])})
        facultad = db.db.facultades.find_one({"_id": ObjectId(estudianteExiste['facultad'])})

        for doc2 in  modulos:
            modulo = db.db.modulos.find_one({"_id": ObjectId(doc2)})
            if modulo is not None:
                profesor = db.db.profesores.find_one({"_id": ObjectId(modulo['profesor'])})
                profesorNombre = ""
                if profesor is None:
                    profesorNombre = ""
                else:
                    profesorNombre = profesor['nombre'] + " " + profesor['apellido']
                modulosArreglo.append({
                    'nombre': modulo['nombre'],
                    'id': modulo['_id'],
                    'id_profesor': modulo['profesor'],
                    'profesor':profesorNombre
                })

        if carrera is None:
            carrera = ""
        else:
            carrera = carrera['nombre']
        
        if facultad is None:
            facultad = ""
        else:
            facultad = facultad['nombre']

        return jsonify({
            'nombreEstudiante': estudianteExiste['nombre']+' ' + estudianteExiste['apellido'],
            'id': estudianteExiste['_id'],
            'apellido': estudianteExiste['apellido'],
            'nombre': estudianteExiste['nombre'],
            'rut': estudianteExiste['rut'],
            'correo': estudianteExiste['correo'],
            'carrera':carrera,
            'facultad':facultad,
            'numMatricula': estudianteExiste['matricula'],
            'archivo': estudianteExiste['url_doc_alumno_reg'],
            'validado': estudianteExiste['validado'],
            'modulos':modulosArreglo

        }), 200

@app.route('/validarEstudiante', methods=['POST'])
@jwt_required()
def validarEstudiante():
    estudianteExiste = db.db.estudiantes.find_one({"_id": ObjectId(request.json['id'])})
    
    if estudianteExiste is None:
        
        return jsonify({'message': 'Estudiante no existe'}), 300
    else:
        db.db.estudiantes.update_one({'_id': ObjectId(request.json['id'])}, {"$set": {
            'validado': request.json['validado']
        }})
        db.db.usuarios.update_one({'refId': ObjectId(request.json['id'])}, {"$set": {
            'validado': request.json['validado']
        }})
        return jsonify({'message': 'Estudiante Actualizado'}), 200

@app.route('/modificarCarreraFacultadEstudiante', methods=['POST'])
@jwt_required()
def modificarFacuCarreraEstudiante():
    estudianteExiste = db.db.estudiantes.find_one({"_id": ObjectId(request.json['id'])})
    
    if estudianteExiste is None:
        
        return jsonify({'message': 'Estudiante no existe'}), 300
    else:
        db.db.estudiantes.update_one({'_id': ObjectId(request.json['id'])}, {"$set": {
            'facultad': ObjectId(request.json['facultad']),
            'carrera': ObjectId(request.json['carrera'])
        }})
        return jsonify({'message': 'Estudiante Actualizado'}), 200

@app.route('/actualizarModuloEstudiante', methods=['POST'])
@jwt_required()
def actualizarModuloEstudiante():
    modulosEstudiante = request.json['modulos']
    modulosAgregar = []
    estudianteExiste = db.db.estudiantes.find_one({"_id": ObjectId(request.json['id'])})
    
    if estudianteExiste is None:
        
        return jsonify({'message': 'Estudiante no existe'}), 300
    else:
        for modulo in modulosEstudiante:
            modulosAgregar.append(ObjectId(modulo))
        db.db.estudiantes.update_one({'_id': ObjectId(request.json['id'])}, {"$set": {
            'modulos': modulosAgregar
        }})
        return jsonify({'message': 'Estudiante Actualizado'}), 200

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

@app.route('/contrasenaProvisoria', methods=['POST'])
def contrasenaProvisoria():
    usuario = db.db.usuarios.find_one({"rut": request.json['rut']})
    
    if usuario is None:
        return jsonify({'message': 'Error al obtener usuario'}), 300
    else:

        db.db.usuarios.update_one({'_id': ObjectId(usuario['_id'])}, {"$set": {
        'contrasena': request.json['contrasenaMD5']
        }})
        msg = mail.send_message(
            'Recuperación de Contraseña',
            sender='meanoto2021@gmail.com',
            recipients=[usuario['correo']],
            body="La nueva contraseña es: "+request.json['contrasena']
        )
        return jsonify({'message': usuario['_id']}), 200

@app.route('/actualizarContra', methods=['POST'])
def actualizarContra():
    usuario = db.db.usuarios.find_one({"_id": ObjectId(request.json['id'])}, {"contrasena": request.json['provisoria']})
    
    if usuario is None:
        return jsonify({'message': 'Error al obtener usuario'}), 300
    else:

        db.db.usuarios.update_one({'_id': ObjectId(usuario['_id'])}, {"$set": {
        'contrasena': request.json['contrasena']
        }})
        usuario2= db.db.usuarios.find_one({"_id": ObjectId(request.json['id'])})
        if usuario2 is None:
            return jsonify({'message': "OK"}), 200
        else:

            msg = mail.send_message(
                'Recuperación de Contraseña',
                sender='meanoto2021@gmail.com',
                recipients=[usuario2['correo']],
                body="Contraseña cambiada con éxito"
            )
            return jsonify({'message': "OK"}), 200



if __name__ == '__main__':
    app.run(port=8000, debug=True)
