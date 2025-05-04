import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
dayjs.extend(localeData);

import 'dayjs/locale/tr';
import 'dayjs/locale/es';
import 'dayjs/locale/de'; 
import 'dayjs/locale/ru';
import 'dayjs/locale/ar';

export const SUPPORTED = ['en', 'tr', 'es', 'de', 'ru', 'ar'];

const PERIOD_MAP = {
  en: { month: 'Month',  week: 'Week',   day: 'Day'   },
  tr: { month: 'Ay',     week: 'Hafta',  day: 'Gün'   },
  es: { month: 'Mes',    week: 'Semana', day: 'Día'   },
  de: { month: 'Monat',  week: 'Woche',  day: 'Tag'   },
  ru: { month: 'Месяц',  week: 'Неделя', day: 'День'  },
  ar: { month: 'شهر',    week: 'أسبوع',  day: 'يوم'   },
};

export function getCalendarLocale(locale = 'en') {
  const code = SUPPORTED.includes(locale) ? locale : 'en';
  dayjs.locale(code);

  const ld = dayjs().localeData();

  return {
    code,
    weekdaysShort: ld.weekdaysShort(),
    periodLabels: PERIOD_MAP[code], 
  };
}
