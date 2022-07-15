import React from "react";
import { useEffect, useState, useMemo } from "react";
import Axios from "axios";
import Table from "./TableContainer";
import { useTable } from "react-table";
import "./licensas-genesy.css";
import { SelectColumnFilter } from "./Filter";
import Button from "@mui/material/Button";

import CircularProgress from "@mui/material/CircularProgress";

export default function LicensasGenesys() {
  const [data, setData] = useState([]);
  const [isLoaded, setIsloaded] = useState(false);
  var [activeUsers, setActiveUsers] = useState(0);
  var [deletedUsers, setDeletedUsers] = useState(0);
  var [inactiveUsers, setInactiveUsers] = useState(0);
  var [CX3Users, setCX3Users] = useState(0);
  var [preditiveEngUsers, setpreditiveEngUsers] = useState(0);
  var [communicateUsers, setcommunicateUsers] = useState(0);

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [loginStatus, setLoginStatus] = useState();
  const [loginStatusMessage, setLoginStatusMessage] = useState();

  var valordeAtivos = 0;
  var valordeDeleted = 0;
  var valorInactive = 0;

  var valordeCX3 = 0;
  var valordePreditiveEng = 0;
  var valorCommunicate = 0;

  function calculateActives(data) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].state == "active") {
        valordeAtivos++;
      }
      if (data[i].state == "deleted") {
        valordeDeleted++;
      }
      if (data[i].state == "inactive") {
        valorInactive++;
      }
      if (data[i].license == "cloudCX3") {
        valordeCX3++;
      }
      if (data[i].license == "predictiveEngagementLicense") {
        valordePreditiveEng++;
      }
      if (data[i].license == "communicate") {
        valorCommunicate++;
      }
    }
    setActiveUsers(valordeAtivos);
    setDeletedUsers(valordeDeleted);
    setInactiveUsers(valorInactive);
    setCX3Users(valordeCX3);
    setpreditiveEngUsers(valordePreditiveEng);
    setcommunicateUsers(valorCommunicate);
    console.log(
      "\n" +
        "Active users: " +
        activeUsers +
        "\n" +
        "Deleted users: " +
        deletedUsers +
        "\n" +
        "Inactive users: " +
        inactiveUsers
    );
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
      fetchData();
    }
  }, []);

  function fetchData() {
    fetch(`http://136.166.35.153:4010/get_userstable`, {
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
        calculateActives(jsonResponse.users);
        setIsloaded(true);
      });
    console.log("data: " + data.users);
  }

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

  function logout() {
    localStorage.removeItem("user");
    setLoginStatus("");
    setIsLoggedin(false);
    setLoginStatusMessage();
    window.location.reload(false);
    setIsloaded(false);
  }

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
          fetchData();
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
             
              <Button
                type="sumbit"
                value="Login"
                sx={{ color: "Black", borderColor: "Black" }}
                className="logout-button"
                variant="outlined"
              >
                Login
              </Button>
            </div>
            <p>{loginStatusMessage}</p>
          </form>
        </div>
      );
    }
  }

  if (isLoaded && isLoggedin) {
    return (
      <div>
        <div className="login-status">
          <p>{loginStatus}</p>
          <Button
            onClick={logout}
            sx={{ color: "white", borderColor: "white" }}
            className="logout-button"
            variant="outlined"
          >
            Logout
          </Button>
        </div>
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
                <td>{CX3Users}</td>
              </tr>
              <tr>
                <td className="">Communicate</td>
                <td>{communicateUsers}</td>
              </tr>
              <tr>
                <td className="">PredictiveEngagementLicense</td>
                <td>{preditiveEngUsers}</td>
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
  } else {
    return (
      <>
        <div className="header-container">
          <div className="login-status"></div>
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
                <td>{CX3Users}</td>
              </tr>
              <tr>
                <td className="">Communicate</td>
                <td>{communicateUsers}</td>
              </tr>
              <tr>
                <td className="">PredictiveEngagementLicense</td>
                <td>{preditiveEngUsers}</td>
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
        <div className="progress-icon">
          <CircularProgress />
          <LoginForm isLogged={isLoggedin} />
        </div>
      </>
    );
  }
}
