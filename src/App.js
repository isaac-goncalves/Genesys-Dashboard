import "./App.css";
import Dashboard from "./components/Dasboard";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import DDrsEmbratel from "./components/Pages/ddrs-embratel";
import LicensasGenesys from "./components/Pages/licensas-genesys";
import TesteGenesys from "./components/Pages/testewidgetGenesys";

export default function App() {
  return (
    <BrowserRouter>
        <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/ddrs-embratel" element={<DDrsEmbratel />} />
        <Route path="/licensas-genesys" element={<LicensasGenesys />} />
        <Route path="/testegenesys" element={<TesteGenesys />} />
      </Routes>
    </BrowserRouter>
  );
}
