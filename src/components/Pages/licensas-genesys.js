import React from "react";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Table from "./TableContainer";
import { useTable } from "react-table";
import "./licensas-genesy.css";
import { SelectColumnFilter } from "./Filter";

export default function LicensasGenesys() {
  const [data, setData] = useState([]);
  var [activeUsers, setActiveUsers] = useState();
  var [deletedUsers, setDeletedUsers] = useState();
  var [inactiveUsers, setInactiveUsers] = useState();
var valordeAtivos = 0
var valordeDeleted = 0
var valorInactive = 0 

  function calculateActives(data) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].state == 'active') {
        valordeAtivos++
      }
      if (data[i].state == 'deleted') {
        valordeDeleted++;  
      }
      if (data[i].state == 'inactive') {
        valorInactive++;    
      }
    }
    setActiveUsers(valordeAtivos);
    setDeletedUsers(valordeDeleted);
    setInactiveUsers(valorInactive);
    console.log(
      "\n" + "Active users: " + activeUsers + 
      "\n" + "Deleted users: " + deletedUsers + 
      "\n" + "Inactive users: " + inactiveUsers 
      );
  }

  useEffect(() => {
    fetch(`http://localhost:4000/get_userstable`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw Error(res.statusText);
        }
      })
      .then((jsonResponse) => {
        console.log(jsonResponse);
        setData(jsonResponse.users);
        calculateActives(jsonResponse.users)
      });
    console.log("data: " + data.users);
  }, []);

  const columns = useMemo(() => [
    {
      Header: "Nome",
      accessor: "name",
    },
    {
      Header: "Estado",
      accessor: "state",
      Filter: SelectColumnFilter,
      filter: "includes",
    },
    {
      Header: "Departmento",
      accessor: "department",
    },
    {
      Header: "Gerente",
      accessor: "manager",
    },
    // {
    //   Header: "Ultimo Login",
    //   accessor: "lastlogin",
    // },
    {
      Header: "Ramal",
      accessor: "extension",
    },
    {
      Header: "Tipo de Licença",
      accessor: "license",
      Filter: SelectColumnFilter,
      filter: "includes",
    },
  ]);

  return (
    <div>
      <div className="header-container">
        <h1>Licenças Genesys</h1>
        <div className="table-container">
          <thead>
            <tr>
              <th>Tipo de Licença</th>
              <th>Quantidade</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="">CloudCX3</td>
              <td>218</td>
            </tr>
            <tr>
              <td className="">PredictiveEngagementLicense</td>
              <td>153</td>
            </tr>
            <tr>
              <td className="">Communicate</td>
              <td>59</td>
            </tr>
          </tbody>
        </div>
        <div className="table-container">
          <thead>
            <tr>
              <th>Acessos</th>
              <th>Quantidade</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="Ativo">Ativo</td>
              <td>{activeUsers}</td>
            </tr>
            <tr>
              <td className="Deletados">Deletados</td>
              <td>{deletedUsers}</td>
            </tr>
            <tr>
              <td className="Desativados">Desativados</td>
              <td>{inactiveUsers}</td>
            </tr>
          </tbody>
        </div>
      </div>
      <Table className="content-table" columns={columns} data={data} />
    </div>
  );
}
