import { Link, useNavigate } from "react-router-dom"

import { useForm } from 'react-hook-form'
import { api } from '../server/api';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
import { useContext, useEffect, useState } from "react";

import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from "../context/AuthContext";

const schema = yup.object({
    name: yup.string().required('O nome é obrigatório'),
    permission: yup.string().required('O celular é obrigatório')
})

export function SignIn() {
    const [isLoading, setIsLoading] = useState(true)
    const [listMembers, setListMembers] = useState([])

    const { signIn, roles } = useAuth()

    const [newRoles] = roles

    const navigate = useNavigate()

    const { register, handleSubmit, reset, formState: { errors } } = useForm(/* {
        resolver: yupResolver(schema)
    } */)

    /* async function handleGetMembers() {
        const response = await api.get('/visit/list').finally(() => setIsLoading(false))
        const data = response.data.data

        setListMembers(data)
    }

    useEffect(() => {
        handleGetMembers()
    }, []) */

    async function onSubmit(data) {

        if (data.email !== '') {
            try {
                await signIn(data)
                navigate('/dashboard')

                /* if (newRoles === 'ROLE_ADMIN') {
                    return navigate('/dashboard')
                }

                if (newRoles === 'ROLE_USER') {
                    return navigate('/visit')
                } */

            } catch (error) {
                console.log(error)
            }
        } else {
            toast.warn('Preencha o formulário!')
        }
    }

    return (

        <div className="flex justify-center items-center h-[100vh]">
            <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} id="formLogin">
                    <h5 className="text-xl font-medium text-gray-900 dark:text-white">Sign in to our platform</h5>
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Seu email</label>
                        <input type="email" {...register('email')} id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name@company.com" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sua senha</label>
                        <input type="password" {...register('password')} id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
                    </div>
                    <div className="flex items-start">
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" />
                            </div>
                            <label htmlFor="remember" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
                        </div>
                        <a href="#" className="ml-auto text-sm text-blue-700 hover:underline dark:text-blue-500">Lost Password?</a>
                    </div>
                    <button type="submit" form='formLogin' className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" >Login to your account</button>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                        Not registered? <Link to="/signup" className="text-blue-700 hover:underline dark:text-blue-500">Create account</Link>
                    </div>
                </form>
            </div>
        </div >

    )
}