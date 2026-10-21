export const bloomRulesCSS = `
 .atelier-bloom-hero>.atelier-bloom-stage{position:static;padding:0}
 .atelier-bloom-hero .atelier-bloom-opening-panel{position:absolute;max-width:none;padding:0;margin:0;display:flex;flex-direction:column;align-items:center}
 .atelier-bloom-hero .atelier-bloom-arch{width:100%;height:28%;flex:none;margin:0;transform:none!important}
 .atelier-bloom-hero .atelier-bloom-arch svg:first-child{display:block!important;width:100%;height:auto;padding:0;margin:0 auto;overflow:visible;transform:translateY(-25%)}
 .atelier-bloom-hero .atelier-bloom-arch svg:not(:first-child){display:none!important}
 .atelier-bloom-hero .atelier-bloom-opening-group{width:100%;height:72%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:8px 0;box-sizing:border-box}
 .atelier-bloom-hero .atelier-bloom-opening-group>div:empty{display:none}
 .atelier-bloom-hero .atelier-bloom-opening-group>p{flex:none;margin:0;padding:0;font-size:11px;line-height:1.45;letter-spacing:.3em}
 .atelier-opening-names.atelier-bloom-opening-names{width:100%;max-width:100%;margin-inline:auto}
 .atelier-bloom-opening-names>span:first-child,.atelier-bloom-opening-names>span:last-child{font-size:32px}
 @media(max-width:767px){.atelier-opening-names.atelier-bloom-opening-names{margin-top:-88px}}
 @media(min-width:768px){
  .atelier-opening-names.atelier-bloom-opening-names{margin-top:8px}
  .atelier-bloom-opening-names>span:first-child,.atelier-bloom-opening-names>span:last-child{font-size:40px}
 }
 .atelier-bloom-names.atelier-names-stacked>:first-child,
 .atelier-bloom-names.atelier-names-stacked>:last-child{max-width:100%;white-space:pre-line;overflow-wrap:normal;word-break:normal;text-wrap:initial;line-height:1.12}
 .atelier-bloom-welcome [hidden],.atelier-bloom-ceremony [hidden],.atelier-bloom-rules [hidden]{display:none!important}
 .atelier-bloom-welcome .atelier-family-names{width:88%;margin-inline:auto;gap:12px}
 .atelier-bloom-welcome .atelier-bloom-person{min-width:0;max-width:100%}
 .atelier-bloom-welcome .atelier-bloom-person h3{display:inline-block;margin:0;white-space:nowrap}
 .atelier-bloom-welcome .atelier-names-stacked .atelier-bloom-person h3{max-width:100%;white-space:pre-line;overflow-wrap:normal;word-break:normal;line-height:1.15}
 .atelier-bloom-welcome .atelier-bloom-family{font-size:16px;line-height:1.5;white-space:pre-line;overflow-wrap:anywhere;margin:8px 0 0}
 .atelier-bloom-welcome .atelier-family-names>p{margin:0;padding:0;line-height:1.2}
 .atelier-bloom-welcome p{overflow-wrap:anywhere}
 .atelier-bloom-rules .atelier-note p{overflow-wrap:anywhere}
 .atelier-bloom-rules .atelier-note img{display:block;width:100%;height:auto;margin:24px auto 0}
 [data-bloom-card]{position:relative;--bloom-fit:1}
 [data-bloom-copy]{box-sizing:border-box;min-width:0;overflow-wrap:anywhere;text-align:center}
 .atelier-bloom-ceremony [data-bloom-copy]{position:absolute;top:28%;bottom:30%;left:18%;width:64%;max-width:none;padding:0;display:flex;flex-direction:column;justify-content:center;gap:8px}
 .atelier-bloom-ceremony [data-bloom-copy]>*{flex:none;min-width:0;max-width:100%;margin:0;padding:0;white-space:pre-line}
 .atelier-bloom-ceremony [data-bloom-copy] h2{font-size:calc(24px + 12px * var(--bloom-fit));line-height:1.15}
 .atelier-bloom-ceremony [data-bloom-copy] h3{font-size:calc(16px + 12px * var(--bloom-fit));line-height:1.2}
 .atelier-bloom-ceremony [data-bloom-copy] p{font-size:calc(10px + 2px * var(--bloom-fit));line-height:1.4;letter-spacing:.12em}
 .atelier-bloom-ceremony [data-bloom-copy] div span{font-size:calc(12px + 2px * var(--bloom-fit));white-space:pre-line;overflow-wrap:anywhere}
 .atelier-bloom-ceremony [data-bloom-copy] .flex{flex-wrap:wrap}
 .atelier-bloom-ceremony>div:last-child{flex-wrap:wrap}
 .atelier-bloom-ceremony>div:last-child>a,.atelier-bloom-ceremony>div:last-child>button{white-space:normal;text-align:center}
 .atelier-bloom-rules [data-bloom-card]{min-height:0;isolation:isolate}
 .atelier-bloom-rules [data-bloom-copy]{position:absolute!important;top:18%;bottom:18%;left:18%;width:64%;display:flex;flex-direction:column;justify-content:center;gap:calc(4px + 6px * var(--bloom-fit))}
 .atelier-bloom-rules [data-bloom-copy]>*{flex:none;min-width:0;max-width:100%;margin:0}
 .atelier-bloom-rules [data-bloom-copy] h2{font-size:calc(24px + 16px * var(--bloom-fit));line-height:1.1}
 .atelier-bloom-rules [data-bloom-copy] h3{font-size:calc(16px + 9px * var(--bloom-fit));line-height:1.2}
 .atelier-bloom-rules [data-bloom-copy] p{font-size:calc(13px + 5px * var(--bloom-fit));line-height:1.3}
 .atelier-bloom-rules [data-bloom-copy] .atelier-eyebrow{font-size:11px}
 .atelier-bloom-rules [data-bloom-copy] .atelier-date{font-size:13px;letter-spacing:.18em}
 .atelier-bloom-rules [data-bloom-copy] [data-card-text]{white-space:pre-line}
 .atelier-bloom-rules [data-bloom-copy] .atelier-links{font-size:14px;gap:8px 12px}
 .atelier-bloom-rules .atelier-bloom-expanded>video{position:absolute;inset:0;width:100%!important;height:100%!important;object-fit:fill;align-self:stretch!important}
`

