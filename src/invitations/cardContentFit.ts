// Fit the complete content group inside each template's decorative clearance.
// Embroidered Garden supplies its own bounds below the shared card styles.
export function wrapCardText(value: string, lineLimit: number): string {
 return value.split(/\r?\n/).map(paragraph=>{
  const lines:string[]=[]
  let line=''
  for(const word of paragraph.trim().split(/\s+/).filter(Boolean)){
   const characters=Array.from(word)
   if(line&&Array.from(line).length+1+characters.length>lineLimit){lines.push(line);line=''}
   while(characters.length>lineLimit){
    lines.push(characters.splice(0,lineLimit).join(''))
   }
   const remaining=characters.join('')
   if(remaining)line=line?`${line} ${remaining}`:remaining
  }
  if(line)lines.push(line)
  return lines.join('\n')
 }).join('\n')
}

export const secretGardenCardCSS = `
 .atelier-video-page .atelier-card-content-fit .atelier-event{padding:0;min-height:0;aspect-ratio:720/1032;box-sizing:border-box}
 .atelier-video-page .atelier-card-content-fit .atelier-event-copy{--card-fit:1;position:absolute;top:34%;bottom:17%;left:18%;width:64%;display:flex;flex-direction:column;justify-content:flex-start;gap:calc(4px + 6px * var(--card-fit));overflow-wrap:anywhere;text-wrap:balance}
 .atelier-video-page .atelier-card-content-fit .atelier-event-copy>*{flex:none;min-width:0;max-width:100%;margin:0;box-sizing:border-box}
 .atelier-video-page .atelier-card-content-fit .atelier-event-copy>.atelier-date~*{margin-top:auto}
 .atelier-video-page .atelier-card-content-fit .atelier-event-copy h2{font-size:calc(24px + 16px * var(--card-fit));line-height:.82}
 .atelier-video-page .atelier-card-content-fit .atelier-event-copy h3{font-size:calc(16px + 8px * var(--card-fit));line-height:1.2}
 .atelier-video-page .atelier-card-content-fit .atelier-event-copy p{font-size:calc(13px + 5px * var(--card-fit));line-height:1.3;white-space:normal}
 .atelier-video-page .atelier-card-content-fit .atelier-event-copy .atelier-eyebrow{font-size:calc(10px + 2px * var(--card-fit));letter-spacing:.18em}
 .atelier-video-page .atelier-card-content-fit .atelier-event-copy .atelier-date{font-size:calc(11px + 3px * var(--card-fit));line-height:1.15}
 .atelier-video-page .atelier-card-content-fit .atelier-event-copy [data-card-text]{white-space:pre-line;text-wrap:wrap}
 .atelier-video-page .atelier-card-content-fit .atelier-event-copy .atelier-links{gap:4px 12px;align-items:center}
 .atelier-video-page .atelier-card-content-fit .atelier-event-copy .atelier-links [hidden]{display:none!important}
 .atelier-video-page .atelier-card-content-fit .atelier-event-copy .atelier-links a,
 .atelier-video-page .atelier-card-content-fit .atelier-event-copy .atelier-links button{font-size:calc(13px + 3px * var(--card-fit));line-height:1.2;min-height:32px;padding:6px 0;max-width:100%;white-space:normal}
`.replaceAll('.atelier-video-page .atelier-card-content-fit', ':is(.atelier-video-page .atelier-card-content-fit, .atelier-embroidered-fit)') + `
 .atelier-embroidered-introduction .atelier-fixed-intro-heading,
 .atelier-embroidered-introduction .atelier-fit-intro-content{width:84%;max-width:84%;margin-inline:auto;box-sizing:border-box;white-space:normal;overflow-wrap:anywhere;text-wrap:balance}
 .atelier-embroidered-introduction .atelier-fixed-intro-heading{font-size:28px!important;line-height:1.2;white-space:normal;overflow-wrap:normal;text-wrap:initial}
 .opening-name.atelier-opening-names{width:64%;max-width:64%;margin-inline:auto;box-sizing:border-box}
 .opening-name.atelier-opening-names.atelier-names-stacked> :first-child,
 .opening-name.atelier-opening-names.atelier-names-stacked> :last-child{width:100%;min-width:0;max-width:100%;white-space:pre-line;overflow-wrap:anywhere;text-wrap:balance;text-align:center}
 .atelier-embroidered-fit .atelier-event{aspect-ratio:1072/1920;background-size:100% 100%;position:relative}
 .atelier-embroidered-fit .atelier-event-copy{top:26%;bottom:14%;left:22%;width:56%;padding:0}
 .atelier-embroidered-fit .atelier-event-copy h2{line-height:1.1}
 .atelier-embroidered-fit .atelier-event:not(:first-child){aspect-ratio:auto}
 .atelier-embroidered-fit .atelier-event>video{min-height:100%;object-fit:fill!important}
 .atelier-embroidered-fit .atelier-event:not(:first-child) .atelier-event-copy{top:28%;bottom:22%}
 .atelier-embroidered-fit .atelier-welcome>.atelier-eyebrow{margin-bottom:28px}
 .atelier-embroidered-fit .atelier-welcome{padding-bottom:12px}
 .atelier-embroidered-fit .atelier-welcome>p:last-child{margin-top:40px;margin-bottom:0}
 .atelier-embroidered-fit .atelier-events>.atelier-event:first-child{margin-top:12px}
 .atelier-embroidered-fit .atelier-note[hidden]{display:none!important}
 .atelier-embroidered-fit .atelier-note>[data-couple-illustration]{display:block;width:100%;max-width:340px;height:auto;margin:24px auto 0}
 .atelier-embroidered-fit .atelier-note p{overflow-wrap:anywhere}
`

