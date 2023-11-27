import React, { useEffect, useState } from "react";
import "./LoginPage.css"; // Import the local CSS file

import { getToken, signUp, storeToken } from "../api/loginHandler";
import { useNavigate } from "react-router-dom";
import { getDataFunction } from "../api/boardsHandler";
import { useDispatch } from "react-redux";
import boardsSlice from "../redux/boardsSlice";

const LoginPage = ({ activeTab = "login", auth }) => {
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [signupData, setSignupData] = useState({
    fullName: "",
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (auth) {
      navigate("/boards")
    }
  }, [auth, navigate])

  /** Login functionality called when button is clicked */
  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginData.username || !loginData.password) {
      setErr("Fields cannot be empty");
      return;
    }
    getToken(loginData)
      .then((res) => {
        if (res["error"]) {
          setMsg("");
          setErr("Error while logging in!");
          throw new Error(res["error"]);
        }
        setLoginData({ username: "", password: "" });
        storeToken(res);
        setErr("");
        setMsg("");

        getDataFunction().then((boards) => {
          dispatch(boardsSlice.actions.setInitialData({ initialData: boards }));
        }).catch((err) => console.log(err))

        setInterval(() => {
          navigate("/boards");
        }, 500);
      })
      .catch((error) => {
        console.log(error);
        // alert("Error while logging in! Wrong username or password");
        setMsg("");
        setErr("Wrong username or password");
      });
  };

  /** Signup functionality called when button is clicked */
  const handleSignup = (e) => {
    e.preventDefault();
    if (!signupData.fullName || !signupData.username || !signupData.password) {
      setErr("Fields cannot be empty");
      return;
    }
    signUp(signupData)
      .then((res) => {
        setErr("");
        setMsg("Sign up successfull! Proceed to Login");
        setSignupData({ fullName: "", username: "", password: "" });

        setTimeout(() => {
          setMsg("");
          navigate("/login");
        }, 1500);
      })
      .catch((error) => {
        console.log(error);
        setMsg("");
        setErr("Username already exists");
      });
  };

  /** Changing HTML depending on which of login and signup is active */
  return (
    <div className="container my-0 mx-auto">
      <div className="auth-wrapper">
        <div className="auth-inner">
          <h3 className=" text-lg mb-4">
            {activeTab === "login" ? "Login" : "Sign Up"}
          </h3>
          {err !=="" && msg === "" && (
            <p className="text-red-800 dark:text-red-400">{err}</p>
          )}
          {msg !== "" && err === "" && (
            <p className="text-green-800 dark:text-green-400">{msg}</p>
          )}
          {err === "" && msg === "" && (
            <p className="opacity-0" aria-hidden>
              blank
            </p>
          )}
          {activeTab === "login" && (
            <form className="mt-4">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  value={loginData.username}
                  onChange={(e) =>
                    setLoginData({ ...loginData, username: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                />
              </div>
              <button
                type="button"
                onClick={handleLogin}
                className="button md:block w-full mt-10"
              >
                Login
              </button>
            </form>
          )}
          {activeTab === "signup" && (
            <form className="mt-4">
              <div className="form-group">
                <label>Full name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Full name"
                  value={signupData.fullName}
                  onChange={(e) =>
                    setSignupData({ ...signupData, fullName: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter Email"
                  value={signupData.username}
                  onChange={(e) =>
                    setSignupData({ ...signupData, username: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  value={signupData.password}
                  onChange={(e) =>
                    setSignupData({ ...signupData, password: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                onClick={handleSignup}
                className="button md:block w-full mt-10"
              >
                Sign Up
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
