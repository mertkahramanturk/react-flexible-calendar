import React, { useState } from 'react';
import BigCalendar from '../BigCalendar';
import { generateDemoEvents } from './data/generateDemoEvents';
import dayjs from 'dayjs';

const demoEvents = generateDemoEvents({ range: 2, perDay: 4 });

export default {
  title: 'Calendar/BigCalendar',
  component: BigCalendar,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    locale:      { control: 'select',      options: ['en','tr','de','ru','ar'] },
    viewType:    { control: 'multi-select', options: ['month','week','day'] },
    enableAdd:   { control: 'boolean' },
    dayStartHour:{ control: 'number', min:0, max:23 },
    dayEndHour:  { control: 'number', min:1, max:24 },
  },
};

const Wrapper = (props) => {
	const [date, setDate] = useState(new Date('2025-05-01'));
  const alertJson = (label, payload) =>
    window.alert(`${label}:\n` + JSON.stringify(payload, null, 2));

  return (
    <div style={{ maxWidth:'95%', margin:'24px auto' }}>
      <BigCalendar
        {...props}
        currentDate={date}
        onNavigate={(d)=>{ setDate(d); alertJson('onNavigate', d); }}
        onEventClick={(e)=> alertJson('onEventClick', e)}
        onEventHover={(e)=> console.log('onEventHover', e)}
				onAdd={(d) => alert(`Yeni event: ${dayjs(d).format('YYYY‑MM‑DD HH:mm')}`)}
				/>
    </div>
  );
};

const Template = (args) => <Wrapper {...args} />;

export const Default = Template.bind({});
Default.args = {
  events: demoEvents,
  locale: 'en',
  viewType: ['month','week','day'],
  enableAdd: true,
  dayStartHour: 8,
  dayEndHour: 22,
};

