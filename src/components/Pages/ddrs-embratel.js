import React from "react";
import { useEffect, useState, useMemo } from "react";
import { SelectColumnFilter } from "./Filter";
import Table from "./TableContainer";
import "./ddrs-embratel.css";
import Axios from "axios";

import CircularProgress from "@mui/material/CircularProgress";

export default function DDrsEmbratel() {
  const [data, setData] = useState([]);
  const [isLoaded, setIsloaded] = useState(false);
  var [avaliableDDRS, setAvaliableDDRS] = useState(0);
  var [usedDDRS, setUsedDDRS] = useState(0);

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [loginStatus, setLoginStatus] = useState();
  const [loginStatusMessage, setLoginStatusMessage] = useState();
  var [username, setUsername] = useState("");
  var [password, setPassword] = useState("");

  var valorAvaliable = 0;
  var valorUsed = 0;

  function calculateAvaliableDDRS(data) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].state == "Em Uso") {
        valorAvaliable++;
      }
      if (data[i].state == "-") {
        valorUsed++;
      }
    }
    setAvaliableDDRS(valorAvaliable);
    setUsedDDRS(valorUsed);
  }

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    console.log("Stored User: " + loggedInUser);
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      console.log(foundUser);
      // const stringefied = JSON.parse(foundUser);
      // console.log(stringefied)
      setIsLoggedin(true);
      setLoginStatus(foundUser.username);
    }

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
        calculateAvaliableDDRS(jsonResponse.extensions);
        setData(jsonResponse.extensions);
        setIsloaded(true);
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

  function LoginForm(props) {
    const Loggedin = props.isLogged;

    function login(e) {
      e.preventDefault();
      console.log("Login function");
      console.log(username);
      console.log(password);
      Axios.post("http://localhost:4000/login", {
        username: username,
        password: password,
      }).then((response) => {
        if (response.data.message) {
          setLoginStatusMessage(response.data.message);
        } else {
          setIsLoggedin(true);
          setLoginStatus(response.data.username);
          const userStringfy = response.data;
          localStorage.setItem("user", JSON.stringify(userStringfy));
        }
        console.log(response);
      });
    }
    var [username, setUsername] = useState("");
    var [password, setPassword] = useState("");
    
    if (Loggedin == false) {
      console.log("No login detected");
      return (
        <div className="form modal-wrapper">
          <form onSubmit={login}>
            <div className="input-container">
              <label>Username </label>
              <input
                type="text"
                name="uname"
                required
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
              {/* {renderErrorMessage("uname")} */}
            </div>
            <div className="input-container">
              <label>Password </label>
              <input
                type="password"
                name="pass"
                required
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                value={password}
              />
              {/* {renderErrorMessage("pass")} */}
            </div>
            <div className="button-container">
              <button type="sumbit" value="Login">
                Login
              </button>
            </div>
            <p>{loginStatusMessage}</p>
          </form>
        </div>
      );
    }
  }

  if (isLoaded && isLoggedin) {
    return (
      <div className="Table">
        <div className="login-status">
          <p>{loginStatus}</p>
        </div>
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
  } else {
    return (
      <div className="Table">
        <div className="login-status">
          <p>{loginStatus}</p>
        </div>
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
          <LoginForm isLogged={isLoggedin} />
        </div>
      </div>
    );
  }
}
