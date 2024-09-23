import React, {useState,useEffect} from 'react';
import { MdMoreVert } from 'react-icons/md';
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import { useNavigate, useParams } from 'react-router-dom';
import { FaEdit, FaTrash } from "react-icons/fa";
import { RiErrorWarningLine } from "react-icons/ri";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import styles from '../Common/utils.module.scss';

const Modal = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  return (
      <div style={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
      }}>
          <div style={{
              padding: '20px',
              backgroundColor: 'white',
              marginLeft: '90px',
              width: '615px',
              height: '600px',
              borderRadius: '5px',
              textAlign: 'left',
          }}>
              <div className={styles.clientTop}>
                  <hr></hr>
                  <div className={styles.textTitle}>
                      View Log
                  </div>
              </div>
            <div className={styles.inputGroups}>
              <div className={styles.inputGroup} style={{width: '190px'}}>
                <input
                    style={{width: '190px', marginTop: '60px', marginLeft: '20px'}}
                    id="event_time"
                    name="event_time"
                    autoComplete="off"
                    value={data.event_time}
                    readOnly/>
                <strong style={{marginTop: '-10px', marginLeft: '20px'}}>Event Time:</strong>
              </div>
              <div className={styles.inputGroup} style={{width: '170px'}}>
                <input
                    style={{width: '170px', marginTop: '60px', marginLeft: '20px'}}
                    id="created_by"
                    name="created_by"
                    autoComplete="off"
                    value={data.created_by}
                    readOnly/>
                <strong style={{marginTop: '-10px', marginLeft: '20px'}}>Created By:</strong>
              </div>
              <div className={styles.inputGroup} style={{width: '190px'}}>
                <input
                    style={{width: '190px', marginTop: '60px', marginLeft: '20px'}}
                    id="event_source"
                    name="event_source"
                    autoComplete="off"
                    value={data.event_source}
                    readOnly/>
                <strong style={{marginTop: '-10px', marginLeft: '20px'}}>Source Code:</strong>
              </div>
              <br/><br/>
              <div className={styles.inputGroup} style={{width: '190px'}}>
                <input
                    style={{width: '190px', marginTop: '60px', marginLeft: '20px'}}
                    id="event_type"
                    name="event_type"
                    autoComplete="off"
                    value={data.event_type}
                    readOnly/>
                <strong style={{marginTop: '-10px', marginLeft: '20px'}}>Event Type:</strong>
              </div>
            </div>
          </div>
      </div>
  );
};
const ActionIcon = ({ row }) => {

  const [showDetails, setShowDetails] = useState(false);

  const handleClick = () => {
    setShowDetails(true);
  };

  const handleClose = () => {
    setShowDetails(false);
  };

  return (
      <>
        <MdOutlineRemoveRedEye onClick={handleClick} style={{
          cursor: 'pointer',
          color: 'white',
          backgroundColor: '#13a89e',
          width: '20px',
          height: '18px',
          borderRadius: '3px',
          transition: 'background-color 0.3s ease'
        }} />
        <Modal isOpen={showDetails} onClose={handleClose} data={row} />
      </>
  );
};


