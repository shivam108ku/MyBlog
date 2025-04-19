import React, { useEffect,useState, createContext } from 'react'
import Navbars from './components/Navbars';
import { Route, Routes } from 'react-router';
 
import UserAuth from './pages/UserAuth';
import { lookInSession } from './common/Session';

export const UserContext = createContext({});

const App = () => {

  const [userAuth ,setAuth] = useState({});

  useEffect(()=>{
    let userInSession = lookInSession("user");
    userInSession ? setAuth(JSON.parse(userInSession)) : setAuth({access_token: null})
  },[])

  return (
    <UserContext.Provider value={{userAuth,setAuth}}>
   
      <Routes>

        <Route path='/' element={<Navbars />}>

          <Route path='signin' element={<UserAuth type="sign-in" />} />
          <Route path='signup' element={<UserAuth type="sign-up" />} />

        </Route>

      </Routes>
     
    </UserContext.Provider>
  )
}

export default App