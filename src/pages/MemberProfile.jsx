import React, { useEffect, useState } from 'react';

import { Sidebar } from '../partials/Sidebar';
import { Header } from '../partials/Header';
import { api } from '../server/api';
import { Link, redirect, useNavigate, useParams } from 'react-router-dom';
import { EmptyState } from '../partials/EmptyState';

import * as Dialog from '@radix-ui/react-dialog';
import { toast } from 'react-toastify';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../server/supabaseClient';

export function MemberProfile() {
  const [member, setMember] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [open, setOpen] = useState(false);

  const [gabinetes, setGabinetes] = useState([])

  const [title, setTitle] = useState('')
  const [date, setDate] = useState(FormatDateInput(Date.now()))
  const [observation, setObservation] = useState('')

  const navigate = useNavigate()

  const { user } = useAuth()

  const { id } = useParams()

  let gabinete

  function formatCPF(cpf) {
    const nome1 = cpf.replaceAll('.', '')
    const nome = nome1.replaceAll('-', '')
    return nome
  }

  function FormatDate(date) {
    const Time = new Date(date).getTime() + (1000 * 60 * 60 * 24)
    const newDate = Intl.DateTimeFormat('pt-BR').format(Time)

    return newDate
  }

  function FormatDateInput(date) {
    /* const Time = new Date(date).getTime() + (1000 * 60 * 60 * 24) */
    const newDate = Intl.DateTimeFormat('fr-CA').format(date)

    return newDate
  }

  async function handleGetMembers() {
    const response = await api.get(`/members/${id}`).finally(() => setIsLoading(false))
    const data = response.data.data

    const [member] = data
    setMember(member)
  }

  async function handleGetGabinete() {
    const response = await api.get(`/gabinete/${id}`).finally(() => setIsLoading(false))
    const data = response.data.data

    console.log(data, 'vendo o GABINETE')

    setGabinetes(data)
  }

  async function handleDelete(id, cpf) {

    try {
      await supabase.storage.from('profile-member').remove([`${formatCPF(cpf)}`])
      await api.delete(`/members/${id}`)

      toast.success('Usuário apagado com sucesso!')

      handleGetMembers()
      navigate('/members')

    } catch (error) {
      console.log(error)
    }

  }

  async function handleSendGabinete() {

    const data = {
      title,
      date,
      observation,
      user_id: user.id,
      member_id: id
    }

    console.log(data, "aqui")

    const response = await api.post(`/gabinete/${id}`, data)
    const dataNew = response.data.data

    setGabinetes(dataNew)

    setDate(FormatDateInput(Date.now()))
    setTitle('')
    setObservation('')
    setOpen(false)
  }

  useEffect(() => {
    handleGetMembers()
    handleGetGabinete()
  }, [isLoading])

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

        {/*  Site header */}

        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className='flex flex-col flex-1 p-8 '>

          <div className='flex pb-8 border-b border-slate-700 justify-between'>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold leading-none text-gray-900 dark:text-white">Detalhes</h1>
            </div>
            <Link to='/members'>
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

          <div className='flex flex-col items-center xl:flex-row xl:items-start gap-6'>

            <div className='flex mt-8 max-w-xl xl:col-span-2 justify-center'>
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
                  <div className="w-full p-4 relative mt-16 bg-white border border-gray-200 rounded-lg shadow sm:p-8 flex flex-col gap-6 dark:bg-slate-700 dark:border-slate-600">

                    <div className='absolute top-[-64px] right-[calc(50%-64px)]'>
                      <img
                        className='w-32 h-32 object-cover rounded-full'
                        src={`https://ixxycvckmqbqsngzgpbl.supabase.co/storage/v1/object/public/profile-member/${formatCPF(member.cpf)}`}
                        alt={member.name}
                      />

                    </div>

                    <div className='flex flex-col'>



                      <div className='flex flex-col items-center mt-12'>


                        <div className='flex gap-4 mb-1 items-center '>

                          <div className='flex flex-col  gap-4'>
                            <div className='flex flex-col items-center'>
                              <div className='flex items-center relative gap-4'>
                                <h1 className='text-3xl font-bold'>{member.name}</h1>
                                <div className={`inline-flex text-sm absolute top-[-40px] right-0 items-center max-h-7 font-bold text-center ${member.isMember ? 'bg-green-300 text-green-800' : 'bg-red-300 text-red-800'} px-3 py-1 rounded-full`}>{member.isMember ? 'Ativo' : 'Inativo'}</div>
                              </div>

                              <div className='flex gap-2'>
                                <span className="text-slate-400">CPF</span>
                                <p className='font-bold text-slate-300'>{member.cpf}</p>
                              </div>
                            </div>

                            <div className='flex gap-3 justify-center'>
                              <Link to={`/members/update/${member.id}`}>
                                <button className='md:flex items-center gap-1 rounded-lg bg-yellow-400 text-slate-800 text-sm font-medium hover:bg-yellow-500 md:px-2 md:py-1 p-3' >
                                  <svg className="w-3 h-3 fill-slate-800 flex-shrink-0" viewBox="0 0 16 16">
                                    <path d="M11.7.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM4.6 14H2v-2.6l6-6L10.6 8l-6 6zM12 6.6L9.4 4 11 2.4 13.6 5 12 6.6z"></path>
                                  </svg>
                                  <span className='hidden md:block'>
                                    Editar
                                  </span>
                                </button>
                              </Link>

                              <button className='md:flex items-center gap-1 rounded-lg bg-red-400 text-slate-800 text-sm font-medium hover:bg-red-500 md:px-2 md:py-1 p-3' onClick={() => handleDelete(member.id, member.cpf)}>
                                <svg className="w-3 h-3 fill-slate-800 flex-shrink-0" viewBox="0 0 16 16">
                                  <path d="M5 7h2v6H5V7zm4 0h2v6H9V7zm3-6v2h4v2h-1v10c0 .6-.4 1-1 1H2c-.6 0-1-.4-1-1V5H0V3h4V1c0-.6.4-1 1-1h6c.6 0 1 .4 1 1zM6 2v1h4V2H6zm7 3H3v9h10V5z"></path>
                                </svg>
                                <span className='hidden md:block'>
                                  Apagar

                                </span>

                              </button>
                            </div>
                          </div>

                        </div>

                      </div>



                    </div>

                    <div className='flex flex-col items-center md:gap-12 gap-4 md:flex md:flex-row justify-center'>
                      <div className='flex flex-col items-center'>
                        <span className="text-slate-400">E-mail</span>
                        <p className='font-bold'>{member.email}</p>
                      </div>

                      <div className='flex flex-col items-center'>
                        <span className="text-slate-400">Sexo</span>
                        <p className='font-bold'>{member.gender === 'female' ? 'Feminino' : "Masculino"}</p>
                      </div>

                      <div className='flex flex-col items-center'>
                        <span className="text-slate-400">Estado Civil</span>
                        <p className='font-bold capitalize'>{member.marital}</p>
                      </div>
                    </div>

                    <div className='flex flex-col items-center'>
                      <span className="text-slate-400">Endereço</span>
                      <p className='font-bold'>{`${member.address}, ${member.address_number} ${member.address_complement === '' ? '' : ' - ' + member.address_complement} - ${member.neighborhood}`}</p>
                      <p className='font-bold'>{`${member.city}/${member.uf} - CEP ${member.cep}`}</p>
                    </div>

                    <div className='flex flex-col items-center'>
                      <span className="text-slate-400">Telefone</span>
                      <p className='font-bold'>{member.tel}</p>
                    </div>

                    <div className='flex gap-6 justify-center'>
                      <div className='flex flex-col items-center'>
                        <span className="text-slate-400">Membro desde:</span>
                        <p className='font-bold'>{FormatDate(member.date_member)}</p>
                      </div>
                      <div className='flex flex-col items-center'>
                        <span className="text-slate-400">Data de nascimento:</span>
                        <p className='font-bold'>{FormatDate(member.date_born)}</p>
                      </div>
                    </div>
                  </div>
                )
              }
            </div>

            <div className='flex flex-1 w-full min-w-xl xl:mt-24 justify-center'>
              <div className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 flex flex-col gap-6 dark:bg-gray-800 dark:border-gray-700">
                <div className='flex pb-8 border-b border-slate-700 justify-between'>
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold leading-none text-gray-900 dark:text-white">Anotações de Gabinetes</h1>
                  </div>

                  <Dialog.Root open={open} onOpenChange={setOpen}>
                    <Dialog.Trigger asChild>

                      <button type="button" className="btn rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white">
                        <svg className="w-4 h-4 fill-current opacity-50 flex-shrink-0" viewBox="0 0 16 16">
                          <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z"></path>
                        </svg>
                        <span className='ml-2'>
                          Nova anotação
                        </span>
                      </button>

                    </Dialog.Trigger>
                    <Dialog.Portal>
                      <Dialog.Overlay className='bg-slate-900 opacity-80 fixed inset-0 z-30' />
                      <Dialog.Content className="bg-gray-700 z-40 fixed top-[calc(50%-216.5px)] left-[calc(50%-200px)] w-[400px] rounded-lg p-6">
                        <Dialog.Title className='text-lg'>
                          <div className="flex items-start pb-4 justify-between border-b rounded-t dark:border-gray-600 ">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                              Anotação de Gabinete
                            </h3>

                            <Dialog.Close>
                              <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                <span className="sr-only">Close modal</span>
                              </button>
                            </Dialog.Close>
                          </div>
                        </Dialog.Title>
                        <Dialog.Description className=' text-center'>

                          <form className='mt-4'>
                            <div class="mb-4 grid-cols-1 grid gap-4">
                              <input type="text" id="title" name='title' value={title} onChange={e => setTitle(e.target.value)} placeholder='Título' class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2.5 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />

                              <input type="date" id="date" name='date' value={date} onChange={e => setDate(e.target.value)} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2.5 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            </div>
                            <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                              <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
                                <label for="observation" className="sr-only">Oberservações</label>
                                <textarea id="observation" name='observation' value={observation} onChange={e => setObservation(e.target.value)} rows="4" className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400 resize-none" placeholder="Escreva as observações do gabinete" required></textarea>
                              </div>
                              <div className="flex items-center justify-end px-3 py-2 border-t dark:border-gray-600">
                                <button type="button" onClick={handleSendGabinete} className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                                  Salvar
                                </button>

                              </div>
                            </div>
                          </form>

                        </Dialog.Description>

                      </Dialog.Content>
                    </Dialog.Portal>
                  </Dialog.Root>





                </div>

                <div className='gap-4 grid'>

                  {isLoading ? (
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
                    gabinetes.map(gabinete => {
                      return (
                        <div key={gabinete.id} className="flex flex-col justify-between max-w-lg p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                          <a href="#">
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white line-clamp-1">{gabinete.title}</h5>
                          </a>
                          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400  line-clamp-2">{gabinete.observation}</p>
                          <a href="#" className="inline-flex max-w-[100.55px] items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Ler mais
                            <svg aria-hidden="true" className="w-4 h-4 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                          </a>
                        </div>
                      )
                    })
                  )}





                </div>


              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div >
  );
}