export const ActionMenu = ({row, onDelete}) => {
  // const { username } = useParams();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [tentk, setTentk] = useState('');
  const handleMenuClick = (action) => {
    switch (action) {
      case 'update':
        navigate(`/client/update/${row.code}`, { state: { row } });
        break;
      case 'delete':
        setShowConfirm(true);
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    const storedTentk = localStorage.getItem('tentk');
    if (storedTentk) {
      setTentk(storedTentk);
    }
  }, []);
  const handleDelete = async () => {
    setShowConfirm(false);

    try {
      // Tìm id dựa trên code
      const response = await fetch(`http://localhost:8080/client/id/${row.code}`);
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const data = await response.json();
      const clientId = data;
      // Gọi API xóa với id
      const deleteResponse = await fetch(`http://localhost:8080/client/${clientId}?updatedBy=${tentk}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!deleteResponse.ok) {
        throw new Error('Network response was not ok.');
      }
      const data_response = await deleteResponse.text();
      localStorage.setItem('deleteMessage', data_response);
      window.location.reload();
      alert(data_response);
      console.log('Record deleted', row);
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error deleting the client.');
    }
  };
  const handleCancel = () => {
    setShowConfirm(false);
  };
  return (
      <>
        <Menu menuButton={<MenuButton style={{ border: 'none', background: 'transparent' }}><MdMoreVert /></MenuButton>}>
          <MenuItem onClick={() => handleMenuClick('update')}>
            <FaEdit style={{ color: 'blue', marginRight: '10px',fontSize:'15px' }} />
            Update
          </MenuItem>
          <MenuItem onClick={() => handleMenuClick('delete')}>
            <FaTrash style={{ color: 'red', marginRight: '10px',fontSize: '15px' }} />
            Delete
          </MenuItem>
        </Menu>
        {showConfirm && (
            <div style={{
              position: 'fixed',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
            }}>
              <div style={{
                padding: '20px',
                backgroundColor: '#b2d0f9',
                border:'none',
                borderRadius: '5px',
                textAlign: 'center',
              }}>
                <RiErrorWarningLine
                    style = {{ color: 'blue', fontSize: '50px'}}
                />
                <p style = {{ color:'blue',fontSize:'15px', fontWeight:'bold' }}>CONFIRM</p>
                <p>Are you sure want to delete this record?</p>
                <button onClick={handleDelete} style={{ marginRight: '10px', color: 'white', backgroundColor: 'red', border: 'none', padding: '10px', borderRadius: '5px' }}>Delete</button>
                <button onClick={handleCancel} style={{ color: 'white', backgroundColor: 'gray', border: 'none', padding: '10px', borderRadius: '5px' }}>Cancel</button>
              </div>
            </div>
        )}
      </>
  );
};
export const ActionMenu1 = ({row, onDelete}) => {
  // const { username } = useParams();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [tentk, setTentk] = useState('');
  const handleMenuClick = (action) => {
    switch (action) {
      case 'update':
        navigate(`/jobcontainer/update/${row.container_number}`, { state: { row } });
        break;
      case 'delete':
        setShowConfirm(true);
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    const storedTentk = localStorage.getItem('tentk');
    if (storedTentk) {
      setTentk(storedTentk);
    }
  }, []);
  const handleDelete = async () => {
    setShowConfirm(false);

    try {
      // Tìm id dựa trên code
      const response = await fetch(`http://localhost:8080/job_container/id/${row.container_number}`);
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const data = await response.json();
      const jobContainerId = data;
      // Gọi API xóa với id
      const deleteResponse = await fetch(`http://localhost:8080/job_container/${jobContainerId}?updatedBy=${tentk}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!deleteResponse.ok) {
        throw new Error('Network response was not ok.');
      }
      const data_response = await deleteResponse.text();
      localStorage.setItem('deleteMessage', data_response);
      window.location.reload();
      alert(data_response);
      console.log('Record deleted', row);
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error deleting the client.');
    }
  };
  const handleCancel = () => {
    setShowConfirm(false);
  };
  return (
      <>
        <Menu menuButton={<MenuButton style={{ border: 'none', background: 'transparent' }}><MdMoreVert /></MenuButton>}>
          <MenuItem onClick={() => handleMenuClick('update')}>
            <FaEdit style={{ color: 'blue', marginRight: '10px',fontSize:'15px' }} />
            Update
          </MenuItem>
          <MenuItem onClick={() => handleMenuClick('delete')}>
            <FaTrash style={{ color: 'red', marginRight: '10px',fontSize: '15px' }} />
            Delete
          </MenuItem>
        </Menu>
        {showConfirm && (
            <div style={{
              position: 'fixed',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
            }}>
              <div style={{
                padding: '20px',
                backgroundColor: '#b2d0f9',
                border:'none',
                borderRadius: '5px',
                textAlign: 'center',
              }}>
                <RiErrorWarningLine
                    style = {{ color: 'blue', fontSize: '50px'}}
                />
                <p style = {{ color:'blue',fontSize:'15px', fontWeight:'bold' }}>CONFIRM</p>
                <p>Are you sure want to delete this record?</p>
                <button onClick={handleDelete} style={{ marginRight: '10px', color: 'white', backgroundColor: 'red', border: 'none', padding: '10px', borderRadius: '5px' }}>Delete</button>
                <button onClick={handleCancel} style={{ color: 'white', backgroundColor: 'gray', border: 'none', padding: '10px', borderRadius: '5px' }}>Cancel</button>
              </div>
            </div>
        )}
      </>
  );
};
export const headerData = [
  {
    Header: () => <div style={{ textAlign: 'center' }}>Action</div>,
    accessor: 'action',
    align: 'center',
    Cell: ({ row }) => <ActionMenu row={row.original} />,
    width: 50,
  },
  {
    Header: () => <div style={{ textAlign: 'center' }}>Code</div>,
    accessor: 'code',
    align: 'center',
    width:90,
  },
  {
    Header: () => <div style={{ textAlign: 'center' }}>Name</div>,
    accessor: 'name',
    align: 'center',
    width:140,
  },
  {
    Header: () => <div style={{ textAlign: 'center' }}>Birthdate</div>,
    accessor: 'birthdate',
    align: 'center',
    width: 120,
  },
  {
    Header: () => <div style={{ textAlign: 'center' }}>Country</div>,
    accessor: 'country',
    align: 'center',
    width:125,
  },
  {
    Header: () => <div style={{ textAlign: 'center' }}>City</div>,
    accessor: 'city',
    align: 'center',
    width: 125,
  },
  {
    Header: () => <div style={{ textAlign: 'center' }}>UNLOCO</div>,
    accessor: 'unloco',
    align: 'center',
    width: 125,
  },
  {
    Header: () => <div style={{ textAlign: 'center' }}>Office Address</div>,
    accessor: 'office_address',
    align: 'center',
    width: 200,
  },
  {
    Header: () => <div style={{ textAlign: 'center' }}>Suburb</div>,
    accessor: 'suburb',
    align: 'center',
    width: 135,
  },
  {
    Header: () => <div style={{ textAlign: 'center' }}>State</div>,
    accessor: 'state',
    align: 'center',
    width: 110,
  },
  {
    Header: () => <div style={{ textAlign: 'center' }}>Postal Code</div>,
    accessor: 'postal_code',
    align: 'center',
    width: 110,
  },
  {
    Header: () => <div style={{ textAlign: 'center' }}>Telephone</div>,
    accessor: 'telephone',
    align: 'center',
    width: 100,
  },
  {
    Header: () => <div style={{ textAlign: 'center' }}>Email</div>,
    accessor: 'email',
    width: 160,
    align: 'center',
  },
  {
    Header: () => <div style={{ textAlign: 'center' }}>Status</div>,
    accessor: 'status',
    width: 80,
    align: 'center',
  },
]
export const bodyData = []
export const headerData1 = [
  {
    Header: () => <div style={{ textAlign: 'center' }}>Action</div>,
    accessor: 'action',
    align: 'center',
    width:25,
    Cell: ({ row }) => <ActionIcon row={row.original} />,
  },
  {
    Header: () => <div style={{ textAlign: 'center' }}>Event Time</div>,
    accessor: 'event_time',
    align: 'center',
    width:60

  },
  {
    Header: () => <div style={{ textAlign: 'center' }}>Created By</div>,
    accessor: 'created_by',
    align: 'center',
    width:70
  },
  {
    Header: () => <div style={{ textAlign: 'center' }}>Event Source</div>,
    accessor: 'event_source',
    align: 'center',
    width:75
  },
  {
    Header: () => <div style={{ textAlign: 'center' }}>Source Code</div>,
    accessor: 'source_code',
    align: 'center',
    width:75
  },
  {
    Header: () => <div style={{ textAlign: 'center' }}>Event Type</div>,
    accessor: 'event_type',
    align: 'center',
    width:60,
  },
  {
    Header: () => <div style={{ textAlign: 'center' }}>Changed Data</div>,
    accessor: 'changed_data',
    width:100,
  },
  {
    Header: () => <div style={{ textAlign: 'center' }}>Old Row Data</div>,
    accessor: 'old_row_data',
    width:100,
  },
  {
    Header: () => <div style={{ textAlign: 'center' }}>New Row Data</div>,
    accessor: 'new_row_data',
    width:100
  },
]
export const bodyData1 = []
export const headerData2 = [
  {
    Header: () => <div style={{ textAlign: 'center' }}>Action</div>,
    accessor: 'action',
    align: 'center',
    Cell: ({ row }) => <ActionMenu1 row={row.original} />,
    width: 50,
  },
  {
    Header: () => <div style={{ textAlign: 'center' }}>Container Number</div>,
    accessor: 'container_number',
    align: 'center',
    width:150,
  },
  {
    Header: () => <div style={{ textAlign: 'center' }}>Seal Number</div>,
    accessor: 'seal_number',
    align: 'center',
    width:100,
  },
  {
    Header: () => <div style={{ textAlign: 'center' }}>Description</div>,
    accessor: 'description',
    align: 'center',
    width:200,
  },
  {
    Header: () => <div style={{ textAlign: 'center' }}>Tare</div>,
    accessor: 'tare',
    align: 'center',
    width:80,
  },
  {
    Header: () => <div style={{ textAlign: 'center' }}>Net</div>,
    accessor: 'net',
    align: 'center',
    width:80,
  },
  {
    Header: () => <div style={{ textAlign: 'center' }}>Gross Weight</div>,
    accessor: 'gross_weight',
    align: 'center',
    width:100,
  },
  {
    Header: () => <div style={{ textAlign: 'center' }}>Is Empty</div>,
    accessor: 'is_empty',
    align: 'center',
    width:100,
  },
  {
    Header: () => <div style={{ textAlign: 'center' }}>Is Full</div>,
    accessor: 'is_full',
    align: 'center',
    width:100,
  },
  {
    Header: () => <div style={{ textAlign: 'center' }}>Container Invoice Status</div>,
    accessor: 'container_invoice_status',
    align: 'center',
    width:250,
  },
  {
    Header: () => <div style={{ textAlign: 'center' }}>Is Overweight Level 1</div>,
    accessor: 'is_overweight_level1',
    align: 'center',
    width:150,
  },
  {
    Header: () => <div style={{ textAlign: 'center' }}>Is Overweight Level 2</div>,
    accessor: 'is_overweight_level2',
    align: 'center',
    width:150,
  },
  {
    Header: () => <div style={{ textAlign: 'center' }}>Level 1 Kg</div>,
    accessor: 'level1_kg',
    align: 'center',
    width:105,
  },
  {
    Header: () => <div style={{ textAlign: 'center' }}>Level 2 Kg</div>,
    accessor: 'level2_kg',
    align: 'center',
    width:105,
  },
  {
    Header: () => <div style={{ textAlign: 'center' }}>Title Level 1</div>,
    accessor: 'title_level1',
    align: 'center',
    width:130,
  },
  {
    Header: () => <div style={{ textAlign: 'center' }}>Title Level 2</div>,
    accessor: 'title_level2',
    align: 'center',
    width:130,
  },
  {
    Header: () => <div style={{ textAlign: 'center' }}>Standard Kg</div>,
    accessor: 'standard_kg',
    align: 'center',
    width:100,
  },
  {
    Header: () => <div style={{ textAlign: 'center' }}>Status</div>,
    accessor: 'status',
    align: 'center',
    width:80,
  }
]
export const bodyData2 = []