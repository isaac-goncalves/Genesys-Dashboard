import React from "react";
import { useEffect, useState, useMemo } from "react";
import { SelectColumnFilter } from "./Filter";
import Table from "./TableContainer";
import "./ddrs-embratel.css";
import Axios from "axios";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

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

  function LoginStatus() {
    {
      if (loginStatusMessage) {
        return (
          <div className="loginStatusMessage">
            <ErrorOutlineIcon style={{ color: "red" }} />
            <p>{loginStatusMessage}</p>
          </div>
        );
      }
    }
  }

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
      Axios.post("http://136.166.35.153:4010/login", {
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
              <Grid align="center">
                <div className="login-header">
                  <Avatar>
                    <LockOutlinedIcon />
                  </Avatar>
                  <h2>Sign In</h2>
                </div>
              </Grid>
              <TextField
                size="small"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                type="text"
                label="Username"
                placeholder="Digite o usuário"
                fullWidth
              />
              <TextField
                size="small"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="text"
                label="Password"
                placeholder="Digite a senha"
                fullWidth
              />
              <div className="button-container">
                <Button
                  fullWidth
                  type="sumbit"
                  value="Login"
                  sx={{ color: "Black", borderColor: "Black" }}
                  className="logout-button"
                  variant="outlined"
                >
                  Login
                </Button>
              </div>
              <LoginStatus />
            </div>
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
