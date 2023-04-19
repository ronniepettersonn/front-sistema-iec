import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "../partials/Header";
import { Sidebar } from "../partials/Sidebar";
import { api } from "../server/api";
import { Footer } from "../components/Footer";

export function Gabinetes() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [file, setFile] = useState('')

    async function handleSendImage(e) {
        e.preventDefault()

        const formData = new FormData()
        formData.append('profileImage', file)

        await api.post('/users/imgprofile', formData, { headers: { "Content-Type": "multipart/form-data" } })
    }

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
                            <h1 className="text-2xl font-bold leading-none text-gray-900 dark:text-white">Agenda Gabinetes</h1>
                        </div>

                        <Link to='/agenda/gabinete/create'>
                            <button type="button" className="btn rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white">
                                <svg className="w-4 h-4 fill-current opacity-50 flex-shrink-0" viewBox="0 0 16 16">
                                    <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z"></path>
                                </svg>
                                <span className='ml-2'>
                                    Registrar Gabinete
                                </span>
                            </button>
                        </Link>

                    </div>

                    <div className='flex  py-8 justify-center'>




                    </div>
                </div>
                <Footer />
            </div>
        </div>
    )
}