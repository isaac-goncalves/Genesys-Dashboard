import './App.css';
import { useState, useEffect } from 'react'
import  Edge from './components/Edge'

import $ from 'jquery';
import { Chart } from 'react-chartjs-2';
import Dashboard from './components/Dashboard';
window.jQuery = $;
window.$ = $;
global.jQuery = $;

export default function App() {

  return (
    <div className="App">
      <Edge/>
    </div>
  );
}

