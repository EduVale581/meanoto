import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import alertTriangleFill from '@iconify/icons-eva/alert-triangle-fill';
import EventIcon from '@mui/icons-material/Event';

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'Inicio',
    path: '/dashboard/app',
    icon: getIcon(pieChart2Fill)
  },
  {
    title: 'eventos',
    path: '/dashboard/evento',
    icon: <EventIcon />
  },
  {
    title: 'salas',
    path: '/dashboard/sala',
    icon: getIcon(alertTriangleFill)
  },
  {
    title: 'modulos',
    path: '/dashboard/modulo',
    icon: getIcon(alertTriangleFill)
  },


  {
    title: 'Not found',
    path: '/404',
    icon: getIcon(alertTriangleFill)
  }
];

export default sidebarConfig;
