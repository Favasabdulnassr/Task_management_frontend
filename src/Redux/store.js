import {combineReducers, configureStore} from '@reduxjs/toolkit'
import LoginReducer from './Reducers/LoginReducer'

import { persistStore,persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'




const persistConfig = {
    key:'root',       // key to store the state in localStorage
    storage:storage,  // uses localStorage by default
    whitelist:['login'],  // only persist the login slice
};

const rootReducer = combineReducers({
    login:LoginReducer,

})

const persistedReducer = persistReducer(persistConfig,rootReducer)

const store = configureStore({
    reducer:persistedReducer,
})


// Create a persistor to handle the store persistence
export const persistor = persistStore(store)


export default store