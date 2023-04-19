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

export function SignUp() {
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
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h5 className="text-xl font-medium text-gray-900 dark:text-white">Sign in to our platform</h5>
                    <form class="space-y-4 md:space-y-6" action="#">
                        <div>
                            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                            <input type="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required="" />
                        </div>
                        <div>
                            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                        </div>
                        <div>
                            <label for="confirm-password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                            <input type="confirm-password" name="confirm-password" id="confirm-password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                        </div>
                        <div class="flex items-start">
                            <div class="flex items-center h-5">
                                <input id="terms" aria-describedby="terms" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required="" />
                            </div>
                            <div class="ml-3 text-sm">
                                <label for="terms" class="font-light text-gray-500 dark:text-gray-300">I accept the <a class="font-medium text-blue-500 hover:underline dark:text-primary-500" href="#">Terms and Conditions</a></label>
                            </div>
                        </div>
                        <button type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Create an account</button>
                        <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
                            Already have an account? <Link to="/signin" class="text-blue-700 hover:underline dark:text-blue-500">Login here</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    )
}