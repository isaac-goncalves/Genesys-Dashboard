import React from "react";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Table from "./TableContainer";
import { useTable } from "react-table";
import "./licensas-genesys.css";
import { SelectColumnFilter } from "./Filter";

export default function LicensasGenesys() {
  const [data, setData] = useState([]);

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
    <div className="Table">
      <h1>Licenças Genesys</h1>
      <Table className="content-table" columns={columns} data={data} />
    </div>
  );
}
