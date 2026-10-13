import type { Plugin } from 'vite'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { randomUUID } from 'node:crypto'
import { validateDetails } from '../src/invitations/model.ts'
export function applicationAPI(): Plugin {
 return { name: 'local-application-api', configureServer(server) {
  server.middlewares.use('/api/applications', async (req,res) => {
   res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store')
   const send=(status:number,data:unknown)=>{res.statusCode=status;res.end(JSON.stringify(data))}
   if(req.method!=='POST'||(req.url||'/').split('?')[0]!=='/'){send(405,{error:'Method not allowed.'});return}
   if(req.headers.origin && ![`http://${req.headers.host}`,`https://${req.headers.host}`].includes(req.headers.origin)){send(403,{error:'Invalid origin.'});return}
   let details
   try {
    let body='';for await(const chunk of req){body+=chunk.toString();if(body.length>40000){send(413,{error:'Application is too large.'});return}}
    details=validateDetails(JSON.parse(body));if(details.template!==2)throw new Error('Please use the Royal Grace application form.')
   }catch(e){send(400,{error:e instanceof Error?e.message:'Invalid application.'});return}
   try {
    const id=randomUUID();const createdAt=new Date().toISOString();const record={id,createdAt,status:'new',details}
    const directory=resolve(process.cwd(),'.invitation-data/applications');await mkdir(directory,{recursive:true})
    await writeFile(resolve(directory,`${id}.json`),JSON.stringify(record,null,2),{flag:'wx'})
    send(201,{id,createdAt,status:'new'})
   }catch{send(503,{error:'Unable to save your application. Please try again.'})}
  })
 } }
}