export function installCardContentFit(doc: Document) {
 const win=doc.defaultView
 if(win){
  const introduction=doc.querySelector<HTMLElement>('.atelier-embroidered-introduction')
  if(introduction){
   const defaults=[
    'With the blessings of Allah and the love of our families, we invite you to celebrate the beginning of our forever.',
    'Your presence, your prayers, and your love will make our day complete.',
   ]
   const fitIntroduction=()=>{
    doc.querySelectorAll<HTMLElement>('.atelier-embroidered-introduction .atelier-fit-intro-content').forEach((paragraph,index)=>{
     paragraph.style.removeProperty('font-size')
     const defaultSize=parseFloat(win.getComputedStyle(paragraph).fontSize)
     const referenceLength=Array.from(defaults[index]||defaults[0]).length
     const length=Array.from(paragraph.textContent?.trim()||'').length
     if(length>referenceLength){
      const size=Math.max(Math.min(14,defaultSize),defaultSize*Math.sqrt(referenceLength/length))
      paragraph.style.fontSize=`${Math.floor(size*10)/10}px`
     }
    })
   }
   win.addEventListener('invitation-preview-updated',fitIntroduction)
   win.addEventListener('resize',fitIntroduction)
   doc.fonts.addEventListener('loadingdone',fitIntroduction)
   void doc.fonts.ready.then(fitIntroduction)
   fitIntroduction()
   win.addEventListener('unload',()=>{
    win.removeEventListener('invitation-preview-updated',fitIntroduction)
    win.removeEventListener('resize',fitIntroduction)
    doc.fonts.removeEventListener('loadingdone',fitIntroduction)
   },{once:true})
  }
  const opening=doc.querySelector<HTMLElement>('.opening-name.atelier-opening-names')
  if(opening){
   const originalSize=parseFloat(win.getComputedStyle(opening).fontSize)
   let namesActive=true
   const fitOpeningNames=()=>{
    // Run after Names Fit has reset its measurements for this update.
    queueMicrotask(()=>{
     if(!namesActive)return
     const current=doc.querySelector<HTMLElement>('.opening-name.atelier-opening-names')
     if(!current||!current.clientWidth)return
     const names=[current.firstElementChild,current.lastElementChild] as HTMLElement[]
     if(names.some(name=>!name))return
     // Use identical line limits and widths for both names, including live edits.
     for(const name of names){
      const value=(name.dataset.nameInput??name.textContent??'').replace(/\r\n?/g,'\n').trim()
      name.textContent=wrapCardText(value,18)
     }
     const probe=doc.createElement('span')
     const style=win.getComputedStyle(names[0])
     probe.style.cssText='position:absolute;visibility:hidden;white-space:pre;pointer-events:none'
     probe.style.font=style.font
     probe.style.fontSize=`${originalSize}px`
     probe.style.letterSpacing=style.letterSpacing
     doc.body.append(probe)
     let longest=0
     for(const name of names){
      for(const line of (name.textContent||'').split('\n')){
       probe.textContent=line
       longest=Math.max(longest,probe.getBoundingClientRect().width)
      }
     }
     probe.remove()
     // Size both names from the widest wrapped line, with a little spare width.
     const size=Math.max(Math.min(24,originalSize),Math.min(originalSize,originalSize*current.clientWidth*.94/Math.max(1,longest)))
     names.forEach(name=>name.style.fontSize=`${Math.floor(size*10)/10}px`)
    })
   }
   win.addEventListener('invitation-preview-updated',fitOpeningNames)
   win.addEventListener('resize',fitOpeningNames)
   doc.fonts.addEventListener('loadingdone',fitOpeningNames)
   void doc.fonts.ready.then(fitOpeningNames)
   fitOpeningNames()
   win.addEventListener('unload',()=>{
    namesActive=false
    win.removeEventListener('invitation-preview-updated',fitOpeningNames)
    win.removeEventListener('resize',fitOpeningNames)
    doc.fonts.removeEventListener('loadingdone',fitOpeningNames)
   },{once:true})
  }
 }
 const container=doc.querySelector<HTMLElement>('.atelier-card-content-fit .atelier-events')
 if(!win||!container)return
 let active=true
 const fit=()=>{
  if(!active)return
  container.querySelectorAll<HTMLElement>('.atelier-event').forEach(card=>{
   const copy=card.querySelector<HTMLElement>('.atelier-event-copy')
   if(!copy||!card.clientWidth)return
   card.style.removeProperty('min-height')
   const requiredHeight=()=>{
    const children=Array.from(copy.children) as HTMLElement[]
    const gap=parseFloat(getComputedStyle(copy).rowGap)||0
    return children.reduce((total,child)=>total+child.getBoundingClientRect().height,0)+gap*Math.max(0,children.length-1)
   }
   const fits=(factor:number)=>{
    copy.style.setProperty('--card-fit',String(factor))
    return requiredHeight()<=copy.clientHeight-4
   }
   const maximumFactor=1
   if(fits(maximumFactor))return
   if(!fits(0)){
    // Preserve readable text and all existing content, including older long values.
    const availableFraction=copy.clientHeight/card.clientHeight
    card.style.minHeight=`${Math.ceil((requiredHeight()+6)/Math.max(.1,availableFraction))}px`
    return
   }
   let low=0,high=maximumFactor
   for(let step=0;step<9;step++){
    const middle=(low+high)/2
    if(fits(middle))low=middle
    else high=middle
   }
   copy.style.setProperty('--card-fit',String(low))
  })
 }
 let width=-1
 const resize=new ResizeObserver(entries=>{
  const nextWidth=entries[0]?.contentRect.width
  if(nextWidth===undefined||nextWidth===width)return
  width=nextWidth
  fit()
 })
 resize.observe(container)
 win.addEventListener('invitation-preview-updated',fit)
 win.addEventListener('resize',fit)
 doc.fonts.addEventListener('loadingdone',fit)
 void doc.fonts.ready.then(fit)
 fit()
 win.addEventListener('unload',()=>{
  active=false
  resize.disconnect()
  win.removeEventListener('invitation-preview-updated',fit)
  win.removeEventListener('resize',fit)
  doc.fonts.removeEventListener('loadingdone',fit)
 },{once:true})
}
