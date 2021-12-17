import React, { useState, useCallback, useEffect, useRef} from 'react';

import BasicTabs from '../BasicTabs';
import Schedule from './Schedule';
import EventSearchTable from './EventSearchTable';
import { getEventos } from '../../api/Api';

export default function EventsTab() {
  const isMounted = useRef(true);
  const [events, setEvents] = useState([]);

  const fetchEvents = useCallback(
    async function() {
      const eventsAux = await getEventos();
      console.log("eventsAux", eventsAux);
      if(isMounted.current) {
        setEvents(eventsAux);
      }
    },[]
  );

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // const updateUI = (newEvent) => {
  //   setEvents( prev => [...prev, newEvent] )
  // }

  const panels = [
    {
      label: "Mis eventos",
      component: <Schedule events={ events }/>,
    },
    {
      label: "Búsqueda",
      component: <EventSearchTable events={ events }/>
    }
  ];

  return(
    <BasicTabs panels={panels}/>
  );
}
