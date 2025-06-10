
import AuthApp from './Components/AuthApp.jsx'
import { CurrentViewProvider } from './Components/CurrentViewProvider.jsx'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import TaskApp from './Components/TaskApp/TaskApp.jsx'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setupAxiosInterceptors } from './services/interceptor.js'


function App() {

   const dispatch = useDispatch()

  useEffect(() => {
    // Call the setup function with dispatch so that it can be used in the interceptors
    setupAxiosInterceptors(dispatch);
  }, [dispatch]);

  return (
    <>
     <Router>
      <CurrentViewProvider>

        <Routes>
          <Route path='/taskApp' element={<TaskApp />} />
          <Route path='/' element={<AuthApp />} />
        </Routes>
      </CurrentViewProvider>


    </Router>
</>

  )
}

export default App