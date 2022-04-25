import {
    Navigate,
    Outlet,
} from 'react-router-dom';
import { useJwt } from "react-jwt";


export const ProtectedRoute =  ({ isAllowed, redirectPath = '/', children }) => {
    //verify if not expired
    const {isExpired } = useJwt(localStorage.getItem('token'));
    if (!isAllowed || isExpired) {
        return <Navigate to={redirectPath} replace />;
    }

    return children ? children : <Outlet />;
};


