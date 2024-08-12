import React, {useState,useEffect} from 'react';
import Sidebar from '../Components/Sidebar.js';
import styles from '../Styles/JobContainerUpdatePage.module.scss';
import {RxAvatar} from "react-icons/rx";
import {Menu, MenuItem} from "@mui/material";
import {Link, useParams} from "react-router-dom";
import {FiLogOut} from "react-icons/fi";
import { Modal, Button } from 'react-bootstrap';
import { BiSolidBellRing } from "react-icons/bi";
import { IoIosArrowRoundBack } from "react-icons/io";
export const JobContainerUpdatePage = () => {
    const { username } = useParams();
    const [jobContainer, setJobContainer] = useState([]);
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
    const [updatedBy, setUpdatedBy] = useState('');
    const [updatedAt, setUpdateAt] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [createdAt, setCreatedAt] = useState('');
    const [modalShow, setModalShow] = useState(false);
    const [tentk, setTentk] = useState('');
    const hasDataChanged = () => {
        return (
            status !== jobContainer.status ||
            description !== jobContainer.description ||
            tare !== jobContainer.tare ||
            net !== jobContainer.net ||
            grossWeight !== jobContainer.grossWeight ||
            isEmpty !== jobContainer.isEmpty ||
            isFull !== jobContainer.isFull ||
            containerInvoiceStatus !== jobContainer.containerInvoiceStatus ||
            isOverweightLevel1 !== jobContainer.isOverweightLevel1 ||
            isOverweightLevel2 !== jobContainer.isOverweightLevel2 ||
            level1Kg !== jobContainer.level1Kg ||
            level2Kg !== jobContainer.level2Kg ||
            titleLevel1 !== jobContainer.titleLevel1 ||
            titleLevel2 !== jobContainer.titleLevel2 ||
            standardKg !== jobContainer.standardKg
        );
    };

    useEffect(() => {
        const storedTentk = localStorage.getItem('tentk');
        if (storedTentk) {
            setTentk(storedTentk);
        }
        const fetchJobContainer = async () => {
            try {
                const response = await fetch(`http://localhost:8080/job_container/container_number?container_number=${username}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                const data = await response.json();
                setJobContainer(data);
                setStatus(data.status);
                setDescription(data.description);
                setTare(data.tare);
                setNet(data.net);
                setGrossWeight(data.grossWeight);
                setIsEmpty(data.isEmpty);
                setIsFull(data.isFull);
                setContainerInvoiceStatus(data.containerInvoiceStatus);
                setIsOverweightLevel1(data.isOverweightLevel1);
                setIsOverweightLevel2(data.isOverweightLevel2);
                setLevel1Kg(data.level1Kg);
                setLevel2Kg(data.level2Kg);
                setStandardKg(data.standardKg);
                setTitleLevel1(data.titleLevel1);
                setTitleLevel2(data.titleLevel2);
                setUpdatedBy(data.updatedBy);
                if(data.updatedAt !== null) setUpdateAt(formatDate(data.updatedAt));
                setCreatedBy(data.createdBy);
                setCreatedAt(formatDate(data.createdAt));
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchJobContainer();
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
        // console.log(hasDataChanged());
        if (!hasDataChanged()) {
            alert("No changes have been made");
            return;
        }
        setModalShow(true);
    };
    const handleModalClose = () => setModalShow(false);
    const handleConfirm= (e) => {
        e.preventDefault();
        setModalShow(false);
        const updateJobContainer = {
            status: status === true,
            description,
            tare,
            net,
            grossWeight,
            isFull,
            isEmpty,
            containerInvoiceStatus,
            isOverweightLevel1,
            isOverweightLevel2,
            level1Kg,
            level2Kg,
            titleLevel1,
            titleLevel2,
            standardKg,
            updatedBy: tentk
        };

        fetch(`http://localhost:8080/job_container/container_number/${username}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateJobContainer),
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
                    Job Containers {">"} {username}
                </div>
                <div className={styles.test1}>
                    <ul className={styles.jobContainerList}>
                        <li><BiSolidBellRing style = {{marginTop:'5px',marginRight:'-15px'}}/></li>
                        <li>
                            <div className={styles.jobContainerAva} onClick={handleClick}>
                                <div className={styles.jobContainerAva1}>{tentk.toUpperCase()}</div>
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
                <h5 style = {{marginLeft: '-20px'}}>DETAILS</h5>
                <form className="newJobContainerForm" onSubmit={handleSubmit}>
                    <div className={styles.inputGroups}>
                        <div className={styles.inputGroup} style={{width: '250px', marginTop: '30px'}}>
                            <select
                                style={{width: '250px', height: '40px'}}
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
                        <div className={styles.inputGroup} style={{width: '440px'}}>
                            <input style={{width: '440px'}}
                                   id="gross_weight"
                                   name="gross_weight"
                                   autoComplete="off"
                                   value={grossWeight}
                                   onChange={(e) => setGrossWeight(e.target.value)}
                                   required/>
                            <label htmlFor="gross_weight">Gross Weight*</label>
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
                        <div className={styles.inputGroup} style={{width: '280px', marginTop: '-10px'}}>
                            <input style={{width: '280px'}}
                                   id="tare"
                                   name="tare"
                                   autoComplete="off"
                                   value={tare}
                                   onChange={(e) => setTare(e.target.value)}
                                   required/>
                            <label htmlFor="tare">Tare*</label>
                        </div>
                        <div className={styles.inputGroup} style={{width: '280px', marginTop: '-10px'}}>
                            <input style={{width: '280px'}}
                                   id="net"
                                   name="net"
                                   autoComplete="off"
                                   value={net}
                                   onChange={(e) => setNet(e.target.value)}
                                   required/>
                            <label htmlFor="net">Net*</label>
                        </div>
                        <div className={styles.inputGroup} style={{width: '280px', marginTop: '0px'}}>
                            <select
                                style={{width: '280px', height: '40px'}}
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
                                style={{width: '280px', height: '40px'}}
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
                        <div className={styles.inputGroup} style={{width: '570px', marginTop: '-10px'}}>
                            <input style={{width: '570px'}}
                                   id="title_level1"
                                   name="title_level1"
                                   autoComplete="off"
                                   value={titleLevel1}
                                   onChange={(e) => setTitleLevel1(e.target.value)}
                                   required/>
                            <label htmlFor="title_level1">Title Level 1*</label>
                        </div>
                        <div className={styles.inputGroup} style={{width: '570px', marginTop: '-10px'}}>
                            <input style={{width: '570px'}}
                                   id="title_level2"
                                   name="title_level2"
                                   autoComplete="off"
                                   value={titleLevel2}
                                   onChange={(e) => setTitleLevel2(e.target.value)}
                                   required/>
                            <label htmlFor="title_level2">Title Level 2*</label>
                        </div>
                        <div className={styles.inputGroup} style={{width: '377px', marginTop: '-10px'}}>
                            <input style={{width: '377px'}}
                                   id="level1_kg"
                                   name="level1_kg"
                                   autoComplete="off"
                                   value={level1Kg}
                                   onChange={(e) => setLevel1Kg(e.target.value)}
                                   required/>
                            <label htmlFor="level1_kg">Level 1 Kg*</label>
                        </div>
                        <div className={styles.inputGroup} style={{width: '377px', marginTop: '-10px'}}>
                            <input style={{width: '377px'}}
                                   id="level2_kg"
                                   name="level2_kg"
                                   autoComplete="off"
                                   value={level2Kg}
                                   onChange={(e) => setLevel2Kg(e.target.value)}
                                   required/>
                            <label htmlFor="level2_kg">Level 2 Kg*</label>
                        </div>
                        <div className={styles.inputGroup} style={{width: '376px', marginTop: '-10px'}}>
                            <input style={{width: '376px'}}
                                   id="standard_kg"
                                   name="standard_kg"
                                   autoComplete="off"
                                   value={standardKg}
                                   onChange={(e) => setStandardKg(e.target.value)}
                                   required/>
                            <label htmlFor="standard_kg">Standard Kg*</label>
                        </div>
                        <div className={styles.inputGroup} style={{width: '450px', marginTop: '-10px'}}>
                            <input style={{width: '450px'}}
                                   id="container_invoice_status"
                                   name="container_invoice_status"
                                   autoComplete="off"
                                   value={containerInvoiceStatus}
                                   onChange={(e) => setContainerInvoiceStatus(e.target.value)}
                                   required/>
                            <label htmlFor="container_invoice_status">Container Invoice Status*</label>
                        </div>
                        <div className={styles.inputGroup} style={{width: '340px', marginTop: '0px'}}>
                            <select
                                style={{width: '340px', height: '40px'}}
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
                        <div className={styles.inputGroup} style={{width: '340px', marginTop: '0px'}}>
                            <select
                                style={{width: '340px', height: '40px'}}
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
                    <button type="submit" className="btn btn-primary" style={{marginLeft: '-20px'}}>
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
            <JobContainerUpdatePage/>
        </React.Fragment>
    )
}

export default App;