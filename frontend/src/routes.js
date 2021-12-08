import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardApp from './pages/DashboardApp';
import NotFound from './pages/Page404';
import Eventos from './pages/Eventos';
import Salas from './pages/Salas';
import Modulos from './pages/Modulos';
import Profesores from './pages/Profesores';
import Estudiantes from './pages/Estudiantes';
import Facultades from './pages/Facultades';
import { UsuarioProvider } from './context/usuarioContext';
import RecuperarContrasena from './pages/RecuperarContrasena';

// ----------------------------------------------------------------------

export default function Router() {
  const token = window.localStorage.getItem("token");
  return useRoutes([
    {
      path: '/dashboard',
      element: token ? <UsuarioProvider><DashboardLayout /></UsuarioProvider> : <Navigate to="/login" />,
      children: [
        { element: <Navigate to="/dashboard/app" replace /> },
        { path: 'app', element: <DashboardApp /> },
        { path: 'evento', element: <Eventos /> },
        { path: 'sala', element: <Salas /> },
        { path: 'modulo', element: <Modulos /> },
        { path: 'profesores', element: <Profesores /> },
        { path: 'estudiantes', element: <Estudiantes /> },
        { path: 'facultades', element: <Facultades /> },
      ]
    },
    {
      path: '/',
      element: !token ? <LogoOnlyLayout /> : <Navigate to="/app/dashboard" />,
      children: [
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: 'recuperar', element: <RecuperarContrasena /> },
        { path: '/', element: <Navigate to="/dashboard" /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
