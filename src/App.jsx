import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Orders from './pages/Orders'
import OrderPage from './pages/OrderPage'
import Products from './pages/Products'
import ProductPage from './pages/ProductPage'
import AddProduct from './pages/AddProduct'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/orders' element={<Orders />} ></Route>
        <Route path='/orders/:id' element={<OrderPage />}></Route>
        <Route path='/products/:id' element={<ProductPage />}></Route>
        <Route path='/products' element={<Products />}></Route>
        <Route path='/add-product' element={<AddProduct />}></Route>
      </Routes>
    </>
  )
}

export default App
