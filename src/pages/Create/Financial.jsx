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
import { useAuth } from '../../context/AuthContext';
import { Footer } from '../../components/Footer';

const schema = yup.object({
    description: yup.string().required('A descrição é obrigatória'),
    amount: yup.string().required('O valor é obrigatório'),
    type: yup.string().required('Escolha o tipo de operação')
})

export function CreateFinancial() {
    const navigate = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true)
    const [listMembers, setListMembers] = useState([])

    const { token, user } = useAuth()

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })

    async function handleGetUser() {
        const response = await api.get('/visit/list').finally(() => setIsLoading(false))
        const data = response.data.data

        setListMembers(data)
    }

    useEffect(() => {
        handleGetUser()
    }, [])

    async function onSubmit(data) {

        const newData = {
            amount: Number(data.amount),
            description: data.description,
            type: data.type,
            codUser: user.id
        }

        console.log(newData)

        try {

            if (data.type === 'credit') {
                await api.post('/deposit', newData)

                toast.success('Entrada cadastrada com sucesso!')
                reset()

                navigate("/financial")
            } else if (data.type === 'debit') {
                await api.post('/withdraw', newData)

                toast.success('Saída cadastrada com sucesso!')
                reset()

                navigate("/financial")
            }


        } catch (error) {
            console.log(error)

            if (error.response.data.error === 'insufficient founds') {

                toast.error('Saldo insuficiente!')
            }
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
                            <h1 className="text-2xl font-bold leading-none text-gray-900 dark:text-white">Cadastro de Visitantes</h1>
                        </div>

                        <Link to='/financial'>
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


                    <form className='w-full border-b border-b-slate-700' onSubmit={handleSubmit(onSubmit)} id='formFinancial'>


                        <div className='grid md:grid-cols-2 md:gap-6'>
                            <div className="mb-6">
                                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descrição</label>
                                <input type="text" id="description" className={`bg-gray-50 border  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700  dark:placeholder-gray-400 dark:text-white  ${errors.name ? 'dark:focus:border-red-500 dark:focus:ring-red-500 border-red-500 dark:border-red-900' : 'dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:border-gray-600'}`} {...register('description')} />

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
                            <div className="mb-6">
                                <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Valor</label>
                                <input type="number" step={0.01} id="amount" min={0.01} className={`bg-gray-50 border  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700  dark:placeholder-gray-400 dark:text-white ${errors.tel ? 'dark:focus:border-red-500 dark:focus:ring-red-500 border-red-500 dark:border-red-900' : 'dark:focus:ring-blue-500 dark:focus:border-blue-500 border-gray-300 dark:border-gray-600'}`} {...register('amount')} />

                                {
                                    errors.amount && (
                                        <div className="flex p-4 mt-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800" role="alert">
                                            <svg aria-hidden="true" className="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                                            <span className="sr-only">Info</span>
                                            <div>
                                                <span className="font-medium">{errors.amount.message}</span>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                        <div>

                            <div className="mb-6">

                                <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Operação</label>

                                <ul className="grid w-full gap-6 md:grid-cols-2">
                                    <li>
                                        <input {...register('type')} type="radio" id="credit" value="credit" className="hidden peer" />
                                        <label for="credit" className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700  dark:peer-checked:text-green-300 peer-checked:border-green-400 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                            <div className="block">
                                                <div className="w-full text-lg font-semibold">Entrada</div>
                                            </div>
                                            <svg aria-hidden="true" className="w-6 h-6 ml-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                        </label>
                                    </li>
                                    <li>
                                        <input type="radio" id="debit" {...register('type')} value="debit" className="hidden peer" />
                                        <label for="debit" className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-red-300 peer-checked:border-red-400 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                            <div className="block">
                                                <div className="w-full text-lg font-semibold">Saída</div>
                                            </div>
                                            <svg aria-hidden="true" className="w-6 h-6 ml-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                        </label>
                                    </li>
                                </ul>

                            </div>


                        </div>



                    </form>

                    <div className='flex justify-end mt-6'>
                        {/* <Link to='/visit'>
                                <button type="button" className="text-slate-800 bg-gray-300 hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:focus:ring-blue-800 ">Cancelar</button>
                            </Link> */}
                        <button type="submit" form='formFinancial' className="text-slate-800 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-yellow-500 dark:hover:bg-yellow-600 dark:focus:ring-blue-800">Cadastrar Visitante</button>

                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
}