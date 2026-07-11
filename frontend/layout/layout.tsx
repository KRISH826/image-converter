"use client"
import { store } from '@/store/store'
import React from 'react'
import { Provider } from 'react-redux'

type props = {
    children: React.ReactNode
}

const Applayout = ({children}: props) => {
  return (
    <Provider store={store}>
        {children}
    </Provider>
  )
}

export default Applayout