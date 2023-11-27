import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Landing = (auth) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/boards")
    }
  }, [auth, navigate])

  return (
    <div className="w-100 h-full min-h-full mb-20 mx-20 flex flex-col items-center">
      <h1 className="text-6xl inline-block font-bold font-sans mt-20 md:mt-40 mb-20">Welcome to CareerPulse Tracker</h1>
      <h1 className="text-3xl inline-block font-bold font-sans mb-20">#Join the experience</h1>
      <div className="flex gap-10 md:flex-row flex-col">
        <Link className="button md:block md:w-48 w-96 text-center" to="/login">
          Login
        </Link>
        <Link className="button md:block md:w-48 w-96 text-center" to="/signup">
          Sign Up
        </Link>
      </div>
    </div>
  );
};
