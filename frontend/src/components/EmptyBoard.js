import React, { useState } from "react";
import AddEditBoardModal from "../modals/AddEditBoardModal";
import HeaderSimple from "./HeaderSimple";

function EmptyBoard({ type, logout, auth }) {
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  return (
    
    <div>
      {type === "add" && <HeaderSimple auth={auth} logout={logout} />}
      <div className=" bg-white dark:bg-[#2b2c37] mt-24 mb-6 flex flex-col  items-center justify-center" style={{minWidth: "78vw", minHeight: "80vh"}}>
        <h3 className=" text-gray-500 font-bold">
          {type === "edit"
            ? "This board is empty. Create a new column to get started."
            : "There are no boards available. Create a new board to get started"}
        </h3>
        <button
          onClick={() => {
            setIsBoardModalOpen(true);
          }}
          className="w-full items-center max-w-xs font-bold hover:opacity-70 dark:text-white dark:bg-[#635fc7] mt-8 relative  text-white bg-[#635fc7] py-2 rounded-full"
        >
          {type === "edit" ? "+ Add New Column" : "+ Add New Board"}
        </button>
        {isBoardModalOpen && (
          <AddEditBoardModal
            type={type}
            setIsBoardModalOpen={setIsBoardModalOpen}
          />
        )}
      </div>
    </div>
  );
}

export default EmptyBoard;
