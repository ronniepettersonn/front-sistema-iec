import IMG404 from '../images/404-illustration.svg'
import { Header } from '../partials/Header'
import { Sidebar } from '../partials/Sidebar'

import React, { useEffect, useState } from 'react';

import { api } from '../server/api';
import { Link, useNavigate } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';

import { Footer } from '../components/Footer';

export function NotFound() {
    const [listMembers, setListMembers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [isContacted, setIsContacted] = useState(false)
    return (
        <div className="flex h-screen overflow-hidden">

            {/* Sidebar */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Content area */}
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

                {/*  Site header */}

                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />



                <div className="px-8 jj ttm py-8 w-full flex-1 max-w-9xl mx-auto">

                    <div className="max-w-2xl m-auto mt-16">

                        <div className="text-center px-4">
                            <div className="inline-flex mb-8">
                                <img src={IMG404} width="176" height="176" alt="404 illustration" />
                            </div>
                            <div className="mb-6">Hmm...esta página não existe. Tente procurar por outra coisa!</div>
                            <Link to="/dashboard" className="btn bg-indigo-500 hover:bg-indigo-600 xi ye">Voltar Para Dashboard</Link>
                        </div>

                    </div>

                </div>

                <Footer />
            </div>
        </div>
    )
}


{/* <div className="vs jj ttm vl ou uf na">

            <div className="ua nt rl">

                <div className="gn vs">
                    <div className="inline-flex rc">
                        <img src={IMG404} width="176" height="176" alt="404 illustration" />
                    </div>
                    <div className="rh">Hmm...this page doesn’t exist. Try searching for something else!</div>
                    <a href="index.html" className="btn ho xi ye">Back To Dashboard</a>
                </div>

            </div>

        </div> */}