import React, { useEffect, useState } from 'react';

import { Sidebar } from '../partials/Sidebar';
import { Header } from '../partials/Header';
import { api } from '../server/api';
import { Link, useNavigate } from 'react-router-dom';
import { EmptyState } from '../partials/EmptyState';

import * as Dialog from '@radix-ui/react-dialog';
import { toast } from 'react-toastify';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Footer } from '../components/Footer';

export function Members() {
  const [listMembers, setListMembers] = useState([])
  const [listMembersSearch, setListMembersSearch] = useState([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate()

  function formatCPF(cpf) {
    const nome1 = cpf?.replaceAll('.', '')
    const nome = nome1?.replaceAll('-', '')
    return nome
  }

  async function handleSearch(e) {
    e.preventDefault()

    const newSearch = {
      name: search
    }

    const response = await api.post(`/members/search`, newSearch).finally(() => setIsLoading(false))
    const data = response.data.data

    setListMembers(data)
  }

  async function handleGetMembers() {
    const response = await api.get('/members/list').finally(() => setIsLoading(false))
    const data = response.data.data

    setListMembers(data)
  }

  async function handleDelete(id) {
    await api.delete(`/members/${id}`)

    toast.success('Usuário apagado com sucesso!')

    handleGetMembers()
  }

  useEffect(() => {
    handleGetMembers()
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

          <div className='flex pb-8 border-b border-slate-700 justify-between'>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold leading-none text-gray-900 dark:text-white">Lista de Membros</h1>
            </div>
            <Link to='/members/create'>
              <button type="button" className="btn rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white">
                <svg className="w-4 h-4 fill-current opacity-50 flex-shrink-0" viewBox="0 0 16 16">
                  <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z"></path>
                </svg>
                <span className='ml-2'>
                  Cadastrar Membro
                </span>
              </button>
            </Link>
          </div>

          <form className='pt-8'>
            <label for="search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Buscar</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <input type="search" id="search" value={search} onChange={e => setSearch(e.target.value)} className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Buscar" />
              <button type="button" onClick={(e) => handleSearch(e)} className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Buscar</button>
            </div>
          </form>

          <div className='flex border-t border-slate-700 py-8 justify-center'>
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
                          textButton={'Cadastrar Membro'}
                          onClick={() => navigate('/members/create')}
                          title='Nenhum membro encontrado'
                          description='Não foi encontrado nenhum membro. Você pode fazer um novo cadastro clicando no botão abaixo!'
                        />
                      ) : (
                        listMembers.map(member => {
                          return (
                            <li className={`py-3 sm:py-4 `} key={member.id}>
                              <Link to={`/members/${member.id}`}>
                                <div className="flex items-center space-x-4">
                                  <img
                                    className='w-14 h-14 object-cover rounded-full'
                                    src={`https://ixxycvckmqbqsngzgpbl.supabase.co/storage/v1/object/public/profile-member/${formatCPF(member.cpf)}`}
                                    alt={member.name}
                                  />

                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                      {member.name}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                      {member.email}
                                    </p>
                                  </div>
                                  <div className="flex-1 flex md:justify-between justify-center items-center min-w-0">
                                    <div className={'hidden md:block'}>
                                      <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-400">
                                        Membro desde
                                      </p>
                                      <p className="text-sm text-gray-500 truncate dark:text-gray-500">
                                        {member.date_member}
                                      </p>
                                    </div>

                                    <div className={`inline-flex text-sm text-center ${member.isMember ? 'bg-green-300 text-green-800' : 'bg-red-300 text-red-800'} px-3 py-1 rounded-full`}>{member.isMember ? 'Ativo' : 'Inativo'}</div>
                                  </div>

                                  {/* <div className="flex md:flex-1 justify-end gap-4">

                                  <DropdownMenu.Root>
                                    <DropdownMenu.Trigger asChild>
                                      <button id="dropdownMenuIconHorizontalButton" data-dropdown-toggle="dropdownDotsHorizontal" className="md:hidden inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600" type="button">
                                        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path></svg>
                                      </button>
                                    </DropdownMenu.Trigger>

                                    <DropdownMenu.Portal>
                                      <DropdownMenu.Content>
                                        <div id="dropdownDotsHorizontal" class=" bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
                                          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconHorizontalButton">
                                            <li>

                                              <Dialog.Root>
                                                <Dialog.Trigger asChild>

                                                  <a href="#" className="flex font-semibold gap-3 items-center text-red-400 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-red-400">
                                                    <svg className="w-4 h-4 fill-red-400 flex-shrink-0" viewBox="0 0 16 16">
                                                      <path d="M5 7h2v6H5V7zm4 0h2v6H9V7zm3-6v2h4v2h-1v10c0 .6-.4 1-1 1H2c-.6 0-1-.4-1-1V5H0V3h4V1c0-.6.4-1 1-1h6c.6 0 1 .4 1 1zM6 2v1h4V2H6zm7 3H3v9h10V5z"></path>
                                                    </svg>
                                                    Apagar
                                                  </a>

                                                </Dialog.Trigger>
                                                <Dialog.Portal>
                                                  <Dialog.Overlay className='bg-slate-900 opacity-80 fixed inset-0 z-30' />
                                                  <Dialog.Content className="bg-gray-700 z-40 fixed top-[calc(50%-119px)] left-[calc(50%-200px)] w-[400px] rounded-lg p-6">
                                                    <Dialog.Close asChild>
                                                      <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-hide="popup-modal">
                                                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                                        <span className="sr-only">Close modal</span>
                                                      </button>
                                                    </Dialog.Close>
                                                    <Dialog.Title className='text-lg'>
                                                      <svg aria-hidden="true" className="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                    </Dialog.Title>
                                                    <Dialog.Description className=' text-center'>
                                                      <h3 className='mb-5 text-lg font-normal text-gray-500 dark:text-gray-400'> Você deseja realmente apagar o membro {member.name}</h3>
                                                      <button onClick={() => handleDelete(member.id)} data-modal-hide="popup-modal" type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                                                        Sim, excluir
                                                      </button>
                                                      <Dialog.Close>
                                                        <button data-modal-hide="popup-modal" type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Não, cancelar</button>
                                                      </Dialog.Close>
                                                    </Dialog.Description>

                                                  </Dialog.Content>
                                                </Dialog.Portal>
                                              </Dialog.Root>


                                            </li>


                                            <li>
                                              <Link to={`/members/update/${member.id}`} class="flex gap-3 items-center px-4 text-yellow-400 font-semibold py-2 hover:bg-gray-100 dark:hover:bg-gray-600 ">
                                                <svg className="w-4 h-4 fill-yellow-400 flex-shrink-0" viewBox="0 0 16 16">
                                                  <path d="M11.7.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM4.6 14H2v-2.6l6-6L10.6 8l-6 6zM12 6.6L9.4 4 11 2.4 13.6 5 12 6.6z"></path>
                                                </svg>

                                                Editar

                                              </Link>
                                            </li>

                                          </ul>

                                        </div>
                                      </DropdownMenu.Content>
                                    </DropdownMenu.Portal>


                                  </DropdownMenu.Root>

                                  <Dialog.Root>
                                    <Dialog.Trigger asChild>
                                      <button className='hidden md:block rounded-lg bg-red-400 text-slate-800 font-medium hover:bg-red-500 px-3'>
                                        <svg className="w-4 h-4 fill-slate-800 flex-shrink-0" viewBox="0 0 16 16">
                                          <path d="M5 7h2v6H5V7zm4 0h2v6H9V7zm3-6v2h4v2h-1v10c0 .6-.4 1-1 1H2c-.6 0-1-.4-1-1V5H0V3h4V1c0-.6.4-1 1-1h6c.6 0 1 .4 1 1zM6 2v1h4V2H6zm7 3H3v9h10V5z"></path>
                                        </svg>
                                      </button>
                                    </Dialog.Trigger>
                                    <Dialog.Portal>
                                      <Dialog.Overlay className='bg-slate-900 opacity-80 fixed inset-0 z-30' />
                                      <Dialog.Content className="bg-gray-700 z-40 fixed top-[calc(50%-119px)] left-[calc(50%-200px)] w-[400px] rounded-lg p-6">
                                        <Dialog.Close asChild>
                                          <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-hide="popup-modal">
                                            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                            <span className="sr-only">Close modal</span>
                                          </button>
                                        </Dialog.Close>
                                        <Dialog.Title className='text-lg'>
                                          <svg aria-hidden="true" className="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        </Dialog.Title>
                                        <Dialog.Description className=' text-center'>
                                          <h3 className='mb-5 text-lg font-normal text-gray-500 dark:text-gray-400'> Você deseja realmente apagar o membro {member.name}</h3>
                                          <button onClick={() => handleDelete(member.id)} data-modal-hide="popup-modal" type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                                            Sim, excluir
                                          </button>
                                          <Dialog.Close>
                                            <button data-modal-hide="popup-modal" type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Não, cancelar</button>
                                          </Dialog.Close>
                                        </Dialog.Description>

                                      </Dialog.Content>
                                    </Dialog.Portal>
                                  </Dialog.Root>


                                  <Link to={`/members/update/${member.id}`}>
                                    <button className=' hidden md:flex items-center gap-2 rounded-lg bg-yellow-400 text-slate-800 font-medium hover:bg-yellow-500 px-4 py-2'>
                                      <svg className="w-4 h-4 fill-slate-800 flex-shrink-0" viewBox="0 0 16 16">
                                        <path d="M11.7.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM4.6 14H2v-2.6l6-6L10.6 8l-6 6zM12 6.6L9.4 4 11 2.4 13.6 5 12 6.6z"></path>
                                      </svg>
                                      <span className='hidden md:block'>
                                        Editar
                                      </span>
                                    </button>
                                  </Link>



                                </div> */}
                                </div>
                              </Link>
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