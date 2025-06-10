import React, { createContext,useContext,useState} from 'react'

const CurrentViewContext = createContext();

export const CurrentViewProvider = ({children}) => {
    const [currentView, setCurrentView] = useState('login');
    return(
        <CurrentViewContext.Provider value={{currentView,setCurrentView}}>
            {children}
        </CurrentViewContext.Provider>
    )
}

export const useCurrentView = () =>useContext(CurrentViewContext)