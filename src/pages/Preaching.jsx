import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "../partials/Header";
import { Sidebar } from "../partials/Sidebar";
import { api } from "../server/api";
import { Footer } from "../components/Footer";

import { Church } from '@phosphor-icons/react';

import { format } from 'date-fns'
import ptBR from "date-fns/locale/pt-BR";

export function Preaching() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [pregacoes, setPregacoes] = useState([])

    const [isLoading, setIsLoading] = useState(true)

    function compareDate(date) {
        const newDate = Intl.DateTimeFormat('pt-BR').format(new Date(date))
        return newDate
    }

    async function getPregacoes() {
        const response = await api.get('/schedule/pregacao').finally(() => setIsLoading(false))
        const data = response.data.data

        setPregacoes(data)
        console.log(pregacoes)
    }

    useEffect(() => {
        getPregacoes()

    }, [])


    return (
        <div className="flex h-screen overflow-hidden">

            {/* Sidebar */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Content area */}
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

                {/*  Site header */}

                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <div className='flex flex-col flex-1 p-8'>

                    <div className='flex pb-8 border-b border-slate-700 justify-between items-center'>
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold leading-none text-gray-900 dark:text-white">Agenda de Pregações</h1>
                        </div>

                        <Link to='/agenda/pregacao/create'>
                            <button type="button" className="btn rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white">
                                <svg className="w-4 h-4 fill-current opacity-50 flex-shrink-0" viewBox="0 0 16 16">
                                    <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z"></path>
                                </svg>
                                <span className='ml-2'>
                                    Nova Pregação
                                </span>
                            </button>
                        </Link>

                    </div>

                    <div className='flex  py-8 justify-center'>

                        {
                            isLoading ? (
                                <div className='flex justify-center'>
                                    <div role="status">
                                        <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                        </svg>
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-12 gap-6 ">
                                    {
                                        pregacoes.map(pregacao => {
                                            return (
                                                <Link key={pregacao.id} href="#" className={`flex flex-col col-span-full sm:col-span-6 xl:col-span-4 max-w-md p-6  border border-gray-200 rounded-lg shadow hover:bg-gray-100  dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700`}>
                                                    <header className="flex items-center mb-4">
                                                        <Church size={40} weight="fill" color="rgb(99 102 241)" />
                                                        <div className="w-px h-6 bg-slate-600 mx-3" />

                                                        <h1 className={`text-4xl font-bold tracking-tight ${compareDate(pregacao.date) === compareDate(new Date()) ? 'dark:text-green-400' : 'dark:text-white'} text-gray-900 dark:text-white`}>{format(new Date(pregacao.date), `dd 'de' LLLL 'às' kk'h'`, { locale: ptBR })}</h1>
                                                    </header>
                                                    <div className="mb-2">

                                                        <div>
                                                            <span className="font-normal text-sm text-gray-700 dark:text-gray-400">Ministro</span>
                                                            <p className="font-bold text-gray-700 text-lg dark:text-gray-200">{pregacao.minister}</p>
                                                        </div>
                                                    </div>

                                                    <div>

                                                        <div>
                                                            <span className="font-normal text-sm text-gray-700 dark:text-gray-400">Dirigente</span>
                                                            <p className="font-bold text-gray-700 text-lg dark:text-gray-200">{pregacao.dirigent}</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            )
                                        })
                                    }




                                </div>
                            )
                        }



                    </div>
                </div>
                <Footer />
            </div>
        </div>
    )
}