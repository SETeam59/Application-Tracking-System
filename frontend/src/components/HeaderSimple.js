import { Link } from "react-router-dom";

function HeaderSimple({ auth, logout }) {
  return (
    <div className=" p-4 left-0 bg-white dark:bg-[#2b2c37] z-50 right-0">
      <header className="flex justify-between dark:text-white items-center">
        {/* Left Side */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <Link
            to="/"
            className="md:text-2xl hidden md:inline-block font-bold font-sans"
          >
            CareerPulse Tracker
          </Link>
          <Link
            to="/"
            className="text-2xl md:hidden lg:hidden font-bold font-sans mr-4"
          >
            CPT
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex space-x-4 items-center md:space-x-6">
          {!auth && (
            <>
              <Link
                className="button md:block"
                to="/login"
              >
                Login
              </Link>
              <Link className="button md:block" to="/signup">
                Sign Up
              </Link>
            </>
          )}{" "}
          {auth && (
            <button className="button md:block" onClick={logout}>
              Logout
            </button>
          )}
        </div>
      </header>
    </div>
  );
}

export default HeaderSimple;
