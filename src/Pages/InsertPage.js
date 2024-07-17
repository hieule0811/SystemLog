import React, {useState} from 'react';
import Sidebar from '../Components/Sidebar.js';
import styles from '../Styles/InsertPage.module.scss';
import {LuBellRing} from "react-icons/lu";
import {RxAvatar} from "react-icons/rx";
import {Menu, MenuItem} from "@mui/material";
import {Link} from "react-router-dom";
import {FiLogOut} from "react-icons/fi";
export const InsertPage = () => {
    const [show, setShow] = useState(false);
    const [filters, setFilters] = useState([]);

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
    return (
        <div className={styles.clientContainer}>
            <div className={styles.clientTop}>
                <hr></hr>
                <div className={styles.textTitle}>
                    Clients > New
                </div>
                <div className={styles.test1}>
                    <ul className={styles.clientList}>
                        <li><LuBellRing/></li>
                        <li>
                            <div className={styles.clientAva} onClick={handleClick}>
                                <div className={styles.clientAva1}>TrungHieu</div>
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
                <form className="newClientForm">
                    <div className="inputGroup">
                        <input
                            style={{width: '250px'}}
                            id="code"
                            name="code"
                            autoComplete="off"
                            placeholder="Code*"
                            required/>
                        <input
                            style={{width: '500px', marginLeft: '20px'}}
                            id="name"
                            name="name"
                            autoComplete="off"
                            placeholder="Name*"
                            required/>
                        <br/><br/>
                        <input
                            style={{width: '500px'}}
                            type="email"
                            id="email"
                            name="email"
                            autoComplete="off"
                            placeholder="Email"/>
                        <input
                            style={{width: '250px', marginLeft: '20px'}}
                            id="country"
                            name="country"
                            autoComplete="off"
                            placeholder="Country"/>
                        <input
                            style={{width: '250px', marginLeft: '20px'}}
                            id="city"
                            name="city"
                            autoComplete="off"
                            placeholder="City"/>
                        <br/><br/>
                        <input
                            style={{width: '375px'}}
                            id="unloco"
                            name="unloco"
                            autoComplete="off"
                            placeholder="Unloco"/>
                        <input
                            style={{width: '250px', marginLeft: '20px'}}
                            id="suburb"
                            name="suburb"
                            autoComplete="off"
                            placeholder="Suburb"/>
                        <input
                            style={{width: '250px', marginLeft: '20px'}}
                            id="state"
                            name="state"
                            autoComplete="off"
                            placeholder="State"/>
                        <br/><br/>
                        <input
                            style={{width: '600px'}}
                            id="officeAddress"
                            name="officeAddress"
                            autoComplete="off"
                            placeholder="Office Address"/>
                        <input
                            style={{width: '375px', marginLeft: '20px'}}
                            id="postalCode"
                            name="postalCode"
                            autoComplete="off"
                            placeholder="Postal Code"/>
                        <br/><br/>
                        <input
                            style={{width: '250px'}}
                            id="createdBy"
                            name="createdBy"
                            autoComplete="off"
                            placeholder="Created By"/>
                        <input
                            style={{width: '250px', marginLeft: '20px'}}
                            id="status"
                            name="status"
                            autoComplete="off"
                            placeholder="Status"/>
                        <br/><br/>
                        <button type="submit" className="btn btn-primary" style={{marginBottom: '10px'}}>
                            SAVE
                        </button>
                    </div>
                </form>
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
