import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './Redux/store.js'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastContainer autoClose={1000} />
    <Provider store={store}>
      <App />
    </Provider>


  </StrictMode>,
)
