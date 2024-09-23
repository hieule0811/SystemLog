import React from "react";
import "./SignIn.css";
import { Link } from "react-router-dom";
import apollogixLogo from '../images/Apollogix-logo.jpg'

const Login = () => {
    // If user inputs an email that cannot be found on database, an alert will be displayed. This will be coded in JavaScript later.
    return (
        <>
            <img src={apollogixLogo} style={{marginTop: '50px'}}/>
            <div className="addUser" style={{width: '400px', marginTop: '0px'}}>
                <h3>FORGOT YOUR PASSWORD?</h3>
                <h5>Enter your email address to reset your password</h5>
                <form className="addUserForm" >
                    <div className="inputGroup">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            autoComplete="off"
                            placeholder="Email"
                            required/>
                        <button type="submit" className="btn btn-primary">
                            RESET PASSWORD
                        </button>
                    </div>
                </form>
                <div className="signin">
                    <Link to="/" type="submit" className="btn btn-success">
                        <p>BACK TO SIGN IN</p>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Login;