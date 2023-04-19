import React from 'react';
import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import './css/style.css';

import './charts/ChartjsConfig';

import 'react-toastify/dist/ReactToastify.css';

// Import pages
import Dashboard from './pages/Dashboard';
import { Members } from './pages/Members';
import { Visit } from './pages/Visit';
import { SignIn } from './pages/SignIn';
import { CreateVisit } from './pages/Create/Visit';
import { CreateMembers } from './pages/Create/Members';
import { Financial } from './pages/Financial';
import { Cult } from './pages/Cult';
import { UpdateMembers } from './pages/Update/Members';
import { ToastContainer } from 'react-toastify';
import { CreateFinancial } from './pages/Create/Financial';
import { CreateUsers } from './pages/Create/Users';
import { AuthProvider } from './context/AuthContext';
import { RoutesApp } from './routes';

function App() {

  /* const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change */

  return (
    <>
      <AuthProvider>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <RoutesApp />
        {/* <Routes>
          <Route exact path="/" element={<SignIn />} />
          <Route exact path="/dashboard" element={<Dashboard />} />

          <Route exact path="/members" element={<Members />} />
          <Route exact path="/members/create" element={<CreateMembers />} />
          <Route exact path="/members/update/:id" element={<UpdateMembers />} />

          <Route exact path="/visit" element={<Visit />} />
          <Route exact path="/visit/create" element={<CreateVisit />} />

          <Route exact path="/financial" element={<Financial />} />
          <Route exact path="/financial/create" element={<CreateFinancial />} />

          <Route exact path="/cult" element={<Cult />} />


          <Route exact path="/users" element={<CreateUsers />} />

        </Routes> */}
      </AuthProvider>
    </>
  );
}

export default App;
