import React, { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Register from './components/login/Register'
import Login from './components/login/Login'
import NotFound from './components/login/NotFound'
import Home from './components/home/Home'
import Private from './components/private/Private'

import { userContext } from './components/context/UserContext'
import List from './components/list/List'

const App = () => {

  const [loggedUser, setLoggedUser] = useState(JSON.parse(localStorage.getItem("nutrify-tracker")));

  return (

    <userContext.Provider value={{loggedUser,setLoggedUser}}>

      <BrowserRouter>
      
        <Routes>

          <Route path='/' element={<Login/>} />
          <Route path='/register' element={<Register/>} />
          <Route path='/home' element={<Private component={Home}/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='*' element={<NotFound/>} />
          <Route path='/list' element={<Private component={List}/>}/>

        </Routes>
      
      </BrowserRouter>

    </userContext.Provider>
  )
}

export default App