import './App.scss';
import { Route, Routes } from 'react-router-dom';
import Client from './Pages/Client.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Helmet } from 'react-helmet';
import InsertPage from './Pages/InsertPage.js';
import UpdatePage from './Pages/UpdatePage.js';
import SystemLogPage from './Pages/SystemLogPage.js';
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
      </Routes>
    </div>
  );
}

export default App;
