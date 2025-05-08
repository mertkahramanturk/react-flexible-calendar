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

## Types / General Big Calendar Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| **events** | `Array<{ id, title, start:Date, end:Date }>` | `[]` | Big Calendar event list. |
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
import '../node_modules/react-flexible-calendar/dist/style.css';
// import 'react-flexible-calendar/dist/style.css';

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

## Types / General Date Picker Props
| Prop                  | Type                       | Default        | Description                                                                              |
| --------------------- | -------------------------- | -------------- | ---------------------------------------------------------------------------------------- |
| **value**             | `Date`                     | —              | Controlled selected date.                                                                |
| **defaultValue**      | `Date`                     | `new Date()`   | Uncontrolled initial value.                                                              |
| **inputMode**         | `boolean`                  | `false`        | `true` → renders as an **input** that pops the calendar; `false` → inline mini‑calendar. |
| **format**            | `string`                   | `"YYYY-MM-DD"` | Day.js display format for the input.                                                     |
| **showTime**          | `boolean`                  | `false`        | Shows hour / minute selectors.                                                           |
| **timePeriod**        | `number`                   | `1`            | Minute step (1 – 60).                                                                    |
| **minDate / maxDate** | `Date`                     | —              | Limits selectable days.                                                                  |
| **minTime / maxTime** | `"HH:mm"`                  | —              | Limits selectable time range.                                                            |
| **disabledDates**     | `Date[] \| string[]`       | `[]`           | Exact dates that cannot be selected.                                                     |
| **highlightDays**     | `Date[] \| string[]`       | `[]`           | Dates to visually highlight.                                                             |
| **disabled**          | `boolean`                  | `false`        | Disables the whole component.                                                            |
| **locale**            | `string`                   | `"en"`         | Language (`en`, `tr`, `de`, `ru`, `ar`, `es`, …).                                        |
| **className / style** | `string` / `CSSProperties` | —              | Extra class / inline styles.                                                             |
| **onChange**          | `(date: Date) ⇒ void`      | `() => {}`     | Fired on every selection.                                                                |


## Usage

Here is a basic example of using react-flexible-calendar within a react application.

```jsx
import { useState } from 'react';
import DatePicker from 'react-flexible-calendar/DatePicker';
import '../node_modules/react-flexible-calendar/dist/style.css';
// import 'react-flexible-calendar/dist/style.css';
export default function Example() {
  const [date, setDate] = useState(null);

  return (
    <DatePicker
      inputMode               
      showTime
      locale="en"
      format="DD.MM.YYYY HH:mm"
      minDate={new Date()}
      maxDate={dayjs().add(4,'month').toDate()}
      minTime="09:00"
      maxTime="18:00"
      timePeriod={5}
      highlightDays={['2025-05-13', '2025-05-19', '2025-05-27']}
      disabledDates={['2025-05-04', '2025-05-20']}
      onChange={setDate}
      style={{ maxWidth: 200 }}
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
