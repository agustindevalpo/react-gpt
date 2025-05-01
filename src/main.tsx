import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import { AppGpt } from './AppGpt.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppGpt />
  </StrictMode>,
)
