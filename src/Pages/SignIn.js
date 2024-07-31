import React, {useState} from "react";
import styles from "../Styles/SignIn.module.scss";
import { Link, useNavigate } from "react-router-dom";
import apollogixLogo from '../images/Apollogix-logo.jpg'
import axios from 'axios';

const SignIn = () => {
    /* If user inputs username and/or password that cannot be found on database, an error will be alerted. This will be coded in JavaScript later. */
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const history = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/login', {
                email: email,
                matkhau: password
            });
            const { email: userEmail, tentk, matkhau } = response.data;
            localStorage.setItem('tentk', tentk);
            localStorage.setItem('email', userEmail);
            history(`/client/${tentk}`);
        } catch (error) {
            alert('Invalid username or password');
        }
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
                            value = {email}
                            onChange={(e) => setEmail(e.target.value)}
                            required/>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            autoComplete="off"
                            placeholder="Password"
                            value = {password}
                            onChange={(e) => setPassword(e.target.value)}
                            required/>
                        <div className="Forget-password">
                            <Link to="/forgot-password" type="submit" className={`${styles.btn} ${styles['btn-success']}`}
                            >
                                Forgot your password?
                            </Link>
                        </div>
                        {error && <div style={{ color: 'red' }}>{error}</div>}
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