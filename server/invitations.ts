import type { Plugin } from 'vite'
import { mkdir, readFile, writeFile, rename } from 'node:fs/promises'
import { resolve } from 'node:path'
import { nameSlug, reservedSlugs, validateDetails } from '../src/invitations/model.ts'
import type { SavedInvitation } from '../src/invitations/model.ts'

export function invitationAPI(): Plugin {
  const directory = resolve(process.cwd(), '.invitation-data')
  const file = resolve(directory, 'invitations.json')
  let queue: Promise<unknown> = Promise.resolve()
  return { name:'local-invitation-api', configureServer(server) {
    server.middlewares.use('/api/invitations', async (req,res) => {
      res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store')
      const send=(status:number,data:unknown)=>{res.statusCode=status;res.end(JSON.stringify(data))}
      const read=async():Promise<SavedInvitation[]>=>{try{return JSON.parse(await readFile(file,'utf8'))}catch(e){if((e as NodeJS.ErrnoException).code==='ENOENT')return [];throw e}}
      try {
        const path=(req.url||'/').split('?')[0]
        if(req.method==='GET' && path!=='/') {
          const all=await read();const found=all.find(i=>i.slug===decodeURIComponent(path.slice(1)))
          send(found?200:404,found||{error:'Invitation not found.'});return
        }
        if(req.method!=='POST'||path!=='/'){send(405,{error:'Method not allowed.'});return}
        if(req.headers.origin && req.headers.origin!==`http://${req.headers.host}` && req.headers.origin!==`https://${req.headers.host}`){send(403,{error:'Invalid origin.'});return}
        let body='';for await(const chunk of req){body+=chunk.toString();if(body.length>40000){send(413,{error:'Invitation is too large.'});return}}
        const details=validateDetails(JSON.parse(body))
        const task=queue.then(async()=>{
          const all=await read();const base=nameSlug(details.groom,details.bride);let slug=base;let n=2
          while(reservedSlugs.has(slug)||all.some(i=>i.slug===slug))slug=`${base}-${n++}`
          const invitation={slug,details,createdAt:new Date().toISOString()};all.push(invitation)
          await mkdir(directory,{recursive:true});await writeFile(file+'.tmp',JSON.stringify(all,null,2));await rename(file+'.tmp',file)
          return invitation
        });queue=task.catch(()=>{});send(201,await task)
      } catch(e){send(400,{error:e instanceof Error?e.message:'Could not save invitation.'})}
    })
  } }
}
