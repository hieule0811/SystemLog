import React, { useState, useEffect } from 'react';
import Sidebar from '../Components/Sidebar.js';
import styles from '../Styles/JobContainerInsertPage.module.scss';
import { RxAvatar } from "react-icons/rx";
import { Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { Modal, Button } from 'react-bootstrap';
import { parse } from 'date-fns';
import { IoIosArrowRoundBack } from "react-icons/io";
import { BiSolidBellRing } from "react-icons/bi";
export const JobContainerInsertPage = () => {
    const [show, setShow] = useState(false);
    const [filters, setFilters] = useState([]);
    const [status, setStatus] = useState('');
    const [description, setDescription] = useState('');
    const [tare, setTare] = useState('');
    const [net, setNet] = useState('');
    const [grossWeight, setGrossWeight] = useState('');
    const [isEmpty, setIsEmpty] = useState('');
    const [isFull, setIsFull] = useState('');
    const [containerInvoiceStatus, setContainerInvoiceStatus] = useState('');
    const [isOverweightLevel1, setIsOverweightLevel1] = useState('');
    const [isOverweightLevel2, setIsOverweightLevel2] = useState('');
    const [level1Kg, setLevel1Kg] = useState('');
    const [level2Kg, setLevel2Kg] = useState('');
    const [titleLevel1, setTitleLevel1] = useState('');
    const [titleLevel2, setTitleLevel2] = useState('');
    const [standardKg, setStandardKg] = useState('');
    const [modalShow, setModalShow] = useState(false);
    const [tentk, setTentk] = useState('');
    const [tareError, setTareError] = useState('');
    const [netError, setNetError] = useState('');
    const [grossWeightError, setGrossWeightError] = useState('');
    const [level1KgError, setLevel1KgError] = useState('');
    const [level2KgError, setLevel2KgError] = useState('');
    const [standardKgError, setStandardKgError] = useState('');
    useEffect(() => {
        const storedTentk = localStorage.getItem('tentk');
        if (storedTentk) {
            setTentk(storedTentk);
        }
    }, []);
    const createdBy = tentk;
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
        if(tareError || netError || grossWeightError || level1KgError || level2KgError || standardKgError) return;
        setModalShow(true); // Hiển thị modal khi nhấn SAVE
    };
    const handleTareChange = (e) => {
        const newTare = e.target.value;
        setTare(newTare);

        if (!/^\d*\.?\d*$/.test(newTare)) {
            setTareError('Tare code must be a number');
        } else {
            setTareError('');
        }
    };

    const handleNetChange = (e) => {
        const newNet = e.target.value;
        setNet(newNet);

        if (!/^\d*\.?\d*$/.test(newNet)) {
            setNetError('Net code must be a number');
        } else {
            setNetError('');
        }
    };

    const handleLevel1KgChange = (e) => {
        const newLevel1Kg = e.target.value;
        setLevel1Kg(newLevel1Kg);

        if (!/^\d*\.?\d*$/.test(newLevel1Kg)) {
            setLevel1KgError('Level1 Kg code must be a number');
        } else {
            setLevel1KgError('');
        }
    };

    const handleLevel2KgChange = (e) => {
        const newLevel2Kg = e.target.value;
        setLevel2Kg(newLevel2Kg);

        if (!/^\d*\.?\d*$/.test(newLevel2Kg)) {
            setLevel2KgError('Level2 Kg code must be a number');
        } else {
            setLevel2KgError('');
        }
    };

    const handleGrossWeightChange = (e) => {
        const newGrossWeight = e.target.value;
        setGrossWeight(newGrossWeight);

        if (!/^\d*\.?\d*$/.test(newGrossWeight)) {
            setGrossWeightError('Gross Weight code must be a number');
        } else {
            setGrossWeightError('');
        }
    };

    const handleStandardKgChange = (e) => {
        const newStandardKg = e.target.value;
        setStandardKg(newStandardKg);

        if (!/^\d*\.?\d*$/.test(newStandardKg)) {
            setStandardKgError('Standard Kg code must be a number');
        } else {
            setStandardKgError('');
        }
    };
    const handleModalClose = () => setModalShow(false);
    const handleConfirm = (e) => {
        e.preventDefault();
        setModalShow(false);
        setStatus('');
        setDescription('');
        setTare('');
        setNet('');
        setGrossWeight('');
        setIsEmpty('');
        setIsFull('');
        setContainerInvoiceStatus('');
        setIsOverweightLevel1('');
        setIsOverweightLevel2('');
        setLevel1Kg('');
        setLevel2Kg('');
        setTitleLevel1('');
        setTitleLevel2('');
        setStandardKg('');
        const newJobContainer = {
            createdBy,
            status: status === 'Inactive' ? false : true,
            description,
            tare: parseFloat(tare).toFixed(2),
            net: parseFloat(net).toFixed(2),
            grossWeight: parseFloat(grossWeight).toFixed(2),
            isEmpty: isEmpty === 'Not Empty' ? false : true,
            isFull: isFull === 'Not Full' ? false : true,
            containerInvoiceStatus,
            isOverweightLevel2: isOverweightLevel2 === 'Level 2 is not Overweight' ? false : true,
            isOverweightLevel1: isOverweightLevel1 === 'Level 1 is not Overweight' ? false : true,
            level1Kg: parseFloat(level1Kg).toFixed(2),
            level2Kg: parseFloat(level2Kg).toFixed(2),
            titleLevel1,
            titleLevel2,
            standardKg: parseFloat(standardKg).toFixed(2),
        };

        fetch('http://localhost:8080/job_container', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newJobContainer),
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
        return avatarMap[tentk] || '/avatar4.jpg'; 
      };
    return (
        <div className={styles.jobContainerContainer}>
            <div className={styles.jobContainerTop}>
                <hr></hr>
                <div className={styles.textTitle}>
                    <Link to ="/jobcontainer" style = {{ color: 'inherit' }}>
                        <IoIosArrowRoundBack style = {{ fontSize:'30px',marginRight:'5px' }} className = {styles.arrowIcon}/>
                    </Link>
                    Job Containers {">"} New
                </div>
                <div className={styles.test1}>
                    <ul className={styles.jobContainerList}>
                        <li><BiSolidBellRing style = {{marginTop:'5px',marginRight:'-15px'}}/></li>
                        <li>
                            <div className={styles.jobContainerAva} onClick={handleClick}>
                                <div className={styles.jobContainerAva1}>{tentk.toUpperCase()}</div>
                                {/* <div className={styles.jobContainerAva2}><RxAvatar/></div> */}
                                <img src = {getAvatarByTentk(tentk)} alt="avatar" className={styles.jobContainerAva2} />
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
            <div className={styles.newJobContainer}>
                <h5 style = {{marginLeft: '-20px'}}>INFORMATION</h5>
                <form className="newJobContainerForm" onSubmit={handleSubmit}>
                    <div className={styles.inputGroups}>
                        <div className={styles.inputGroup} style={{width: '400px', marginTop: '30px'}}>
                            <select
                                style={{width: '400px', height: '40px',color: status? 'black' : '#008031'}}
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
                        <div className={styles.inputGroup} style={{width: '440px',position:'relative'}}>
                            <input style={{width: '500px'}}
                                   id="gross_weight"
                                   name="gross_weight"
                                   autoComplete="off"
                                   value={grossWeight}
                                   onChange={handleGrossWeightChange}
                                   required/>
                            <label htmlFor="gross_weight">Gross Weight*</label>
                            {grossWeightError && <div style = {{ color:'red',position:'absolute',top:'48px' }}>{grossWeightError}</div>}
                        </div>
                        <div className={styles.inputGroup} style={{width: '1150px', marginTop: '-10px'}}>
                            <input style={{width: '1150px'}}
                                   id="description"
                                   name="description"
                                   autoComplete="off"
                                   value={description}
                                   onChange={(e) => setDescription(e.target.value)}
                                   required/>
                            <label htmlFor="description">Description*</label>
                        </div>
                        <div className={styles.inputGroup} style={{width: '280px', marginTop: '-10px',position:'relative'}}>
                            <input style={{width: '280px'}}
                                   id="tare"
                                   name="tare"
                                   autoComplete="off"
                                   value={tare}
                                   onChange={handleTareChange}
                                   required/>
                            <label htmlFor="tare">Tare*</label>
                            {tareError && <div style = {{ color:'red',position:'absolute',top:'48px' }}>{tareError}</div>}
                        </div>
                        <div className={styles.inputGroup} style={{width: '280px', marginTop: '-10px',position:'relative'}}>
                            <input style={{width: '280px'}}
                                   id="net"
                                   name="net"
                                   autoComplete="off"
                                   value={net}
                                   onChange={handleNetChange}
                                   required/>
                            <label htmlFor="net">Net*</label>
                            {netError && <div style = {{ color:'red',position:'absolute',top:'48px' }}>{netError}</div>}
                        </div>
                        <div className={styles.inputGroup} style={{width: '280px', marginTop: '0px'}}>
                            <select
                                style={{width: '280px', height: '40px', color: isEmpty? 'black' : '#008031'}}
                                id="is_empty"
                                name="is_empty"
                                value={isEmpty}
                                onChange={(e) => setIsEmpty(e.target.value)}
                                autoComplete="off">
                                <option value="" disabled selected hidden>Is Empty</option>
                                <option value="true">Empty</option>
                                <option value="false">Not Empty</option>
                            </select>
                        </div>
                        <div className={styles.inputGroup} style={{width: '280px', marginTop: '0px'}}>
                            <select
                                style={{width: '280px', height: '40px', color: isFull? 'black' : '#008031'}}
                                id="is_full"
                                name="is_full"
                                value={isFull}
                                onChange={(e) => setIsFull(e.target.value)}
                                autoComplete="off">
                                <option value="" disabled selected hidden>Is Full</option>
                                <option value="true">Full</option>
                                <option value="false">Not Full</option>
                            </select>
                        </div>
                        <div className={styles.inputGroup} style={{width: '570px', marginTop: '0px'}}>
                            <input style={{width: '570px'}}
                                   id="title_level1"
                                   name="title_level1"
                                   autoComplete="off"
                                   value={titleLevel1}
                                   onChange={(e) => setTitleLevel1(e.target.value)}
                                   required/>
                            <label htmlFor="title_level1">Title Level 1*</label>
                        </div>
                        <div className={styles.inputGroup} style={{width: '570px', marginTop: '0px'}}>
                            <input style={{width: '570px'}}
                                   id="title_level2"
                                   name="title_level2"
                                   autoComplete="off"
                                   value={titleLevel2}
                                   onChange={(e) => setTitleLevel2(e.target.value)}
                                   required/>
                            <label htmlFor="title_level2">Title Level 2*</label>
                        </div>
                        <div className={styles.inputGroup} style={{width: '377px', marginTop: '-10px',position:'relative'}}>
                            <input style={{width: '377px'}}
                                   id="level1_kg"
                                   name="level1_kg"
                                   autoComplete="off"
                                   value={level1Kg}
                                   onChange={handleLevel1KgChange}
                                   required/>
                            <label htmlFor="level1_kg">Level 1 Kg*</label>
                            {level1KgError && <div style = {{ color:'red',position:'absolute',top:'48px' }}>{level1KgError}</div>}
                        </div>
                        <div className={styles.inputGroup} style={{width: '377px', marginTop: '-10px',position:'relative'}}>
                            <input style={{width: '377px'}}
                                   id="level2_kg"
                                   name="level2_kg"
                                   autoComplete="off"
                                   value={level2Kg}
                                   onChange={handleLevel2KgChange}
                                   required/>
                            <label htmlFor="level2_kg">Level 2 Kg*</label>
                            {level2KgError && <div style = {{ color:'red',position:'absolute',top:'48px' }}>{level2KgError}</div>}
                        </div>
                        <div className={styles.inputGroup} style={{width: '376px', marginTop: '-10px',position:'relative'}}>
                            <input style={{width: '376px'}}
                                   id="standard_kg"
                                   name="standard_kg"
                                   autoComplete="off"
                                   value={standardKg}
                                   onChange={handleStandardKgChange}
                                   required/>
                            <label htmlFor="standard_kg">Standard Kg*</label>
                            {standardKgError && <div style = {{ color:'red',position:'absolute',top:'48px' }}>{standardKgError}</div>}
                        </div>
                        <div className={styles.inputGroup} style={{width: '450px', marginTop: '0px'}}>
                            <input style={{width: '450px'}}
                                   id="container_invoice_status"
                                   name="container_invoice_status"
                                   autoComplete="off"
                                   value={containerInvoiceStatus}
                                   onChange={(e) => setContainerInvoiceStatus(e.target.value)}
                                   required/>
                            <label htmlFor="container_invoice_status">Container Invoice Status*</label>
                        </div>
                        <div className={styles.inputGroup} style={{width: '340px', marginTop: '10px'}}>
                            <select
                                style={{width: '340px', height: '40px',color: isOverweightLevel1? 'black' : '#008031'}}
                                id="is_overweight_level_1"
                                name="is_overweight_level_1"
                                value={isOverweightLevel1}
                                onChange={(e) => setIsOverweightLevel1(e.target.value)}
                                autoComplete="off">
                                <option value="" disabled selected hidden>Is Level 1 Overweight</option>
                                <option value="true">Level 1 is Overweight</option>
                                <option value="false">Level 1 is not Overweight</option>
                            </select>
                        </div>
                        <div className={styles.inputGroup} style={{width: '340px', marginTop: '10px'}}>
                            <select
                                style={{width: '340px', height: '40px', color: isOverweightLevel2? 'black' : '#008031'}}
                                id="is_overweight_level_2"
                                name="is_overweight_level_2"
                                value={isOverweightLevel2}
                                onChange={(e) => setIsOverweightLevel2(e.target.value)}
                                autoComplete="off">
                                <option value="" disabled selected hidden>Is Level 2 Overweight</option>
                                <option value="true">Level 2 is Overweight</option>
                                <option value="false">Level 2 is not Overweight</option>
                            </select>
                        </div>
                    </div>
                    <label htmlFor="created_by" style={{marginLeft: '-20px', marginTop: '-10px'}}>Created By</label>
                    <input
                        style={{
                            width: '340px',
                            marginLeft: '5px',
                            height: '40px',
                            backgroundColor: 'lightgrey',
                            marginTop: '0px'
                        }}
                        id="created_by"
                        name="created_by"
                        autoComplete="off"
                        value={tentk}
                        readOnly/>
                    <br/><br/>
                    <button type="submit" className="btn btn-primary" style={{marginLeft: '-20px'}}>
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
            <JobContainerInsertPage/>
        </React.Fragment>
    )
}

export default App;
