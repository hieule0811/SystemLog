import React from 'react';
import Sidebar from '../Components/Sidebar.js';
import styles from '../Styles/InsertPage.module.scss';
export const InsertPage = () => {
  return (
    <div className={styles.InsertPage}>
      Hihi
    </div>
  );
};
function App(){
  return(
    <React.Fragment>
      <Sidebar/>
      <InsertPage/>
    </React.Fragment>
  )
}
export default App;
