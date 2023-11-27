import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch } from "@headlessui/react";
import boardIcon from "../assets/icon-board.svg";
import useDarkMode from "../hooks/useDarkMode";
import darkIcon from "../assets/icon-dark-theme.svg";
import lightIcon from "../assets/icon-light-theme.svg";

import showSidebarIcon from "../assets/icon-show-sidebar.svg";
import hideSidebarIcon from "../assets/icon-hide-sidebar.svg";

import boardsSlice from "../redux/boardsSlice";
import AddEditBoardModal from "../modals/AddEditBoardModal";
import DeleteModal from "../modals/DeleteModal";
import { useLocation, useNavigate } from "react-router-dom";
import AddEditApplicationModal from "../modals/AddEditApplicationModal";
import { getDataFunction } from "../api/boardsHandler";
import { addResume, getResume } from "../api/applicationHandler";

function Sidebar({ isSideBarOpen, setIsSideBarOpen, setAppls }) {
  const dispatch = useDispatch();
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [isEditBoardModalOpen, setIsEditBoardModalOpen] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [boardType, setBoardType] = useState("add");
  const [applicationType, setApplicationType] = useState("add");
  const [colorTheme, setTheme] = useDarkMode();
  const [boardId, setBoardId] = useState("")
  const [darkSide, setDarkSide] = useState(
    colorTheme === "light" ? true : false
  );

  const navigate = useNavigate();
  const location = useLocation();
  const locCheck = location.pathname === "/applications";

  const toggleDarkMode = (checked) => {
    setTheme(colorTheme);
    setDarkSide(checked);
  };

  const handleDeleteButtonClick = (boardid) => {
    console.log(boardid)
    dispatch(boardsSlice.actions.deleteBoard({boardid}));
    dispatch(boardsSlice.actions.setBoardActive({ index: 0 }));
    setIsDeleteModalOpen(false);
    setTimeout(() => {
      getDataFunction().then((boards) => {
        dispatch(boardsSlice.actions.setInitialData({ initialData: boards }));
      }).catch((err) => console.log(err))
    }, 500)
  };

  const boards = useSelector((state) => state.boards);
  const board = boards.find((board) => board.isActive);

  const toggleSidebar = () => {
    setIsSideBarOpen((curr) => !curr);
  };

  return (
    <div>
      <div
        className={
          isSideBarOpen
            ? `min-w-[261px] bg-white dark:bg-[#2b2c37]  fixed top-[72px] h-screen  items-center left-0 z-20`
            : ` bg-[#635FC7] dark:bg-[#2b2c37] dark:hover:bg-[#635FC7] top-auto bottom-10 justify-center items-center hover:opacity-80 cursor-pointer  p-0 transition duration-300 transform fixed felx w-[56px] h-[48px] rounded-r-full  `
        }
      >
        <div className="overflow-y-auto">
          {/* reWrite modal  */}

          {isSideBarOpen && (
            <div className=" bg-white  dark:bg-[#2b2c37]    w-full   py-4 rounded-xl">
              <h3 className=" dark:text-gray-300 text-gray-600 font-semibold mx-4 mb-8 ">
                ALL BOARDS ({boards?.length})
              </h3>

              <div className="  dropdown-borad flex flex-col h-[70vh]  justify-between ">
                <div>
                  {boards.map((board, index) => (
                    <div
                      className={` flex justify-between items-baseline space-x-2 px-5 mr-8 rounded-r-full duration-500 ease-in-out py-4 cursor-pointer hover:bg-[#635fc71a] hover:text-[#635fc7] dark:hover:bg-white dark:hover:text-[#635fc7] dark:text-white  ${
                        board.isActive &&
                        !locCheck &&
                        " bg-[#635fc7] rounded-r-full text-white mr-8 "
                      } `}
                      key={index}
                      onClick={() => {
                        navigate("/boards");
                        dispatch(boardsSlice.actions.setBoardActive({ index }));
                      }}
                    >
                      {/* <img src={boardIcon} className="  filter-white  h-4 " />{" "} */}
                      <p className=" text-lg font-bold ">{board.name}</p>
                      <div className="flex gap-3">
                        <span className="cursor-pointer"
                          onClick={() => {
                            setBoardType("edit");
                            setBoardId(board._id.$oid)
                            setIsEditBoardModalOpen(true);
                          }}
                        >
                          &#9998;
                        </span>
                        <span className="cursor-pointer"
                          onClick={() => {
                            console.log(board._id)
                            setBoardId(board._id)
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          &#128465;
                        </span>
                      </div>
                    </div>
                  ))}

                  <div
                    className=" flex  items-baseline space-x-2  mr-8 rounded-r-full duration-500 ease-in-out cursor-pointer text-[#635fc7] px-5 py-4 hover:bg-[#635fc71a] hover:text-[#635fc7] dark:hover:bg-white  "
                    onClick={() => {
                      setBoardType("add");
                      setIsBoardModalOpen(true);
                    }}
                  >
                    <img src={boardIcon} alt="create board icon" className="   filter-white  h-4 " />
                    <p className=" text-lg font-bold  ">Create New Board </p>
                  </div>
                </div>

                <hr />

                <div>
                  <div
                    className={` flex justify-between items-baseline space-x-2 px-5 mr-8 rounded-r-full duration-500 ease-in-out py-4 cursor-pointer hover:bg-[#635fc71a] hover:text-[#635fc7] dark:hover:bg-white dark:hover:text-[#635fc7] dark:text-white  ${
                      locCheck &&
                      " bg-[#635fc7] rounded-r-full text-white mr-8 "
                    } `}
                    onClick={() => {
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
                  <p className=" text-lg font-bold ml-5 mt-4 dark:text-white">Upload Resume</p>
                  <input
                    onChange={e => addResume(e.target.files[0])}
                    className={` flex justify-between items-baseline space-x-2 px-5 mr-8 rounded-r-full duration-500 ease-in-out py-4 cursor-pointer hover:bg-[#635fc71a] hover:text-[#635fc7] dark:hover:bg-white dark:hover:text-[#635fc7] dark:text-white cursor-pointer ${
                      locCheck &&
                      " bg-[#635fc7] rounded-r-full text-white mr-8 "
                    } `}
                    type="file"
                    name="file"
                  >
                  </input>
                  <div
                    className=" flex  items-baseline space-x-2  mr-8 rounded-r-full duration-500 ease-in-out cursor-pointer text-[#635fc7] px-5 py-4 hover:bg-[#635fc71a] hover:text-[#635fc7] dark:hover:bg-white  "
                    onClick={() => {
                      
                    }}
                  >
                    <img src={boardIcon} alt="create application icon" className="   filter-white  h-4 " />
                    <p className=" text-lg font-bold  " onClick={getResume}>View Resume </p>
                  </div>
                </div>

                <hr />

                <div className=" mx-2  p-4 relative space-x-2 bg-slate-100 dark:bg-[#20212c] flex justify-center items-center rounded-lg mt-4">
                  <img src={lightIcon} alt="sun indicating light mode" />

                  <Switch
                    checked={darkSide}
                    onChange={toggleDarkMode}
                    className={`${
                      darkSide ? "bg-[#635fc7]" : "bg-gray-200"
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                  >
                    <span
                      className={`${
                        darkSide ? "translate-x-6" : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                    />
                  </Switch>

                  <img src={darkIcon} alt="moon indicating dark mode" />
                </div>
              </div>
            </div>
          )}

          {/* Sidebar hide/show toggle */}
          {isSideBarOpen ? (
            <div
              onClick={() => toggleSidebar()}
              className=" flex  items-center mt-2 opacity-0 absolute bottom-16  text-lg font-bold  rounded-r-full hover:text-[#635FC7] cursor-pointer mr-6 mb-8 px-8 py-4 hover:bg-[#635fc7] hover:opacity-100 hover:text-white dark:hover:bg-white dark:hover:text-[#635FC7]  space-x-2 justify-center  my-4 text-gray-500 "
            >
              <img
                className=" min-w-[20px] fill-white"
                src={hideSidebarIcon}
                alt=" side bar show/hide"
              />
              {isSideBarOpen && <p> Hide Sidebar </p>}
            </div>
          ) : (
            <div className=" absolute p-5  " onClick={() => toggleSidebar()}>
              <img src={showSidebarIcon} alt="show sidebar icon" />
            </div>
          )}
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
          onDeleteBtnClick={() => handleDeleteButtonClick(boardId)}
        />
      )}

      {isApplicationModalOpen && (
        <AddEditApplicationModal
          setIsApplicationModalOpen={setIsApplicationModalOpen}
          type={applicationType}
          setAppls={setAppls}
        />
      )}
    </div>
  );
}

export default Sidebar;
