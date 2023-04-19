import React, { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form'

import { Sidebar } from '../../partials/Sidebar';
import { Header } from '../../partials/Header';
import { api } from '../../server/api';
import { Link, useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
import { Footer } from '../../components/Footer';

const schema = yup.object({
    name: yup.string().required('O nome é obrigatório!'),
    description: yup.string().required('Preencha a descrição!')
})

export function CreateRoles() {
    const navigate = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true)
    const [listMembers, setListMembers] = useState([])

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })

    async function handleGetMembers() {
        const response = await api.get('/visit/list').finally(() => setIsLoading(false))
        const data = response.data.data

        setListMembers(data)
    }

    useEffect(() => {
        handleGetMembers()
    }, [])

    async function onSubmit(data) {


        try {
            await api.post('/roles', data)

            toast.success('Visitante cadastrado com sucesso!')

            reset()

            navigate("/roles")

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="flex h-screen overflow-hidden">


            {/* Sidebar */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Content area */}
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

                {/*  Site header */}

                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <div className="p-8">

                    <div className='flex pb-8 border-b border-slate-700 justify-between items-center'>
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold leading-none text-gray-900 dark:text-white">Cadastro de Permissões</h1>
                        </div>

                        <Link to='/roles'>
                            <button type="button" className="btn rounded-lg bg-pink-500 hover:bg-pink-600 text-white">

                                <svg className="w-4 h-4 fill-current opacity-50 flex-shrink-0" viewBox="0 0 16 16">
                                    <path d="M9.4 13.4l1.4-1.4-4-4 4-4-1.4-1.4L4 8z"></path>
                                </svg>
                                <span className='ml-2'>
                                    Voltar
                                </span>
                            </button>
                        </Link>

                    </div>
                </div>

                <div className='flex flex-col px-8 w-full flex-1'>


                    <form className='w-full border-b border-b-slate-700' onSubmit={handleSubmit(onSubmit)} id='formVisit'>


                        <div className='grid md:grid-cols-2 md:gap-6'>
                            <div className="mb-6">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome</label>
                                <input type="text" placeholder='Seu nome' id="name" className={`bg-gray-50 border  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700  dark:placeholder-gray-400 dark:text-white  ${errors.name ? 'dark:focus:border-red-500 dark:focus:ring-red-500 border-red-500 dark:border-red-900' : 'dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:border-gray-600'}`} {...register('name')} />

                                {
                                    errors.name && (
                                        <div className="flex p-4 mt-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800" role="alert">
                                            <svg aria-hidden="true" className="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                                            <span className="sr-only">Info</span>
                                            <div>
                                                <span className="font-medium">{errors.name.message}</span>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                            <div className="mb-6">
                                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descrição</label>
                                <input type="text" id="description" className={`bg-gray-50 border  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700  dark:placeholder-gray-400 dark:text-white ${errors.tel ? 'dark:focus:border-red-500 dark:focus:ring-red-500 border-red-500 dark:border-red-900' : 'dark:focus:ring-blue-500 dark:focus:border-blue-500 border-gray-300 dark:border-gray-600'}`} {...register('description')} />

                                {
                                    errors.description && (
                                        <div className="flex p-4 mt-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800" role="alert">
                                            <svg aria-hidden="true" className="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                                            <span className="sr-only">Info</span>
                                            <div>
                                                <span className="font-medium">{errors.description.message}</span>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>



                    </form>

                    <div className='flex justify-end mt-6'>
                        {/* <Link to='/visit'>
                                <button type="button" className="text-slate-800 bg-gray-300 hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:focus:ring-blue-800 ">Cancelar</button>
                            </Link> */}
                        <button type="submit" form='formVisit' className="text-slate-800 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-yellow-500 dark:hover:bg-yellow-600 dark:focus:ring-blue-800">Cadastrar Visitante</button>

                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
}