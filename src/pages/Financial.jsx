import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EmptyState } from "../partials/EmptyState";
import { Header } from "../partials/Header";
import { Sidebar } from "../partials/Sidebar";
import { api } from "../server/api";
import { Footer } from "../components/Footer";

export function Financial() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [listStatement, setListStatement] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [balance, setBalance] = useState(0)
    const [totalWithdraw, setTotalWithdraw] = useState(0)
    const [totalDeposit, setTotalDeposit] = useState(0)

    const navigate = useNavigate()

    async function handleGetStatement() {
        const response = await api.get('/statement/month').finally(() => setIsLoading(false))
        const data = response.data.data

        const newData = data.map(item => {
            return {
                amount: Number(item.amount),
                codUser: item.codUser,
                createdAt: item.createdAt,
                description: item.description,
                id: item.id,
                total: Number(item.total),
                type: item.type
            }
        })

        newData.reduce((acc, operation) => {
            if (operation.type === 'debit') {
                const credit = acc + operation.amount

                setTotalWithdraw(credit)
                return credit
            } else {
                return acc
            }
        }, 0)

        newData.reduce((acc, operation) => {
            if (operation.type === 'credit') {
                const debit = acc + operation.amount

                setTotalDeposit(debit)
                return debit
            } else {
                return acc
            }
        }, 0)

        const responseBalance = await api.get('/balance')
        const dataBalance = responseBalance.data.data

        setBalance(dataBalance)
        setListStatement(data)
    }

    useEffect(() => {
        handleGetStatement()
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
                            <h1 className="text-2xl font-bold leading-none text-gray-900 dark:text-white">Financeiro</h1>
                        </div>

                        <Link to='/financial/create'>
                            <button type="button" className="btn rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white">
                                <svg className="w-4 h-4 fill-current opacity-50 flex-shrink-0" viewBox="0 0 16 16">
                                    <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z"></path>
                                </svg>
                                <span className='ml-2'>
                                    Lançamento Financeiro
                                </span>
                            </button>
                        </Link>

                    </div>

                    <div className='flex flex-col py-8 justify-center gap-4'>

                        <div className="grid md:grid-cols-3 md:gap-4 gap-4">
                            <div className="shadow-lg rounded-lg bg-gray-800 border-gray-700 border flex-1">
                                <div className="py-6 px-5">

                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="mb-2 text-slate-500">Dinheiro em caixa:</div>
                                            <div className="text-3xl font-bold text-slate-300">{!isLoading && Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance)}</div>
                                        </div>
                                        {/* <div className="w-14 h-14 rounded-full shrink-0 bg-green-500 my-2 mr-3">
                                            <svg className="w-14 h-14 fill-current text-green-50" viewBox="0 0 36 36">
                                                <path d="M18.3 11.3l-1.4 1.4 4.3 4.3H11v2h10.2l-4.3 4.3 1.4 1.4L25 18z" />
                                            </svg>
                                        </div> */}
                                    </div>

                                </div>
                            </div>

                            <div className="shadow-lg rounded-lg bg-gray-800 border-gray-700 border flex-1">
                                <div className="py-6 px-5">

                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="mb-2 text-slate-500">Total entradas do mês:</div>
                                            <div className="text-3xl font-bold text-green-500">{!isLoading && Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalDeposit)}</div>
                                        </div>
                                        {/* <div className="w-14 h-14 rounded-full shrink-0 bg-rose-500 my-2 mr-3">
                                            <svg className="w-14 h-14 fill-current text-rose-50" viewBox="0 0 36 36">
                                                <path d="M17.7 24.7l1.4-1.4-4.3-4.3H25v-2H14.8l4.3-4.3-1.4-1.4L11 18z" />
                                            </svg>
                                        </div> */}
                                    </div>

                                </div>
                            </div>

                            <div className="shadow-lg rounded-lg bg-gray-800 border-gray-700 border flex-1">
                                <div className="py-6 px-5">

                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="mb-2 text-slate-500">Total saídas do mês:</div>
                                            <div className="text-3xl font-bold text-rose-500">{!isLoading && Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalWithdraw)}</div>
                                        </div>
                                        {/* <div className="w-14 h-14 rounded-full shrink-0 bg-rose-500 my-2 mr-3">
                                            <svg className="w-14 h-14 fill-current text-rose-50" viewBox="0 0 36 36">
                                                <path d="M17.7 24.7l1.4-1.4-4.3-4.3H25v-2H14.8l4.3-4.3-1.4-1.4L11 18z" />
                                            </svg>
                                        </div> */}
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className={`col-span-full ${/* xl:col-span-6 */ ''} shadow-lg rounded-lg bg-gray-800 border-gray-700 border flex-1`}>
                            <header className="px-5 py-4 border-b border-gray-700">
                                <h2 className="font-semibold text-slate-200">Entradas e Saídas</h2>
                            </header>
                            <div className="p-3">

                                {/* Card content */}
                                {/* "Today" group */}
                                <div>
                                    {/* <header className="text-xs uppercase text-slate-400 bg-gray-700 rounded-sm font-semibold p-2">Today</header> */}
                                    <ul className="my-1">
                                        {/* Item */}

                                        {

                                            isLoading === true ? (
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

                                                listStatement.length === 0 ? (
                                                    <div className="mb-16">
                                                        <EmptyState
                                                            textButton={'Lançamento Financeiro'}
                                                            onClick={() => navigate('/financial/create')}
                                                            title='Ainda não há movimentação nesse mês'
                                                            description='Não foi encontrado nenhuma movimentação nesse mês. Você pode fazer um novo lançamento clicando no botão abaixo!'
                                                        />
                                                    </div>
                                                ) : (
                                                    listStatement.map(item => {
                                                        return (
                                                            <li key={item.id} className="flex px-2">
                                                                {
                                                                    item.type === 'credit' ? (
                                                                        <div className="w-9 h-9 rounded-full shrink-0 bg-green-500 my-2 mr-3">
                                                                            <svg className="w-9 h-9 fill-current text-green-50" viewBox="0 0 36 36">
                                                                                <path d="M18.3 11.3l-1.4 1.4 4.3 4.3H11v2h10.2l-4.3 4.3 1.4 1.4L25 18z" />
                                                                            </svg>
                                                                        </div>
                                                                    ) : (

                                                                        <div className="w-9 h-9 rounded-full shrink-0 bg-rose-500 my-2 mr-3">
                                                                            <svg className="w-9 h-9 fill-current text-rose-50" viewBox="0 0 36 36">
                                                                                <path d="M17.7 24.7l1.4-1.4-4.3-4.3H25v-2H14.8l4.3-4.3-1.4-1.4L11 18z" />
                                                                            </svg>
                                                                        </div>
                                                                    )
                                                                }
                                                                <div className="grow flex items-center border-b border-gray-700 text-sm py-2">
                                                                    <div className="grow flex justify-between">
                                                                        <div className="self-center">{item.description}</div>
                                                                        <div className="shrink-0 self-start ml-2">
                                                                            <span className={`font-medium ${item.type === 'credit' ? 'text-green-500' : 'text-rose-500'}`}>
                                                                                {item.type === 'credit' ? '+ ' : '- '}
                                                                                {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.amount)}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </li>

                                                        )
                                                    })
                                                )

                                            )


                                        }


                                    </ul>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
                <Footer />
            </div>
        </div>
    )
}