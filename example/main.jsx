import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import BigCalendar from '../src/BigCalendar';
import DatePicker from '../src/DatePicker';
import dayjs from 'dayjs';


const events = [
	{
		id: 1,
		title: '9 dan 9 bucuğa',
		start: new Date('2025-04-01T09:00:00'),
		end: new Date('2025-04-01T09:00:30')
	},
	{
		id: 2,
		title: '9 dan 10 a kadar',
		start: new Date('2025-04-01T09:00:00'),
		end: new Date('2025-04-01T10:00:00')
	},
	{
		id: 3,
		title: '11 den 16 ya kadar',
		start: new Date('2025-04-01T11:00:00'),
		end: new Date('2025-04-01T16:00:00')
	},
	{
		id: 4,
		title: '12 den 14 e kadar',
		start: new Date('2025-04-01T12:00:00'),
		end: new Date('2025-04-01T14:00:00')
	},
	{
		id: 4,
		title: '14 den 21 e kadar',
		start: new Date('2025-04-01T19:00:00'),
		end: new Date('2025-04-01T21:00:00')
	},
	{
		id: 5,
		title: '14 den 15 e kadar',
		start: new Date('2025-04-02T14:00:00'),
		end: new Date('2025-04-02T15:00:00')
	},
	{
		id: 6,
		title: '14 den 16 e kadar',
		start: new Date('2025-04-02T14:00:00'),
		end: new Date('2025-04-02T16:00:00')
	},
	{
		id: 7,
		title: '14 den 17 e kadar',
		start: new Date('2025-04-02T14:00:00'),
		end: new Date('2025-04-02T17:00:00')
	},
	{
		id: 8,
		title: '14 den 17 e kadar',
		start: new Date('2025-04-03T09:00:00'),
		end: new Date('2025-04-03T11:00:00')
	}
];


const App = () => {
	const [calendarDate, setCalendarDate] = useState(new Date('2025-04-01'));
	const [date, setDate] = useState(new Date());

	return (
		<div style={{ maxWidth: '95%', margin: '0 auto', padding: '24px' }}>
			{/* <BigCalendar 
        currentDate={calendarDate}
        events={events} 
				locale="tr"
        onEventClick={(e) => console.log('Tıklandı:', e)}
        onEventHover={(e) => console.log('Hover:', e)}
        className="my-custom-calendar"
        style={{ backgroundColor: '#fcfcfc', borderRadius: '8px', padding: '8px' }}
				viewType={['month', 'week', 'day']}
				dayStartHour={8}
				dayEndHour={22}
				onAdd={(date) => console.log('Yeni etkinlik için başlangıç:', date)}
  			enableAdd={true}
        onNavigate={(newDate) => {
          console.log('Yeni tarih:', newDate);
          setCalendarDate(newDate);
        }}
      /> */}
			{console.log('selectedDate', date)}
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
