import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SsoProvider } from '@etechinc/sso-client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SsoProvider brokerOrigin="https://kannegiesser.ai" appSlug="service-contracts">
      <App />
    </SsoProvider>
  </StrictMode>,
)
