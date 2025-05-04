// -----------------------------------------------------------------------------
// utils/calendarHelpers.js (unchanged)
// -----------------------------------------------------------------------------

import dayjs from 'dayjs';



export function getOverlappingGroups(events) {
	const sorted = [...events].sort((a, b) => new Date(a.start) - new Date(b.start));
	const groups = [];

	sorted.forEach((event) => {
		let added = false;

		for (const group of groups) {
			const isOverlapping = group.some((e) =>
				dayjs(event.start).isBefore(dayjs(e.end)) &&
				dayjs(event.end).isAfter(dayjs(e.start))
			);

			if (isOverlapping) {
				group.push(event);
				added = true;
				break;
			}
		}

		if (!added) {
			groups.push([event]);
		}
	});

	return groups;
}
export const minutesToPixels = (m) => (m * SLOT_HEIGHT) / 60;

export const SLOT_HEIGHT = 60;          // 1 saat = 60 px
export function getEventRect(evt, slotStart){
  const s = dayjs(evt.start);
  const e = dayjs(evt.end);
  const offset = Math.max(0, s.diff(slotStart,'minute'));
  const dur    = Math.max(15, e.diff(s,'minute')); // en az 15 dk
  return {
    top   : (offset * SLOT_HEIGHT)/60,
    height: (dur   * SLOT_HEIGHT)/60,
  };
}
export const GROUP_COLORS = ['#e5ffee','#d6e4ff','#fff7d6','#f8bbd0'];