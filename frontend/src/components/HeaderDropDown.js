import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch } from "@headlessui/react";
import boardIcon from "../assets/icon-board.svg";
import useDarkMode from "../hooks/useDarkMode";
import darkIcon from "../assets/icon-dark-theme.svg";
import lightIcon from "../assets/icon-light-theme.svg";
import boardsSlice from "../redux/boardsSlice";
import AddEditBoardModal from "../modals/AddEditBoardModal";
import DeleteModal from "../modals/DeleteModal";
import { getDataFunction } from "../api/boardsHandler";
import { useLocation, useNavigate } from "react-router-dom";
import AddEditApplicationModal from "../modals/AddEditApplicationModal";

function HeaderDropDown({ setOpenDropdown }) {
  const dispatch = useDispatch();
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [isEditBoardModalOpen, setIsEditBoardModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [boardType, setBoardType] = useState("add");
  const [currentTheme, setTheme] = useDarkMode();
  const [isDarkModeEnabled, setDarkModeEnabled] = useState(
    currentTheme === "light" ? true : false
  );
  const [applicationType, setApplicationType] = useState("add");
  const navigate = useNavigate();
  const location = useLocation();
  const locCheck = location.pathname === "/applications";

  const boards = useSelector((state) => state.boards);
  const board = boards.find((board) => board.isActive);

  const handleDeleteButtonClick = (boardid) => {
    dispatch(boardsSlice.actions.deleteBoard({boardid}));
    dispatch(boardsSlice.actions.setBoardActive({ index: 0 }));
    setIsDeleteModalOpen(false);
    getDataFunction().then((boards) => {
        dispatch(boardsSlice.actions.setInitialData({ initialData: boards }));
      }).catch((err) => console.log(err))
  };

  const toggleDarkMode = (checked) => {
    setTheme(currentTheme);
    setDarkModeEnabled(checked);
  };

  return (
    <div
      className="py-10 px-6 absolute left-0 right-0 bottom-[-100vh] top-16 dropdown overflow-y-auto"
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setOpenDropdown(false);
      }}
    >
      {/* DropDown Modal */}

      <div className="bg-white dark:bg-[#2b2c37] shadow-md shadow-[#364e7e1a] w-full py-4 rounded-xl">
        <h3 className="dark:text-gray-300 text-gray-600 font-semibold mx-4 mb-8">
          ALL BOARDS ({boards?.length})
        </h3>

        <div className="dropdown-board">
          {boards.map((board, index) => (
            <div
              className={` flex justify-between items-baseline space-x-2 px-5 mr-8 rounded-r-full duration-500 ease-in-out py-4 cursor-pointer hover:bg-[#635fc71a] hover:text-[#635fc7] dark:hover:bg-white dark:hover:text-[#635fc7] dark:text-white ${
                board.isActive && !locCheck && "bg-[#635fc7] rounded-r-full text-white mr-8"
              }`}
              key={index}
              onClick={() => {
                // setOpenDropdown(false)
                navigate("/boards")
                dispatch(boardsSlice.actions.setBoardActive({ index }));
              }}
            >
              {/* <img src={boardIcon} className="filter-white h-4" />{" "} */}
              <p className="text-lg font-bold">{board.name}</p>
               <div className="flex gap-3">
                  <span className="cursor-pointer"
                    onClick={() => {
                      setBoardType("edit");
                      setIsEditBoardModalOpen(true);
                    }}
                  >
                    &#9998;
                  </span>
                  <span className="cursor-pointer"
                    onClick={() => {
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    &#128465;
                  </span>
                </div>
            </div>
          ))}

          <div
            onClick={() => {
              setIsBoardModalOpen(true);
              setOpenDropdown(false);
            }}
            className="flex items-baseline space-x-2 text-[#635fc7] px-5 py-4"
          >
            <img src={boardIcon} alt="create board icon" className="filter-white h-4" />
            <p className="text-lg font-bold">Create New Board</p>
          </div>

          <hr />

          <div>
            <div
              className={` flex justify-between items-baseline space-x-2 px-5 mr-8 rounded-r-full duration-500 ease-in-out py-4 cursor-pointer hover:bg-[#635fc71a] hover:text-[#635fc7] dark:hover:bg-white dark:hover:text-[#635fc7] dark:text-white  ${
                locCheck &&
                " bg-[#635fc7] rounded-r-full text-white mr-8 "
              } `}
              onClick={() => {
                setOpenDropdown(false)
                navigate("/applications");
              }}
            >
              <p className=" text-lg font-bold ">Applications</p>
            </div>
            <div
              className=" flex  items-baseline space-x-2  mr-8 rounded-r-full duration-500 ease-in-out cursor-pointer text-[#635fc7] px-5 py-4 hover:bg-[#635fc71a] hover:text-[#635fc7] dark:hover:bg-white  "
              onClick={() => {
                setApplicationType("add");
                setIsApplicationModalOpen(true);
              }}
            >
              <img src={boardIcon} alt="create application icon" className="   filter-white  h-4 " />
              <p className=" text-lg font-bold  ">New Application </p>
            </div>
          </div>

          <hr />

          <div>
              <p className=" text-lg font-bold ml-5">Upload Resume</p>
              <input
                className={` flex justify-between items-baseline space-x-2 px-5 mr-8 rounded-r-full duration-500 ease-in-out py-4 cursor-pointer hover:bg-[#635fc71a] hover:text-[#635fc7] dark:hover:bg-white dark:hover:text-[#635fc7] dark:text-white  ${
                  locCheck &&
                  " bg-[#635fc7] rounded-r-full text-white mr-8 "
                } `}
                type="file"
              >
              </input>
              <div
                className=" flex  items-baseline space-x-2  mr-8 rounded-r-full duration-500 ease-in-out cursor-pointer text-[#635fc7] px-5 py-4 hover:bg-[#635fc71a] hover:text-[#635fc7] dark:hover:bg-white  "
                onClick={() => {
                  
                }}
              >
                <img src={boardIcon} alt="create application icon" className="   filter-white  h-4 " />
                <p className=" text-lg font-bold  ">View Resume </p>
              </div>
            </div>

            <hr />

          <div className="mx-2 p-4 space-x-2 bg-slate-100 dark:bg-[#20212c] flex justify-center items-center rounded-lg">
            <img src={lightIcon} alt="sun indicating light mode" />

            <Switch
              checked={isDarkModeEnabled}
              onChange={toggleDarkMode}
              className={`${
                isDarkModeEnabled ? "bg-[#635fc7]" : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className="sr-only">Enable notifications</span>
              <span
                className={`${
                  isDarkModeEnabled ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>

            <img src={darkIcon} alt="moon indicating dark mode" />
          </div>
        </div>
      </div>

      {isBoardModalOpen && (
        <AddEditBoardModal
          type="add"
          setIsBoardModalOpen={setIsBoardModalOpen}
        />
      )}

      {isEditBoardModalOpen && (
        <AddEditBoardModal
          setBoardType={setBoardType}
          type={boardType}
          setIsBoardModalOpen={setIsEditBoardModalOpen}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          type="board"
          title={board.name}
          onDeleteBtnClick={() => handleDeleteButtonClick(board._id ? board._id.$oid : board.id)}
        />
      )}

      {isApplicationModalOpen && (
        <AddEditApplicationModal
          setIsApplicationModalOpen={setIsApplicationModalOpen}
          type={applicationType}
        />
      )}
    </div>
  );
}

export default HeaderDropDown;
