import { stringify } from "postcss";
import { createContext, useCallback, useContext, useState } from "react";
import { api } from "../server/api";


const AuthContext = createContext({})

function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const user = localStorage.getItem('@SistemaIEC:user')

        return JSON.parse(user)
    })
    const [roles, setRoles] = useState(() => {
        const roles = localStorage.getItem('@SistemaIEC:roles')

        return [roles]
    })
    const [token, setToken] = useState(() => {
        const token = localStorage.getItem('@SistemaIEC:token')

        if (token) {
            api.defaults.headers.authorization = `Bearer ${token}`

            return { token }
        }

        return {}
    })


    const signIn = useCallback(async ({ email, password }) => {
        const response = await api.post('/session', {
            email,
            password
        })

        const { token, newUser, roles } = response.data

        setToken(token)
        setUser(newUser)
        setRoles(roles)

        api.defaults.headers.authorization = `Bearer ${token}`
        localStorage.setItem('@SistemaIEC:token', token)
        localStorage.setItem('@SistemaIEC:user', JSON.stringify(newUser))
        localStorage.setItem('@SistemaIEC:roles', roles)
    }, []);

    const userLogged = useCallback(() => {
        const token = localStorage.getItem('@SistemaIEC:token');

        if (token) {
            return true
        }

        return false
    }, [])

    return (
        <AuthContext.Provider value={{ token, signIn, userLogged, user, roles }}>
            {children}
        </AuthContext.Provider>
    )
}

function useAuth() {
    const context = useContext(AuthContext)

    return context
}

export { AuthProvider, useAuth }