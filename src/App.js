import './App.scss';
import { Route, Routes } from 'react-router-dom';
import Client from './Pages/Client.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Helmet } from 'react-helmet';
import InsertPage from './Pages/InsertPage.js';
import UpdatePage from './Pages/UpdatePage.js';
import SystemLogPage from './Pages/SystemLogPage.js';
import ForgotPassword from './Pages/ForgotPassword.js';
import SignIn from './Pages/SignIn.js';
import SignUp from './Pages/SignUp.js';
function App() {
  return (
    <div className="App">
      <Helmet>
        <title>SystemLog</title>
      </Helmet>
      <Routes>
        <Route path = '/client' element = {<Client/>}/>
        <Route path = '/systemlog' element = {<SystemLogPage/>}/>
        <Route path = '/client/insert' element = {<InsertPage/>}/>
        <Route path = '/client/update' element = {<UpdatePage/>}/>
        <Route path = '/' element = {<SignIn/>}/>
        <Route path = '/sign-up' element = {<SignUp/>}/>
        <Route path = '/forgot-password' element = {<ForgotPassword/>}/>
      </Routes>
    </div>
  );
}

export default App;
