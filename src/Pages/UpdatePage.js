import React, {useState,useEffect} from 'react';
import Sidebar from '../Components/Sidebar.js';
import styles from '../Styles/UpdatePage.module.scss';
import {LuBellRing} from "react-icons/lu";
import {RxAvatar} from "react-icons/rx";
import {Menu, MenuItem} from "@mui/material";
import {Link, useParams} from "react-router-dom";
import {FiLogOut} from "react-icons/fi";
import { Modal, Button } from 'react-bootstrap';
export const UpdatePage = () => {

    const { username } = useParams();
    const [client,setClient] = useState([]);
    const [show, setShow] = useState(false);
    const [filters, setFilters] = useState([]);
    const [name, setName] = useState(client.name);
    const [email, setEmail] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [unloco, setUnloco] = useState('');
    const [suburb, setSuburb] = useState('');
    const [state, setState] = useState('');
    const [status, setStatus] = useState(true);
    const [officeAddress, setOfficeAddress] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [telephone, setTelephone] = useState('');
    const [updatedBy, setUpdatedBy] = useState('');
    const [updatedAt, setUpdateAt] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [createdAt, setCreatedAt] = useState('');
    const [postalCodeError, setPostalCodeError] = useState('');
    const [modalShow, setModalShow] = useState(false);
    const [tentk, setTentk] = useState('');
    const hasDataChanged = () => {
        return (
          name !== client.name ||
          email !== client.email ||
          country !== client.country ||
          city !== client.city ||
          unloco !== client.unloco ||
          suburb !== client.suburb ||
          state !== client.state ||
          status !== client.status ||
          officeAddress !== client.officeAddress ||
          postalCode !== client.postalCode ||
          birthdate !== client.birthdate ||
          telephone !== client.telephone
        );
    };
    useEffect(() => {
        const storedTentk = localStorage.getItem('tentk');
        if (storedTentk) {
            setTentk(storedTentk);
        }
        const fetchClient = async () => {
            try {
                const response = await fetch(`http://localhost:8080/client/code?code=${username}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                const data = await response.json();
                setClient(data);
                setName(data.name);
                setEmail(data.email);
                setCountry(data.country);
                setCity(data.city);
                setUnloco(data.unloco);
                setSuburb(data.suburb);
                setState(data.state);
                setStatus(data.status);
                setOfficeAddress(data.officeAddress);
                setPostalCode(data.postalCode);
                setBirthdate(data.birthdate);
                setTelephone(data.telephone);
                setUpdatedBy(data.updatedBy);
                if(data.updatedAt !== null) setUpdateAt(formatDate(data.updatedAt));
                setCreatedBy(data.createdBy);
                setCreatedAt(formatDate(data.createdAt));
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchClient();
    }, [username]);
    const handleClose = () => {
        setFilters([]);
        setShow(false);
    };
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
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
        if (!hasDataChanged()) {
            alert("No changes have been made");
            return;
        }
        if (!/^\d+$/.test(postalCode)) {
            setPostalCodeError('Postal code must be a number');
            return;
        }
        setModalShow(true);
    };
    const handleModalClose = () => setModalShow(false);
    const handleConfirm= (e) => {
        e.preventDefault();
        setModalShow(false);
        const updateClient = {
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
          status: status === true,
          updatedBy: tentk
        };

        fetch(`http://localhost:8080/client/code/${username}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateClient),
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
            window.location.reload();

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
                    Clients {">"} {username}
                </div>
                <div className={styles.test1}>
                    <ul className={styles.clientList}>
                        <li><LuBellRing/></li>
                        <li>
                            <div className={styles.clientAva} onClick={handleClick}>
                                <div className={styles.clientAva1}>{tentk}  </div>
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
                <h5>DETAILS</h5>
                <form className="newClientForm" onSubmit = {handleSubmit}>
                    <div className="inputGroup">
                        <label htmlFor="name">Name</label>
                        <input
                            style={{width: '500px', marginLeft: '5px'}}
                            id="name"
                            name="name"
                            autoComplete="off"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required/>
                        <label htmlFor="name" style={{marginLeft: '20px'}}>Email</label>
                        <input
                            style={{width: '500px', marginLeft: '5px'}}
                            type="email"
                            id="email"
                            name="email"
                            autoComplete="off"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}/>
                        <br/><br/>
                        <label htmlFor="name">Country</label>
                        <input
                            style={{width: '250px', marginLeft: '5px'}}
                            id="country"
                            name="country"
                            autoComplete="off"
                            placeholder="Country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}/>
                        <label htmlFor="city" style={{marginLeft: '20px'}}>City</label>
                        <input
                            style={{width: '250px', marginLeft: '5px'}}
                            id="city"
                            name="city"
                            autoComplete="off"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}/>
                        <label htmlFor="unloco" style={{marginLeft: '20px'}}>Unloco</label>
                        <input
                            style={{width: '375px', marginLeft: '5px'}}
                            id="unloco"
                            name="unloco"
                            autoComplete="off"
                            value={unloco}
                            onChange={(e) => setUnloco(e.target.value)}
                            />
                        <br/><br/>
                        <label htmlFor="suburb">Suburb</label>
                        <input
                            style={{width: '250px', marginLeft: '5px'}}
                            id="suburb"
                            name="suburb"
                            autoComplete="off"
                            value={suburb}
                            onChange={(e) => setSuburb(e.target.value)}
                        />
                        <label htmlFor="state" style={{marginLeft: '20px'}}>State</label>
                        <input
                            style={{width: '250px', marginLeft: '5px'}}
                            id="state"
                            name="state"
                            autoComplete="off"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                        />
                        <label htmlFor="telephone" style={{marginLeft: '20px'}}>Telephone</label>
                        <input
                            style={{width: '250px', marginLeft: '5px'}}
                            id="telephone"
                            name="telephone"
                            autoComplete="off"
                            value={telephone}
                            onChange={(e) => setTelephone(e.target.value)}
                        />
                        <br/><br/>
                        <label htmlFor="officeAddress">Office Address</label>
                        <input
                            style={{width: '600px', marginLeft: '5px'}}
                            id="office_address"
                            name="office_address"
                            autoComplete="off"
                            value={officeAddress}
                            onChange={(e) => setOfficeAddress(e.target.value)}/>
                        <label htmlFor="status" style={{marginLeft: '20px'}}>Status</label>
                        <select
                            style={{width: '250px', marginLeft: '5px'}}
                            id="status"
                            name="status"
                            autoComplete="off"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="false">Inactive</option>
                            <option value="true">Active</option>
                        </select>
                        <br/><br/>
                        <label htmlFor="postal_code">Postal Code</label>
                        <input
                            style={{width: '375px', marginLeft: '5px', position: 'relative'}}
                            id="postal_code"
                            name="postal_code"
                            autoComplete="off"
                            value={postalCode}
                            onChange={(e) => {
                                setPostalCode(e.target.value);
                                setPostalCodeError('');
                            }}
                        />
                        {postalCodeError && <div style={{marginLeft:'90px',color: 'red',position:'absolute' }}>{postalCodeError}</div>}
                        <label htmlFor="birthdate" style={{marginLeft: '20px'}}>Birthdate</label>
                        <input
                            style={{width: '375px', marginLeft: '5px', backgroundColor: 'lightgrey'}}
                            id="birthdate"
                            name="birthdate"
                            autoComplete="off"
                            type = "date"
                            value={birthdate}
                            onChange={(e) => setBirthdate(e.target.value)}
                            readOnly/>
                        <br/><br/>
                        <label htmlFor="created_by">Created By</label>
                        <input
                            style={{width: '250px', marginLeft: '5px', backgroundColor: 'lightgrey'}}
                            id="created_by"
                            name="created_by"
                            autoComplete="off"
                            value= {createdBy}
                            readOnly/>
                        <label htmlFor="created_at" style={{marginLeft: '20px'}}>Created At</label>
                        <input
                            style={{width: '250px', marginLeft: '5px', backgroundColor: 'lightgrey'}}
                            id="created_at"
                            name="created_at"
                            autoComplete="off"
                            value={createdAt}
                            readOnly/>
                        <br/><br/>
                        <label htmlFor="updated_by">Updated By</label>
                        <input
                            style={{width: '250px', marginLeft: '5px', backgroundColor: 'lightgrey'}}
                            id="updated_by"
                            name="updated_by"
                            autoComplete="off"
                            value={updatedBy}
                            readOnly/>
                        <label htmlFor="updated_at" style={{marginLeft: '20px'}}>Updated At</label>
                        <input
                            style={{width: '250px', marginLeft: '5px', backgroundColor: 'lightgrey'}}
                            id="updated_at"
                            name="updated_at"
                            autoComplete="off"
                            value={updatedAt}
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
                <Modal.Body>Are you sure you want to update this record?</Modal.Body>
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
            <UpdatePage/>
        </React.Fragment>
    )
}

export default App;