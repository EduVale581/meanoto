import BasicTabs from '../BasicTabs';
import Schedule from './Schedule';
import EventSearchTable from './EventSearchTable';

export default function EventsTab() {
  const panels = [
    {
      label: "Eventos Semana Actual",
      component: <Schedule />,
    },
    {
      label: "Búsqueda",
      component: <EventSearchTable/>
    }

  ];

  return(
    <BasicTabs panels={panels}/>
  );
}
