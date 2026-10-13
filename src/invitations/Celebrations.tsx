import { useInvitationDetails } from './context'
import { formatDate, formatTime, mapURL } from './model'
import { downloadCalendar } from './calendar'
import './personalized.css'
export default function Celebrations(){
 const d=useInvitationDetails();if(!d)return null
 return <div className="personal-celebrations">{[...d.events].sort((a,b)=>`${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)).map((e,i)=><article key={i}><p className="personal-event-date">{formatDate(e.date,{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</p><h3>{e.title}</h3><strong>{formatTime(e.time)}</strong><h4>{e.venue}</h4><p>{e.address}</p><div><a href={mapURL(e.venue,e.address,e.map)} target="_blank" rel="noreferrer">Directions ↗</a><button onClick={()=>downloadCalendar(e,d.offset,`${d.groom} & ${d.bride}`)}>Save the date +</button></div></article>)}</div>
}
