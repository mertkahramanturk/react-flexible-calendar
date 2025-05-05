import React, { useState, useMemo } from 'react';
import { getCalendarLocale } from './utils/calendarLocale';
import ChevronLeftIcon from './assets/images/icons/ChevronLeftIcon';
import ChevronRightIcon from './assets/images/icons/ChevronRightIcon';
import './DatePicker.css';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);
export default function DatePicker({
	value,
	defaultValue = new Date(),
	inputMode = false,
	format = 'YYYY-MM-DD',

	minDate,
	maxDate,
	minTime,
	maxTime,
	disabled = false,
	disabledDates = [],
	highlightDays = [],
	timePeriod = 1,

	onChange = () => { },
	locale = 'en',
	showTime = false,
	className = '',
	style = {},
}) {
	const timeLabel = {
		  en: 'Time',
		  tr: 'Saat',
		  de: 'Zeit',
		 	ru: 'Время',
		  ar: 'الوقت',
		  es: 'Hora',
			}[locale] || 'Time';

	const [internal, setInternal] = useState(dayjs(defaultValue));
	const [view, setView] = useState(dayjs(defaultValue));
	const [open, setOpen] = useState(!inputMode);
	const selected = value ? dayjs(value) : internal;
	const { weekdaysShort } = getCalendarLocale(locale);
	const wrapRef = React.useRef(null);

	const dMin = minDate ? dayjs(minDate).startOf('day') : null;
	const dMax = maxDate ? dayjs(maxDate).endOf('day') : null;

	const tMin = minTime ? dayjs(minTime, 'HH:mm') : null;
	const tMax = maxTime ? dayjs(maxTime, 'HH:mm') : null;

	const monthStart = view.startOf('month');
	const gridStart = monthStart.startOf('week');


	React.useEffect(() => {
		if (!inputMode || !open) return;
		const h = (e) => {
			if (wrapRef.current && !wrapRef.current.contains(e.target))
				setOpen(false);
		};
		window.addEventListener('mousedown', h);
		return () => window.removeEventListener('mousedown', h);
	}, [inputMode, open]);

	const days = useMemo(() => {
		const arr = [];
		for (let d = gridStart.clone(); arr.length < 42; d = d.add(1, 'day')) {
			arr.push(d);
		}
		return arr;
	}, [gridStart.valueOf()]);

	const emitChange = (d) => {
		if (disabled) return;
		if (!value) setInternal(d);
		setView(d);
		onChange(d.toDate());
		// if (inputMode) setOpen(false);
	};

	const disabledSet = useMemo(() => {
		return new Set(
			(disabledDates || []).map((d) => dayjs(d).format('YYYY-MM-DD'))
		);
	}, [disabledDates]);

	const highlightSet = useMemo(
		() => new Set((highlightDays || []).map((d)=> dayjs(d).format('YYYY-MM-DD'))),
		[highlightDays]
	);

	const isDayDisabled = (d) =>
		(dMin && d.isBefore(dMin,'day')) ||
	  (dMax && d.isAfter(dMax,'day')) ||
	 disabledSet.has(d.format('YYYY-MM-DD'));

	const minMin = tMin ? tMin.hour() * 60 + tMin.minute() : 0;
	const maxMin = tMax ? tMax.hour() * 60 + tMax.minute() : 24 * 60 - 1;

	const hours = [...Array(24).keys()].filter((h) => {
		const mins = h * 60;
		return mins >= minMin && mins <= maxMin;
	});

	const minuteStep = Math.max(1, Math.min(60, timePeriod)); 
	const baseMinutes = [...Array(60).keys()].filter((m) => m % minuteStep === 0);

	const minutes = hours.includes(selected.hour())
		? baseMinutes.filter((m) => {
			const mins = selected.hour() * 60 + m;
			return mins >= minMin && mins <= maxMin;
		})
		: baseMinutes;



	React.useEffect(() => {
		if (showTime && hours.length && !hours.includes(selected.hour())) {
			emitChange(selected.hour(hours[0]));
		}
	}, [hours.length]);

	return (
		<div className={className} ref={wrapRef} style={{ position:'relative', ...style }}>
			{inputMode && (
				<input
					className="mc-input"
					readOnly
					value={selected.format(format)}
					onClick={() => !disabled && setOpen((o) => !o)}
					disabled={disabled}
				/>
			)}
			{open && (
				<div
					className={`mini-calendar mc-popever ${disabled ? 'mc-disabled' : ''} ${className}`}
					style={inputMode ? {
						         position:'absolute',
						          top:'calc(100% + 4px)',
						          left:0,
						         zIndex: 9999,
						        } : {}}
				>
					<div className="mc-header">
						<button
							onClick={() => setView(view.subtract(1, 'month'))}
							className="mc-arrow-btn"
							disabled={disabled}
						>
							<ChevronLeftIcon size={16} />
						</button>

						<span>{selected.locale(locale).format('MMMM YYYY')}</span>

						<button
							onClick={() => setView(view.add(1, 'month'))}
							className="mc-arrow-btn"
							disabled={disabled}
						>
							<ChevronRightIcon size={16} />
						</button>
					</div>

					<div className="mc-grid mc-weekdays">
						{weekdaysShort.map((d) => (
							<div key={d} className="mc-wd">
								{d}
							</div>
						))}
					</div>

					<div className="mc-grid mc-days">
						{days.map((d) => {
							const isCurMon = d.isSame(monthStart, 'month');
							const isSel = d.isSame(selected, 'day') && d.isSame(view, 'month');
							const blocked = isDayDisabled(d);
							const isHigh  = highlightSet.has(d.format('YYYY-MM-DD'));

							return (
								<div
									key={d.valueOf()}
									className={[
										'mc-day',
										isCurMon ? '' : 'mc-other',
										isSel ? 'mc-selected' : '',
										blocked ? 'mc-blocked' : '',
										isHigh && !blocked ? 'mc-highlight' : '',
									].join(' ')}
									onClick={() => !blocked && emitChange(d)}
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
								value={selected.hour()}
								disabled={disabled}
								onChange={(e) =>
									emitChange(selected.hour(parseInt(e.target.value, 10)))
								}
							>
								{hours.map((h) => (
									<option key={h} value={h}>
										{String(h).padStart(2, '0')}
									</option>
								))}
							</select>
							:
							<select
								className="mc-time-select"
								value={selected.minute()}
								disabled={disabled}
								onChange={(e) =>
									emitChange(selected.minute(parseInt(e.target.value, 10)))
								}
							>
								{minutes.map((m) => (
									<option key={m} value={m}>
										{String(m).padStart(2, '0')}
									</option>
								))}
							</select>
						</div>
					)}
				</div>
			)
			}
		</div>
	);
}
