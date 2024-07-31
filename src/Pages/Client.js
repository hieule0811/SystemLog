import React, {useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import Sidebar from '../Components/Sidebar.js';
import styles from '../Styles/Client.module.scss';
import { Form, FormControl, Button, InputGroup,Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CiFilter } from "react-icons/ci";
import { LuBellRing } from "react-icons/lu";
import { RxAvatar } from "react-icons/rx";
import { FaTrash } from 'react-icons/fa';
import { IoIosAdd } from "react-icons/io";
import { FiLogOut } from 'react-icons/fi';
import Table from '../Components/Table.js';
import { useParams } from 'react-router-dom';
import {headerData, bodyData} from '../Common/utils.js';
import { Menu, MenuItem } from '@mui/material';
import { FaTimes } from 'react-icons/fa';
const operatorOptions = {
  code: ['contains','starts with', 'ends with'],
  name: ['contains','starts with', 'ends with'],
  birthdate: ['contains'],
  country: ['contains','starts with', 'ends with'],
  city: ['contains','starts with', 'ends with'],
  unloco: ['contains','starts with', 'ends with'],
  officeAddress: ['contains','starts with', 'ends with'],
  suburb: ['contains','starts with', 'ends with'],
  state: ['contains','starts with', 'ends with'],
  postalCode: ['contains','starts with', 'ends with'],
  telephone: ['contains','starts with', 'ends with'],
  email: ['contains','starts with', 'ends with'],
  status: ['contains']
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
            <option value="code">Code</option>
            <option value="name">Name</option>
            <option value="birthdate">Birthdate</option>
            <option value="country">Country</option>
            <option value="city">City</option>
            <option value="unloco">UNLOCO</option>
            <option value="officeAddress">Office Address</option>
            <option value="suburb">Suburb</option>
            <option value="state">State</option>
            <option value="postalCode">Postal Code</option>
            <option value="telephone">Telephone</option>
            <option value="email">Email</option>
            <option value="status">Status</option>
            {/* <option value="">Column</option>
            <option value="column1">Column 1</option>
            <option value="column2">Column 2</option>
            <option value="column3">Column 3</option>
            <option value="column4">Column 4</option>
            <option value="column5">Column 5</option>
            <option value="column6">Column 6</option>
            <option value="column7">Column 7</option>
            <option value="column8">Column 8</option>
            <option value="column9">Column 9</option>
            <option value="column10">Column 10</option> */}
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
const Client = () =>{
  const columns = headerData;
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
        const response = await fetch('http://localhost:8080/client');
        const data = await response.json();
        const formattedData = data.map(item => ({
          code: item.code,
          name: item.name,
          birthdate: formatDate(item.birthdate),
          country: item.country,
          city: item.city,
          unloco: item.unloco,
          office_address: item.officeAddress,
          suburb: item.suburb,
          state: item.state,
          postal_code: item.postalCode,
          telephone: item.telephone,
          email: item.email,
          status: item.status ? 'Active' : 'Inactive'
        }));
        setBodyData(formattedData);
        setFilterData(formattedData); // Set initial filterData to bodyData
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
          const response = await fetch(`http://localhost:8080/client/search?keyword=${searchQuery}`);
          const data = await response.json();
          const formattedData = data.map(item => ({
            code: item.code,
            name: item.name,
            birthdate: formatDate(item.birthdate),
            country: item.country,
            city: item.city,
            unloco: item.unloco,
            office_address: item.officeAddress,
            suburb: item.suburb,
            state: item.state,
            postal_code: item.postalCode,
            telephone: item.telephone,
            email: item.email,
            status: item.status ? 'Active' : 'Inactive'
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
      const response = await fetch ('http://localhost:8080/client/filter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedFilters),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const formattedData = data.map(item => {
        return {
          ...item,
          birthdate: item.birthdate ? formatDate(item.birthdate) : '',
          status: item.status ? 'Active' : 'Inactive',
          postal_code: item.postalCode,
          office_address: item.officeAddress
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
    setShowRemoveFilterButton(false); // Hide the "Remove Filter" button
  };

  return(
    <div className = {styles.clientContainer}>
      <div className = {styles.clientTop}>
        <hr></hr>
        <div className = {styles.textTitle}>
          Clients

        </div>
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
              <CiFilter className = {styles.customFil}/> FILTER
            </button>
            <Link to = {`/client/insert`}>
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
          <ul className = {styles.clientList}>
            <li><LuBellRing /></li>
            <li>
              <div className = {styles.clientAva} onClick={handleClick}>
                <div className = {styles.clientAva1}>{tentk}</div>
                <div className = {styles.clientAva2}><RxAvatar/></div>
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
      <div className = {styles.clientBottom}>
          <Table columns = {columns} data = {data}/>
      </div>

    </div>
  )
}
function App(){
  return(
    <React.Fragment>
      <Sidebar/>
      <Client/>
    </React.Fragment>
  )
}
export default App;