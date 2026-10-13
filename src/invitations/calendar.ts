import type { Celebration } from './model'
export function downloadCalendar(event: Celebration, offset: string, couple: string) {
 const start=new Date(`${event.date}T${event.time}:00${offset}`)
 const stamp=(date:Date)=>date.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'')
 const escape=(s:string)=>s.replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;')
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Invitation Atelier//Wedding//EN','BEGIN:VEVENT',`UID:${crypto.randomUUID()}@invitation`,`DTSTAMP:${stamp(new Date())}`,`DTSTART:${stamp(start)}`,`DTEND:${stamp(new Date(start.getTime()+3*3600000))}`,`SUMMARY:${escape(`${couple} — ${event.title}`)}`,`LOCATION:${escape(`${event.venue}, ${event.address}`)}`,'END:VEVENT','END:VCALENDAR','']
 const url=URL.createObjectURL(new Blob([lines.join('\r\n')],{type:'text/calendar;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='celebration.ics';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)
}
