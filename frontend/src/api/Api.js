import * as Dropbox from "dropbox";
const ACCESS_TOKEN =
    "tqNg1q6lWygAAAAAAAAAARN-TPPDgpDCV18QtmdhiG_61Xk3zZFQwFPvKFjv5FdU";
const dbx = new Dropbox.Dropbox({ accessToken: ACCESS_TOKEN });
const API = "http://127.0.0.1:8000";

async function cargarUsuario(token, idUsuario) {
    if (token && idUsuario && token !== "" && idUsuario !== "") {
        let bodyFetch = { id: idUsuario };


        try {
            const resp = await fetch(`${API}/usuario`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(bodyFetch),
            });



            if (!resp.ok) return -1;

            else if (resp.status === 403) {
                return 403;
            }
            else if (resp.status === 401) {
                return 401;

            }
            else if (resp.status === 300) {
                return 300;

            }
            else if (resp.status === 200) {
                const data = await resp.json();
                return data;

            }
            else {
                return -1;
            }

        }
        catch {
            return null;

        }


    }
    else {
        return -1;
    }
}

async function verificarTexto(link) {
    try {
        const resp = await fetch(`${API}/obtenertexto`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ link: link }),
        });



        if (!resp.ok) return -1;

        else if (resp.status === 403) {
            return 403;
        }
        else if (resp.status === 401) {
            return 401;

        }
        else if (resp.status === 300) {
            return 300;

        }
        else if (resp.status === 200) {
            const data = await resp.json();
            return data;

        }
        else {
            return -1;
        }

    }
    catch {
        return -1;

    }
}

async function registroEstudiante(bodyFetch) {
    try {
        const resp = await fetch(`${API}/registro`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyFetch),
        });



        if (!resp.ok) return -1;

        else if (resp.status === 403) {
            return 403;
        }
        else if (resp.status === 401) {
            return 401;

        }
        else if (resp.status === 300) {
            return 300;

        }
        else if (resp.status === 200) {
            const data = await resp.json();
            return data;

        }
        else {
            return -1;
        }

    }
    catch {
        return -1;

    }
}

async function obtenerToken(rut, password) {
    try {
        const resp = await fetch(`${API}/token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rut: rut, password: password })
        })

        if (!resp.ok) return -1;

        if (resp.status === 401) {
            return 401;
        }
        else if (resp.status === 400) {
            return 400;
        }
        const data = await resp.json();
        return data;

    }
    catch {
        return -1;


    }
}

async function getModulos(setModulosArreglo, setModulosMostrar, setModulosServidor, facultadSeleccionadaFiltro, carreraSeleccionadaFiltro) {
    try {
        const token = window.localStorage.getItem('token');

        const resp = await fetch(`${API}/modulos`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            }
        })
        if (!resp.ok) return -1;

        else if (resp.status === 403) {
            return 403;
        }
        else if (resp.status === 401) {
            return 401;
        }
        else if (resp.status === 200) {
            const data = await resp.json();
            setModulosArreglo(data)
            if (facultadSeleccionadaFiltro === "Sin filtro") {
                setModulosMostrar(data)

            }
            if (carreraSeleccionadaFiltro === "Sin filtro" && facultadSeleccionadaFiltro === "Sin filtro") {
                setModulosMostrar(data)

            }
            else if (carreraSeleccionadaFiltro === "Sin filtro" && facultadSeleccionadaFiltro !== "Sin filtro") {
                setModulosMostrar(data.filter((e) => e.facultad === facultadSeleccionadaFiltro))

            }
            else {
                setModulosMostrar(data.filter((e) => e.facultad === facultadSeleccionadaFiltro && e.carrera === carreraSeleccionadaFiltro))
            }
        }
        else {
            return -1;
        }



    }
    catch {
        setModulosServidor(true)

    }
};

async function getModulos2() {
    try {
        const token = window.localStorage.getItem('token');

        const resp = await fetch(`${API}/modulos`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            }
        })


        if (resp.status === 403) {
            return 403;
        }
        else if (resp.status === 401) {
            return 401;
        }
        else if (resp.status === 200) {
            const data = await resp.json();
            return data;
        }
        else if (!resp.ok) return -1;
        else {
            return -1;
        }



    }
    catch {
        return -1;

    }
};

async function crearNuevoModulo(nombre, facultadSeleccionadaModal, nro_alumnos, carreraSeleccionadaModal, setModulosArreglo, setModulosMostrar, setModulosServidor, facultadSeleccionadaFiltro, carreraSeleccionadaFiltro, setLoadingCrearModulo, setOpenCrearModulo) {
    const token = window.localStorage.getItem('token');

    try {
        setLoadingCrearModulo(true)
        let nuevoModulo = {
            nombre: nombre,
            profesor: "",
            facultad: facultadSeleccionadaModal,
            nro_alumnos: nro_alumnos,
            eventos: [],
            carrera: carreraSeleccionadaModal
        }
        const resp = await fetch(`${API}/modulos`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(nuevoModulo),
        })
        if (!resp.ok) return -1;

        else if (resp.status === 403) {
            return 403;
        }
        else if (resp.status === 401) {
            return 401;
        }
        else if (resp.status === 200) {
            const data = await resp.json();
            const obtenerDatoModulo = getModulos(setModulosArreglo, setModulosMostrar, setModulosServidor, facultadSeleccionadaFiltro, carreraSeleccionadaFiltro)
            setLoadingCrearModulo(false)
            setOpenCrearModulo(false)
            return 200;
        }
        else {
            return -1;
        }

    }
    catch {
        return -1;

    }
};

async function guardarCantidadEstudiantes(id, cantEstudiantes, profesorSeleccionado, setLoadingEditar, setOpenEditarCantidadAlumnos, setModulosArreglo, setModulosMostrar, setModulosServidor, facultadSeleccionadaFiltro, carreraSeleccionadaFiltro) {
    try {
        setLoadingEditar(true);
        let editarModulo = {
            nro_alumnos: cantEstudiantes,
            profesor: profesorSeleccionado,
        }
        const token = window.localStorage.getItem('token');
        const resp = await fetch(`${API}/modulos/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(editarModulo),
        });

        if (!resp.ok) return -1;

        else if (resp.status === 403) {
            return 403;
        }
        else if (resp.status === 401) {
            return 401;
        }
        else if (resp.status === 200) {
            const data = await resp.json();
            const obtenerDatoModulo = getModulos(setModulosArreglo, setModulosMostrar, setModulosServidor, facultadSeleccionadaFiltro, carreraSeleccionadaFiltro);
            setLoadingEditar(false);
            setOpenEditarCantidadAlumnos(false)
            return data;

        }
        else if (resp.status === 300) {
            return 300;

        }
        else {
            return -1;
        }

    }
    catch {
        return -1;
    }
};

