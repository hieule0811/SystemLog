import React, {useState,useEffect} from 'react';
import Sidebar from '../Components/Sidebar.js';
import styles from '../Styles/InsertPage.module.scss';
import {LuBellRing} from "react-icons/lu";
import {RxAvatar} from "react-icons/rx";
import {Menu, MenuItem} from "@mui/material";
import {Link, useParams} from "react-router-dom";
import {FiLogOut} from "react-icons/fi";
import { Modal, Button } from 'react-bootstrap';
export const InsertPage = () => {
    const [show, setShow] = useState(false);
    const [filters, setFilters] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [unloco, setUnloco] = useState('');
    const [suburb, setSuburb] = useState('');
    const [state, setState] = useState('');
    const [status, setStatus] = useState('');
    const [officeAddress, setOfficeAddress] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [telephone, setTelephone] = useState('');
    const [postalCodeError, setPostalCodeError] = useState('');
    const [modalShow, setModalShow] = useState(false);
    const [tentk, setTentk] = useState('');
    useEffect(() => {
        const storedTentk = localStorage.getItem('tentk');
        if (storedTentk) {
            setTentk(storedTentk);
        }
    }, []);
    const createdBy = tentk, updatedBy = tentk;
    const handleClose = () => {
        setFilters([]);
        setShow(false);
    };
    const handleShow = () => setShow(true);

    const addFilter = () => {
        setFilters([...filters, { column: '', operator: '', data: '' }]);
    };

    const removeFilter = (index) => {
        const newFilters = filters.filter((_, i) => i !== index);
        setFilters(newFilters);
    };

    const handleFilterChange = (index, field, value) => {
        const newFilters = filters.map((filter, i) =>
            i === index ? { ...filter, [field]: value } : filter
        );
        setFilters(newFilters);
    };
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const handleClosed = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!/^\d+$/.test(postalCode)) {
            setPostalCodeError('Postal code must be a number');
            return;
        }
        setModalShow(true); // Hiển thị modal khi nhấn SAVE
    };
    const handleModalClose = () => setModalShow(false);
    const handleConfirm= (e) => {
        e.preventDefault();
        setModalShow(false);
        setName('');
        setEmail('');
        setCountry('');
        setCity('');
        setUnloco('');
        setSuburb('');
        setState('');
        setStatus('');
        setOfficeAddress('');
        setPostalCode('');
        setBirthdate('');
        setTelephone('');
        const newClient = {
          createdBy,
          updatedBy,
          name,
          birthdate,
          country,
          city,
          unloco,
          officeAddress,
          suburb,
          state,
          postalCode: parseInt(postalCode, 10),
          email,
          telephone,
          status: status === 'Inactive' ? false : true,
        };

        fetch('http://localhost:8080/client', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newClient),
        })
        .then(
            response => {
                if (response.ok) {
                  return response.text();
                }
                throw new Error('Network response was not ok.');
            }
         )
        .then(data => {
            alert(data);

        })
        .catch((error) => {
            console.error('Error:', error);
            setModalShow(false);
        });
      };
    return (
        <div className={styles.clientContainer}>
            <div className={styles.clientTop}>
                <hr></hr>
                <div className={styles.textTitle}>
                    Clients {">"} New
                </div>
                <div className={styles.test1}>
                    <ul className={styles.clientList}>
                        <li><LuBellRing/></li>
                        <li>
                            <div className={styles.clientAva} onClick={handleClick}>
                                <div className={styles.clientAva1}>{tentk}</div>
                                <div className={styles.clientAva2}><RxAvatar/></div>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClosed}
                                >
                                    <Link to="/" style={{textDecoration: 'none', color: 'inherit'}}>
                                        <MenuItem onClick={handleLogout}>
                                            <FiLogOut style={{marginRight: '5px'}}/> Logout
                                        </MenuItem>
                                    </Link>

                                </Menu>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div className={styles.newClient}>
                <h5>INFORMATION</h5>
                <form className="newClientForm" onSubmit={handleSubmit}>
                    <div className="inputGroup">
                        <input
                            style={{width: '500px'}}
                            id="name"
                            name="name"
                            autoComplete="off"
                            placeholder="Name*"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required/>
                        <input
                            style={{width: '500px', marginLeft: '20px'}}
                            type="email"
                            id="email"
                            name="email"
                            autoComplete="off"
                            placeholder="Email"
                            value = {email}
                            onChange = {(e) => setEmail(e.target.value)}
                        />
                        <br/><br/>
                        <input
                            style={{width: '250px'}}
                            id="country"
                            name="country"
                            autoComplete="off"
                            placeholder="Country*"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            required/>
                        <input
                            style={{width: '250px', marginLeft: '20px'}}
                            id="city"
                            name="city"
                            autoComplete="off"
                            placeholder="City*"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required/>
                        <input
                            style={{width: '375px', marginLeft: '20px'}}
                            id="unloco"
                            name="unloco"
                            autoComplete="off"
                            placeholder="Unloco*"
                            value={unloco}
                            onChange={(e) => setUnloco(e.target.value)}
                            required/>
                        <br/><br/>
                        <input
                            style={{width: '250px'}}
                            id="suburb"
                            name="suburb"
                            autoComplete="off"
                            placeholder="Suburb*"
                            value={suburb}
                            onChange={(e) => setSuburb(e.target.value)}
                            required/>
                        <input
                            style={{width: '250px', marginLeft: '20px'}}
                            id="state"
                            name="state"
                            autoComplete="off"
                            placeholder="State*"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            required/>
                        <select
                            style={{width: '250px', marginLeft: '20px'}}
                            id="status"
                            name="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            autoComplete="off">
                            <option value="" disabled selected hidden>Status</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                        <br/><br/>
                        <input
                            style={{width: '600px'}}
                            id="office_address"
                            name="office_address"
                            autoComplete="off"
                            placeholder="Office Address*"
                            value={officeAddress}
                            onChange={(e) => setOfficeAddress(e.target.value)}
                            required/>
                        <input
                            style={{width: '375px', marginLeft: '20px', postion: 'relative'}}
                            id="postal_code"
                            name="postal_code"
                            autoComplete="off"
                            placeholder="Postal Code*"
                            value={postalCode}
                            onChange={(e) => {
                                setPostalCode(e.target.value);
                                setPostalCodeError('');
                            }}
                            required/>
                        {postalCodeError && <div style={{marginLeft:'620px',color: 'red',position:'absolute' }}>{postalCodeError}</div>}
                        <br/><br/>
                        <input
                            id="birthdate"
                            name="birthdate"
                            // onChange={(date) => setBirthdate(date)}
                            placeholder="dd/mm/yyyy"
                            type="date"
                            value={birthdate}
                            onChange={(e) => setBirthdate(e.target.value)}
                            required/>
                        <input
                            style={{width: '250px', marginLeft: '20px'}}
                            id="telephone"
                            name="telephone"
                            autoComplete="off"
                            placeholder="Telephone"
                            value={telephone}
                            onChange={(e) => setTelephone(e.target.value)}
                            />
                        <br/><br/>
                        <label htmlFor="created_by">Created By</label>
                        <input
                            style={{width: '250px', marginLeft: '5px', backgroundColor: 'lightgrey'}}
                            id="created_by"
                            name="created_by"
                            autoComplete="off"
                            value={tentk}
                            readOnly/>

                        <br/><br/>
                        <button type="submit" className="btn btn-primary" style={{marginBottom: '10px'}}>
                            SAVE
                        </button>
                    </div>
                </form>
                <Modal show={modalShow} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to create this record?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleConfirm}>
                        OK
                    </Button>
                </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

function App() {
    return (
        <React.Fragment>
            <Sidebar/>
            <InsertPage/>
        </React.Fragment>
    )
}

export default App;