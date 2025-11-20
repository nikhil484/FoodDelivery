// import React from 'react'
// import { Navigate, Route, Routes } from 'react-router-dom'
// import Home from './pages/Home.jsx'
// import SignUP from './pages/SignUp.jsx'
// import SignIn from './pages/SignIn.jsx'
// import ForgotPassword from './pages/ForgotPassword.jsx'
// import useGetCurrentUser from './hooks/useGetCurrentUser.jsx'
// import { useSelector } from 'react-redux'
// import Nav from './components/Nav.jsx'
// import useGetCity from './hooks/useGetCity.jsx'
// import useGetMyShop from './hooks/useGetMyShop.jsx'
// import CreateEditShop from './pages/CreateEditShop.jsx'


// export const serverUrl= "http://localhost:8000"

// function App() {
//   useGetCurrentUser()
//   useGetCity()
//   useGetMyShop()
  
  
//   const {userData}= useSelector(state=>state.user)
//   return (
//     <>
    
//     <Routes>
//     <Route path='/signup' element={!userData?<SignUP/>:<Navigate to={"/"}/>}/>
//     <Route path='/signin' element={!userData?<SignIn/>:<Navigate to={"/"}/>}/>
//     <Route path='/forgot-password' element={!userData?<ForgotPassword/>:<Navigate to={"/"}/>}/>
//     <Route path='/' element={userData?<Home/>:<Navigate to={"/signin"}/>}/>
//     <Route path='/create-edit-shop' element ={userData?<CreateEditShop/>:<Navigate to={"/signin"}/>}/>
//     </Routes>
//     </>
//   )
// }

// export default App





// import React from 'react'
// import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
// import Home from './pages/Home.jsx'
// import SignUp from './pages/SignUp.jsx'
// import SignIn from './pages/SignIn.jsx'
// import ForgotPassword from './pages/ForgotPassword.jsx'
// import useGetCurrentUser from './hooks/useGetCurrentUser.jsx'
// import { useSelector } from 'react-redux'
// import Nav from './components/Nav.jsx'
// import useGetCity from './hooks/useGetCity.jsx'
// import useGetMyShop from './hooks/useGetMyShop.jsx'
// import CreateEditShop from './pages/CreateEditShop.jsx'
// import OwnerDashboard from './components/OwnerDashboard.jsx'
// import AddItem from './pages/AddItem.jsx'
// import EditItem from './pages/EditItem.jsx'

// export const serverUrl = "http://localhost:8000"

// function App() {
//   useGetCurrentUser()
//   useGetCity()
//   useGetMyShop()

//   const location = useLocation()
//   const { userData } = useSelector(state => state.user)

//   // ✅ Add all routes where Nav should be hidden
//   const hideNavOn = ['/create-edit-shop','/add-item', '/signin', '/signup', '/forgot-password','/edit-item']

//   return (
//     <>
//       {/* ✅ Only show Nav if user is logged in AND not on any hidden path */}
//       {userData && !hideNavOn.includes(location.pathname) && <Nav />}

//       <Routes>
//         <Route path='/' element={userData ? <Home /> : <Navigate to="/signin" />} />
//         <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to="/" />} />
//         <Route path='/signin' element={!userData ? <SignIn /> : <Navigate to="/" />} />
//         <Route path='/forgot-password' element={!userData ? <ForgotPassword /> : <Navigate to="/" />} />
//         <Route path='/owner-dashboard' element={userData ? <OwnerDashboard /> : <Navigate to="/signin" />} />
//         <Route path='/create-edit-shop' element={userData ? <CreateEditShop /> : <Navigate to="/signin" />} />
//         <Route path='/add-item' element={userData ? <AddItem /> : <Navigate to="/signin" />} />
//         <Route path='/edit-item/:itemId' element={userData?<EditItem/>:<Navigate to={"/signin"}/>}/>
//           </Routes>
//     </>
//   )
// }

// export default App



import React from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import SignUp from './pages/SignUp.jsx'
import SignIn from './pages/SignIn.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import useGetCurrentUser from './hooks/useGetCurrentUser.jsx'
import { useSelector } from 'react-redux'
import Nav from './components/Nav.jsx'
import useGetCity from './hooks/useGetCity.jsx'
import useGetMyShop from './hooks/useGetMyShop.jsx'
import CreateEditShop from './pages/CreateEditShop.jsx'
import OwnerDashboard from './components/OwnerDashboard.jsx'
import AddItem from './pages/AddItem.jsx'
import EditItem from './pages/EditItem.jsx'
import useGetShopByCity from './hooks/useGetShopByCity.jsx'
import useGetItemsByCity from './hooks/useGetItemsByCity.jsx'

export const serverUrl = "http://localhost:8000"

function App() {
  useGetCurrentUser()
  useGetCity()
  useGetMyShop()
  useGetShopByCity()
  useGetItemsByCity()
  const location = useLocation()
  const { userData } = useSelector(state => state.user)

  // Hide Nav for these base paths (works for parameterized routes like /edit-item/:id)
  const hideNavOn = ['/create-edit-shop','/add-item', '/signin', '/signup', '/forgot-password', '/edit-item']

  // Check if current pathname matches or startsWith any hide path
  const shouldHideNav = hideNavOn.some(p => location.pathname === p || location.pathname.startsWith(p + '/') || location.pathname.startsWith(p))

  return (
    <>
      {/* show Nav only when user logged in AND not on a hidden path */}
      {userData && !shouldHideNav && <Nav />}

      <Routes>
        <Route path='/' element={userData ? <Home /> : <Navigate to="/signin" />} />
        <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to="/" />} />
        <Route path='/signin' element={!userData ? <SignIn /> : <Navigate to="/" />} />
        <Route path='/forgot-password' element={!userData ? <ForgotPassword /> : <Navigate to="/" />} />
        <Route path='/owner-dashboard' element={userData ? <OwnerDashboard /> : <Navigate to="/signin" />} />
        <Route path='/create-edit-shop' element={userData ? <CreateEditShop /> : <Navigate to="/signin" />} />
        <Route path='/add-item' element={userData ? <AddItem /> : <Navigate to="/signin" />} />
        <Route path='/edit-item/:itemId' element={userData ? <EditItem /> : <Navigate to="/signin" />} />

        {/* optional: 404 / fallback */}
        <Route path='*' element={<Navigate to={userData ? '/' : '/signin'} replace />} />
      </Routes>
    </>
  )
}

export default App
