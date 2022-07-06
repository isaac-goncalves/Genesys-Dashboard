import React from "react";
import { useEffect, useState, useMemo } from "react";
import { SelectColumnFilter } from "./Filter";
import Table from "./TableContainer";
import "./ddrs-embratel.css";

export default function DDrsEmbratel() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:4000/get_extensionstable`, {
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
        setData(jsonResponse.extensions);
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
              <td>153</td>
            </tr>
            <tr>
              <td className="Deletados">Em uso</td>
              <td>256</td>
            </tr>
          </tbody>
        </div>
      </div>
      <Table className="content-table" columns={columns} data={data} />
    </div>
  );
}