export function prepareBloomOpening(hero:HTMLElement,names:HTMLElement){
 const panel=names.parentElement!
 hero.classList.add('atelier-bloom-hero')
 panel.classList.add('atelier-bloom-opening-panel')
 panel.parentElement?.classList.add('atelier-bloom-stage')
 const arch=panel.firstElementChild!
 arch.classList.add('atelier-bloom-arch')
 const group=names.ownerDocument.createElement('div')
 group.className='atelier-bloom-opening-group'
 const children=Array.from(panel.children)
 group.append(...children.slice(children.indexOf(names)))
 panel.append(group)
}

// One fitter owns Bloom's widths, line breaks and shared name size.
// Always re-read the live elements because editor updates can replace children.
export function fitBloomNames(block:HTMLElement){
 const doc=block.ownerDocument
 const win=doc.defaultView
 if(!win||!block.isConnected)return
 const children=Array.from(block.children) as HTMLElement[]
 if(children.length!==3)return
 const names=[children[0].querySelector<HTMLElement>('h3')||children[0],children[2].querySelector<HTMLElement>('h3')||children[2]]
 const values=names.map(name=>(name.dataset.nameInput??name.textContent??'').replace(/\r\n?/g,'\n').replace(/[^\S\n]+/g,' ').trim())
 names.forEach((name,index)=>{name.style.removeProperty('font-size');name.textContent=values[index]})
 const maximum=parseFloat(win.getComputedStyle(names[0]).fontSize)
 const minimum=Math.min(24,maximum)
 const normalMinimum=Math.max(minimum,maximum*.75)
 const originalHero=block.classList.contains('atelier-bloom-opening-names')?block.closest<HTMLElement>('#hero'):null
 let safeBottom=Infinity
 if(originalHero){
  const contain=win.getComputedStyle(originalHero.firstElementChild!).backgroundSize==='contain'
  const scale=(contain?Math.min:Math.max)(originalHero.clientWidth/941,originalHero.clientHeight/1672)
  // Use the image's inner oval, not a percentage of an already narrowed parent.
  block.style.maxWidth=`${Math.floor(941*scale*.30)}px`
  const top=originalHero.getBoundingClientRect().top+(originalHero.clientHeight-1672*scale)/2
  safeBottom=top+1672*scale*.60
 }
 const hero=block.closest<HTMLElement>('.atelier-bloom-hero')
 const panel=hero?.querySelector<HTMLElement>('.atelier-bloom-opening-panel')
 const group=hero?.querySelector<HTMLElement>('.atelier-bloom-opening-group')
 if(hero)hero.style.removeProperty('min-height')
 const probe=doc.createElement('span')
 probe.style.cssText='position:absolute;visibility:hidden;pointer-events:none;white-space:pre;width:max-content'
 const style=win.getComputedStyle(names[0])
 // Copy individual properties: computed font shorthand can be empty for web fonts.
 probe.style.fontFamily=style.fontFamily
 probe.style.fontWeight=style.fontWeight
 probe.style.fontStyle=style.fontStyle
 probe.style.fontStretch=style.fontStretch
 probe.style.fontVariant=style.fontVariant
 probe.style.fontFeatureSettings=style.fontFeatureSettings
 probe.style.fontKerning=style.fontKerning
 probe.style.letterSpacing=style.letterSpacing
 doc.body.append(probe)
 const measure=(text:string,size:number)=>{
  probe.style.fontSize=`${size}px`
  probe.textContent=text
  return probe.getBoundingClientRect().width
 }
 for(let pass=0;pass<4;pass++){
  if(hero&&panel){
   // Match the existing centered cover/contain background, including phone previews.
   const background=hero.firstElementChild!
   const contain=win.getComputedStyle(background).backgroundSize==='contain'
   const scale=(contain?Math.min:Math.max)(hero.clientWidth/941,hero.clientHeight/1672)
   const imageWidth=941*scale,imageHeight=1672*scale
   panel.style.left=`${(hero.clientWidth-imageWidth)/2+imageWidth*.33}px`
   panel.style.top=`${(hero.clientHeight-imageHeight)/2+imageHeight*.27}px`
   panel.style.width=`${imageWidth*.34}px`
   panel.style.height=`${imageHeight*.34}px`
  }
  const width=block.clientWidth*.94
  if(!width)break
  const fullWidth=Math.max(...values.flatMap(value=>{
   if(value.includes('\n'))return value.split('\n').map(line=>measure(line,maximum))
   const words=value.split(/\s+/).filter(Boolean)
   return (words.length===2?words:[value]).map(line=>measure(line,maximum))
  }))
  let size=Math.min(maximum,Math.max(normalMinimum,maximum*width/Math.max(1,fullWidth)))
  // Keep every word intact, reducing both names beyond the usual limit if necessary.
  const widestWord=Math.max(1,...values.flatMap(value=>value.split(value.includes('\n')?'\n':/\s+/).map(word=>measure(word,size))))
  size=Math.min(size,size*width/widestWord)
  const opening=doc.querySelector('.atelier-bloom-opening-names')
  const stacked=block.dataset.namesLayout==='stacked'||Boolean(block.classList.contains('atelier-family-names')&&opening?.classList.contains('atelier-names-stacked'))||values.reduce((sum,value)=>sum+measure(value,maximum),0)+children[1].getBoundingClientRect().width+32>width*.8
  block.classList.toggle('atelier-names-stacked',stacked)
  const wrap=(value:string,fontSize:number)=>{
   if(value.includes('\n'))return value
   const words=value.split(/\s+/).filter(Boolean)
   if(words.length===2)return words.join('\n')
   const lines:string[]=[]
   let line=''
   for(const word of words){
    if(line&&measure(`${line} ${word}`,fontSize)>width){lines.push(line);line=''}
    line=line?`${line} ${word}`:word
   }
   if(line)lines.push(line)
   return lines.join('\n')
  }
  const render=(fontSize:number)=>names.forEach((name,index)=>{
   name.style.fontSize=`${fontSize}px`
   name.textContent=stacked?wrap(values[index],fontSize):values[index]
  })
  render(size)
  // Measure the rendered text itself as a final guard against font/shorthand differences.
  const renderedWidth=()=>Math.max(0,...names.flatMap(name=>{
   const node=name.firstChild
   if(!node)return [0]
   let offset=0
   return (node.textContent||'').split('\n').map(line=>{
    const range=doc.createRange()
    range.setStart(node,offset)
    range.setEnd(node,offset+line.length)
    offset+=line.length+1
    return range.getBoundingClientRect().width
   })
  }))
  for(let attempt=0;attempt<8;attempt++){
   const actual=renderedWidth()
   if(actual<=width+.25)break
   size*=width/actual*.98
   render(size)
  }
  if(originalHero){
   const date=block.parentElement?.querySelector<HTMLElement>(':scope > p')
   for(let attempt=0;date&&attempt<24&&date.getBoundingClientRect().bottom>safeBottom;attempt++){
    size*=.94
    render(size)
   }
  }
  if(!group)break
  const requiredHeight=()=>Array.from(group.children).filter(child=>win.getComputedStyle(child).display!=='none').reduce((sum,child)=>sum+child.getBoundingClientRect().height,0)+28
  // Fit the complete names, connector and date, rather than moving the date into the border.
  while(size>minimum&&requiredHeight()>group.clientHeight){size=Math.max(minimum,size-.5);render(size)}
  const excess=requiredHeight()-group.clientHeight
  if(excess<=1||!hero)break
  hero.style.minHeight=`${Math.ceil(hero.clientHeight+(excess+8)/(.34*.72))}px`
 }
 probe.remove()
}

