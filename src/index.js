import './index.css'
import 'react-toastify/dist/ReactToastify.css'
import "react-datepicker/dist/react-datepicker.css"
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './container/App';
import Provider from './store/Provider'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <Provider>
      <App />
    </Provider>
  </BrowserRouter>
  // </React.StrictMode>
)
