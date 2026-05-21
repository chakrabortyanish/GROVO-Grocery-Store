import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App.jsx'
import {SignUp, LogIn, Cart, Delete} from './pages/index.js'

import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'

import { CartProvider } from './components/contextAPI/cartContext.jsx'

import Payment from './pages/checkout/Payment.jsx'

// Router setup
const Router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path='/' element={<App/>}></Route>
        <Route path='/signup' element={<SignUp/>}></Route>
        <Route path='/login' element={<LogIn/>}></Route>
        <Route path='/delete' element={<Delete/>}></Route>
        <Route path='/cart' element={<Cart/>}></Route>
        <Route path='/payment' element={<Payment/>}></Route>
      </>
    )
  )


createRoot(document.getElementById('root')).render(
    <CartProvider>
      <RouterProvider router={Router} />
    </CartProvider>
)
