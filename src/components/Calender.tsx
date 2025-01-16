// import React from 'react'
// import { CCalendar } from '@coreui/react-pro'

// export default function Calendar() {
//   return (
//     <div className="d-flex justify-content-center ">
//       <CCalendar
//         calendars={1}
//         className="border rounded fit-content"
//         locale="en-US"
//         range
//         startDate="2025/01/01"
//         endDate="2025/01/07"
//       />
//     </div>
//   )
// }

import React from 'react';
import { useState } from 'react';
import { Calendar as Cal } from 'react-calendar';
import './Calendar.css';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function Calender() {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <div>
        <Cal onChange={onChange} value={value} />
    </div>
  );
}