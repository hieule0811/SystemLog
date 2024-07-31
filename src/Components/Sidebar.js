import React, { useState, useEffect } from 'react';
import {Link, useLocation, useParams} from 'react-router-dom';
import styles from './Sidebar.module.scss';
import logo from '../images/logo.webp';
import { MdMenu } from "react-icons/md";
import { LuUsers } from "react-icons/lu";
import { GiBackwardTime } from "react-icons/gi";
import { RxAvatar } from "react-icons/rx";
import { CiLogout } from "react-icons/ci";

const Sidebar = () => {
  const location = useLocation();
  // const { username } = useParams();
  const [isMenuOpen, setIsMenuOpen] = useState(() => {
    // Đọc giá trị từ sessionStorage nếu tồn tại
    const storedValue = sessionStorage.getItem('isMenuOpen');
    return storedValue ? JSON.parse(storedValue) : false;
  });
  const [tentk, setTentk] = useState('');

  // Cập nhật giá trị isMenuOpen vào sessionStorage
  useEffect(() => {
    const storedTentk = localStorage.getItem('tentk');
    if (storedTentk) {
      setTentk(storedTentk);
    }
    sessionStorage.setItem('isMenuOpen', JSON.stringify(isMenuOpen));
  }, [isMenuOpen]);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isSubMenuActive = (subMenu) => {
    return subMenu.some(subItem => location.pathname === subItem.path);
  };

  const SidebarData = [
    {
      title: 'Menu',
      icon: <MdMenu />,
      path: null,
      subMenu: [
        {
          title: 'Clients',
          icon: <LuUsers />,
          path: `/client`
        },
        {
          title: 'System Logs',
          icon: <GiBackwardTime />,
          path: `/systemlog`
        }
      ]
    }
  ];

  return (
      <div className={styles.SidebarContainer}>
        <div className={styles.SidebarTop}>
          <img className={styles.SidebarLogo} src={logo} alt="Logo" />
        </div>
        <div className={styles.SidebarBottom}>
          <ul className={styles.SidebarList}>
            {SidebarData.map((item, index) => (
                <React.Fragment key={index}>
                  <li
                      className={`${styles.SidebarItem} ${isMenuOpen && isSubMenuActive(item.subMenu) ? styles.activeMenu : ''}`}
                      onClick={handleMenuClick}
                  >
                    <div className={styles.SidebarLink}>
                      <div className={`${index !== 0 ? styles.ItemsIcon : styles.IconFirst}`}>
                        {item.icon}
                      </div>
                      <div className={`${index !== 0 ? styles.ItemsTitle : styles.TitleFirst}`}>
                        {item.title}
                      </div>
                    </div>
                  </li>
                  {isMenuOpen && item.subMenu && item.subMenu.map((subItem, subIndex) => {
                    const isActive = location.pathname === subItem.path;
                    return (
                        <li
                            key={subIndex}
                            className={`${styles.SidebarItem} ${isActive ? styles.active : ''} ${styles.subMenuItem}`}
                        >
                          <Link to={subItem.path} className={styles.SidebarLink}>
                            <div className={styles.ItemsIcon}>
                              {subItem.icon}
                            </div>
                            <div className={styles.ItemsTitle}>
                              {subItem.title}
                            </div>
                          </Link>
                        </li>
                    );
                  })}
                </React.Fragment>
            ))}
          </ul>
          <div className={styles.SidebarLog}>
            <ul className={styles.SidebarLogList}>
              <li className={styles.SidebarAvatar}>
                <RxAvatar className={styles.SidebarAva} />
                <div className={styles.SidebarName}>
                  {tentk}
                </div>
              </li>
              <li>
                <Link to = "/">
                  <button className={styles.SidebarButton}>
                    <CiLogout /> Logout
                  </button>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
  );
};

export default Sidebar;