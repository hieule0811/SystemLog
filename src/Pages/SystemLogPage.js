import React, {useState} from 'react';
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

const operatorOptions = {
  column1: ['equals', 'not equals', 'contains', 'does not contain'],
  column2: ['greater than', 'less than', 'equals', 'not equals'],
  column3: ['starts with', 'ends with', 'includes', 'excludes']
};

const ModalComponent = ({ show, handleClose, filters, handleFilterChange, addFilter, removeFilter }) => (
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
            <option value="column1">Column 1</option>
            <option value="column2">Column 2</option>
            <option value="column3">Column 3</option>
            <option value="column4">Column 4</option>
            <option value="column5">Column 5</option>
            <option value="column6">Column 6</option>
            <option value="column7">Column 7</option>
            <option value="column8">Column 8</option>
            <option value="column9">Column 9</option>
            <option value="column10">Column 10</option>
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
      <Button variant="success" onClick={handleClose}>
        SUBMIT
      </Button>
    </Modal.Footer>
  </Modal>
);

const SystemLogPage = () =>{
  const columns = headerData1;
  const data = bodyData1;
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

  return(
    <div className = {styles.systemlogContainer}>
      <div className = {styles.systemlogTop}>
        <hr></hr>
        <div className = {styles.textTitle}>
          System Logs
        </div>
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
            <ModalComponent
              show={show}
              handleClose={handleClose}
              filters={filters}
              handleFilterChange={handleFilterChange}
              addFilter={addFilter}
              removeFilter={removeFilter}
            />
        </div>
        <div className = {styles.test1}>
          <ul className = {styles.systemlogList}>
            <li><LuBellRing /></li>
            <li>
              <div className = {styles.systemlogAva}>
                <div className = {styles.systemlogAva1}>TrungHieu</div>
                <div className = {styles.systemlogAva2}><RxAvatar/></div>
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