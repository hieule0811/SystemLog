import React, {useState} from "react";
import styles from "../Styles/SignIn.module.scss";
import { Link, useNavigate } from "react-router-dom";
import apollogixLogo from '../images/Apollogix-logo.jpg'

const SignIn = () => {
    /* If user inputs username and/or password that cannot be found on database, an error will be alerted. This will be coded in JavaScript later. */
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const history = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(""); // Clear any previous errors
        // *** Assume this sign-in is successful (without using database)
        // const result = await response.json();
        // localStorage.setItem('authToken', result.token);
        // localStorage.setItem('username', result.username);
        const username = "QuangNha";
        localStorage.setItem('name', username);
        // Redirect to dashboard or another protected route
        history(`/client/${username}`);
    };

    return (
        <div className = {styles.setLayout}>
            <img src={apollogixLogo} style={{marginTop: '50px', marginBottom:'20px'}}/>
            <div className={styles.addUser} style={{width: '400px', marginTop: '0px'}}>
                <h3>SIGN IN TO YOUR ACCOUNT</h3>
                <form className={styles.addUserForm} onSubmit = {handleSubmit}>
                    <div className={styles.inputGroup}>
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
                            <Link to="/forgot-password" type="submit" className={`${styles.btn} ${styles['btn-success']}`}
                            >
                                Forgot your password?
                            </Link>
                        </div>
                        <button type="submit" className="btn btn-primary" style = {{marginBottom: '10px' }}>
                            SIGN IN
                        </button>
                    </div>
                </form>
                <div className="signup">
                    <Link to="/sign-up" type="submit" className={`${styles.btn} ${styles['btn-success']}`}
                    >
                        <p>Don't have an Account? Sign Up Here</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

function App(){
    return(
        <React.Fragment>
            <SignIn/>
        </React.Fragment>
    )
}
export default App;