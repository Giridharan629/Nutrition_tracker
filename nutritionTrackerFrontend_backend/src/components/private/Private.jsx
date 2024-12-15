import React, { useContext } from 'react'
import { userContext } from '../context/UserContext'
import { Navigate } from 'react-router-dom';

const Private = (props) => {

    const loggedUser = useContext(userContext);

  return (
    loggedUser.loggedUser!==null?
    <props.component/>
    :<Navigate to="/login" />
  )
}

export default Private