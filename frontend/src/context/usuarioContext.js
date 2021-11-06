import React, { useState, useEffect, useMemo, useContext } from 'react';
import Api from 'src/api/Api';

const UsuarioContext = React.createContext();
export function UsuarioProvider(props) {

    const [user, setUser] = useState(null);
    const [cargandoUsuario, setCargandoUsuario] = useState(false);

    const token = window.localStorage.getItem("token");
    const idUsuario = window.localStorage.getItem("user");


    useEffect(() => {
        async function datoFinal() {

            const data = await Api.cargarUsuario(token, idUsuario);
            if (data === 401) {
                window.localStorage.removeItem("token");
                window.localStorage.removeItem("user");
                window.location.href = "/login"
            }
            else if (data === 403) {
                window.localStorage.removeItem("token");
                window.localStorage.removeItem("user");
                window.location.href = "/login"

            }
            else if (data === -1) {
                window.localStorage.removeItem("token");
                window.localStorage.removeItem("user");
                window.location.href = "/login"

            }
            else {
                setUser(data);
            }

        }
        datoFinal();


    }, [token, idUsuario])

    const value = useMemo(() => {
        return ({
            user,
            setUser,
            cargandoUsuario,
            setCargandoUsuario
        });
    }, [user]);

    return <UsuarioContext.Provider value={value} {...props} />

}

export function useUsuario() {
    const context = useContext(UsuarioContext);

    if (!context) {
        throw new Error("useUsuario debe estar dentro del proveedor Usuario Context");
    }
    return context;
}
