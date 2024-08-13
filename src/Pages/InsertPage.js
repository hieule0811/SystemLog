import React, {useState,useEffect} from 'react';
import Sidebar from '../Components/Sidebar.js';
import styles from '../Styles/InsertPage.module.scss';
import {RxAvatar} from "react-icons/rx";
import {Menu, MenuItem} from "@mui/material";
import {Link, useParams} from "react-router-dom";
import {FiLogOut} from "react-icons/fi";
import { Modal, Button , Alert} from 'react-bootstrap';
import { IoIosArrowRoundBack } from "react-icons/io";
import { BiSolidBellRing } from "react-icons/bi";
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
    const [telephoneError, setTelephoneError] = useState('');
    const [modalShow, setModalShow] = useState(false);
    const [tentk, setTentk] = useState('');
    useEffect(() => {
        const storedTentk = localStorage.getItem('tentk');
        if (storedTentk) {
            setTentk(storedTentk);
        }
    }, []);
    const createdBy = tentk, updatedBy = '';
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
        if (postalCodeError || telephoneError) {
            return;
        }
        setModalShow(true);
    };
    const handlePostalCodeChange = (e) => {
        const newPostalCode = e.target.value;
        setPostalCode(newPostalCode);

        if (!/^\d*$/.test(newPostalCode)) {
            setPostalCodeError('Postal code must be a number');
        } else {
            setPostalCodeError('');
        }
    };
    const handleTelephoneChange = (e) => {
        const newTelephone = e.target.value;
        setTelephone(newTelephone);

        if (!/^\d*$/.test(newTelephone)) {
            setTelephoneError('Telephone must be a number');
        } else {
            setTelephoneError('');
        }
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
    const getAvatarByTentk = (tentk) => {
        const avatarMap = {
          'Trung Hieu': '/avatar1.jpg',
          'Nhat Linh': '/avatar2.jpg',
          'Quang Nha': '/avatar3.jpg',
        };
        return avatarMap[tentk] || '/avatar4.jpg'; // Avatar mặc định nếu không tìm thấy
    };
    return (
        <div className={styles.clientContainer}>
            <div className={styles.clientTop}>
                <hr></hr>

                <div className={styles.textTitle}>
                <Link to ="/client" style = {{ color: 'inherit' }}>
                   <IoIosArrowRoundBack style = {{ fontSize:'30px',marginRight:'5px' }} className = {styles.arrowIcon}/>
                </Link>
                    Clients {">"} New
                </div>
                <div className={styles.test1}>
                    <ul className={styles.clientList}>
                        <li><BiSolidBellRing style = {{marginTop:'5px',marginRight:'-15px'}}/></li>
                        <li>
                            <div className={styles.clientAva} onClick={handleClick}>
                                <div className={styles.clientAva1}>{tentk.toUpperCase()}</div>
                                <img src = {getAvatarByTentk(tentk)}  alt="avatar" className={styles.clientAva2} />
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
                <h5 style = {{marginLeft: '-20px'}}>INFORMATION</h5>
                <form className="newClientForm" onSubmit={handleSubmit}>
                    <div className={styles.inputGroups}>
                        <div className={styles.inputGroup} style={{width: '440px'}}>
                            <input style={{width: '440px'}}
                                   id="name"
                                   name="name"
                                   autoComplete="off"
                                   value={name}
                                   onChange={(e) => setName(e.target.value)}
                                   required/>
                            <label htmlFor="name">Name*</label>
                        </div>
                        <div className={styles.inputGroup} style={{width: '250px'}}>
                            <input style={{width: '250px',color:birthdate ? 'black':'#008031'}}
                                   id="birthdate"
                                   name="birthdate"
                                   type="date"
                                   value={birthdate}
                                   onChange={(e) => setBirthdate(e.target.value)}
                                   required/>
                        </div>
                        <div className={styles.inputGroup} style={{width: '440px'}}>
                            <input style={{width: '440px'}}
                                   id="country"
                                   name="country"
                                   autoComplete="off"
                                   value={country}
                                   onChange={(e) => setCountry(e.target.value)}
                                   required/>
                            <label htmlFor="country">Country*</label>
                        </div>
                        <div className={styles.inputGroup} style={{width: '440px', marginTop: '-10px'}}>
                            <input style={{width: '440px'}}
                                   id="city"
                                   name="city"
                                   autoComplete="off"
                                   value={city}
                                   onChange={(e) => setCity(e.target.value)}
                                   required/>
                            <label htmlFor="city" style = {{marginTop: '0px'}}>City*</label>
                        </div>
                        <div className={styles.inputGroup} style={{width: '250px', marginTop: '-10px'}}>
                            <input style={{width: '250px'}}
                                   id="unloco"
                                   name="unloco"
                                   value={unloco}
                                   onChange={(e) => setUnloco(e.target.value)}
                                   required/>
                            <label htmlFor="unloco" style = {{marginTop: '0px'}}>UNLOCO*</label>
                        </div>
                        <div className={styles.inputGroup} style={{width: '440px', marginTop: '-10px'}}>
                            <input style={{width: '440px'}}
                                   id="suburb"
                                   name="suburb"
                                   autoComplete="off"
                                   value={suburb}
                                   onChange={(e) => setSuburb(e.target.value)}
                                   required/>
                            <label htmlFor="suburb">Suburb*</label>
                        </div>
                        <div className={styles.inputGroup} style={{width: '1150px', marginTop: '-10px'}}>
                            <input style={{width: '1150px'}}
                                   id="office_address"
                                   name="office_address"
                                   autoComplete="off"
                                   value={officeAddress}
                                   onChange={(e) => setOfficeAddress(e.target.value)}
                                   required/>
                            <label htmlFor="office_address" style = {{marginTop: '0px'}}>Office Address*</label>
                        </div>
                        <div className={styles.inputGroup} style={{width: '440px', marginTop: '-10px'}}>
                            <input style={{width: '440px'}}
                                   id="state"
                                   name="state"
                                   autoComplete="off"
                                   value={state}
                                   onChange={(e) => setState(e.target.value)}
                                   required/>
                            <label htmlFor="state">State*</label>
                        </div>
                        <div className={styles.inputGroup} style={{width: '250px', marginTop: '-10px',position:'relative'}}>
                            <input style={{width: '250px'}}
                                   id="postal_code"
                                   name="postal_code"
                                   value={postalCode}
                                   onChange={handlePostalCodeChange}
                                   required/>
                            <label htmlFor="postal_code">Postal Code*</label>
                            {postalCodeError && <div style = {{ color:'red',position:'absolute',top:'48px' }}>{postalCodeError}</div>}
                        </div>
                        <div className={styles.inputGroup} style={{width: '440px', marginTop: '-10px'}}>
                            <input style={{width: '440px'}}
                                   id="telephone"
                                   name="telephone"
                                   autoComplete="off"
                                   value={telephone}
                                   onChange={handleTelephoneChange}
                                   required/>
                            <label htmlFor="telephone">Telephone*</label>
                            {telephoneError && <div style = {{ color:'red',position:'absolute',top:'48px' }}>{telephoneError}</div>}
                        </div>
                        <div className={styles.inputGroup} style={{width: '700px', marginTop: '-10px'}}>
                            <input style={{width: '700px'}}
                                   id="email"
                                   name="email"
                                   value={email}
                                   onChange={(e) => setEmail(e.target.value)}
                                   required/>
                            <label htmlFor="email">Email*</label>
                        </div>
                        <div className={styles.inputGroup} style={{width: '440px', marginTop: '0px'}}>
                            <select
                                style={{width: '440px', height: '40px',color: status? 'black':'#008031'}}
                                id="status"
                                name="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                autoComplete="off">
                                <option value="" disabled selected hidden style = {{ color:'red' }}>Status</option>
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </div>
                    </div>
                    <label htmlFor="created_by" style = {{marginLeft: '-20px', marginTop: '-20px'}}>Created By</label>
                    <input
                        style={{width: '340px', marginLeft: '5px', height: '40px', backgroundColor: 'lightgrey', marginTop: '-10px',borderRadius: '5px'}}
                        id="created_by"
                        name="created_by"
                        autoComplete="off"
                        value={tentk}
                        readOnly/>
                    <br/><br/>
                    <button type="submit" className="btn btn-primary" style = {{marginLeft: '-20px'}}>
                        SAVE
                    </button>
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