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
