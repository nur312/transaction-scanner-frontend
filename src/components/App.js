import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import api from "../api/AxiosApi"
import './App.css';
import Header from './Header';
import TransactionsMainPage from './TransactionsMainPage';
import ValidateTransaction from "./ValidateTransaction";
import Auth from "./auth/Auth";
import UploadTransactions from "./UploadTransactions";
import CheckedTransactions from "./CheckedTransactions";
import ViewResult from "./ViewResult";
import SignUp from "./auth/SignUp";


function App(props) {

  const [isAuth, setIsAuth] = useState(false);

  if (!isAuth && localStorage.getItem("token")) {
    setIsAuth(true);
  }

  const login = async (user) => {

    api.post(`/auth/operator/sign-in`, {
      operatorUsername: user.username,
      operatorPassword: user.password
    }).then(
      (response) => {
        if (!response || response.status !== 200) {
          alert("Please check your username and password");
          return;
        }

        console.log(response);
        console.log(user);

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("operatorUsername", response.data.operatorUsername);
        localStorage.setItem("operatorId", response.data.operatorId);
        localStorage.setItem("role", "operator");
        setIsAuth(true);
        window.location.replace(`${window.location.origin}/operator`);
      }).catch((err) => {

        alert("Please check your username and password");
        console.log(err);
      });
  };

  const adminLogin = async (user) => {

    api.post(`/auth/admin/sign-in`, {
      adminUsername: user.username,
      adminPassword: user.password
    }).then(
      (response) => {
        if (!response || response.status !== 200) {
          alert("Please check your username and password");
          return;
        }

        console.log(response);
        console.log(user);

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("adminUsername", response.data.adminUsername);
        localStorage.setItem("adminId", response.data.adminId);
        localStorage.setItem("role", "admin");
        setIsAuth(true);
        window.location.replace(`${window.location.origin}/`);
      }).catch((err) => {

        alert("Please check your username and password");
        console.log(err);
      });

  }

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("operatorUsername");
    localStorage.removeItem("operatorId");
    localStorage.removeItem("role");
    localStorage.removeItem("adminUsername");
    localStorage.removeItem("adminId");
    setIsAuth(false);
    window.location.replace(`${window.location.origin}/`);
  }

  const signUp = (user) => {

    console.log(`going to add the operator ${JSON.stringify(user)}`);

    const operator = {
      operatorUsername: user.username,
      operatorPassword: user.password
    }
    api.post("/operator/sign-up", operator)
      .then((response) => {
        if (response.status !== 200 && response.status !== 201) {
          alert("Couldn't add a new user")
          return;
        }
        alert(user.username + " was added as operator")
        return;
      }).catch((error) => {
        alert("Couldn't add a new user");
        console.log(error);
      });
  }

  console.log(isAuth)
  if (!isAuth) {
    return (<Auth login={login} adminLogin={adminLogin} logout={logout} />)
  }

  return localStorage.getItem("role") !== "admin" ? (
    <div className='ui container'>
      <Router>
        <Header logout={logout} />
        <Routes>
          <Route path={"/operator"} exact
            element={
              <TransactionsMainPage />}
          />

          <Route
            path={"/transaction/validate/:id"}
            element={<ValidateTransaction {...props} />}
          />

          <Route
            path={"/transaction/result/view/all"}
            element={<CheckedTransactions />}
          />

          <Route
            path={"/transaction/result/view/:id"}
            element={<ViewResult />}
          />

          <Route

            path={"/operator/auth"}
            element={<Auth login={login} signUp={signUp} />}
          />
          <Route

            path={"/transaction/upload"}
            element={<UploadTransactions />}
          />
        </Routes>
      </Router>
    </div>
  ) : (
    <div className='ui container'>
      <Router>
        <Routes>
          <Route
            path={"/"}
            element={<SignUp {...props} logout={logout} signUp={signUp} />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
