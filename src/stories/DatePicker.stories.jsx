// src/stories/DatePickerFull.stories.jsx
import React, { useState } from 'react';
import dayjs from 'dayjs';
import DatePicker from '../DatePicker';

export default {
  title: 'Calendar/DatePicker',
  component: DatePicker,
  parameters: { layout:'centered' },
  argTypes: {
    locale:        { control:'select', options:['en','tr','de','ru','ar','es'] },
    inputMode:     { control:'boolean' },
    showTime:      { control:'boolean' },
    timePeriod:    { control:'number', min:1, max:60 },
    disabled:      { control:'boolean' },
  },
};

const Template = (args) => {
  const [v,setV] = useState(null);
  return <DatePicker {...args} value={v} onChange={setV} />;
};

export const Playground = Template.bind({});
Playground.args = {
  locale:'en',
  inputMode:true,
  showTime:true,
  timePeriod:5,
  minDate:new Date(),
  maxDate:dayjs().add(4,'month').toDate(),
  minTime:'09:00',
  maxTime:'18:00',
  highlightDays:['2025-05-13','2025-05-19','2025-05-27'],
  disabledDates:['2025-05-04','2025-05-20'],
  format:'DD.MM.YYYY HH:mm',
};
