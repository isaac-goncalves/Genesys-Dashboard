import React from "react";
import { useEffect, useState, useMemo } from "react";
import { SelectColumnFilter } from "./Filter";
import Table from "./TableContainer";
import "./ddrs-embratel.css";

import CircularProgress from '@mui/material/CircularProgress';


export default function DDrsEmbratel() {
  const [data, setData] = useState([]);
  const [isLoaded, setIsloaded] = useState(false);
  var [avaliableDDRS, setAvaliableDDRS] = useState(0)
  var [usedDDRS, setUsedDDRS] = useState(0)

var valorAvaliable = 0
var valorUsed = 0 

function calculateAvaliableDDRS(data) {
for (let i = 0; i < data.length; i++) {
      if (data[i].state == "Em Uso") {
        valorAvaliable++;
      }
      if (data[i].state == "-") {
        valorUsed++;
      }
    }
    setAvaliableDDRS(valorAvaliable)
    setUsedDDRS(valorUsed)
}

  useEffect(() => {
    fetch(`http://136.166.35.153:4010/get_extensionstable`, {
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
        calculateAvaliableDDRS(jsonResponse.extensions)
        setData(jsonResponse.extensions);
        setIsloaded(true)
      });
    console.log("data: " + data.extensions);
  }, []);

  const columns = useMemo(() => [
    {
      Header: "Prefixo",
      accessor: "prefix",
    },
    {
      Header: "Terminação",
      accessor: "end",
    },
    {
      Header: "Estado",
      accessor: "state",
      Filter: SelectColumnFilter,
      filter: "includes",
    },
    {
      Header: "Nome",
      accessor: "name",
    },
    {
      Header: "Tipo",
      accessor: "ownerType",
      Filter: SelectColumnFilter,
      filter: "includes",
    },
    {
      Header: "Departamento",
      accessor: "department",
    },
  ]);

  if(isLoaded){
  return (
    <div className="Table">
      <div className="header-container">
        <h1>DDRS Embratel</h1>
        <div className="table-container">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Quantidade</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="Ativo">Disponiveis</td>
              <td>{avaliableDDRS}</td>
            </tr>
            <tr>
              <td className="Deletados">Em uso</td>
              <td>{usedDDRS}</td>
            </tr>
          </tbody>
        </div>
      </div>
      <Table className="content-table" columns={columns} data={data} />
    </div>
  );
  }
  else {
  return(
    <div className="Table">
    <div className="header-container">
      <h1>DDRS Embratel</h1>
      <div className="table-container">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Quantidade</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="Ativo">Disponiveis</td>
            <td>{avaliableDDRS}</td>
          </tr>
          <tr>
            <td className="Deletados">Em uso</td>
            <td>{usedDDRS}</td>
          </tr>
        </tbody>
      </div>
    </div>
    <div className="progress-icon">
          <CircularProgress />
        </div>
  </div>
  )
  }
}
