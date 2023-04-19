import React, { useEffect, useState } from "react";
import {
    Navigate,
    Outlet,
    Route
} from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { api } from "../server/api";

export const PrivateRoutes = ({ role }) => {
    const [permissions, setPermissions] = useState([])
    const { userLogged } = useAuth()

    useEffect(() => {
        async function loadRoles() {
            const response = await api.get('/users/roles');
            const findRole = await response.data.some((r) => role?.split(',').includes(r))
            setPermissions(findRole)
        }

        loadRoles()
    }, [])

    if (!userLogged()) {
        return <Navigate to='/signin' />
    }

    if (!role && userLogged()) {
        return <Outlet />
    }

    return permissions ? <Outlet /> : <Navigate to='/signin' />
}

