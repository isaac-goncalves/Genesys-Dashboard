import './App.css';
import { useState, useEffect } from 'react'
import  Dashboard from './components/Dasboard'

import $ from 'jquery';
import { Chart } from 'react-chartjs-2';
import ChartComponent from './components/Chart';

window.jQuery = $;
window.$ = $;
global.jQuery = $;

export default function App() {

  return (
    <div className="App">
      <Dashboard/>
    </div>
  );
}

