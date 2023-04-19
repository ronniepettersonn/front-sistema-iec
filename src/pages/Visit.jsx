import React, { useEffect, useState } from 'react';

import { Sidebar } from '../partials/Sidebar';
import { Header } from '../partials/Header';
import { api } from '../server/api';
import { Link, useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import { EmptyState } from '../partials/EmptyState';
import { Footer } from '../components/Footer';

export function Visit() {
  const [listMembers, setListMembers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [isContacted, setIsContacted] = useState(false)

  const navigate = useNavigate()

  async function handleGetMembers() {
    const response = await api.get('/visit/list').finally(() => setIsLoading(false))
    const data = response.data.data

    setListMembers(data)
  }

  async function handleContacted(id) {
    try {
      setIsContacted(true)
      await api.put(`/visit/contacted/${id}`, { contacted: true }).finally(() => setIsLoading(false))

      setIsContacted(false)
    } catch (error) {
      console.log(error)
    }

  }

  useEffect(() => {
    handleGetMembers()

  }, [isContacted])

  return (
    <div className="flex h-screen overflow-hidden">
      <ToastContainer />

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

        {/*  Site header */}

        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className='flex flex-col flex-1 p-8'>

          <div className='flex pb-8 border-b border-slate-700 justify-between items-center'>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold leading-none text-gray-900 dark:text-white">Lista de Visitantes</h1>
            </div>

            <Link to='/visit/create'>
              <button type="button" className="btn rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white">
                <svg className="w-4 h-4 fill-current opacity-50 flex-shrink-0" viewBox="0 0 16 16">
                  <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z"></path>
                </svg>
                <span className='ml-2'>
                  Cadastrar Visitante
                </span>
              </button>
            </Link>

          </div>

          <div className='flex  py-8 justify-center'>


            <div className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
              <div className="flow-root">
                <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">

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

                      listMembers.length === 0 ? (
                        <EmptyState
                          textButton={'Cadastrar Visitante'}
                          onClick={() => navigate('/visit/create')}
                          title='Nenhum visitante encontrado'
                          description='Não foi encontrado nenhum visitante. Você pode fazer um novo cadastro clicando no botão abaixo!'
                        />
                      ) : (

                        listMembers.map(member => {
                          return (
                            <li className="py-3 sm:py-4" key={member.id}>
                              <div className="flex items-center space-x-4">
                                {/* <div className="flex-shrink-0">
                                    <img className="w-8 h-8 rounded-full" src="http://github.com/ronniepettersonn.png" alt="" />
                                  </div> */}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                    {member.name}
                                  </p>
                                  <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                    {member.tel}
                                  </p>
                                </div>

                                <div className="flex-1 min-w-0 items-center justify-center flex gap-4">
                                  <input checked={member.contacted} readOnly id="checkbox-1" type="checkbox" value={isContacted} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                  <button className='text-white disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:bg-gray-400 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-2 py-1 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800' disabled={!!member.contacted} onClick={() => handleContacted(member.id)}>Contato feito</button>
                                </div>

                                <div className="flex-1 min-w-0 text-right">
                                  <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-400">
                                    Data da visita
                                  </p>
                                  <p className="text-sm text-gray-500 truncate dark:text-gray-500">
                                    {member.createdAt}
                                  </p>
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
        <Footer />
      </div>
    </div>
  );
}