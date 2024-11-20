import { lazy,Suspense,useEffect } from 'react'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import {Toaster} from "react-hot-toast"


import Loader from './components/loader'
import Header from './components/header'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import { useDispatch, useSelector } from 'react-redux'

import { userExist, userNotExist } from './redux/reducer/userReducer'
// @ts-ignore
import { getUser } from "./redux/api/userAPI"
import { UserReducerInitialState } from './types/reducer-types'
import ProtectedRoute from './components/protected-route'
const Search =lazy(()=>import('./pages/search'))
const Shipping =lazy(()=>import('./pages/shipping'))
const Orders =lazy(()=>import('./pages/orders'))
const NotFound =lazy(()=>import('./pages/notFound'))
const Checkout =lazy(()=>import('./pages/checkout'))
const OrderDetails =lazy(()=>import('./pages/orderDetails'))
const Login =lazy(()=>import('./pages/login'))
const Cart =lazy(()=>import('./pages/cart'))
const Home =lazy(()=>import('./pages/home'))
//Admin Routes importing
const Dashboard = lazy(() => import("./pages/admin/dashboard"));
const Products = lazy(() => import("./pages/admin/products"));
const Customers = lazy(() => import("./pages/admin/customers"));
const Transaction = lazy(() => import("./pages/admin/transaction"));
const Barcharts = lazy(() => import("./pages/admin/charts/barcharts"));
const Piecharts = lazy(() => import("./pages/admin/charts/piecharts"));
const Linecharts = lazy(() => import("./pages/admin/charts/linecharts"));
const Coupon = lazy(() => import("./pages/admin/apps/coupon"));
const Stopwatch = lazy(() => import("./pages/admin/apps/stopwatch"));
const Toss = lazy(() => import("./pages/admin/apps/toss"));
const NewProduct = lazy(() => import("./pages/admin/management/newproduct"));
const ProductManagement = lazy(
  () => import("./pages/admin/management/productmanagement")
);
const TransactionManagement = lazy(
  () => import("./pages/admin/management/transactionmanagement")
);
const App = () => {

const { user,loading }=useSelector((state:{userReducer:UserReducerInitialState})=>state.userReducer)
  
const dispath=useDispatch();
useEffect(()=>{
  onAuthStateChanged(auth,async(user)=>{
    if(user){
      const data=await getUser(user.uid)
      dispath(userExist(data.user))
    }
    else{
      dispath(userNotExist())
    }
  })
},[])

 return loading?<Loader/>:<Router>
 <Header user={user}/>
 <Suspense fallback={<Loader/>}>
 <Routes>
     <Route path='/' element={<Home/>}/>
     <Route path='/search' element={<Search/>}/>
     <Route path='/cart' element={<Cart/>}/>
     
     <Route path='/login' element={
      <ProtectedRoute isAuthenticated={user?false:true}>
      <Login/>
      </ProtectedRoute>
      }/>

     {/*Logged In User Routes */}
     <Route element={<ProtectedRoute isAuthenticated={user?true:false}/>}>
     <Route path='/shipping' element={<Shipping/>}/>
     <Route path='/orders' element={<Orders/>}/>
     <Route path='/orders/:id' element={<OrderDetails/>}/>
     <Route path='/pay' element={<Checkout/>}/>
     </Route>
      {/*admin routes*/}
     <Route
 element={
   <ProtectedRoute isAuthenticated={true} adminOnly={true} admin={user?.role==="admin"?true:false} />}
>
 <Route path="/admin/dashboard" element={<Dashboard />} />
 <Route path="/admin/product" element={<Products />} />
 <Route path="/admin/customer" element={<Customers />} />
 <Route path="/admin/transaction" element={<Transaction />} />
 {/* Charts */}
 <Route path="/admin/chart/bar" element={<Barcharts />} />
 <Route path="/admin/chart/pie" element={<Piecharts />} />
 <Route path="/admin/chart/line" element={<Linecharts />} />
 {/* Apps */}
 <Route path="/admin/app/coupon" element={<Coupon />} />
 <Route path="/admin/app/stopwatch" element={<Stopwatch />} />
 <Route path="/admin/app/toss" element={<Toss />} />

 {/* Management */}
 <Route path="/admin/product/new" element={<NewProduct />} />

 <Route path="/admin/product/:id" element={<ProductManagement />} />

 <Route path="/admin/transaction/:id" element={<TransactionManagement />} />
</Route>
<Route path='*' element={<NotFound/>}/>
 </Routes>
 </Suspense>
 <Toaster position="bottom-center"/>
 </Router> 
}

export default App