export function installBloomFit(doc:Document){
 const win=doc.defaultView
 if(!win||!doc.querySelector('[data-bloom-card]'))return
 let active=true
 const fit=()=>{
  if(!active)return
  doc.querySelectorAll<HTMLElement>('[data-bloom-card]').forEach(card=>{
   const copy=card.querySelector<HTMLElement>('[data-bloom-copy]')
   if(!copy||!card.clientWidth)return
   card.classList.remove('atelier-bloom-expanded')
   card.style.removeProperty('min-height')
   const height=()=>{
    const children=Array.from(copy.children).filter(child=>win.getComputedStyle(child).display!=='none')
    const gap=parseFloat(win.getComputedStyle(copy).rowGap)||0
    return children.reduce((sum,child)=>sum+child.getBoundingClientRect().height,0)+Math.max(0,children.length-1)*gap
   }
   const fits=(factor:number)=>{
    card.style.setProperty('--bloom-fit',String(factor))
    return height()<=copy.clientHeight-4
   }
   if(fits(1))return
   if(!fits(0)){
    if(card.dataset.bloomCard==='image')card.style.minHeight=`${Math.ceil((height()+8)/.42)}px`
    else{
     // Extend the decorative frame with the content; never detach the copy from it.
     const required=Math.ceil((height()+8)/.64)
     card.style.minHeight=`${Math.max(card.clientHeight,required)}px`
     card.classList.add('atelier-bloom-expanded')
    }
    return
   }
   let low=0,high=1
   for(let step=0;step<9;step++){
    const middle=(low+high)/2
    if(fits(middle))low=middle
    else high=middle
   }
   card.style.setProperty('--bloom-fit',String(low))
  })
 }
 const widths=new WeakMap<Element,number>()
 const observer=new ResizeObserver(entries=>{
  let changed=false
  for(const entry of entries){
   if(widths.get(entry.target)!==entry.contentRect.width){
    widths.set(entry.target,entry.contentRect.width)
    changed=true
   }
  }
  if(changed)fit()
 })
 doc.querySelectorAll('[data-bloom-card]').forEach(card=>observer.observe(card))
 win.addEventListener('resize',fit)
 win.addEventListener('invitation-preview-updated',fit)
 doc.addEventListener('loadedmetadata',fit,true)
 doc.fonts.addEventListener('loadingdone',fit)
 void doc.fonts.ready.then(fit)
 fit()
 win.addEventListener('unload',()=>{
  active=false
  observer.disconnect()
  win.removeEventListener('resize',fit)
  win.removeEventListener('invitation-preview-updated',fit)
  doc.removeEventListener('loadedmetadata',fit,true)
  doc.fonts.removeEventListener('loadingdone',fit)
 },{once:true})
}
