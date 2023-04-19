import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext";
import { api } from "../server/api";

export function PermissionComponent({ role, children }) {
    const { roles, user } = useAuth()
    const [permissions, setPermissions] = useState(roles)
    const [isLoading, setIsLoading] = useState(true);

    /* setPermissions(user.roles) */

    //useEffect(() => {

    const findRole = roles.some((r) => role?.split(',').includes(r))

    /* async function loadRoles() {
        const response = await api.get('/users/roles').finally(() => setIsLoading(false));
        const findRole = await response.data.some((r) => role?.split(',').includes(r))

        setPermissions(findRole)
    }

    loadRoles() */
    /* setPermissions(roles) */

    //}, [role])
    return (
        <>
            {
                findRole && children
            }
        </>
    )
}