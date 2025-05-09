// -----------------------------------------------------------------------------
// BigCalendar.jsx   (locale‑aware weekday headers)
// -----------------------------------------------------------------------------
import React, { useState } from 'react';
import dayjs from 'dayjs';
import isBetween      from 'dayjs/plugin/isBetween';
import isoWeek        from 'dayjs/plugin/isoWeek';
import localeData     from 'dayjs/plugin/localeData';

import './BigCalendar.css';
import { getOverlappingGroups } from './utils/calendarHelpers';

import ChevronLeftIcon  from './assets/images/icons/ChevronLeftIcon';
import ChevronRightIcon from './assets/images/icons/ChevronRightIcon';
import PlusIcon         from './assets/images/icons/PlusIcon';
import CalendarIcon     from './assets/images/icons/CalenderIcon';

import { getCalendarLocale } from './utils/calendarLocale';

dayjs.extend(isBetween);
dayjs.extend(isoWeek); 
dayjs.extend(localeData);


export default function BigCalendar({
  events = [],
  defaultDate = new Date(),
  currentDate: controlledDate,

  onEventClick  = () => {},
  onEventHover  = () => {},
  onNavigate    = () => {},
  onAdd         = () => {},

  locale   = 'en',
  viewType = ['month','week','day'],
  dayStartHour = 0,
  dayEndHour   = 24,
  enableAdd    = true,

  className = '',
  style     = {},
}) {
  const isControlled   = controlledDate !== undefined;
  const [internalDate, setInternalDate] = useState(dayjs(defaultDate));
  const currentDate    = isControlled ? dayjs(controlledDate) : internalDate;

  const allowedViews = viewType?.length ? viewType : ['month','week','day'];
  const [view, setView] = useState(allowedViews[0]);

  const { periodLabels, weekdaysShort } = getCalendarLocale(locale);
  const firstDayIdx = dayjs().locale(locale).localeData().firstDayOfWeek(); // 0‑6
  const weekLabels  = [
    ...weekdaysShort.slice(firstDayIdx),
    ...weekdaysShort.slice(0, firstDayIdx),
  ];

  let rangeStart, rangeEnd;
  if (view === 'month') {
    rangeStart = currentDate.startOf('month').startOf('isoWeek');
    rangeEnd   = currentDate.endOf('month').endOf('isoWeek');
  } else if (view === 'week') {
    rangeStart = currentDate.startOf('isoWeek');
    rangeEnd   = currentDate.endOf('isoWeek');
  } else {
    rangeStart = currentDate.startOf('day');
    rangeEnd   = currentDate.endOf('day');
  }

  const days = [];
  for (let d = rangeStart; d.isBefore(rangeEnd) || d.isSame(rangeEnd,'day'); d = d.add(1,'day')) {
    days.push(d);
  }

  const updateDate = (d) => {
    onNavigate(d.toDate());
    if (!isControlled) setInternalDate(d);
  };
  const handlePrev = () => updateDate(currentDate.subtract(1, view));
  const handleNext = () => updateDate(currentDate.add(1, view));

  const handleDayClick = (d) => {
    if (!allowedViews.includes('day')) return;
    updateDate(d.startOf('day'));
    setView('day');
  };

  const hours = Array.from({length: dayEndHour - dayStartHour},
                           (_,i)=> i + dayStartHour);

  return (
    <div className={`big-calendar ${className}`} style={style}>

      {/* görünüm butonları */}
      {allowedViews.length > 1 && (
        <div className="big-calendar-view-switch">
          {allowedViews.map((id)=>(
            <button
              key={id}
              className={`big-calendar-period-btn ${view===id?'period-active':''}`}
              onClick={()=> setView(id)}
            >
              {periodLabels[id]}
            </button>
          ))}
        </div>
      )}

      <div className="big-calendar-header">
        <button className="big-calendar-arrow-btn" onClick={handlePrev}>
          <ChevronLeftIcon size={20}/>
        </button>

        {currentDate.locale(locale).format(view==='day'?'DD MMMM YYYY':'MMMM YYYY')}

        <button className="big-calendar-arrow-btn" onClick={handleNext}>
          <ChevronRightIcon size={20}/>
        </button>
      </div>

      {view === 'day' && allowedViews.includes('day') && (
        <div className="big-calendar-day-view">
          {hours.map((h)=>{
            const slotStart = currentDate.hour(h).minute(0);
            const slotEnd   = slotStart.add(1,'hour');

            const hourEvents = events.filter(e =>
              dayjs(e.start).isBefore(slotEnd) && dayjs(e.end).isAfter(slotStart)
            );
            const groups = getOverlappingGroups(hourEvents);

            return (
              <div key={h} className="big-calendar-hour-row">
                {enableAdd && (
                  <div
                    className="bc-add-btn-day"
                    style={{ right:8, top:8 }}
                    onClick={(e)=>{ e.stopPropagation(); onAdd(slotStart.toDate()); }}
                  >
                    <PlusIcon className="bc-plus"/>
                  </div>
                )}

                <div className="big-calendar-hour-label">{slotStart.format('HH:mm')}</div>

                <div className="big-calendar-hour-content">
                  {groups.flatMap((group,i)=>
                    group.map((evt,j)=>{
                      const width = 100 / group.length;
                      const left  = j * width;

                      return (
                        <div
                          key={evt.id}
                          className="big-calendar-event overlap"
                          style={{
                            position:'absolute',
                            left:`${left}%`,
                            width:`${width-1}%`,
                            top:0,
                            height:'75%',
                          }}
                          onClick={()=>onEventClick(evt)}
                          onMouseEnter={()=>onEventHover(evt)}
                        >
                          {evt.title}
                          <div style={{fontSize:9,opacity:.8}}>
                            {dayjs(evt.start).format('HH:mm')} – {dayjs(evt.end).format('HH:mm')}
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
      )}

      {view !== 'day' && (
        <div className="big-calendar-grid">
          {weekLabels.map((d)=>(
            <div key={d} className="big-calendar-weekday">{d}</div>
          ))}

          {days.map((d)=> {
            const dayEvents = events.filter(e=> dayjs(e.start).isSame(d,'day'));
            return (
              <div
                key={d.valueOf()}
                className="big-calendar-day"
                onClick={()=> handleDayClick(d)}
              >
                <div className="big-calendar-day-number">{d.date()}</div>

                {enableAdd && (
                  <div
                    className="bc-add-btn"
                    onClick={(e)=>{ e.stopPropagation(); onAdd(d.startOf('day').toDate()); }}
                  >
                    <PlusIcon className="bc-plus"/>
                  </div>
                )}

                {allowedViews.includes('day') && (
                  <div
                    className="bc-day-detail-btn"
                    onClick={(e)=>{ e.stopPropagation(); handleDayClick(d); }}
                  >
                    <CalendarIcon className="bc-plus"/>
                  </div>
                )}

                {dayEvents.map((evt)=>(
                  <div
                    key={evt.id}
                    className="big-calendar-event"
                    onClick={(e)=>{ e.stopPropagation(); onEventClick(evt); }}
                    onMouseEnter={()=>onEventHover(evt)}
                  >
                    {evt.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}