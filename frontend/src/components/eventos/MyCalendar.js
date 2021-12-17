import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import moment from "moment"
import 'moment/locale/es';

const localizer = momentLocalizer(moment)

const min = new Date();
min.setHours(8, 30, 0);
const max = new Date();
max.setHours(22, 0, 0);
const messages = {
  allDay: 'Todo el día',
  previous: 'Anterior',
  next: 'Siguiente',
  today: 'Hoy',
  month: 'Mes',
  week: 'Semana',
  day: 'Día',
};

export default function MyCalendar({ events }) {
  return(
    <div>
      <Calendar
        endAccessor="end"
        events={events}
        localizer={localizer}
        max={max}
        messages={messages}
        min={min}
        popup={true}
        startAccessor="start"
        step={35}
        style={{ height: 500 }}
        views={['month', 'day']}
      />
    </div>
  )
}
