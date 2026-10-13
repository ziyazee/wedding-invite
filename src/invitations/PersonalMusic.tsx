import { useEffect, useRef, useState } from 'react'
export default function PersonalMusic({src}:{src:string}){
 const audio=useRef<HTMLAudioElement>(null);const [playing,setPlaying]=useState(false)
 useEffect(()=>{const start=()=>{if(audio.current){audio.current.volume=.4;void audio.current.play().catch(()=>{})}};document.addEventListener('click',start,{once:true});return()=>document.removeEventListener('click',start)},[])
 return <><audio ref={audio} src={src} loop preload="none" onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)}/><button className="personal-music" aria-label={playing?'Pause music':'Play music'} onClick={e=>{e.stopPropagation();if(playing)audio.current?.pause();else void audio.current?.play().catch(()=>{})}}>{playing?'♫ Pause':'♫ Music'}</button></>
}
