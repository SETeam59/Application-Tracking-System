import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import TrackerPage from "./tracker";
import LoginPage from "./login/LoginPage";
import boardsSlice from "./redux/boardsSlice";
import { useDispatch } from "react-redux";
import { Landing } from "./landing/Landing";
import HeaderSimple from "./components/HeaderSimple";
import { getDataFunction } from "./api/boardsHandler";

function App() {
  const [auth, setAuth] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiry");
    localStorage.removeItem("theme");
    dispatch(boardsSlice.actions.deleteInitialData());
    setAuth(auth => !auth);
    navigate("/login");
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setAuth(true);
      getDataFunction().then((boards) => {
        dispatch(boardsSlice.actions.setInitialData({ initialData: boards }));
      }).catch((err) => navigate("/boards"))
    } else {
      setAuth(false);
    }
  }, [auth, dispatch, navigate]);

  return (
    <div className="main-page">
      <p aria-hidden id="test" className="absolute opacity-0">
        Test test
      </p>
      <Routes>
        <Route
          path="/login"
          element={
            <>
              <HeaderSimple auth={auth} logout={handleLogout} />
              <LoginPage activeTab="login" auth={auth} />
            </>
          }
        />
        <Route
          path="/signup"
          element={
            <>
              <HeaderSimple auth={auth} logout={handleLogout} />
              <LoginPage activeTab="signup" auth={auth} />
            </>
          }
        />
        <Route
          path="/boards"
          element={
            <TrackerPage
              getData={getDataFunction}
              logout={handleLogout}
              page="boards"
              auth={auth}
            />
          }
        />
        <Route
          path="/applications"
          element={
            <TrackerPage
              getData={getDataFunction}
              logout={handleLogout}
              page="applications"
              auth={auth}
            />
          }
        />
        <Route
          path="/" exact
          element={
            <>
              <HeaderSimple auth={auth} logout={handleLogout} />
              <Landing auth={auth} />
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
