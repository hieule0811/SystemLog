import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../Styles/SignUp.module.scss";
import apollogixLogo from "../images/Apollogix-logo.jpg";

const SignUp = () => {
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    const handleSubmit = (event) => {
        if (!isChecked) {
            event.preventDefault();
            alert('You must tick the checkbox to login.');
        }
    };

    return (
        <div className = {styles.setLayout}>
            <img src={apollogixLogo} style={{ marginTop: '50px', marginBottom: '20px' }} />
            <div className={styles.addUser}
                 style={{ width: '400px', marginTop: '0px' }}
            >
                <h3>Sign Up</h3>
                <form className={styles.addUserForm} onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <input
                            id="ten_tk"
                            name="ten_tk"
                            autoComplete="off"
                            placeholder="Username"
                            required
                        />
                        <input
                            type="password"
                            id="mat_khau"
                            name="mat_khau"
                            autoComplete="off"
                            placeholder="Password"
                            required
                        />
                        <input
                            type="password"
                            id="confirm_password"
                            name="confirm_password"
                            autoComplete="off"
                            placeholder="Confirm your Password"
                            required
                        />
                        <input
                            type="email"
                            id="email"
                            name="email"
                            autoComplete="off"
                            placeholder="Email"
                            required
                        />
                        <input
                            id="phone_number"
                            pattern="^(\[ ]*((\+|)[0-9 ]+\)|)[0-9 ]+$"
                            name="phone_number"
                            autoComplete="off"
                            placeholder="Phone Number"
                        />
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
                        <button type="submit" className={`${styles.btn} ${styles['btn-success']}`}
                                style={{marginBottom: '10px'}}
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
                <div className="signin">
                    <Link to="/"
                          className={`${styles.btn} ${styles['btn-success']}`}
                    >
                        <p>Already have an Account? Sign In Here</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

function App(){
    return(
        <React.Fragment>
            <SignUp/>
        </React.Fragment>
    )
}
export default App;