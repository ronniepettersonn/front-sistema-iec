import React, { useEffect, useRef, useState } from 'react';

import { Sidebar } from '../../partials/Sidebar';
import { Header } from '../../partials/Header';
import { api } from '../../server/api';
import { Link, useNavigate } from 'react-router-dom';

import InputMask from "react-input-mask";

import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import * as yup from 'yup';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios';
import { Footer } from '../../components/Footer';
import { supabase } from '../../server/supabaseClient';


const schema = yup.object({
    name: yup.string().required('O nome é obrigatório'),
    tel: yup.string().required('O celular é obrigatório'),
    cpf: yup.string().required('O CPF é obrigatório'),
    email: yup.string().required('O email é obrigatório'),
    city: yup.string().required('A cidade é obrigatório'),
    date_born: yup.string().required('Data de nascimento é obrigatório'),
    date_member: yup.string().required('Data de nascimento é obrigatório'),
})


export function CreateMembers() {
    const [listMembers, setListMembers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [address, setAddress] = useState({})

    const navigate = useNavigate()

    const { register, handleSubmit, watch, formState: { errors }, reset, control } = useForm({
        resolver: yupResolver(schema),
        values: {
            city: address.localidade,
            address: address.logradouro,
            neighborhood: address.bairro,
            uf: address.uf,
            cpf: document.getElementById('cpf')?.value,
            tel: document.getElementById('tel')?.value,
            cep: address.cep?.replace('-', '')
        }
    })

    async function handleCEPConsult(e) {

        const input = document.getElementById('cep')

        if (input.value !== '') {
            const response = await axios.get(`http://viacep.com.br/ws/${input.value}/json/`)
            const data = response.data
            setAddress(data)

            if (data?.erro) {
                toast.error('Endereço não encontrado')
            }
        }

        console.log(address)
    }

    async function onSubmit(data) {

        try {
            const nome1 = data.cpf.replaceAll('.', '')
            const nome = nome1.replaceAll('-', '')
            console.log(nome)
            await supabase.storage.from('profile-member').upload(nome, data.profileImg[0])

            const response = await api.post('/members', data)

            const [message] = response.data.error

            if (response.data.success) {
                toast.success('Cadastro realizado com sucesso')

                reset()

                navigate("/members")

            } else {
                toast.error(message.message)
            }

        } catch (error) {
            console.log(error)
        }
    }

    async function handleGetMembers() {
        const response = await api.get('/visit/list').finally(() => setIsLoading(false))
        const data = response.data.data

        setListMembers(data)
    }

    useEffect(() => {
        handleGetMembers()
    }, [address])

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
                            <h1 className="text-2xl font-bold leading-none text-gray-900 dark:text-white">Cadastro de Membros</h1>
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
                </div>



                <div className='flex flex-col w-full flex-1 px-8 pb-8'>
                    <form className='w-full border-b border-b-slate-700' onSubmit={handleSubmit(onSubmit)} id='formMember'>
                        <div className='grid md:grid-cols-2 md:gap-6'>
                            <div className="mb-6">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome</label>
                                <input type="text" id="name" placeholder='Seu nome' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register('name')} />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="tel" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Celular</label>
                                {/* <input type="tel" id="tel" pattern='(\([0-9]{2}\))\s([9]{1})\s([0-9]{4})-([0-9]{4})' placeholder='(99) 9 9999-9999' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register('tel')} /> */}

                                <Controller /* as={InputMask} */ /* mask={'999.999.999-00'} */ control={control} /* type="text" id="cpf" min={0} placeholder='999.999.999-99' */ /* className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" */ /* {...register('cpf')} */
                                    name='tel'

                                    render={({
                                        field: { onChange, onBlur, value, name, ref },
                                    }) => (
                                        <InputMask
                                            mask={'(99) 9 9999-9999'}
                                            inputRef={ref}
                                            onChange={onChange}
                                            name={name}
                                            onBlur={onBlur}
                                            value={value}
                                            defaultValue={value}
                                            id='tel'
                                            type={'text'}
                                            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                                        />)
                                    }
                                />
                            </div>
                        </div>

                        <div className='grid md:grid-cols-2 md:gap-6'>
                            <div className="mb-6">
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                <input type="email" id="email" placeholder='exemplo@exemplo.com' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register('email')} />
                            </div>

                            <div className='grid md:grid-cols-3 md:gap-6'>
                                <div className="mb-6  sm:col-span-1">
                                    <label htmlFor="cpf" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">CPF</label>
                                    <Controller /* as={InputMask} */ /* mask={'999.999.999-00'} */ control={control} /* type="text" id="cpf" min={0} placeholder='999.999.999-99' */ /* className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" */ /* {...register('cpf')} */
                                        name='cpf'

                                        render={({
                                            field: { onChange, onBlur, value, name, ref },
                                        }) => (
                                            <InputMask
                                                mask={'999.999.999-99'}
                                                inputRef={ref}
                                                onChange={onChange}
                                                name={name}
                                                onBlur={onBlur}
                                                value={value}
                                                id='cpf'
                                                type={'text'}
                                                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                                            />)
                                        }
                                    />
                                </div>
                                <div className="mb-6 md:col-span-2">
                                    <label htmlFor="profileImg" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Foto Perfil</label>
                                    <input className="block w-full file:text-sm file:mr-4 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none file:p-2.5 file:bg-gray-600 file:border-none file:text-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file" {...register('profileImg')} />
                                </div>

                            </div>
                        </div>

                        <div className='grid md:grid-cols-2 md:gap-6'>
                            <div className="mb-6">
                                <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Endereço</label>
                                <input type="text" id="address" defaultValue={address.logradouro} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register('address')} />
                            </div>
                            <div className='grid md:grid-cols-3 md:gap-6'>
                                <div className="mb-6">
                                    <label htmlFor="address_number" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Número</label>
                                    <input type="number" min={0} id="address_number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register('address_number')} />
                                </div>
                                <div className="mb-6">
                                    <label htmlFor="address_complement" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Complemento</label>
                                    <input type="text" id="address_complement" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register('address_complement')} />
                                </div>
                                <div className="mb-6">
                                    <label htmlFor="uf" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Estado</label>
                                    <input type="text" id="uf" maxLength={2} defaultValue={address.uf} minLength={2} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register('uf')} />
                                </div>
                            </div>
                        </div>

                        <div className='grid md:grid-cols-2 md:gap-6'>
                            <div className="mb-6">
                                <label htmlFor="neighborhood" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Bairro</label>
                                <input type="text" id="neighborhood" defaultValue={address.bairro} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register('neighborhood')} />
                            </div>
                            <div className='grid md:grid-cols-2 md:gap-6'>
                                <div className="mb-6">
                                    <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cidade</label>
                                    <input type="text" id="city" defaultValue={address.localidade} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register('city')} />
                                </div>
                                <div className="mb-6 relative">
                                    <label htmlFor="cep" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">CEP</label>
                                    {/* <input type="number" onBlurCapture={handleCEPConsult} id="cep" placeholder='Somemnte números' className="bg-gray-50  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register('cep')} /> */}

                                    <Controller /* as={InputMask} */ /* mask={'999.999.999-00'} */ control={control} /* type="text" id="cpf" min={0} placeholder='999.999.999-99' */ /* className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" */ /* {...register('cpf')} */
                                        name='cep'

                                        render={({
                                            field: { onChange, onBlur, value, name, ref },
                                        }) => (
                                            <InputMask
                                                mask={'99999999'}
                                                inputRef={ref}
                                                onChange={onChange}
                                                name={name}
                                                onBlurCapture={handleCEPConsult}
                                                onBlur={onBlur}
                                                value={value}
                                                id='cep'
                                                type={'text'}
                                                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                                            />)
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='grid md:grid-cols-2 md:gap-6'>
                            <div className='grid md:grid-cols-2 md:gap-6'>
                                <div className="mb-6">
                                    <label htmlFor="date_born" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nascimento</label>
                                    <input type="date" id="date_born" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register('date_born')} />
                                </div>
                                <div className="mb-6">
                                    <label htmlFor="date_member" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Membro desde</label>
                                    <input type="date" id="date_member" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register('date_member')} />
                                </div>
                            </div>
                            <div className='grid md:grid-cols-2 md:gap-6'>
                                <div className="mb-6">
                                    <label htmlFor="gender" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sexo</label>
                                    <select id="gender" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register('gender')} >
                                        <option value="male">Masculino</option>
                                        <option value="female">Feminino</option>
                                    </select>
                                </div>
                                <div className="pb-6">
                                    <label htmlFor="marital" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Estado Civil</label>
                                    <select id="marital" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register('marital')} >
                                        <option value="casado">Casado</option>
                                        <option value="solteiro">Solteiro</option>
                                        <option value="divorciado">Divorciado</option>
                                        <option value="viuvo">Viúvo</option>
                                    </select>
                                </div>
                            </div>
                        </div>




                    </form>

                    <div className='flex justify-end mt-6'>
                        {/* <Link to='/members'>
                                <button type="button" className="text-slate-800 bg-gray-300 hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:focus:ring-blue-800 ">Cancelar</button>
                            </Link> */}
                        <button type="submit" form='formMember' className="text-slate-800 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-yellow-500 dark:hover:bg-yellow-600 dark:focus:ring-blue-800">Cadastrar Membro</button>

                    </div>




                </div>

                <Footer />

            </div>
        </div>
    );
}