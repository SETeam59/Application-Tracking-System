import React, { useState } from "react";
import iconDown from "../assets/icon-chevron-down.svg";
import iconUp from "../assets/icon-chevron-up.svg";
import HeaderDropDown from "./HeaderDropDown";
import AddEditTaskModal from "../modals/AddEditTaskModal";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AddEditBoardModal from "../modals/AddEditBoardModal";
import DeleteModal from "../modals/DeleteModal";
import boardsSlice from "../redux/boardsSlice";
import { getDataFunction } from "../api/boardsHandler";

function Header({ setIsBoardModalOpen, isBoardModalOpen, logout, simple = false }) {
  const dispatch = useDispatch();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [boardType, setBoardType] = useState("add");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const boards = useSelector((state) => state.boards);
  const board = boards.find((board) => board.isActive);

  const handleDropdownClick = () => {
    setOpenDropdown((isOpen) => !isOpen);
    setBoardType("add");
  };

  const handleDeleteButtonClick = (boardid) => {
    dispatch(boardsSlice.actions.deleteBoard({boardid}));
    dispatch(boardsSlice.actions.setBoardActive({ index: 0 }));
    setIsDeleteModalOpen(false);
    getDataFunction().then((boards) => {
        dispatch(boardsSlice.actions.setInitialData({ initialData: boards }));
      }).catch((err) => console.log(err))
    // }
  };

  return (
    <div className=" p-4 fixed left-0 bg-white dark:bg-[#2b2c37] z-50 right-0 max-w-100">
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
          <p className="text-2xl md:hidden">|</p>
          <div className="flex items-center">
            {!simple && (<h3 className="truncate max-w-[200px] md:text-2xl text-xl font-bold md:ml-20 font-sans">
              {board.name}
            </h3> )}
            {simple && (<h3 className="truncate max-w-[200px] md:text-2xl text-xl font-bold md:ml-20 font-sans">
              Applications
            </h3> )}
            <img
            src={openDropdown ? iconUp : iconDown}
            alt="dropdown icon"
            className="w-3 ml-2 md:hidden cursor-pointer"
            onClick={handleDropdownClick}
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex space-x-4 items-center md:space-x-6">
          {!simple && (
          <>
            <button
              className="button hidden md:block"
              onClick={() => {
                setIsTaskModalOpen((prevState) => !prevState);
              }}
            >
              + Add New Task
            </button>
            <button
              onClick={() => {
                setIsTaskModalOpen((prevState) => !prevState);
              }}
              className="button py-1 px-3 md:hidden"
            >
              +
            </button> 
          </>)}
          <button
            className="button md:block"
            onClick={() => {
              logout();
            }}
          >
            Logout
          </button>
        </div>

        {openDropdown && (
          <HeaderDropDown
            setOpenDropdown={setOpenDropdown}
            setIsBoardModalOpen={setIsBoardModalOpen}
          />
        )}
      </header>
      {isTaskModalOpen && (
        <AddEditTaskModal
          setIsAddTaskModalOpen={setIsTaskModalOpen}
          type="add"
          device="mobile"
        />
      )}

      {isBoardModalOpen && (
        <AddEditBoardModal
          setBoardType={setBoardType}
          type={boardType}
          setIsBoardModalOpen={setIsBoardModalOpen}
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
    </div>
  );
}

export default Header;
