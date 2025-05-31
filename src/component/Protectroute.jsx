import {Outlet,Navigate} from "react-router-dom"; 
import {userState} from "react";

function ProtectRoue(){
    const[isAuth,setIsAuth] = userState(true);

    return isAuth ? <Outlet /> : <Navigate to="/login" /> ;


}

export default ProtectRoue