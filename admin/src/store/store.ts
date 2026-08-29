import {configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query';
// import storage from 'redux-persist/lib/storage';
import storage from './storage';
import{persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER} from 'redux-persist'
import userReducer from './slice/userSlice'
import { api } from './api';

// Persist configuration for user
const userPersistConfig = {key:'user',storage, whitelist:['user', 'isEmailVerified', 'isLoggedIn']}

//wrap reducers  with persist config

const persistedUserReducer = persistReducer(userPersistConfig, userReducer)

export const store = configureStore({
    reducer:{
        [api.reducerPath]:api.reducer,
        user:persistedUserReducer
    },
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware({
        serializableCheck:{
            ignoredActions:[FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        }
    }).concat(api.middleware)
})

//setuyp the luster for rtk query
setupListeners(store.dispatch)

//create a persistor
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch