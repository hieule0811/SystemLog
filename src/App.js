import './App.scss';
import { Route, Routes } from 'react-router-dom';
import Client from './Pages/Client.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Helmet } from 'react-helmet';
import InsertPage from './Pages/InsertPage.js';
import UpdatePage from './Pages/UpdatePage.js';
import SystemLogPage from './Pages/SystemLogPage.js';
import SignIn from './Pages/SignIn'
import ForgotPassword from './Pages/ForgotPassword'
import SignUp from './Pages/SignUp'
import JobContainer from './Pages/JobContainer.js';
import JobContainerInsertPage from './Pages/JobContainerInsertPage.js';
import JobContainerUpdatePage from './Pages/JobContainerUpdatePage.js';

function App() {
    return (
        <div className="App">
            <Helmet>
                <title>SystemLog</title>
            </Helmet>
            <Routes>
                <Route path = '' element = {<SignIn/>}/>
                <Route path = '/sign-in' element = {<SignIn/>}/>
                <Route path= '/forgot-password' element = {<ForgotPassword/>}/>
                <Route path = '/sign-up' element = {<SignUp/>}/>
                <Route path = '/client' element = {<Client/>}/>
                <Route path = '/client/:username' element = {<Client/>}/>
                <Route path = '/jobcontainer' element = {<JobContainer/>}/>
                <Route path = '/jobcontainer/:username' element = {<JobContainer/>}/>
                <Route path = '/jobcontainer/insert' element = {<JobContainerInsertPage/>}/>
                <Route path = '/jobcontainer/insert/:username' element = {<JobContainerInsertPage/>}/>
                <Route path = '/jobcontainer/update' element = {<JobContainerUpdatePage/>}/>
                <Route path = '/jobcontainer/update/:username' element = {<JobContainerUpdatePage/>}/>
                <Route path = '/systemlog' element = {<SystemLogPage/>}/>
                <Route path = '/systemlog/:username' element = {<SystemLogPage/>}/>
                <Route path = '/client/insert' element = {<InsertPage/>}/>
                <Route path = '/client/insert/:username' element = {<InsertPage/>}/>
                <Route path = '/client/update' element = {<UpdatePage/>}/>
                <Route path = '/client/update/:username' element = {<UpdatePage/>}/>
            </Routes>
        </div>
    );
}

export default App;