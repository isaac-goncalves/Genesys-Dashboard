import React from "react";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Table from "./TableContainer";
import { useTable } from "react-table";

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
        setData(jsonResponse);
      });
    console.log("data: " + data.users);
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "Users Genesys",
        columns: [
          {
            Header: "Nome",
            accessor: "users.name"
          },
          {
            Header: "estado",
            accessor: "users.state"
          },
          {
            Header: "Departmento",
            accessor: "users.department"
          },
          {
            Header: "Gerente",
            accessor: "users.manager",
          },
          {
            Header: "Ultimo Login",
            accessor: "users.lastlogin",
          },
          {
            Header: "Ramal",
            accessor: "users.address",
          },
          {
            Header: "licensa",
            accessor: "users.license",
          },
          
        ]
      }
    ]
  )

  return <div>
      <h1>Teste Tabela</h1>
      <Table columns={columns} data={data} />
  </div>;
}
