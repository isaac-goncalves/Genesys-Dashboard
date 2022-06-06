import React from "react";
import { useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { Link } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import { Icon } from "@mui/material";
import './Navbar.css'
import { AppBar, Button, Toolbar, Typography } from "@mui/material"
import image from "../LG logo.png";
import { IconContext} from 'react-icons' 

export default function Navbar() {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
    <IconContext.Provider value={{color: '#fff'}}>
     <div className='navbar'>
        <AppBar style={{ background: 'rgb(51,56,61)' }} >
        <Toolbar>
          <Link to='#' className='menu-bars'>
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
        <img className='logo' src={image} alt="LG CNS logo" height="30"/>
          <Typography  variant='h5'>
        Monitoramento Genesys
          </Typography>
        </Toolbar>
      </AppBar>
        </div>
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items' onClick={showSidebar}>
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              )
          })}
        </ul>
      </nav>
      </IconContext.Provider>
    </>
  );
}
