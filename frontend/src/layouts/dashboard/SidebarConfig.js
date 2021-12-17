import EventIcon from '@mui/icons-material/Event';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import HomeIcon from '@mui/icons-material/Home';
import ClassIcon from '@mui/icons-material/Class';
import GroupIcon from '@mui/icons-material/Group';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

// ----------------------------------------------------------------------

const sidebarConfig = [
  {
    title: 'Inicio',
    path: '/dashboard/app',
    icon: <HomeIcon />,
    usuarios: ["ADMIN", "OPERATIVO", "PROFESOR", "ESTUDIANTE"]
  },
  {
    title: 'eventos',
    path: '/dashboard/evento',
    icon: <EventIcon />,
    usuarios: ["ADMIN", "OPERATIVO", "PROFESOR", "ESTUDIANTE"]
  },
  {
    title: 'salas',
    path: '/dashboard/sala',
    icon: <LocationCityIcon />,
    usuarios: ["ADMIN", "OPERATIVO"]
  },
  {
    title: 'módulos',
    path: '/dashboard/modulo',
    icon: <ClassIcon />,
    usuarios: ["ADMIN", "OPERATIVO", "PROFESOR", "ESTUDIANTE"]
  },
  {
    title: 'profesores',
    path: '/dashboard/profesores',
    icon: <GroupIcon />,
    usuarios: ["ADMIN", "OPERATIVO"]
  },
  {
    title: 'estudiantes',
    path: '/dashboard/estudiantes',
    icon: <GroupIcon />,
    usuarios: ["ADMIN", "OPERATIVO"]
  },
  {
    title: 'facultades',
    path: '/dashboard/facultades',
    icon: <AccountBalanceIcon />,
    usuarios: ["ADMIN"]
  },

];

export default sidebarConfig;
