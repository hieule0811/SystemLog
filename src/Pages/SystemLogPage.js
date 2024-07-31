import React, {useState,useEffect} from 'react';
import Sidebar from '../Components/Sidebar.js';
import styles from '../Styles/SystemLogPage.module.scss';
import { Form, FormControl, Button, InputGroup,Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CiFilter } from "react-icons/ci";
import { LuBellRing } from "react-icons/lu";
import { RxAvatar } from "react-icons/rx";
import { FaTrash } from 'react-icons/fa';
import Table from '../Components/Table.js';
import {headerData1, bodyData1} from '../Common/utils.js';
import { Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import { RiDeleteBin6Line } from "react-icons/ri";
import moment from 'moment';
import { FiColumns } from "react-icons/fi";
import { FaTimes } from 'react-icons/fa';
const operatorOptions = {
  createdBy : ["contains","starts with","ends with"],
  eventSource : ["contains","starts with","ends with"],
  sourceCode : ["contains","starts with","ends with"],
  eventType : ["contains","starts with","ends with"],
  changedData : ["contains","starts with","ends with"],
  dataOld : ["contains","starts with","ends with"],
  dataNew: ["contains","starts with","ends with"],
};

const ModalComponent = ({ show, handleClose, filters, handleFilterChange, addFilter, removeFilter, handleSubmit }) => (
  <Modal show={show} onHide={handleClose} backdrop={false}>
    <Modal.Header closeButton>
      <Modal.Title>Filter</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {filters.map((filter, index) => (
        <InputGroup className="mb-3" key={index}>
          <FormControl
            as="select"
            value={filter.column}
            onChange={e => handleFilterChange(index, 'column', e.target.value)}
          >
            <option value="">Column</option>
            <option value="createdBy">Created By</option>
            <option value="eventSource">Event Source</option>
            <option value="sourceCode">Source Code</option>
            <option value="eventType">Event Type </option>
            <option value="changedData">Changed Data</option>
            <option value="dataOld">Old Row Data</option>
            <option value="dataNew">New Row Data</option>
          </FormControl>
          <FormControl
            as="select"
            value={filter.operator}
            onChange={e => handleFilterChange(index, 'operator', e.target.value)}
            disabled={!filter.column}
          >
            <option value="">Operator</option>
            {filter.column && operatorOptions[filter.column].map((op, i) => (
              <option key={i} value={op}>{op}</option>
            ))}
          </FormControl>
          <FormControl
            value={filter.data}
            placeholder="Data"
            onChange={e => handleFilterChange(index, 'data', e.target.value)}
          />
          <Button variant="outline-danger" onClick={() => removeFilter(index)}>
            <FaTrash />
          </Button>
        </InputGroup>
      ))}
      <Button variant="outline-primary" onClick={addFilter}>
        <i className="fa fa-plus" aria-hidden="true"></i> ADD FILTER
      </Button>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="danger" onClick={handleClose}>
        CLEAR
      </Button>
      <Button variant="success" onClick={handleSubmit}>
        SUBMIT
      </Button>
    </Modal.Footer>
  </Modal>

);
const CustomModalFilter = ({ show, handleClose, handleFilter }) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const onFilter = () => {
    handleFilter(startTime, endTime);
    setStartTime('');
    setEndTime('');
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}
      backdrop={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Filter</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formStartTime">
            <Form.Label>Start Time</Form.Label>
            <Form.Control
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formEndTime" className="mt-3">
            <Form.Label>End Time</Form.Label>
            <Form.Control
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="danger" onClick={onFilter}>
          Filter
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
const CustomModalDelete = ({ show, handleClose, handleDelete }) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [deleteAll, setDeleteAll] = useState(false);
  const onDelete= () => {
    handleDelete(startTime, endTime,deleteAll);
    setStartTime('');
    setEndTime('');
    setDeleteAll(false);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}
      backdrop={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formStartTime">
            <Form.Label>Start Time</Form.Label>
            <Form.Control
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formEndTime" className="mt-3">
            <Form.Label>End Time</Form.Label>
            <Form.Control
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer >
        <Form.Check
          style={{fontSize: '20px' }}
          type="checkbox"
          label="All"
          checked={deleteAll}
          onChange={(e) => setDeleteAll(e.target.checked)}
        />
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="danger" onClick={onDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
const SystemLogPage = () =>{
  const columns = headerData1;
  const [bodyData1,setBodyData1] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterData, setFilterData] = useState([]);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch('http://localhost:8080/logs');
  //       const data = await response.json();
  //       const formattedData = data.map(item => ({
  //         event_time: moment(item.eventTime).format('DD/MM/YYYY HH:mm'),
  //         created_by: item.createdBy,
  //         event_source: item.eventSource,
  //         source_code: item.sourceCode,
  //         event_type: item.eventType,
  //         changed_data: item.changedData,
  //         old_row_data: item.dataOld,
  //         new_row_data: item.dataNew,
  //       }));
  //       setBodyData1(formattedData);
  //       setFilterData(formattedData);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8080/logs');
      const data = await response.json();
      const formattedData = data.map(item => ({
        event_time: moment(item.eventTime).format('DD/MM/YYYY HH:mm'),
        created_by: item.createdBy,
        event_source: item.eventSource,
        source_code: item.sourceCode,
        event_type: item.eventType,
        changed_data: item.changedData,
        old_row_data: item.dataOld,
        new_row_data: item.dataNew,
      }));
      setBodyData1(formattedData);
      setFilterData(formattedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const [tentk, setTentk] = useState('');
  useEffect(() => {
    const storedTentk = localStorage.getItem('tentk');
    if (storedTentk) {
      setTentk(storedTentk);
    }
    if (searchQuery.trim() !== '') {
      const fetchData = async () => {
        try {
          const response = await fetch(`http://localhost:8080/logs/search?keyword=${searchQuery}`);
          const data = await response.json();
          const formattedData = data.map(item => ({
            event_time: moment(item.eventTime).format('DD/MM/YYYY HH:mm'),
            created_by: item.createdBy,
            event_source: item.eventSource,
            source_code: item.sourceCode,
            event_type: item.eventType,
            changed_data: item.changedData,
            old_row_data: item.dataOld,
            new_row_data: item.dataNew,
          }));
          setFilterData(formattedData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    } else {
      setFilterData(bodyData1);
    }
  }, [searchQuery, bodyData1]);
  const data = filterData;
  const [show, setShow] = useState(false);
  const [filters, setFilters] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [showRemoveFilterButton, setShowRemoveFilterButton] = useState(false);
  const removeFilterHandler = () =>{
    setIsFiltered(false);
    setFilterData(bodyData1);
  }
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
  const handleSubmit = async () => {
    try {
      const response = await fetch (`http://localhost:8080/logs/filter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filters),

      });
      console.log(filters)
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText} - ${errorText}`);
      }
      const data = await response.json();
      console.log(data);
      const formattedData = data.map(item => {
        return {
          event_time: moment(item.eventTime).format('DD/MM/YYYY HH:mm'),
          created_by: item.createdBy,
          event_source: item.eventSource,
          source_code: item.sourceCode,
          event_type: item.eventType,
          changed_data: item.changedData,
          old_row_data: item.dataOld,
          new_row_data: item.dataNew
        };
      });
      setShowRemoveFilterButton(true);
      setFilterData(formattedData);
      handleClose();
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const [showModalFilter, setShowModalFilter] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);

  const handleShowModalFilter = () => setShowModalFilter(true);
  const handleCloseModalFilter = () => setShowModalFilter(false);

  const handleShowModalDelete = () => setShowModalDelete(true);
  const handleCloseModalDelete = () => setShowModalDelete(false);

  const handleFilter = async (startTime, endTime) => {
    try {
      const response = await fetch(`http://localhost:8080/logs/filterByDate?startDate=${startTime}&endDate=${endTime}`);
      const data = await response.json();
      const formattedData = data.map(item => ({
        event_time: moment(item.eventTime).format('DD/MM/YYYY HH:mm'),
        created_by: item.createdBy,
        event_source: item.eventSource,
        source_code: item.sourceCode,
        event_type: item.eventType,
        changed_data: item.changedData,
        old_row_data: item.dataOld,
        new_row_data: item.dataNew,
      }));
      setFilterData(formattedData);
      setIsFiltered(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handleDelete = async (startTime, endTime, deleteAll) => {
    try {
      if (deleteAll) {
        const response = await fetch('http://localhost:8080/logs/deleteAll', {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('Deleted all logs successfully.');
          fetchData();
        } else {
          console.error('Failed to delete all logs.');
        }
      } else {
        const response = await fetch(`http://localhost:8080/logs/deleteByDate?startDate=${startTime}&endDate=${endTime}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('Deleted logs in the specified date range successfully.');
          fetchData();
        } else {
          alert('Failed to delete logs in the specified date range.');
        }
      }
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };
  const handleRemoveFilters = () => {
    setFilterData(bodyData1);
    setFilters([]);
    setShowRemoveFilterButton(false);
  };
  return(
    <div className = {styles.systemlogContainer}>
      <div className = {styles.systemlogTop}>
        <hr></hr>
        <div className = {styles.textTitle}>
          System Logs
        </div>
        {isFiltered && (
            <Button variant="outline-danger" onClick={removeFilterHandler} style={{ marginLeft: '320px', marginTop:'25px',textAlign:'center',justifyContent:'center'}}>
              <FaTimes /> Remove
            </Button>
        )}
        {showRemoveFilterButton && (
          <Button variant="outline-danger" onClick={handleRemoveFilters} style={{ marginLeft: '320px', marginTop:'25px',textAlign:'center',justifyContent:'center'}}>
            <FaTimes /> Remove
          </Button>
        )}
        <div className = {styles.test}>
            <Form className="d-flex justify-content-center align-items-center"
            style = {{ marginTop:'25px' }}
            >
              <InputGroup className="mb-3" style={{ maxWidth: '400px'}}>
                <FormControl
                  size="md"
                  type="text"
                  placeholder="Search Anything Here..."
                  aria-label="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button style = {{backgroundColor:'#13a89e'}} size="md">Search</Button>
              </InputGroup>
            </Form>
            {/* <Button variant="primary" style={{ backgroundColor: '#13a89e'}} className={styles.customButton}>
              <CiFilter className={styles.customFil} />
            </Button> */}
            <button className = {styles.iconButton} onClick={handleShow}>
              <FiColumns className = {styles.customFil}/>
            </button>
            <button className = {styles.addDelete} onClick={handleShowModalFilter}>
              <CiFilter className = {styles.customDelete}/>
            </button>
            <button className = {styles.iconButton} onClick={handleShowModalDelete}>
              <RiDeleteBin6Line className = {styles.customFil}/>
            </button>
            <CustomModalFilter
              show={showModalFilter}
              handleClose={handleCloseModalFilter}
              handleFilter={handleFilter}
            />
            <CustomModalDelete
              show={showModalDelete}
              handleClose={handleCloseModalDelete}
              handleDelete={handleDelete}
            />
            <ModalComponent
              show={show}
              handleClose={handleClose}
              filters={filters}
              handleFilterChange={handleFilterChange}
              addFilter={addFilter}
              removeFilter={removeFilter}
              handleSubmit={handleSubmit}
            />
        </div>
        <div className = {styles.test1}>
          <ul className = {styles.systemlogList}>
            <li><LuBellRing /></li>
            <li>
              <div className = {styles.systemlogAva} onClick  = {handleClick}>
                <div className = {styles.systemlogAva1}>{tentk}</div>
                <div className = {styles.systemlogAva2}><RxAvatar/></div>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClosed}
                >
                  <Link to = "/" style = {{ textDecoration:'none', color: 'inherit' }}>
                    <MenuItem onClick={handleLogout}>
                      <FiLogOut style={{ marginRight: '5px' }} /> Logout
                    </MenuItem>
                  </Link>

                </Menu>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className = {styles.systemlogBottom}>
          <Table columns = {columns} data = {data}/>

      </div>
    </div>
  )
}
function App(){
  return(
    <React.Fragment>
      <Sidebar/>
      <SystemLogPage/>
    </React.Fragment>
  )
}
export default App;