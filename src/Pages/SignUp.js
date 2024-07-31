import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Button } from 'react-bootstrap';
import styles from "../Styles/SignUp.module.scss";
import apollogixLogo from "../images/Apollogix-logo.jpg";
import axios from 'axios';
import { set } from "date-fns/set";

const SignUp = () => {
    const [tentk, setTentk] = useState('');
    const [email, setEmail] = useState('');
    const [matkhau, setMatkhau] = useState('');
    const [confirmMatkhau, setConfirmMatkhau] = useState('');
    const [error, setError] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [errorMessageTk, setErrorMessageTk] = useState('');
    const [errorMessageEmail, setErrorMessageEmail] = useState('');
    const [errorMessagePassword, setErrorMessagePassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!isChecked) {
            alert('You must tick the checkbox to login.');
        }
        else if (matkhau !== confirmMatkhau) {
            setErrorMessagePassword('Passwords do not match. Please try again.');
            setErrorMessageTk('');
            setErrorMessageEmail('');
            alert('Passwords do not match. Please try again.');
        }
        else {
            try {
                const response = await axios.post('http://localhost:8080/api/signup', { email, tentk, matkhau, phonenumber });
                const { email: userEmail, tentk: userTentk } = response.data;
                localStorage.setItem('tentk', tentk);
                localStorage.setItem('email', userEmail);
                setShowModal(true);
                setErrorMessageTk('');
                setErrorMessageEmail('');
            } catch (err) {
                console.error('Sign-up failed', err);
                if (err.response && err.response.status === 409) {
                    const errorData = err.response.data;
                    if (errorData.includes('Email')) {
                        setErrorMessageEmail(errorData);
                        setErrorMessageTk('');
                        alert(errorData)
                    } else if (errorData.includes('Username')) {
                        setErrorMessageTk(errorData);
                        setErrorMessageEmail('');
                        alert(errorData);
                    }
                } else {
                    setErrorMessageTk('Sign-up failed. Please try again.');
                    setErrorMessageEmail('');
                }
            }
        }
    };

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };
    const handleModalClose = () => {
        setShowModal(false);
        setTentk('');
        setEmail('');
        setMatkhau('');
        setPhonenumber('');
        setConfirmMatkhau('');
        setIsChecked(false);
        setError('');
    };
    const handleTkChange = () =>{

    }
    return (
        <div className={styles.setLayout}>
            <img src={apollogixLogo} style={{ marginTop: '50px', marginBottom: '20px' }} />
            <div className={styles.addUser} style={{ width: '400px', marginTop: '0px' }}>
                <h3>Sign Up</h3>
                <form className={styles.addUserForm} onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <input
                            id="ten_tk"
                            name="ten_tk"
                            autoComplete="off"
                            placeholder="Username*"
                            value={tentk}
                            onChange={(e) => setTentk(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            id="mat_khau"
                            name="mat_khau"
                            autoComplete="off"
                            placeholder="Password*"
                            value={matkhau}
                            onChange={(e) => setMatkhau(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            id="confirm_password"
                            name="confirm_password"
                            value={confirmMatkhau}
                            autoComplete="off"
                            placeholder="Confirm your Password*"
                            onChange={(e) => setConfirmMatkhau(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            id="email"
                            name="email"
                            autoComplete="off"
                            placeholder="Email*"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            id="phone_number"
                            pattern="^(\[ ]*((\+|)[0-9 ]+\)|)[0-9 ]+$"
                            name="phone_number"
                            autoComplete="off"
                            value={phonenumber}
                            onChange={(e) => setPhonenumber(e.target.value)}
                            placeholder="Phone Number*"
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
                        <button type="submit" className={`${styles.btn} ${styles['btn-success']}`} style={{ marginBottom: '10px' }}>
                            Sign Up
                        </button>
                    </div>

                </form>
                <div className="signin">
                    <Link to="/" className={`${styles.btn} ${styles['btn-success']}`}>
                        <p>Already have an Account? Sign In Here</p>
                    </Link>
                </div>
            </div>
            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>Account created successfully!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

function App() {
    return (
        <React.Fragment>
            <SignUp />
        </React.Fragment>
    );
}

export default App;