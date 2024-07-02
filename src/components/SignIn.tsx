import React from "react";
import "./SignIn.css";
import { Link } from "react-router-dom";
import apollogixLogo from '../images/Apollogix-logo.jpg'

const SignIn = () => {
    /* If user inputs username and/or password that cannot be found on database, an error will be alerted. This will be coded in JavaScript later. */
    return (
        <>
            <img src={apollogixLogo} style={{marginTop: '50px'}}/>
            <div className="addUser" style={{width: '400px', marginTop: '0px'}}>
                <h3>SIGN IN TO YOUR ACCOUNT</h3>
                <form className="addUserForm" >
                    <div className="inputGroup">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            autoComplete="off"
                            placeholder="Email"
                            required/>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            autoComplete="off"
                            placeholder="Password"
                            required/>
                        <div className="Forget-password">
                            <Link to="/forgot-password" type="submit" className="btn btn-success">
                                Forgot your password?
                            </Link>
                        </div>
                        <button type="submit" className="btn btn-primary">
                            SIGN IN
                        </button>
                    </div>
                </form>
                <div className="signup">
                    <Link to="/sign-up" type="submit" className="btn btn-success">
                        <p>Don't have an Account? Sign Up Here</p>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default SignIn;