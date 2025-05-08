import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import {BigCalendar, DatePicker} from 'react-flexible-calendar';
import dayjs from 'dayjs';
import '../node_modules/react-flexible-calendar/dist/index.css'

const App = () => {
	const [calendarDate, setCalendarDate] = useState(new Date('2025-04-01'));
	const [date, setDate] = useState(new Date());
	const events = [
		{
			id: 1,
			title: 'Meeting',
			start: new Date('2025-04-01T09:00:00'),
			end: new Date('2025-04-01T09:00:30')
		},
		{
			id: 2,
			title: 'Meeting 2',
			start: new Date('2025-04-01T09:00:00'),
			end: new Date('2025-04-01T10:00:00')
		},
		{
			id: 3,
			title: 'Meeting 3',
			start: new Date('2025-04-01T11:00:00'),
			end: new Date('2025-04-01T16:00:00')
		},
		{
			id: 4,
			title: 'Meeting 4',
			start: new Date('2025-04-01T12:00:00'),
			end: new Date('2025-04-01T14:00:00')
		},
		{
			id: 5,
			title: 'Meeting 5',
			start: new Date('2025-04-01T19:00:00'),
			end: new Date('2025-04-01T21:00:00')
		},
		{
			id: 6,
			title: 'Meeting 6',
			start: new Date('2025-04-02T14:00:00'),
			end: new Date('2025-04-02T15:00:00')
		},
		{
			id: 7,
			title: 'Meeting 7',
			start: new Date('2025-04-02T14:00:00'),
			end: new Date('2025-04-02T16:00:00')
		},
		{
			id: 8,
			title: 'Meeting 8',
			start: new Date('2025-04-02T14:00:00'),
			end: new Date('2025-04-02T17:00:00')
		},
		{
			id: 9,
			title: 'Meeting 9',
			start: new Date('2025-04-03T09:00:00'),
			end: new Date('2025-04-03T11:00:00')
		}
	];
	return (
		<div style={{ maxWidth: '95%', margin: '0 auto', padding: '24px' }}>
			<BigCalendar 
        currentDate={calendarDate}
        events={events} 
				locale="tr"
        onEventClick={(e) => console.log('clicked:', e)}
        onEventHover={(e) => console.log('Hover:', e)}
        className="my-custom-calendar"
        style={{ backgroundColor: '#fcfcfc', borderRadius: '8px', padding: '8px' }}
				viewType={['month', 'week', 'day']}
				dayStartHour={8}
				dayEndHour={22}
				onAdd={(date) => console.log('new event start time:', date)}
  			enableAdd={true}
        onNavigate={(newDate) => {
          console.log('New date:', newDate);
          setCalendarDate(newDate);
        }}
      />
			<DatePicker
				locale="en"
				showTime
				minDate={new Date()}
				maxDate={dayjs().add(4, 'month').toDate()}
				minTime="09:00"
				maxTime="18:00"
				disabled={false}
				timePeriod={5}
				onChange={(d) => setDate(d)}
				inputMode={true}
				format="DD.MM.YYYY HH:mm"
				highlightDays={[
					'2025-05-13',
					new Date('2025-05-19'),
					'2025-05-27'
				]}
				disabledDates={['2025-05-04', '2025-05-20']}
			/>

		</div>
	);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
