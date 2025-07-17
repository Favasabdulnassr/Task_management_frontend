import React, { createContext, useContext, useEffect, useState } from 'react'

const CurrentViewContext = createContext();

export const CurrentViewProvider = ({ children }) => {

    const [currentView, setCurrentView] = useState(() => {
        return localStorage.getItem('currentView') || 'login';
    });


    useEffect(() => {
        localStorage.setItem('currentView', currentView);
    }, [currentView]);

    return (
        <CurrentViewContext.Provider value={{ currentView, setCurrentView }}>
            {children}
        </CurrentViewContext.Provider>
    )
}

export const useCurrentView = () => useContext(CurrentViewContext)