<br/>
<br/>

<p align="center" style="box-shadow: 2px 2px;">
  <a href="https://mertkahramanturk.github.io/react-flexible-calendar/?path=/story/calendar-bigcalendar--default" rel="noopener" target="_blank" ><h1 align="center">react-flexible-calendar</h1>
</a></p>
</p>

<div align="center">

A highly customizable and flexible calendar component for React

</div>

## Support buymeacoffee

[buymeacoffee](https://buymeacoffee.com/kahramantue)

## Demo and documentation

You can access all code examples and documentation on site https://mertkahramanturk.github.io/react-flexible-calendar/?path=/story/calendar-bigcalendar--default

## Issue Prioritizing

Please share your problems, bugs and development requests.
[Issue](https://github.com/mertkahramanturk/react-flexible-calendar/issues)

## Installation

#### 1.Install package

To install react-flexible-calendar with `npm`:

    npm install react-flexible-calendar

## Types / General Calendar Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| **events** | `Array<{ id, title, start:Date, end:Date }>` | `[]` | Calendar event list. |
| **locale** | `string` | `"en"` | Language (`en`, `tr`, `de`, `ru`, `ar`, …). |
| **viewType** | `string[]` | `['month','week','day']` | Which views are enabled. |
| **currentDate** | `Date` | — | Controlled current date (with `onNavigate`). |
| **defaultDate** | `Date` | `new Date()` | Uncontrolled initial date. |
| **dayStartHour** | `number` | `0` | First visible hour in day view. |
| **dayEndHour** | `number` | `24` | Last visible hour (exclusive). |
| **enableAdd** | `boolean` | `true` | Show the **+** quick‑add button on cells/rows. |
| **className** | `string` | — | Extra class for root div. |
| **style** | `React.CSSProperties` | — | Inline styles for root div. |
| **onEventClick** | `(event) ⇒ void` | `() => {}` | Fired when an event is clicked. |
| **onEventHover** | `(event) ⇒ void` | `() => {}` | Hover callback. |
| **onAdd** | `(start: Date) ⇒ void` | `() => {}` | Quick‑add button callback. |
| **onNavigate** | `(newDate: Date) ⇒ void` | `() => {}` | Fires when next / prev or drill‑down changes date. |



## Usage

Here is a basic example of using react-flexible-calendar within a react application.

```jsx
import { useState } from 'react';
import BigCalendar from 'react-flexible-calendar';
import 'react-flexible-calendar/dist/style.css'; // if you bundle css separately

const events = [
  { id:1, title:'Design Review', start:new Date('2025-06-04T09:00'), end:new Date('2025-06-04T10:30') },
  { id:2, title:'Lunch',         start:new Date('2025-06-04T12:00'), end:new Date('2025-06-04T13:00') },
];

export default function App() {
  const [date, setDate] = useState(new Date());

  return (
    <BigCalendar
		  className="my-custom-calendar"
      events={events}
      currentDate={date}
      locale="en"
      viewType={['month','week','day']}
      dayStartHour={8}
      dayEndHour={22}
      onNavigate={(d)=> setDate(d)}
      onEventClick={(e)=> alert('Clicked: '+e.title)}
			onEventHover={(e) => console.log('Hover:', e)}
			enableAdd={true}
      onAdd={(d)=> alert('Add event at '+d)}
      style={{ background:'#fcfcfc', borderRadius:8, padding:8 }}
    />
  );
}


ReactDOM.render(<App />, document.getElementById("react-div"));
```

## Contributors

### Code Contributors

<a href="https://github.com/mertkahramanturk/react-flexible-calendar/graphs/contributors"><img style="border-radius: 2000px" src="https://avatars.githubusercontent.com/u/84500180?v=4&size=64" /></a>

## License

This project is licensed under the terms of the [MIT license](/LICENSE).