async function getProfesores() {
    try {
        const token = window.localStorage.getItem('token');

        const resp = await fetch(`${API}/profesores`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            },
        });

        if (!resp.ok) return -1;

        else if (resp.status === 403) {
            return 403;
        }
        else if (resp.status === 401) {
            return 401;
        }
        else if (resp.status === 200) {
            const data = await resp.json();
            return data;
        }
        else {
            return -1;
        }
    }
    catch {
        return -1;
    }
};

async function crearProfesor(payload) {
    try {
        const token = window.localStorage.getItem('token');
        const resp = await fetch(`${API}/profesores`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(payload),
        });

        if (!resp.ok) return -1;

        else if (resp.status === 403) {
            return 403;
        }
        else if (resp.status === 401) {
            return 401;

        }
        else if (resp.status === 300) {
            return 300;

        }
        else if (resp.status === 200) {
            const data = await resp.json();
            return data;
        }
        else if (resp.status === 300) {
            return 300;

        }
        else {
            return -1;
        }

    }
    catch {
        return -1;

    }
}

async function actualizarSala(sala) {
    try {
        const token = window.localStorage.getItem('token');
        const resp = await fetch(`${API}/actualizarSala`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(sala),
        });



        if (resp.status === 403) {
            return 403;
        }
        else if (resp.status === 401) {
            return 401;

        }
        else if (resp.status === 300) {
            return 300;

        }
        else if (resp.status === 200) {
            const data = await resp.json();
            return data;
        }
        else if (resp.status === 300) {
            return 300;

        }
        else if (!resp.ok) return -1;
        else {
            return -1;
        }

    }
    catch {
        return -1;

    }
}

async function eliminarProfesor(id) {
    try {
        const token = window.localStorage.getItem('token');
        const resp = await fetch(`${API}/profesores/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            },
        });
        return resp.status;
    }
    catch {
        return -1;
    }
}

async function eliminarSala(id) {
    try {
        const token = window.localStorage.getItem('token');
        const resp = await fetch(`${API}/salas/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            },
        });
        return resp.status;
    }
    catch {
        return -1;
    }
}

async function obtenerModulos() {
    try {
        const token = window.localStorage.getItem('token');

        const resp = await fetch(`${API}/modulos`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            }
        })

        if (!resp.ok) return -1;

        else if (resp.status === 403) {
            return 403;
        }
        else if (resp.status === 401) {
            return 401;
        }

        else if (resp.status === 200) {
            return await resp.json();
        }
        else {
            return -1;
        }
    }
    catch (err) {

    }
};

