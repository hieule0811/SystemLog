import React, {useState} from 'react';
import { MdMoreVert } from 'react-icons/md';
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from "react-icons/fa";
import { RiErrorWarningLine } from "react-icons/ri";
import { MdOutlineRemoveRedEye } from "react-icons/md";

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
        borderRadius: '5px',
        textAlign: 'center',
      }}>
        <RiErrorWarningLine style={{ color: 'blue', fontSize: '50px' }} />
        <p style={{ color: 'blue', fontSize: '15px', fontWeight: 'bold' }}>View Log</p>
        <p><strong>Event Time:</strong> {data.event_time}</p>
        <p><strong>Created By:</strong> {data.created_by}</p>
        <p><strong>Event Source:</strong> {data.event_source}</p>
        <p><strong>Source Code:</strong> {data.source_code}</p>
        <p><strong>Event Type:</strong> {data.event_type}</p>
        <p><strong>Changed Data:</strong> {data.changed_data}</p>
        <button onClick={onClose} style={{ marginTop: '10px', color: 'white', backgroundColor: 'gray', border: 'none', padding: '10px', borderRadius: '5px' }}>Close</button>
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


const ActionMenu = ({row}) => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const handleMenuClick = (action) => {
    switch (action) {
      // case 'insert':
      //   navigate('/client/insert', { state: { row } });
      //   break;
      case 'update':
        navigate('/client/update', { state: { row } });
        break;
      case 'delete':
        setShowConfirm(true);
        break;
      default:
        break;
    }
  };
  const handleDelete = () => {
    // Logic to delete the record
    setShowConfirm(false);
    console.log('Record deleted', row);
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };
  return (
    <>
    <Menu menuButton={<MenuButton style={{ border: 'none', background: 'transparent' }}><MdMoreVert /></MenuButton>}>
      {/* <MenuItem onClick={() => handleMenuClick('insert')}>
      <CgInsertAfterO style={{ color: 'green', marginRight: '10px',fontSize:'15px' }} />
      Insert
      </MenuItem> */}
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

// const ActionMenu = ({row}) => {
//   const navigate = useNavigate();
//   const [showConfirm, setShowConfirm] = useState(false);
//   const handleMenuClick = (action) => {
//     switch (action) {
//       case 'insert':
//         navigate('/client/insert', { state: { row } });
//         break;
//       case 'update':
//         navigate('/client/update', { state: { row } });
//         break;
//       case 'delete':
//         setShowConfirm(true);
//         break;
//       default:
//         break;
//     }
//   };
//   const handleDelete = () => {
//     // Logic to delete the record
//     setShowConfirm(false);
//     console.log('Record deleted', row);
//   };

//   const handleCancel = () => {
//     setShowConfirm(false);
//   };
//   return (
//     <>
//     <Menu menuButton={<MenuButton style={{ border: 'none', background: 'transparent' }}><MdMoreVert /></MenuButton>}>
//       <MenuItem onClick={() => handleMenuClick('insert')}>
//       <CgInsertAfterO style={{ color: 'green', marginRight: '10px',fontSize:'15px' }} />
//       Insert
//       </MenuItem>
//       <MenuItem onClick={() => handleMenuClick('update')}>
//       <FaEdit style={{ color: 'blue', marginRight: '10px',fontSize:'15px' }} />
//       Update
//       </MenuItem>
//       <MenuItem onClick={() => handleMenuClick('delete')}>
//       <FaTrash style={{ color: 'red', marginRight: '10px',fontSize: '15px' }} />
//       Delete
//       </MenuItem>
//     </Menu>
//     {showConfirm && (
//         <div style={{
//           position: 'fixed',
//           top: '0',
//           left: '0',
//           width: '100%',
//           height: '100%',
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           zIndex: 1000,
//         }}>
//           <div style={{
//             padding: '20px',
//             backgroundColor: '#b2d0f9',
//             border:'none',
//             borderRadius: '5px',
//             textAlign: 'center',
//           }}>
//             <RiErrorWarningLine
//             style = {{ color: 'blue', fontSize: '50px'}}
//             />
//             <p style = {{ color:'blue',fontSize:'15px', fontWeight:'bold' }}>CONFIRM</p>
//             <p>Are you sure want to delete this record?</p>
//             <button onClick={handleDelete} style={{ marginRight: '10px', color: 'white', backgroundColor: 'red', border: 'none', padding: '10px', borderRadius: '5px' }}>Delete</button>
//             <button onClick={handleCancel} style={{ color: 'white', backgroundColor: 'gray', border: 'none', padding: '10px', borderRadius: '5px' }}>Cancel</button>
//           </div>
//         </div>
//     )}
//     </>
//   );
// };
export const headerData = [
  {
    Header: 'Action',
    accessor: 'action',
    align: 'center',
    Cell: ({ row }) => <ActionMenu row={row.original} />,
    width: 50,
  },
  {
    Header: 'Code',
    accessor: 'code',
    width:100,
  },
  {
    Header: 'Name',
    accessor: 'name',
    width:200,
  },
  {
    Header: 'Country',
    accessor: 'country',
    width:125,
  },
  {
    Header: 'City',
    accessor: 'city',
    width: 125,
  },
  {
    Header: 'UNLOCO',
    accessor: 'unloco',
    width: 125,
  },
  {
    Header: 'Office Address',
    accessor: 'office_address',
    width: 300,
  },
  {
    Header: 'Suburb',
    accessor: 'suburb',
    width: 125,
  },
  {
    Header: 'State',
    accessor: 'state',
    width: 150,
  },
  {
    Header: 'Postal Code',
    accessor: 'post_code',
    width: 110,
  },
  {
    Header: 'Telephone',
    accessor: 'telephone',
    width: 100,
  },
  {
    Header: 'Email',
    accessor: 'email',
    width: 130,
  },
  {
    Header: 'Status',
    accessor: 'status',
    width: 80,
  },
]
export const bodyData = [
  {
    code: 'B-GFEWH',
    name: 'B-G FENCING WHOLESALE',
    country: 'Australia',
    city: 'Sydney',
    unloco: 'AUSYD',
    office_address: 'UNIT 9 453-455 VICTORIA STREET',
    suburb: 'Wetherill Park',
    state: 'New South Wales',
    post_code: '2164',
    telephone: '0250092231',
    email: ' ',
    status: 'Active'
  },
  {
    code: 'B-GFEWH',
    name: 'B-G FENCING WHOLESALE',
    country: 'Australia',
    city: 'Sydney',
    unloco: 'AUSYD',
    office_address: 'UNIT 9 453-455 VICTORIA STREET',
    suburb: 'Wetherill Park',
    state: 'New South Wales',
    post_code: '2164',
    telephone: '0250092231',
    email: ' ',
    status: 'Active'
  },
  {
    code: 'B-GFEWH',
    name: 'B-G FENCING WHOLESALE',
    country: 'Australia',
    city: 'Sydney',
    unloco: 'AUSYD',
    office_address: 'UNIT 9 453-455 VICTORIA STREET',
    suburb: 'Wetherill Park',
    state: 'New South Wales',
    post_code: '2164',
    telephone: '0250092231',
    email: ' ',
    status: 'Active'
  },
  {
    code: 'B-GFEWH',
    name: 'B-G FENCING WHOLESALE',
    country: 'Australia',
    city: 'Sydney',
    unloco: 'AUSYD',
    office_address: 'UNIT 9 453-455 VICTORIA STREET',
    suburb: 'Wetherill Park',
    state: 'New South Wales',
    post_code: '2164',
    telephone: '0250092231',
    email: ' ',
    status: 'Active'
  },
  {
    code: 'B-GFEWH',
    name: 'B-G FENCING WHOLESALE',
    country: 'Australia',
    city: 'Sydney',
    unloco: 'AUSYD',
    office_address: 'UNIT 9 453-455 VICTORIA STREET',
    suburb: 'Wetherill Park',
    state: 'New South Wales',
    post_code: '2164',
    telephone: '0250092231',
    email: ' ',
    status: 'Active'
  },
  {
    code: 'B-GFEWH',
    name: 'B-G FENCING WHOLESALE',
    country: 'Australia',
    city: 'Sydney',
    unloco: 'AUSYD',
    office_address: 'UNIT 9 453-455 VICTORIA STREET',
    suburb: 'Wetherill Park',
    state: 'New South Wales',
    post_code: '2164',
    telephone: '0250092231',
    email: ' ',
    status: 'Active'
  },
    {
    code: 'B-GFEWH',
    name: 'B-G FENCING WHOLESALE',
    country: 'Australia',
    city: 'Sydney',
    unloco: 'AUSYD',
    office_address: 'UNIT 9 453-455 VICTORIA STREET',
    suburb: 'Wetherill Park',
    state: 'New South Wales',
    post_code: '2164',
    telephone: '0250092231',
    email: ' ',
    status: 'Active'
  },
    {
    code: 'B-GFEWH',
    name: 'B-G FENCING WHOLESALE',
    country: 'Australia',
    city: 'Sydney',
    unloco: 'AUSYD',
    office_address: 'UNIT 9 453-455 VICTORIA STREET',
    suburb: 'Wetherill Park',
    state: 'New South Wales',
    post_code: '2164',
    telephone: '0250092231',
    email: ' ',
    status: 'Active'
  },
    {
    code: 'B-GFEWH',
    name: 'B-G FENCING WHOLESALE',
    country: 'Australia',
    city: 'Sydney',
    unloco: 'AUSYD',
    office_address: 'UNIT 9 453-455 VICTORIA STREET',
    suburb: 'Wetherill Park',
    state: 'New South Wales',
    post_code: '2164',
    telephone: '0250092231',
    email: ' ',
    status: 'Active'
  },
    {
    code: 'B-GFEWH',
    name: 'B-G FENCING WHOLESALE',
    country: 'Australia',
    city: 'Sydney',
    unloco: 'AUSYD',
    office_address: 'UNIT 9 453-455 VICTORIA STREET',
    suburb: 'Wetherill Park',
    state: 'New South Wales',
    post_code: '2164',
    telephone: '0250092231',
    email: ' ',
    status: 'Active'
  },
    {
    code: 'B-GFEWH',
    name: 'B-G FENCING WHOLESALE',
    country: 'Australia',
    city: 'Sydney',
    unloco: 'AUSYD',
    office_address: 'UNIT 9 453-455 VICTORIA STREET',
    suburb: 'Wetherill Park',
    state: 'New South Wales',
    post_code: '2164',
    telephone: '0250092231',
    email: ' ',
    status: 'Active'
  },
    {
    code: 'B-GFEWH',
    name: 'B-G FENCING WHOLESALE',
    country: 'Australia',
    city: 'Sydney',
    unloco: 'AUSYD',
    office_address: 'UNIT 9 453-455 VICTORIA STREET',
    suburb: 'Wetherill Park',
    state: 'New South Wales',
    post_code: '2164',
    telephone: '0250092231',
    email: ' ',
    status: 'Active'
  },
    {
    code: 'B-GFEWH',
    name: 'B-G FENCING WHOLESALE',
    country: 'Australia',
    city: 'Sydney',
    unloco: 'AUSYD',
    office_address: 'UNIT 9 453-455 VICTORIA STREET',
    suburb: 'Wetherill Park',
    state: 'New South Wales',
    post_code: '2164',
    telephone: '0250092231',
    email: ' ',
    status: 'Active'
  },
    {
    code: 'B-GFEWH',
    name: 'B-G FENCING WHOLESALE',
    country: 'Australia',
    city: 'Sydney',
    unloco: 'AUSYD',
    office_address: 'UNIT 9 453-455 VICTORIA STREET',
    suburb: 'Wetherill Park',
    state: 'New South Wales',
    post_code: '2164',
    telephone: '0250092231',
    email: ' ',
    status: 'Active'
  },
    {
    code: 'B-GFEWH',
    name: 'B-G FENCING WHOLESALE',
    country: 'Australia',
    city: 'Sydney',
    unloco: 'AUSYD',
    office_address: 'UNIT 9 453-455 VICTORIA STREET',
    suburb: 'Wetherill Park',
    state: 'New South Wales',
    post_code: '2164',
    telephone: '0250092231',
    email: ' ',
    status: 'Active'
  },
    {
    code: 'B-GFEWH',
    name: 'B-G FENCING WHOLESALE',
    country: 'Australia',
    city: 'Sydney',
    unloco: 'AUSYD',
    office_address: 'UNIT 9 453-455 VICTORIA STREET',
    suburb: 'Wetherill Park',
    state: 'New South Wales',
    post_code: '2164',
    telephone: '0250092231',
    email: ' ',
    status: 'Active'
  },
    {
    code: 'B-GFEWH',
    name: 'B-G FENCING WHOLESALE',
    country: 'Australia',
    city: 'Sydney',
    unloco: 'AUSYD',
    office_address: 'UNIT 9 453-455 VICTORIA STREET',
    suburb: 'Wetherill Park',
    state: 'New South Wales',
    post_code: '2164',
    telephone: '0250092231',
    email: ' ',
    status: 'Active'
  },
    {
    code: 'B-GFEWH',
    name: 'B-G FENCING WHOLESALE',
    country: 'Australia',
    city: 'Sydney',
    unloco: 'AUSYD',
    office_address: 'UNIT 9 453-455 VICTORIA STREET',
    suburb: 'Wetherill Park',
    state: 'New South Wales',
    post_code: '2164',
    telephone: '0250092231',
    email: ' ',
    status: 'Active'
  },
    {
    code: 'B-GFEWH',
    name: 'B-G FENCING WHOLESALE',
    country: 'Australia',
    city: 'Sydney',
    unloco: 'AUSYD',
    office_address: 'UNIT 9 453-455 VICTORIA STREET',
    suburb: 'Wetherill Park',
    state: 'New South Wales',
    post_code: '2164',
    telephone: '0250092231',
    email: ' ',
    status: 'Active'
  },
    {
    code: 'B-GFEWH',
    name: 'B-G FENCING WHOLESALE',
    country: 'Australia',
    city: 'Sydney',
    unloco: 'AUSYD',
    office_address: 'UNIT 9 453-455 VICTORIA STREET',
    suburb: 'Wetherill Park',
    state: 'New South Wales',
    post_code: '2164',
    telephone: '0250092231',
    email: ' ',
    status: 'Active'
  },
    {
    code: 'B-GFEWH',
    name: 'B-G FENCING WHOLESALE',
    country: 'Australia',
    city: 'Sydney',
    unloco: 'AUSYD',
    office_address: 'UNIT 9 453-455 VICTORIA STREET',
    suburb: 'Wetherill Park',
    state: 'New South Wales',
    post_code: '2164',
    telephone: '0250092231',
    email: ' ',
    status: 'Active'
  },
    {
    code: 'B-GFEWH',
    name: 'B-G FENCING WHOLESALE',
    country: 'Australia',
    city: 'Sydney',
    unloco: 'AUSYD',
    office_address: 'UNIT 9 453-455 VICTORIA STREET',
    suburb: 'Wetherill Park',
    state: 'New South Wales',
    post_code: '2164',
    telephone: '0250092231',
    email: ' ',
    status: 'Active'
  },
    {
    code: 'B-GFEWH',
    name: 'B-G FENCING WHOLESALE',
    country: 'Australia',
    city: 'Sydney',
    unloco: 'AUSYD',
    office_address: 'UNIT 9 453-455 VICTORIA STREET',
    suburb: 'Wetherill Park',
    state: 'New South Wales',
    post_code: '2164',
    telephone: '0250092231',
    email: ' ',
    status: 'Active'
  },
    {
    code: 'B-GFEWH',
    name: 'B-G FENCING WHOLESALE',
    country: 'Australia',
    city: 'Sydney',
    unloco: 'AUSYD',
    office_address: 'UNIT 9 453-455 VICTORIA STREET',
    suburb: 'Wetherill Park',
    state: 'New South Wales',
    post_code: '2164',
    telephone: '0250092231',
    email: ' ',
    status: 'Active'
  },

]
export const headerData1 = [
  {
    Header: 'Action',
    accessor: 'action',
    align: 'center',
    width:45,
    Cell: ({ row }) => <ActionIcon row={row.original} />,
  },
  {
    Header: 'Event Time',
    accessor: 'event_time',
    width:150

  },
  {
    Header: 'Created By',
    accessor: 'created_by',
    width:100
  },
  {
    Header: 'Event Source',
    accessor: 'event_source',
    width:100
  },
  {
    Header: 'Source Code',
    accessor: 'source_code',
    width:100
  },
  {
    Header: 'Event Type',
    accessor: 'event_type',
    width:100,
  },
  {
    Header: 'Changed Data',
    accessor: 'changed_data',
    width:130,
  },
  {
    Header: 'Old Row Data',
    accessor: 'old_row_data',
    width:150,
  },
  {
    Header: 'New Row Data',
    accessor: 'new_row_data',
    width:150
  },
]
export const bodyData1 = [
  {
    event_time: '2021-09-23 10:00:00',
    created_by: 'TrungHieu',
    event_source: 'Client',
    source_code: 'B-GFEWH',
    event_type: 'Insert',
    changed_data: 'cto_edo: null --> 1024999878; ',
    old_row_data: 'feregrgergergergergergergerg ',
    new_row_data: ' veverergregergregregregreger',
  },
  {

    event_time: '2021-09-23 10:00:00',
    created_by: 'TrungHieu',
    event_source: 'Client',
    source_code: 'B-GFEWH',
    event_type: 'Insert',
    changed_data: 'cto_edo: null --> 1024999878; ',
    old_row_data: 'feregrgergergergergergergerg ',
    new_row_data: ' veverergregergregregregreger',
  },
  {
    event_time: '2021-09-23 10:00:00',
    created_by: 'TrungHieu',
    event_source: 'Client',
    source_code: 'B-GFEWH',
    event_type: 'Insert',
    changed_data: 'cto_edo: null --> 1024999878; ',
    old_row_data: 'feregrgergergergergergergerg ',
    new_row_data: ' veverergregergregregregreger',
  },
  {
    event_time: '2021-09-23 10:00:00',
    created_by: 'TrungHieu',
    event_source: 'Client',
    source_code: 'B-GFEWH',
    event_type: 'Insert',
    changed_data: 'cto_edo: null --> 1024999878; ',
    old_row_data: 'feregrgergergergergergergerg ',
    new_row_data: ' veverergregergregregregreger',
  },
  {
    event_time: '2021-09-23 10:00:00',
    created_by: 'TrungHieu',
    event_source: 'Client',
    source_code: 'B-GFEWH',
    event_type: 'Insert',
    changed_data: 'cto_edo: null --> 1024999878; ',
    old_row_data: 'feregrgergergergergergergerg ',
    new_row_data: ' veverergregergregregregreger',
  },
  {
    event_time: '2021-09-23 10:00:00',
    created_by: 'TrungHieu',
    event_source: 'Client',
    source_code: 'B-GFEWH',
    event_type: 'Insert',
    changed_data: 'cto_edo: null --> 1024999878; ',
    old_row_data: 'feregrgergergergergergergerg ',
    new_row_data: ' veverergregergregregregreger',
  },
  {
    event_time: '2021-09-23 10:00:00',
    created_by: 'TrungHieu',
    event_source: 'Client',
    source_code: 'B-GFEWH',
    event_type: 'Insert',
    changed_data: 'cto_edo: null --> 1024999878; ',
    old_row_data: 'feregrgergergergergergergerg ',
    new_row_data: ' veverergregergregregregreger',
  },
  {
    event_time: '2021-09-23 10:00:00',
    created_by: 'TrungHieu',
    event_source: 'Client',
    source_code: 'B-GFEWH',
    event_type: 'Insert',
    changed_data: 'cto_edo: null --> 1024999878; ',
    old_row_data: 'feregrgergergergergergergerg ',
    new_row_data: ' veverergregergregregregreger',
  },

  {
    event_time: '2021-09-23 10:00:00',
    created_by: 'TrungHieu',
    event_source: 'Client',
    source_code: 'B-GFEWH',
    event_type: 'Insert',
    changed_data: 'cto_edo: null --> 1024999878; ',
    old_row_data: 'feregrgergergergergergergerg ',
    new_row_data: ' veverergregergregregregreger',
  },
  {
    event_time: '2021-09-23 10:00:00',
    created_by: 'TrungHieu',
    event_source: 'Client',
    source_code: 'B-GFEWH',
    event_type: 'Insert',
    changed_data: 'cto_edo: null --> 1024999878; ',
    old_row_data: 'feregrgergergergergergergerg ',
    new_row_data: ' veverergregergregregregreger',
  },
  {
    event_time: '2021-09-23 10:00:00',
    created_by: 'TrungHieu',
    event_source: 'Client',
    source_code: 'B-GFEWH',
    event_type: 'Insert',
    changed_data: 'cto_edo: null --> 1024999878; ',
    old_row_data: 'feregrgergergergergergergerg ',
    new_row_data: ' veverergregergregregregreger',
  },
  {
    event_time: '2021-09-23 10:00:00',
    created_by: 'TrungHieu',
    event_source: 'Client',
    source_code: 'B-GFEWH',
    event_type: 'Insert',
    changed_data: 'cto_edo: null --> 1024999878; ',
    old_row_data: 'feregrgergergergergergergerg ',
    new_row_data: ' veverergregergregregregreger',
  },
  {
    event_time: '2021-09-23 10:00:00',
    created_by: 'TrungHieu',
    event_source: 'Client',
    source_code: 'B-GFEWH',
    event_type: 'Insert',
    changed_data: 'cto_edo: null --> 1024999878; ',
    old_row_data: 'feregrgergergergergergergerg ',
    new_row_data: ' veverergregergregregregreger',
  },
  {
    event_time: '2021-09-23 10:00:00',
    created_by: 'TrungHieu',
    event_source: 'Client',
    source_code: 'B-GFEWH',
    event_type: 'Insert',
    changed_data: 'cto_edo: null --> 1024999878; ',
    old_row_data: 'feregrgergergergergergergerg ',
    new_row_data: ' veverergregergregregregreger',
  },

]