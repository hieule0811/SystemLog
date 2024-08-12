import React from "react";
import styles from "../Styles/SignIn.module.scss";
import { Link } from "react-router-dom";
import apollogixLogo from '../images/Apollogix-logo.jpg'

const ForgotPassword = () => {
    return (
        <div className = {styles.setLayout}>
            <img src={apollogixLogo} style={{marginTop: '50px',marginBottom:'20px'}}/>
            <div className={styles.addUser} style={{width: '400px', marginTop: '0px'}}>
                <h3>FORGOT YOUR PASSWORD?</h3>
                <h5>Enter your email address to reset your password</h5>
                <form className={styles.addUserForm} >
                    <div className={styles.inputGroup}>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            autoComplete="off"
                            placeholder="Email"
                            required/>
                        <button type="submit" className="btn btn-primary" style = {{marginBottom: '10px',}}
                        >
                            RESET PASSWORD
                        </button>
                    </div>
                </form>
                <div className="signin">
                    <Link to="/" type="submit" className={`${styles.btn} ${styles['btn-success']}`}
                    >
                        <p>BACK TO SIGN IN</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

function App(){
    return(
      <React.Fragment>
        <ForgotPassword />
      </React.Fragment>
    )
  }
export default App;