async function obtenerSalas() {
    try {
        const token = window.localStorage.getItem('token');

        const resp = await fetch(`${API}/salas`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            }
        })



        if (resp.status === 403) {
            return 403;
        }
        else if (resp.status === 401) {
            return 401;
        }

        else if (resp.status === 200) {
            return await resp.json();
        }
        else if (!resp.ok) return -1;
        else {
            return -1;
        }
    }
    catch (err) {

    }
};

async function eliminarModulo(id, setLoadingEliminar, setModulosArreglo, setModulosMostrar, setModulosServidor, facultadSeleccionadaFiltro, carreraSeleccionadaFiltro) {
    try {
        setLoadingEliminar(true);
        const token = window.localStorage.getItem('token');

        const resp = await fetch(`${API}/modulos/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            },
        });

        if (!resp.ok) return -1

        else if (resp.status === 403) {
            return 403;
        }
        else if (resp.status === 401) {
            return 401;
        }
        else if (resp.status === 200) {
            const data = await resp.json();
            const obtenerDatoModulo = getModulos(setModulosArreglo, setModulosMostrar, setModulosServidor, facultadSeleccionadaFiltro, carreraSeleccionadaFiltro);
            setLoadingEliminar(false);
            return data;

        }
        else if (resp.status === 300) {
            return 300;

        }
        else {
            return -1;
        }

    }
    catch {
        return -1;
    }
};


async function enviarContrasena(rut, contrasena, contrasenaMD5) {
    try {

        const resp = await fetch(`${API}/contrasenaProvisoria`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ rut: rut, contrasena: contrasena, contrasenaMD5: contrasenaMD5 }),
        });



        if (resp.status === 403) {
            return 403;
        }
        else if (resp.status === 401) {
            return 401;
        }
        else if (resp.status === 200) {
            const data = await resp.json();
            return data;

        }
        else if (resp.status === 300) {
            return 300;

        }
        else if (!resp.ok) return -1
        else {
            return -1;
        }

    }
    catch {
        return -1;
    }

};

async function cambiarContrasena(id, provisoria, contrasena) {
    try {

        const resp = await fetch(`${API}/actualizarContra`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: id, provisoria: provisoria, contrasena: contrasena }),
        });



        if (resp.status === 403) {
            return 403;
        }
        else if (resp.status === 401) {
            return 401;
        }
        else if (resp.status === 200) {
            const data = await resp.json();
            return data;

        }
        else if (resp.status === 300) {
            return 300;

        }
        else if (!resp.ok) return -1
        else {
            return -1;
        }

    }
    catch {
        return -1;
    }

};

async function getEstudiantes() {
    try {
        const token = window.localStorage.getItem('token');

        const resp = await fetch(`${API}/estudiantes`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            }
        })


        if (resp.status === 403) {
            return 403;
        }
        else if (resp.status === 401) {
            return 401;
        }
        else if (resp.status === 300) {
            return 300;
        }
        else if (resp.status === 200) {
            const data = await resp.json();
            return data;
        }
        else if (!resp.ok) return -1;
        else {
            return -1;
        }



    }
    catch {
        return -1;

    }
};

async function getFacultades() {
    try {
        const token = window.localStorage.getItem('token');

        const resp = await fetch(`${API}/facultades`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            }
        })


        if (resp.status === 403) {
            return 403;
        }
        else if (resp.status === 401) {
            return 401;
        }
        else if (resp.status === 300) {
            return 300;
        }
        else if (resp.status === 200) {
            const data = await resp.json();
            return data;
        }
        else if (!resp.ok) return -1;
        else {
            return -1;
        }



    }
    catch {
        return -1;

    }
};

async function validarEstudiante(id, validado) {
    try {
        const token = window.localStorage.getItem('token');

        const resp = await fetch(`${API}/validarEstudiante`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ id: id, validado: validado })
        })


        if (resp.status === 403) {
            return 403;
        }
        else if (resp.status === 401) {
            return 401;
        }
        else if (resp.status === 300) {
            return 300;
        }
        else if (resp.status === 200) {
            const data = await resp.json();
            return data;
        }
        else if (!resp.ok) return -1;
        else {
            return -1;
        }
    }
    catch {
        return -1;

    }
};

async function actualizarCarreraFacultad(id, facultad, carrera) {
    try {
        const token = window.localStorage.getItem('token');

        const resp = await fetch(`${API}/modificarCarreraFacultadEstudiante`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ id: id, facultad: facultad, carrera: carrera })
        })


        if (resp.status === 403) {
            return 403;
        }
        else if (resp.status === 401) {
            return 401;
        }
        else if (resp.status === 300) {
            return 300;
        }
        else if (resp.status === 200) {
            const data = await resp.json();
            return data;
        }
        else if (!resp.ok) return -1;
        else {
            return -1;
        }
    }
    catch {
        return -1;

    }
};

async function crearSala(sala) {
    try {
        const token = window.localStorage.getItem('token');

        const resp = await fetch(`${API}/salas`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(sala)
        })


        if (resp.status === 403) {
            return 403;
        }
        else if (resp.status === 401) {
            return 401;
        }
        else if (resp.status === 300) {
            return 300;
        }
        else if (resp.status === 200) {
            const data = await resp.json();
            return data;
        }
        else if (!resp.ok) return -1;
        else {
            return -1;
        }
    }
    catch {
        return -1;

    }
};

async function actualizarModuloEstudiante(id, modulos) {
    try {
        const token = window.localStorage.getItem('token');

        const resp = await fetch(`${API}/actualizarModuloEstudiante`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ id: id, modulos: modulos })
        })


        if (resp.status === 403) {
            return 403;
        }
        else if (resp.status === 401) {
            return 401;
        }
        else if (resp.status === 300) {
            return 300;
        }
        else if (resp.status === 200) {
            const data = await resp.json();
            return data;
        }
        else if (!resp.ok) return -1;
        else {
            return -1;
        }
    }
    catch {
        return -1;

    }
};

async function obtenerEstudiante(id) {
    try {
        const token = window.localStorage.getItem('token');

        const resp = await fetch(`${API}/estudiantes/${id}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            },
        })


        if (resp.status === 403) {
            return 403;
        }
        else if (resp.status === 401) {
            return 401;
        }
        else if (resp.status === 300) {
            return 300;
        }
        else if (resp.status === 200) {
            const data = await resp.json();
            return data;
        }
        else if (!resp.ok) return -1;
        else {
            return -1;
        }
    }
    catch {
        return -1;

    }
};

