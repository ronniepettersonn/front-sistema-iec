import React, { useEffect } from 'react';
import {
    Routes,
    Route,
    useLocation,
    Navigate
} from 'react-router-dom';

// Import pages
import Dashboard from '../pages/Dashboard';
import { Members } from '../pages/Members';
import { Visit } from '../pages/Visit';
import { SignIn } from '../pages/SignIn';
import { CreateVisit } from '../pages/Create/Visit';
import { CreateMembers } from '../pages/Create/Members';
import { Financial } from '../pages/Financial';
import { Cult } from '../pages/Cult';
import { UpdateMembers } from '../pages/Update/Members';
import { ToastContainer } from 'react-toastify';
import { CreateFinancial } from '../pages/Create/Financial';
import { CreateUsers } from '../pages/Create/Users';
import { AuthProvider } from '../context/AuthContext';
import { PrivateRoutes } from './PrivateRoutes';
import { Users } from '../pages/Users';
import { EmptyState } from '../partials/EmptyState';
import { MemberProfile } from '../pages/MemberProfile';
import { NotFound } from '../components/NotFound';
import { UpdateUsers } from '../pages/Update/Users';
import { Preaching } from '../pages/Preaching';
import { Gabinetes } from '../pages/Gabinetes';
import { Events } from '../pages/Events';
import { CreatePreach } from '../pages/Create/Preach';
import { CreateGabinete } from '../pages/Create/Gabinete';
import { SignUp } from '../pages/SignUp';
import { CreateRoles } from '../pages/Create/Roles';

export function RoutesApp() {
    const location = useLocation();

    useEffect(() => {
        document.querySelector('html').style.scrollBehavior = 'auto'
        window.scroll({ top: 0 })
        document.querySelector('html').style.scrollBehavior = ''
    }, [location.pathname]); // triggered on route change

    return (
        <Routes>
            <Route exact path="/" element={<PrivateRoutes role={"ROLE_ADMIN,ROLE_USER"} />} >
                <Route index element={<Dashboard />} />
                <Route path="/dashboard" exact element={<Dashboard />} />

                <Route exact path="/members" element={<Members />} />
                <Route exact path="/members/:id" element={<MemberProfile />} />
                <Route exact path="/members/create" element={<CreateMembers />} />
                <Route exact path="/members/update/:id" element={<UpdateMembers />} />

                <Route exact path="/visit" element={<Visit />} />
                <Route exact path="/visit/create" element={<CreateVisit />} />

                <Route exact path="/financial" element={<Financial />} />
                <Route exact path="/financial/create" element={<CreateFinancial />} />

                <Route exact path="/cult" element={<Cult />} />

                <Route exact path="/users/update/:id" element={<UpdateUsers />} />
                <Route exact path="/users" element={<Users />} />
                <Route exact path="/create/user" element={<CreateUsers />} />

                <Route exact path="/agenda/pregacao" element={<Preaching />} />
                <Route exact path="/agenda/pregacao/create" element={<CreatePreach />} />
                <Route exact path="/agenda/gabinete" element={<Gabinetes />} />
                <Route exact path="/agenda/gabinete/create" element={<CreateGabinete />} />
                <Route exact path="/agenda/evento" element={<Events />} />

                <Route exact path="/roles/create" element={<CreateRoles />} />


                <Route path="*" element={<NotFound />} />
            </Route>

            <Route exact path="/signin" element={<SignIn />} />
            <Route exact path="/signup" element={<SignUp />} />
        </Routes>

    )
}