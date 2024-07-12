import React from 'react';
import Sidebar from '../Components/Sidebar.js';
import styles from '../Styles/UpdatePage.module.scss';
export const UpdatePage = () => {
  return (
    <div className={styles.UpdatePage}>
      Hihi
    </div>
  );
};
function App(){
  return(
    <React.Fragment>
      <Sidebar/>
      <UpdatePage/>
    </React.Fragment>
  )
}
export default App;