async function generarCodigo() {
    try {
        const token = window.localStorage.getItem('token');

        const resp = await fetch(`${API}/generarCodigoEvento`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            },
        })


        if (resp.status === 403) {
            return 403;
        }
        else if (resp.status === 401) {
            return 401;
        }
        else if (resp.status === 300) {
            return 300;
        }
        else if (resp.status === 200) {
            const data = await resp.json();
            return data;
        }
        else if (!resp.ok) return -1;
        else {
            return -1;
        }
    }
    catch {
        return -1;

    }
};

async function agregarEvento(evento) {
    try {
        const token = window.localStorage.getItem('token');

        const resp = await fetch(`${API}/crearEvento`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(evento)
        })


        if (resp.status === 403) {
            return 403;
        }
        else if (resp.status === 401) {
            return 401;
        }
        else if (resp.status === 300) {
            return 300;
        }
        else if (resp.status === 200) {
            const data = await resp.json();
            return data;
        }
        else if (!resp.ok) return -1;
        else {
            return -1;
        }
    }
    catch {
        return -1;

    }
};

async function eliminarEstudiante(id) {
    try {
        const token = window.localStorage.getItem('token');

        const resp = await fetch(`${API}/estudiantes/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            },
        });


        if (resp.status === 403) {
            return 403;
        }
        else if (resp.status === 401) {
            return 401;
        }
        else if (resp.status === 300) {
            return 300;
        }
        else if (resp.status === 200) {
            const data = await resp.json();
            return data;
        }
        else if (!resp.ok) return -1;
        else {
            return -1;
        }
    }
    catch {
        return -1;

    }
};

async function getEventos() {
    try {
        const token = window.localStorage.getItem('token');
        const resp = await fetch(`${API}/eventos`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
            }
        })
        if (!resp.ok) return -1;
        if (resp.status === 200) {
            return await resp.json();
        }
        return -1;
    }
    catch (err) { }
}

export {
    getEventos,
    getProfesores,
    crearProfesor,
    eliminarProfesor,
    obtenerModulos
};

export default {
    cargarUsuario,
    obtenerToken,
    getModulos,
    crearNuevoModulo,
    guardarCantidadEstudiantes,
    getProfesores,
    eliminarModulo,
    registroEstudiante,
    verificarTexto,
    enviarContrasena,
    cambiarContrasena,
    getEstudiantes,
    validarEstudiante,
    eliminarEstudiante,
    getFacultades,
    getModulos2,
    actualizarCarreraFacultad,
    actualizarModuloEstudiante,
    obtenerEstudiante,
    generarCodigo,
    agregarEvento,
    obtenerSalas,
    crearSala,
    eliminarSala,
    actualizarSala,
    dbx,
    API
};
