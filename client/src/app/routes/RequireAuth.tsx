import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUserInfoQuery } from "../../features/account/accountApi";
import LoadingComponent from "../layout/LoadingComponent";

export default function RequirAuth(){
    const {data: user, isLoading} = useUserInfoQuery();
    const location = useLocation();
    if (isLoading) return <LoadingComponent />

    if(!user) {
        return <Navigate to='/sign-in' state={{from: location}} />
    }

    return (
        <Outlet />
    )
}