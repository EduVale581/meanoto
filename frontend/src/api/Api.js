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
        else {
            return -1;
        }

    }
    catch {
        return -1;
    }
};

export { getProfesores };

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
    dbx,
    API
};
