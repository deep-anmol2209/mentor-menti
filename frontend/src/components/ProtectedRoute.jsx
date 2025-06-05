// import React, { Children } from 'react'
// import { Navigate} from 'react-router-dom';

// const ProtectedRoute = () => {
//     const isAuthenticated=localStorage.getItem("token");
//     return isAuthenticated?Children:<Navigate to="/signin"/>

// }

// export default ProtectedRoute;

import React from 'react'
import useUserStore from '../store/user';
import { Navigate, useLocation } from 'react-router-dom';
import { removeToken } from '../helper';

const ProtectedRoute = (props) => {
    const {children} = props;
    const {user} = useUserStore();
    const location = useLocation();
    if(!user){
      removeToken();
        return <Navigate to={`/signin?redirect=${location.pathname}`}/>
    }

  return (
    <div>{children}</div>
  )
}

export default ProtectedRoute
