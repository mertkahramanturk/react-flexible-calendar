import React, { useState, useMemo, useRef, useEffect } from 'react';

import dayjs            from 'dayjs';
import isSameOrAfter    from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore   from 'dayjs/plugin/isSameOrBefore';
import customParseFmt   from 'dayjs/plugin/customParseFormat';
import localeData       from 'dayjs/plugin/localeData';
import isoWeek          from 'dayjs/plugin/isoWeek';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFmt);
dayjs.extend(localeData);
dayjs.extend(isoWeek);

import { getCalendarLocale } from './utils/calendarLocale';
import ChevronLeftIcon  from './assets/images/icons/ChevronLeftIcon';
import ChevronRightIcon from './assets/images/icons/ChevronRightIcon';
import './DatePicker.css';


export default function DatePicker({
  value,
  defaultValue = new Date(),

  inputMode   = false,
  format      = 'YYYY-MM-DD',

  minDate, maxDate,
  minTime, maxTime,
  disabled = false,
  disabledDates = [],
  highlightDays = [],
  timePeriod = 1,

  onChange = () => {},
  locale   = 'en',
  showTime = false,
  className = '',
  style = {},
}) {
  const timeLabel = {
    en:'Time', tr:'Saat', de:'Zeit', ru:'Время', ar:'الوقت', es:'Hora',
  }[locale] || 'Time';

  const [internal, setInternal] = useState(dayjs(defaultValue));
  const [view,     setView]     = useState(dayjs(defaultValue));
  const [open,     setOpen]     = useState(!inputMode);

  const selected = value ? dayjs(value) : internal;

  const { weekdaysShort } = getCalendarLocale(locale);
  const wrapRef = useRef(null);

  const fDow = dayjs().locale(locale).localeData().firstDayOfWeek();
  const weekLabels = [
    ...weekdaysShort.slice(fDow),
    ...weekdaysShort.slice(0, fDow),
  ];

  const dMin = minDate ? dayjs(minDate).startOf('day') : null;
  const dMax = maxDate ? dayjs(maxDate).endOf('day')   : null;

  const tMin = minTime ? dayjs(minTime,'HH:mm') : null;
  const tMax = maxTime ? dayjs(maxTime,'HH:mm') : null;

  const monthStart = view.startOf('month');
  const diffToFdow = (monthStart.day() - fDow + 7) % 7;
  const gridStart  = monthStart.subtract(diffToFdow,'day'); 

  const days = useMemo(()=> {
    const arr = [];
    for (let d = gridStart.clone(); arr.length < 42; d = d.add(1,'day')) {
      arr.push(d);
    }
    return arr;
  }, [gridStart.valueOf()]);

  const disabledSet  = useMemo(
    ()=> new Set(disabledDates .map(d=>dayjs(d).format('YYYY-MM-DD'))),
    [disabledDates]);

  const highlightSet = useMemo(
    ()=> new Set(highlightDays.map(d=>dayjs(d).format('YYYY-MM-DD'))),
    [highlightDays]);

  const emitChange = (d)=>{
    if (disabled) return;
    if (!value)  setInternal(d);
    setView(d);
    onChange(d.toDate());
  };

  const minMin = tMin ? tMin.hour()*60 + tMin.minute() : 0;
  const maxMin = tMax ? tMax.hour()*60 + tMax.minute() : 24*60-1;

  const hours = [...Array(24).keys()].filter(h=>{
    const mm = h*60;
    return mm>=minMin && mm<=maxMin;
  });

  const minuteStep = Math.max(1, Math.min(60, timePeriod));
  const baseMins   = [...Array(60).keys()].filter(m=> m%minuteStep===0);

  const minutes = hours.includes(selected.hour())
    ? baseMins.filter(m=> {
        const mm = selected.hour()*60 + m;
        return mm>=minMin && mm<=maxMin;
      })
    : baseMins;

  useEffect(()=>{
    if (!inputMode || !open) return;
    const close = e=>{
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener('mousedown', close);
    return ()=> window.removeEventListener('mousedown', close);
  }, [inputMode, open]);

  return (
    <div ref={wrapRef} className={className} style={{position:'relative',...style}}>

      {/* input */}
      {inputMode && (
        <input
          className="mc-input"
          readOnly
          disabled={disabled}
          value={selected.format(format)}
          onClick={()=> !disabled && setOpen(o=>!o)}
        />
      )}

      {open && (
        <div
          className={`mini-calendar mc-popever ${disabled?'mc-disabled':''} ${className}`}
          style={inputMode ? {position:'absolute',top:'calc(100% + 4px)',left:0,zIndex:9999}:{}}>

          <div className="mc-header">
            <button className="mc-arrow-btn" disabled={disabled}
                    onClick={()=> setView(view.subtract(1,'month'))}>
              <ChevronLeftIcon size={16}/>
            </button>

            <span>{selected.locale(locale).format('MMMM YYYY')}</span>

            <button className="mc-arrow-btn" disabled={disabled}
                    onClick={()=> setView(view.add(1,'month'))}>
              <ChevronRightIcon size={16}/>
            </button>
          </div>

          <div className="mc-grid mc-weekdays">
            {weekLabels.map((d)=>(
              <div key={d} className="mc-wd">{d}</div>
            ))}
          </div>

          <div className="mc-grid mc-days">
            {days.map((d)=>{
              const key     = d.format('YYYY-MM-DD');
              const blocked = (dMin && d.isBefore(dMin,'day')) ||
                              (dMax && d.isAfter (dMax,'day')) ||
                               disabledSet.has(key);

              return (
                <div
                  key={d.valueOf()}
                  className={[
                    'mc-day',
                    d.month()===view.month() ? '' : 'mc-other',
                    d.isSame(selected,'day') ? 'mc-selected' : '',
                    blocked ? 'mc-blocked' : '',
                    highlightSet.has(key) && !blocked ? 'mc-highlight':'',
                  ].join(' ')}
                  onClick={()=> !blocked && emitChange(d)}
                >
                  {d.date()}
                </div>
              );
            })}
          </div>

          {showTime && (
            <div className="mc-time">
              {timeLabel}:
              <select
                className="mc-time-select"
                disabled={disabled}
                value={selected.hour()}
                onChange={(e)=> emitChange(selected.hour(+e.target.value))}>
                {hours.map(h=>(
                  <option key={h} value={h}>{String(h).padStart(2,'0')}</option>
                ))}
              </select>
              :
              <select
                className="mc-time-select"
                disabled={disabled}
                value={selected.minute()}
                onChange={(e)=> emitChange(selected.minute(+e.target.value))}>
                {minutes.map(m=>(
                  <option key={m} value={m}>{String(m).padStart(2,'0')}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
