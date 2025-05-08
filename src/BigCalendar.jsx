import React, { useState } from 'react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import './BigCalendar.css';
import { getOverlappingGroups } from './utils/calendarHelpers';
import ChevronLeftIcon from './assets/images/icons/ChevronLeftIcon'
import ChevronRightIcon from './assets/images/icons/ChevronRightIcon'
import PlusIcon from './assets/images/icons/PlusIcon';
import CalenderIcon from './assets/images/icons/CalenderIcon';
import { getCalendarLocale } from './utils/calendarLocale';
dayjs.extend(isBetween);

function BigCalendar({
	events = [],
	defaultDate = new Date(),
	currentDate: controlledDate,
	onEventClick = () => { },
	onEventHover = () => { },
	onNavigate = () => { },
	className = '',
	style = {},
	locale = 'en',
	viewType = ['month', 'week', 'day'],
	dayStartHour = 0,
	dayEndHour = 24,
	enableAdd = true,
	onAdd = () => { },
}) {
	const isControlled = controlledDate !== undefined;
	const [internalDate, setInternalDate] = useState(dayjs(defaultDate));
	const currentDate = isControlled ? dayjs(controlledDate) : internalDate;
	const allowedViews = viewType?.length ? viewType : ['month', 'week', 'day'];
	const [view, setView] = useState(allowedViews[0]);
	const { weekdaysShort, periodLabels } = getCalendarLocale(locale);

	let start, end;

	if (view === 'month') {
		start = currentDate.startOf('month').startOf('week');
		end = currentDate.endOf('month').endOf('week');
	} else if (view === 'week') {
		start = currentDate.startOf('week');
		end = currentDate.endOf('week');
	} else {
		start = currentDate.startOf('day');
		end = currentDate.endOf('day');
	}

	const days = [];
	let day = start;

	while (day.isBefore(end) || day.isSame(end, 'day')) {
		days.push(day);
		day = day.add(1, 'day');
	}

	const updateDate = (newDate) => {
		onNavigate(newDate.toDate());
		if (!isControlled) {
			setInternalDate(newDate);
		}
	};

	const handlePrev = () => {
		updateDate(currentDate.subtract(1, view));
	};

	const handleNext = () => {
		updateDate(currentDate.add(1, view));
	};

	const hours = Array.from(
		{ length: dayEndHour - dayStartHour },
		(_, i) => i + dayStartHour
	); const handleDayClick = (d) => {
		if (!allowedViews.includes('day')) return;
		updateDate(d.startOf('day'));
		setView('day');
	};

	return (
		<div className={`big-calendar ${className}`} style={style}>
			{allowedViews?.length > 1 &&
				<div className="big-calendar-view-switch">
					{allowedViews.map((id) => (
						<button
							key={id}
							className={`big-calendar-period-btn ${view === id ? 'period-active' : ''}`}
							onClick={() => setView(id)}
						>
							{periodLabels[id]}
						</button>
					))}
				</div>
			}
			<div className="big-calendar-header">
				<button className='big-calendar-arrow-btn' onClick={handlePrev}>
					<ChevronLeftIcon className="icon" size={20} />
				</button>
				{currentDate.locale(locale).format(view === 'day' ? 'DD MMMM YYYY' : 'MMMM YYYY')}
				<button className='big-calendar-arrow-btn' onClick={handleNext}>
					<ChevronRightIcon className="icon" size={20} />
				</button>
			</div>
			{view === 'day' && allowedViews.includes('day') ?
				<div className="big-calendar-day-view">
					{hours.map((hour) => {
						const slotStart = currentDate.hour(hour).minute(0);
						const slotEnd = slotStart.add(1, 'hour');

						const hourEvents = events.filter((evt) =>
							dayjs(evt.start).isBefore(slotEnd) && dayjs(evt.end).isAfter(slotStart)
						);

						const groups = getOverlappingGroups(hourEvents);

						return (
							<div key={hour} className="big-calendar-hour-row">
								{enableAdd && (
									<div
										className="bc-add-btn-day"
										style={{ right: 8, top: 8 }}
										onClick={(e) => { e.stopPropagation(); onAdd(slotStart.toDate()); }}
									>					<PlusIcon className="bc-plus" />
									</div>
								)}
								<div className="big-calendar-hour-label">{slotStart.format('HH:mm')}</div>
								<div className="big-calendar-hour-content">
									{groups.flatMap((group, i) =>
										group.map((evt, j) => {
											const width = 100 / group.length;
											const left = j * width;

											return (
												<div
													key={evt.id}
													className="big-calendar-event overlap"
													style={{
														position: 'absolute',
														left: `${left}%`,
														width: `${width - 1}%`,
														top: `${top}px`,
														height: '75%',
														backgroundColor: '#e5ffee',
														color: '#009031',
														fontSize: '10px',
														borderRadius: '4px',
														padding: '4px',
														boxSizing: 'border-box',
														overflow: 'hidden',
														cursor: 'pointer',
														fontWeight: 600
													}}
													onClick={() => onEventClick(evt)}
													onMouseEnter={() => onEventHover(evt)}
												>
													{evt.title}
													<div style={{ fontSize: '9px', opacity: 0.8 }}>
														{dayjs(evt.start).format('HH:mm')} - {dayjs(evt.end).format('HH:mm')}
													</div>
												</div>
											);
										})
									)}
								</div>
							</div>
						);
					})}
				</div>
				:
				<div className="big-calendar-grid">
					{view !== 'day' && weekdaysShort.map((d) => (
						<div key={d} className="big-calendar-weekday">{d}</div>
					))}

					{days.map((dayItem, index) => {
						const dayEvents = events.filter(evt =>
							dayjs(evt.start).isSame(dayItem, 'day')
						);

						return (
							<div key={index} className="big-calendar-day" onClick={() => handleDayClick(dayItem)}>
								<div className="big-calendar-day-number">{dayItem.format('D')}</div>
								{enableAdd && (
									<div
										className="bc-add-btn"
										onClick={(e) => { e.stopPropagation(); onAdd(dayItem.startOf('day').toDate()); }}
									>
										<PlusIcon className="bc-plus" />
									</div>
								)}
								{allowedViews.includes('day') && (
									<div
										className="bc-day-detail-btn"
										onClick={(e) => { e.stopPropagation(); handleDayClick(dayItem) }}
									>
										<CalenderIcon className="bc-plus" />
									</div>
								)}
								{dayEvents.map((evt) => (
									<div
										key={evt.id}
										className="big-calendar-event"
										onClick={(e) => { e.stopPropagation(); onEventClick(evt) }}
										onMouseEnter={() => onEventHover(evt)}
									>
										{evt.title}
									</div>
								))}
							</div>
						);
					})}
				</div>
			}

		</div>
	);
}

export default BigCalendar;