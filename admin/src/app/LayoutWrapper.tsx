'use client'
import Spinner from '@/lib/Spinner'
import AuthCheck from '@/store/Provider/AuthProvider'
import { persistor, store } from '@/store/store'
import React from 'react'
import { Toaster } from 'react-hot-toast'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <Provider store={store}>
            <PersistGate loading={<Spinner />} persistor={persistor}>
                <Toaster />
                <AuthCheck>
                    {children}
                </AuthCheck>
            </PersistGate>
        </Provider>
    )
}

export default LayoutWrapper