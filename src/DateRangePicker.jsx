import React, { useState, useMemo, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import isoWeek from 'dayjs/plugin/isoWeek';
import { getCalendarLocale } from './utils/calendarLocale';
import ChevronLeftIcon from './assets/images/icons/ChevronLeftIcon';
import ChevronRightIcon from './assets/images/icons/ChevronRightIcon';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);
dayjs.extend(localeData);
dayjs.extend(isoWeek);

export default function DateRangePicker({
  startDate,
  endDate,
  onChange = () => {},
  format = 'YYYY-MM-DD',
  inputMode = false,
  locale = 'en',
  disabled = false,
  minDate,
  maxDate,
  disabledDates = [],
  className = '',
  style = {},
  placeholder = 'YYYY-MM-DD - YYYY-MM-DD',
  calendars = 1,
  showTime = false,
  minTime = '00:00',
  maxTime = '23:59',
  timePeriod = 15,
}) {
	const startTimeLabel = {
		en: 'Start Time',
		tr: 'Başlangıç Saati',
		de: 'Startzeit',
		ru: 'Время начала',
		ar: 'وقت البدء',
		es: 'Hora de inicio',
	}[locale] || 'Start Time';
	
	const endTimeLabel = {
		en: 'End Time',
		tr: 'Bitiş Saati',
		de: 'Endzeit',
		ru: 'Время окончания',
		ar: 'وقت الانتهاء',
		es: 'Hora de finalización',
	}[locale] || 'End Time';
	

	
  const [view, setView] = useState(dayjs());
  const [range, setRange] = useState({
    start: startDate ? dayjs(startDate) : null,
    end: endDate ? dayjs(endDate) : null,
  });
  const [hovered, setHovered] = useState(null);
  const [open, setOpen] = useState(!inputMode);
  const wrapRef = useRef();

  const weekdaysShort = getCalendarLocale(locale).weekdaysShort;
  const fDow = dayjs().locale(locale).localeData().firstDayOfWeek();
  const weekLabels = [...weekdaysShort.slice(fDow), ...weekdaysShort.slice(0, fDow)];

  const dMin = minDate ? dayjs(minDate).startOf('day') : null;
  const dMax = maxDate ? dayjs(maxDate).endOf('day') : null;
  const disabledSet = useMemo(() => new Set(disabledDates.map(d => dayjs(d).format('YYYY-MM-DD'))), [disabledDates]);

  const isBlocked = (d) =>
    (dMin && d.isBefore(dMin, 'day')) ||
    (dMax && d.isAfter(dMax, 'day')) ||
    disabledSet.has(d.format('YYYY-MM-DD'));

  const isInRange = (d) => {
    const { start, end } = range;
    if (!start || !end) return false;
    return d.isSameOrAfter(start, 'day') && d.isSameOrBefore(end, 'day');
  };

  const isHoveredRange = (d) => {
    const { start, end } = range;
    if (start && !end && hovered) {
      return d.isSameOrAfter(start, 'day') && d.isSameOrBefore(hovered, 'day');
    }
    return false;
  };

  const handleSelect = (d) => {
    if (disabled || isBlocked(d)) return;
    let newRange;
    if (!range.start || (range.start && range.end)) {
      newRange = { start: d, end: null };
    } else if (d.isBefore(range.start)) {
      newRange = { start: d, end: range.start };
    } else {
      newRange = { start: range.start, end: d };
    }
    setRange(newRange);
    if (newRange.end) onChange({ startDate: newRange.start.toDate(), endDate: newRange.end.toDate() });
  };

  const getCalendarDays = (monthStart) => {
    const diffToFdow = (monthStart.day() - fDow + 7) % 7;
    const gridStart = monthStart.subtract(diffToFdow, 'day');
    const days = [];
    for (let d = gridStart.clone(); days.length < 42; d = d.add(1, 'day')) {
      days.push(d);
    }
    return days;
  };

  const generateTimeOptions = () => {
    const options = [];
    const start = dayjs().startOf('day').hour(Number(minTime.split(':')[0])).minute(Number(minTime.split(':')[1]));
    const end = dayjs().startOf('day').hour(Number(maxTime.split(':')[0])).minute(Number(maxTime.split(':')[1]));
    let current = start.clone();

    while (current.isSameOrBefore(end)) {
      options.push(current.format('HH:mm'));
      current = current.add(timePeriod, 'minute');
    }

    return options;
  };

  const timeOptions = useMemo(() => generateTimeOptions(), [minTime, maxTime, timePeriod]);

  const handleTimeChange = (type, timeStr) => {
    const time = dayjs(timeStr, 'HH:mm');
    setRange((prev) => {
      const date = prev[type] ?? dayjs();
      const newDate = date.hour(time.hour()).minute(time.minute());
      const updatedRange = { ...prev, [type]: newDate };
      if (updatedRange.start && updatedRange.end) {
        onChange({ startDate: updatedRange.start.toDate(), endDate: updatedRange.end.toDate() });
      }
      return updatedRange;
    });
  };

  useEffect(() => {
    if (!inputMode || !open) return;
    const close = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener('mousedown', close);
    return () => window.removeEventListener('mousedown', close);
  }, [inputMode, open]);

  return (
    <div ref={wrapRef} className={className} style={{ position: 'relative', ...style }}>
      {inputMode && (
        <input
          className="mc-input"
          placeholder={placeholder}
          readOnly
          disabled={disabled}
          value={
            range.start && range.end
              ? `${range.start.format(format)} - ${range.end.format(format)}`
              : ''
          }
          onClick={() => !disabled && setOpen((o) => !o)}
        />
      )}

      {open && (
        <div
          className={`${calendars === 2 ? 'mini-double-calendar' : 'mini-calendar'} mc-popever ${disabled ? 'mc-disabled' : ''} ${className}`}
          style={inputMode ? { position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 9999 } : {}}
        >
          <div style={{ display: 'flex', gap: '16px' }}>
            {[...Array(calendars)].map((_, idx) => {
              const currentView = view.add(idx, 'month');
              const days = getCalendarDays(currentView);

              return (
                <div key={idx}>
                  <div className="mc-header">
                    {idx === 0 && (
                      <button onClick={() => setView(view.subtract(1, 'month'))} className="mc-arrow-btn" disabled={disabled}>
                        <ChevronLeftIcon size={16} />
                      </button>
                    )}
                    <span>{currentView.locale(locale).format('MMMM YYYY')}</span>
                    {idx === calendars - 1 && (
                      <button onClick={() => setView(view.add(1, 'month'))} className="mc-arrow-btn" disabled={disabled}>
                        <ChevronRightIcon size={16} />
                      </button>
                    )}
                  </div>

                  <div className="mc-grid mc-weekdays">
                    {weekLabels.map((d) => (
                      <div key={d} className="mc-wd">{d}</div>
                    ))}
                  </div>

                  <div className="mc-grid mc-days">
                    {days.map((d) => {
                      const isSelected = d.isSame(range.start, 'day') || d.isSame(range.end, 'day');
                      const blocked = isBlocked(d);
                      return (
                        <div
                          key={d.valueOf()}
                          className={[
                            'mc-day',
                            d.month() === currentView.month() ? '' : 'mc-other',
                            isSelected ? 'mc-selected' : '',
                            isInRange(d) || isHoveredRange(d) ? 'mc-range' : '',
                            blocked ? 'mc-blocked' : '',
                          ].join(' ')}
                          onClick={() => handleSelect(d)}
                          onMouseEnter={() => setHovered(d)}
                        >
                          {d.date()}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {showTime && (
            <div className="mc-time">
             
                <label>{startTimeLabel}:</label>
                <select
									className="mc-time-select"
                  disabled={!range.start}
                  value={range.start ? range.start.format('HH:mm') : ''}
                  onChange={(e) => handleTimeChange('start', e.target.value)}
                >
                  {timeOptions.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
            
              :
                <label>{endTimeLabel}:</label>
                <select
									className="mc-time-select"
                  disabled={!range.end}
                  value={range.end ? range.end.format('HH:mm') : ''}
                  onChange={(e) => handleTimeChange('end', e.target.value)}
                >
                  {timeOptions.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
            
            </div>
          )}
        </div>
      )}
    </div>
  );
}
