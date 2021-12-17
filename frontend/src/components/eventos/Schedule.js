import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
// import TablePagination from '@mui/material/TablePagination';
import MyCalendar from './MyCalendar';

const bloques = [
  {
    label: '8:30 - 9:30',
    value: '1'
  },
  {
    label: '9:40 - 10:40',
    value: '2'
  },
  {
    label: '10:50 - 11:50',
    value: '3'
  },
  {
    label: '12:00 - 13:00',
    value: '4'
  },
  {
    label: '13:10 - 14:10',
    value: '5'
  },
  {
    label: '14:20 - 15:20',
    value: '6'
  },
  {
    label: '15:30 - 16:30',
    value: '7'
  },
  {
    label: '16:40 - 17:40',
    value: '8'
  },
  {
    label: '17:50 - 18:50',
    value: '9'
  },
  {
    label: '19:00 - 20:00',
    value: '10'
  },
  {
    label: '20:10 - 21:10',
    value: '11'
  }
];

export default function Schedule({ events }) {
  const [ eventsList, setEventsList ] = useState([]);

  useEffect( () => {
    const getAllEventDates = function(event) {
      const allDates = [];
      const startDate = strDateToDateObj(event.fecha_inicio_recurrencia);
      const endDate = strDateToDateObj(event.fecha_fin_recurrencia);

      let date = startDate;
      if(event.tipoRecurrencia === 'Semanal') {
        while( dateIsBetween(startDate, endDate, date) ) {
          allDates.push( new Date(date.getTime()) );
          date.setDate( date.getDate() + 7 )
        }
      } else if(event.tipoRecurrencia === 'Mensual') {
        while( dateIsBetween(startDate, endDate, date) ) {
          allDates.push( new Date(date.getTime()) );
          date.setDate( date.getMonth() + 1 )
        }
      } else if(event.tipoRecurrencia === 'Diaria') {
        while( dateIsBetween(startDate, endDate, date) ) {
          allDates.push( new Date(date.getTime()) );
          date.setDate( date.getDate() + 1 )
        }
      } else {
        allDates.push( strDateToDateObj(event.fecha_inicio_recurrencia) )
      }
      return allDates;
    };

    function getEventInstances(event, dates) {
      return dates.map( d => (
        {
          title: event.nombre,
          allDay: false,
          start: getStartDate(event, d),
          end: getEndDate(event, d)
        }
      ));
    };

    function getStartDate(event, date) {
      const blockStartTime = getBlockStartTime(event.bloque)
      const year = date.getYear() + 1900;
      const month = date.getMonth();
      const day = date.getDate();
      const [ startHour, startMinute ] = blockStartTime.split(':');
      return new Date( year, month, day, startHour, startMinute);
    };

    function getEndDate(event, date) {
      const blockEndTime = getBlockEndTime(event.bloque)
      const year = date.getYear() + 1900;
      const month = date.getMonth();
      const day = date.getDate();
      const [ endHour, endMinute ] = blockEndTime.split(':');
      return new Date( year, month, day, endHour, endMinute);
    };

    const list = [];
    events.forEach( e => {
      const all = getAllEventDates(e);
      const instances = getEventInstances(e, all);
      instances.forEach( i => list.push(i) )
    } );
    setEventsList(list);
  }, [events]);


  function dateIsBetween(min, max, date) {
    return(
      date.getTime() <= max.getTime() && date.getTime() >= min.getTime()
    )
  }

  function strDateToDateObj(strDate) {
    const dateArray = strDate.split('/');
    const year = dateArray[2];
    const month = dateArray[1];
    const day = dateArray[0];
    return new Date(year, parseInt(month) - 1, day);
  }

  function getBlockStartTime(value) {
    return bloques.find( b => b.value == value ).label.split(' ')[0];
  }

  function getBlockEndTime(value) {
    return bloques.find( b => b.value == value ).label.split(' ')[2];
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <MyCalendar events={eventsList}/>
    </Paper>
  );
}
