import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { applicationAPI } from './server/applications.ts'
import { invitationAPI } from './server/invitations.ts'

export default defineConfig({
  plugins: [react(), tailwindcss(), invitationAPI(), applicationAPI()],
})
