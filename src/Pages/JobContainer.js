import React, {useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import Sidebar from '../Components/Sidebar.js';
import styles from '../Styles/JobContainer.module.scss';
import { Form, FormControl, Button, InputGroup,Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CiFilter } from "react-icons/ci";
import { RxAvatar } from "react-icons/rx";
import { FaTrash } from 'react-icons/fa';
import { IoIosAdd } from "react-icons/io";
import { FiLogOut } from 'react-icons/fi';
import Table from '../Components/Table.js';
import { useParams } from 'react-router-dom';
import {headerData2, bodyData2} from '../Common/utils.js';
import { Menu, MenuItem } from '@mui/material';
import { FaTimes } from 'react-icons/fa';
import { BiSolidBellRing } from "react-icons/bi";
const operatorOptions = {
  status: ['contains'],
  containerNumber: ['contains'],
  sealNumber: ['contains','starts with', 'ends with'],
  description: ['contains','starts with', 'ends with'],
  tare: ['contains','starts with', 'ends with'],
  net: ['contains','starts with', 'ends with'],
  grossWeight: ['contains','starts with', 'ends with'],
  isEmpty: ['contains'],
  isFull: ['contains'],
  containerInvoiceStatus: ['contains','starts with', 'ends with'],
  isOverweightLevel1: ['contains'],
  isOverweightLevel2: ['contains'],
  level1Kg: ['contains','starts with', 'ends with'],
  level2Kg: ['contains','starts with', 'ends with'],
  titleLevel1: ['contains','starts with', 'ends with'],
  titleLevel2: ['contains','starts with', 'ends with'],
  standardKg: ['contains','starts with', 'ends with'],
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
            <option value="status">Status</option>
            <option value="containerNumber">Container Number</option>
            <option value="sealNumber">Seal Number</option>
            <option value="description">Description</option>
            <option value="tare">Tare</option>
            <option value="net">Net</option>
            <option value="grossWeight">Gross Weight</option>
            <option value="isEmpty">Is Empty</option>
            <option value="isFull">Is Full</option>
            <option value="containerInvoiceStatus">Container Invoice Status</option>
            <option value="isOverweightLevel1">Is Overweight Level 1</option>
            <option value="isOverweightLevel2">Is Overweight Level 2</option>
            <option value="level1Kg">Level 1 Kg</option>
            <option value="level2Kg">Level 2 Kg</option>
            <option value="titleLevel1">Title Level 1</option>
            <option value="titleLevel2">Title Level 2</option>
            <option value="standardKg">Standard Kg</option>
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
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
};
const formatDateBack = (dateString) => {
  const [day,month,year] = dateString.split('/');
  return `${year}-${month}-${day}`;
};
const JobContainer = () =>{
  const columns = headerData2;
  const [bodyData,setBodyData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterData, setFilterData] = useState([]);
  const [tentk, setTentk] = useState('');
  useEffect(() => {
    const storedTentk = localStorage.getItem('tentk');
    if (storedTentk) {
      setTentk(storedTentk);
    }
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/job_container');
        const unsorted_data = await response.json();
        const data = unsorted_data.reverse();
        const formattedData = data.map(item => ({
          status: item.status ? 'Active' : 'Inactive',
          container_number: item.containerNumber,
          seal_number: item.sealNumber,
          description: item.description,
          tare: item.tare,
          net: item.net,
          gross_weight: item.grossWeight,
          is_empty: item.isEmpty ? 'Yes' : 'No',
          is_full: item.isFull ? 'Yes' : 'No',
          container_invoice_status: item.containerInvoiceStatus,
          is_overweight_level1: item.isOverweightLevel1 ? 'Yes' : 'No',
          is_overweight_level2: item.isOverweightLevel2 ? 'Yes' : 'No',
          level1_kg: item.level1Kg,
          level2_kg: item.level2Kg,
          title_level1: item.titleLevel1,
          title_level2: item.titleLevel2,
          standard_kg: item.standardKg,
        }));
        setBodyData(formattedData);
        setFilterData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      const fetchData = async () => {
        try {
          const response = await fetch(`http://localhost:8080/job_container/search?keyword=${searchQuery}`);
          const unsorted_data = await response.json();
          const data = unsorted_data.reverse();
          const formattedData = data.map(item => ({
            status: item.status ? 'Active' : 'Inactive',
            container_number: item.containerNumber,
            seal_number: item.sealNumber,
            description: item.description,
            tare: item.tare,
            net: item.net,
            gross_weight: item.grossWeight,
            is_empty: item.isEmpty ? 'Yes' : 'No',
            is_full: item.isFull ? 'Yes' : 'No',
            container_invoice_status: item.containerInvoiceStatus,
            is_overweight_level1: item.isOverweightLevel1 ? 'Yes' : 'No',
            is_overweight_level2: item.isOverweightLevel2 ? 'Yes' : 'No',
            level1_kg: item.level1Kg,
            level2_kg: item.level2Kg,
            title_level1: item.titleLevel1,
            title_level2: item.titleLevel2,
            standard_kg: item.standardKg,
          }));
          setFilterData(formattedData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    } else {
      setFilterData(bodyData);
    }
  }, [searchQuery, bodyData]);
  const data = filterData;
  const [show, setShow] = useState(false);
  const [filters, setFilters] = useState([]);
  const [showRemoveFilterButton, setShowRemoveFilterButton] = useState(false);
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
    const formattedFilters = filters.map(filter => {
      if(filter.column === 'birthdate') {
        return {
          ...filter,
          data: formatDateBack(filter.data)
        };
      }
      return filter;
    });
    console.log(formattedFilters);
    try {
      const response = await fetch ('http://localhost:8080/job_container/filter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedFilters),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const unsorted_data = await response.json();
      const data = unsorted_data.reverse();
      const formattedData = data.map(item => {
        return {
          ...item,
          container_number: item.containerNumber,
          seal_number: item.sealNumber,
          gross_weight: item.grossWeight,
          is_empty: item.isEmpty ? 'Yes' : 'No',
          is_full: item.isFull ? 'Yes' : 'No',
          container_invoice_status: item.containerInvoiceStatus,
          status: item.status ? 'Active' : 'Inactive',
          is_overweight_level1: item.isOverweightLevel1 ? 'Yes' : 'No',
          is_overweight_level2: item.isOverweightLevel2 ? 'Yes' : 'No',
          level1_kg: item.level1Kg,
          level2_kg: item.level2Kg,
          title_level1: item.titleLevel1,
          title_level2: item.titleLevel2,
          standard_kg: item.standardKg,
        };
      });
      setShowRemoveFilterButton(true);
      setFilterData(formattedData);
      handleClose();
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleRemoveFilters = () => {
    setFilterData(bodyData);
    setFilters([]);
    setShowRemoveFilterButton(false);
  };
  const getAvatarByTentk = (tentk) => {
    const avatarMap = {
      'Trung Hieu': '/avatar1.jpg',
      'Nhat Linh': '/avatar2.jpg',
      'Quang Nha': '/avatar3.jpg',
    };
    return avatarMap[tentk] || '/avatar4.jpg';
  };
  return(
    <div className = {styles.jobcontainerContainer}>
      <div className = {styles.jobcontainerTop}>
        <hr></hr>
        <div className = {styles.textTitle}>
          Job Container

        </div>
        {showRemoveFilterButton && (
            <Button variant="outline-danger" onClick={handleRemoveFilters} style={{ left: '300px', top:'25px',textAlign:'center',justifyContent:'center', position: 'absolute'}}>
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
            <button className = {styles.iconButton} onClick={handleShow}>
              <CiFilter className = {styles.customFil}/> FILTER
            </button>
            <Link to = {`/jobcontainer/insert`}>
            <button className = {styles.addButton}>
              <IoIosAdd className = {styles.customAdd}/>
            </button>
            </Link>

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
          <ul className = {styles.jobcontainerList}>
            <li><BiSolidBellRing style = {{marginTop:'5px',marginRight:'-15px'}}/></li>
            <li>
              <div className = {styles.jobcontainerAva} onClick={handleClick}>
                <div className = {styles.jobcontainerAva1}>{tentk.toUpperCase()}</div>
                {/* <div className = {styles.jobcontainerAva2}><RxAvatar/></div> */}
                <img src = {getAvatarByTentk(tentk)} alt="avatar" className={styles.jobcontainerAva2} />
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
      <div className = {styles.jobcontainerBottom}>
          <Table columns = {columns} data = {data}/>
      </div>

    </div>
  )
}
function App(){
  return(
    <React.Fragment>
      <Sidebar/>
      <JobContainer/>
    </React.Fragment>
  )
}
export default App;