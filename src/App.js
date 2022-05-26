import './App.css';
import { useState, useEffect } from 'react'
import Dashboard from './components/Dasboard'

import $ from 'jquery';
import ChartComponent from './components/Chart';
import { AppBar, Button, Toolbar, Typography } from "@mui/material"
import { Delete } from "@mui/icons-material"
import TimelineIcon from '@mui/icons-material/Timeline';

export default function App() {

  return (
    <div className="App">
      <AppBar style={{ background: 'rgb(51,56,61)' }} position='sticky'>
        <Toolbar>
        <img className='logo' src="/LG logo.png" alt="LG CNS logo" height="30"/>
          <Typography  variant='h5'>
        Monitoramento Genesys
          </Typography>
        </Toolbar>
      </AppBar>
      <Dashboard />
    </div>
  );
}

