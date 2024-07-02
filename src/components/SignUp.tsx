import React, { useState } from "react";
import './SignUp.css'
import { Link } from "react-router-dom";
import apollogixLogo from "../images/Apollogix-logo.jpg";

const SignUp = () => {
    // If the email/phone duplicates with what was on database, an alert will be displayed. This will be coded in JavaScript later.
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(event.target.checked);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        if (!isChecked) {
            event.preventDefault();
            alert('You must tick the checkbox to login.');
        }
    };
    return (
        <>
            <img src={apollogixLogo} style={{marginTop: '20px'}}/>
            <div className="addUser" style={{width: '400px', marginTop: '0px'}}>
                <h3>Sign Up</h3>
                <form className="addUserForm" onSubmit={handleSubmit}>
                    <div className="inputGroup">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            autoComplete="off"
                            placeholder="Email"
                            required/>
                        <input
                            type="phoneNumber"
                            id="phoneNumber"
                            pattern="^(\[ ]*((\+|)[0-9 ]+\)|)[0-9 ]+$"
                            name="phoneNumber"
                            autoComplete="phoneNumber"
                            placeholder="Phone Number"
                            required/>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            autoComplete="off"
                            placeholder="Password"
                            required/>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            autoComplete="off"
                            placeholder="Confirm your Password"
                            required/>
                        <label htmlFor="rememberMe">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                name="rememberMe"
                                checked={isChecked}
                                onChange={handleCheckboxChange}
                            />
                            I accept the terms and conditions of use.
                        </label>
                        <button type="submit" className="btn btn-success">
                            Sign Up
                        </button>
                    </div>
                </form>
                <div className="signin">
                    <Link to="/" type="submit" className="btn btn-success">
                        <p>Already have an Account? Sign In Here</p>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default SignUp;