import EventIcon from '@mui/icons-material/Event';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import HomeIcon from '@mui/icons-material/Home';
import ClassIcon from '@mui/icons-material/Class';
import GroupIcon from '@mui/icons-material/Group';

// ----------------------------------------------------------------------

const sidebarConfig = [
  {
    title: 'Inicio',
    path: '/dashboard/app',
    icon: <HomeIcon />
  },
  {
    title: 'eventos',
    path: '/dashboard/evento',
    icon: <EventIcon />
  },
  {
    title: 'salas',
    path: '/dashboard/sala',
    icon: <LocationCityIcon />
  },
  {
    title: 'modulos',
    path: '/dashboard/modulo',
    icon: <ClassIcon/>
  },
  {
    title: 'profesores',
    path: '/dashboard/profesores',
    icon: <GroupIcon/>
  },

];

export default sidebarConfig;
