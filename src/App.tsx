import React from 'react'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import ForgotPassword from './components/ForgotPassword'
import './App.css'
import {RouterProvider, createBrowserRouter} from "react-router-dom";

function App() {
    const route = createBrowserRouter([
        {
            path: "/",
            element: <SignIn />,
        },
        {
            path: "/sign-up",
            element: <SignUp />
        },
        {
            path: "/forgot-password",
            element: <ForgotPassword/>
        },
    ]);
    return (
       <div className="App" style={{width: '1300px', marginLeft: '0px'}}>
           <RouterProvider router={route}></RouterProvider>
       </div>
    )
}

export default App
