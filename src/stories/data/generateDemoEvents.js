import dayjs from 'dayjs';

/**
 *
 * @param {Object} opts
 * @param {number} opts.range  
 * @param {number} opts.perDay 
 * @returns {Array}
 */
export function generateDemoEvents({ range = 1, perDay = 2 } = {}) {
  const events = [];
  let id = 1;

  const base = dayjs();                   
  const startMonth = base.subtract(range, 'month').startOf('month');
  const endMonth   = base.add(range, 'month').endOf('month');

  for (let d = startMonth.clone(); d.isBefore(endMonth); d = d.add(1, 'day')) {
    const count = Math.floor(Math.random() * (perDay + 1));
    for (let i = 0; i < count; i++) {
      const startHour = 8 + Math.floor(Math.random() * 10);
      const durationH = 1 + Math.floor(Math.random() * 3);
      const start = d.hour(startHour).minute(0).second(0);
      const end   = start.clone().add(durationH, 'hour');

      events.push({
        id,
        title: `Event ${id}`,
        start: start.toDate(),
        end  : end.toDate(),
      });
      id++;
    }
  }
  return events;
}
