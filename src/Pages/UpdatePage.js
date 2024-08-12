import React, {useState,useEffect} from 'react';
import Sidebar from '../Components/Sidebar.js';
import styles from '../Styles/UpdatePage.module.scss';
import {RxAvatar} from "react-icons/rx";
import {Menu, MenuItem} from "@mui/material";
import {Link, useParams} from "react-router-dom";
import {FiLogOut} from "react-icons/fi";
import { Modal, Button } from 'react-bootstrap';
import { BiSolidBellRing } from "react-icons/bi";
import { IoIosArrowRoundBack } from "react-icons/io";
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
                    Clients {">"} {username}
                </div>
                <div className={styles.test1}>
                    <ul className={styles.clientList}>
                        <li><BiSolidBellRing style = {{marginTop:'5px',marginRight:'-15px'}}/></li>
                        <li>
                            <div className={styles.clientAva} onClick={handleClick}>
                                <div className={styles.clientAva1}>{tentk.toUpperCase()}</div>
                                <img src = {getAvatarByTentk(tentk)} alt = "avatar" className = {styles.clientAva2}/>
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
                <h5 style = {{marginLeft: '-20px'}}>DETAILS</h5>
                <form className="newClientForm" onSubmit = {handleSubmit}>
                    <div className={styles.inputGroups}>
                        <div className={styles.inputGroup} style={{width: '440px'}}>
                            <input style={{width: '440px'}}
                                id="name"
                                name="name"
                                autoComplete="off"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required/>
                            <label htmlFor="name">Name</label>
                        </div>
                        <div className={styles.inputGroup} style={{width: '250px'}}>
                            <input style={{width: '250px'}}
                                id="birthdate"
                                name="birthdate"
                                type="date"
                                value={birthdate}
                                onChange={(e) => setBirthdate(e.target.value)}
                                required/>
                            <label htmlFor="birthdate">Birthdate</label>
                        </div>
                        <div className={styles.inputGroup} style={{width: '440px'}}>
                            <input style={{width: '440px'}}
                                id="country"
                                name="country"
                                autoComplete="off"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                required/>
                            <label htmlFor="country">Country</label>
                        </div>
                        <div className={styles.inputGroup} style={{width: '440px', marginTop: '-10px'}}>
                            <input style={{width: '440px'}}
                                id="city"
                                name="city"
                                autoComplete="off"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                required/>
                            <label htmlFor="city" style={{marginTop: '0px'}}>City</label>
                        </div>
                        <div className={styles.inputGroup} style={{width: '250px', marginTop: '-10px'}}>
                            <input style={{width: '250px'}}
                                id="unloco"
                                name="unloco"
                                value={unloco}
                                onChange={(e) => setUnloco(e.target.value)}
                                required/>
                            <label htmlFor="unloco" style={{marginTop: '0px'}}>UNLOCO</label>
                        </div>
                        <div className={styles.inputGroup} style={{width: '440px', marginTop: '-10px'}}>
                            <input style={{width: '440px'}}
                                id="suburb"
                                name="suburb"
                                autoComplete="off"
                                value={suburb}
                                onChange={(e) => setSuburb(e.target.value)}
                                required/>
                            <label htmlFor="suburb">Suburb</label>
                        </div>
                        <div className={styles.inputGroup} style={{width: '1150px', marginTop: '-10px'}}>
                            <input style={{width: '1150px'}}
                                id="office_address"
                                name="office_address"
                                autoComplete="off"
                                value={officeAddress}
                                onChange={(e) => setOfficeAddress(e.target.value)}
                                required/>
                            <label htmlFor="office_address" style={{marginTop: '0px'}}>Office Address</label>
                        </div>
                        <div className={styles.inputGroup} style={{width: '440px', marginTop: '-10px'}}>
                            <input style={{width: '440px'}}
                                id="state"
                                name="state"
                                autoComplete="off"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                required/>
                            <label htmlFor="state">State</label>
                        </div>
                        <div className={styles.inputGroup} style={{width: '250px', marginTop: '-10px'}}>
                            <input style={{width: '250px'}}
                                id="postal_code"
                                name="postal_code"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                                required/>
                            <label htmlFor="postal_code">Postal Code</label>
                        </div>
                        <div className={styles.inputGroup} style={{width: '440px', marginTop: '-10px'}}>
                            <input style={{width: '440px'}}
                                id="telephone"
                                name="telephone"
                                autoComplete="off"
                                value={telephone}
                                onChange={(e) => setTelephone(e.target.value)}
                                required/>
                            <label htmlFor="telephone">Telephone</label>
                        </div>
                        <div className={styles.inputGroup} style={{width: '700px', marginTop: '-10px'}}>
                            <input style={{width: '700px'}}
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required/>
                            <label htmlFor="email">Email</label>
                        </div>
                        <div className={styles.inputGroup} style={{width: '440px', marginTop: '0px'}}>
                            <select
                                style={{width: '440px', height: '40px'}}
                                id="status"
                                name="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                autoComplete="off">
                                <option value="" disabled selected hidden>Status</option>
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </div>
                        <div className={styles.inputGroup} style={{width: '280px', marginTop: '-10px'}}>
                            <input style={{width: '280px', backgroundColor: "lightgrey"}}
                                id="created_by"
                                name="created_by"
                                autoComplete="off"
                                value={createdBy}
                                readOnly/>
                            <label htmlFor="created_by">Created By</label>
                        </div>
                        <div className={styles.inputGroup} style={{width: '280px', marginTop: '-10px'}}>
                            <input style={{width: '280px', backgroundColor: "lightgrey"}}
                                id="created_at"
                                name="created_at"
                                autoComplete="off"
                                value={createdAt}
                                readOnly/>
                            <label htmlFor="created_at">Created At</label>
                        </div>
                        <div className={styles.inputGroup} style={{width: '280px', marginTop: '-10px'}}>
                            <input style={{width: '280px', backgroundColor: "lightgrey"}}
                                id="updated_by"
                                name="updated_by"
                                autoComplete="off"
                                value={updatedBy}
                                readOnly/>
                            <label htmlFor="updated_by">Updated By</label>
                        </div>
                        <div className={styles.inputGroup} style={{width: '280px', marginTop: '-10px'}}>
                            <input style={{width: '280px', backgroundColor: "lightgrey"}}
                                id="updated_at"
                                name="updated_at"
                                autoComplete="off"
                                value={updatedAt}
                                readOnly/>
                            <label htmlFor="updated_at">Updated At</label>
                        </div>
                    </div>

                    <br/><br/>
                    <button type="submit" className="btn btn-primary" style={{marginLeft: '-20px', marginTop: '-100px'}}>
                        SAVE
                    </button>
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