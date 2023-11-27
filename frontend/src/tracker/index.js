import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import Home from "../components/Home";
import EmptyBoard from "../components/EmptyBoard";
import boardsSlice from "../redux/boardsSlice";
import { useNavigate } from "react-router-dom";

function TrackerPage({ logout, getData, page, auth }) {
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const dispatch = useDispatch();
  const boards = useSelector((state) => state.boards);
  const activeBoard = boards.find((board) => board.isActive);
  
  const navigate = useNavigate()

  useEffect(() => {
    if(!localStorage.getItem("token")) {
      navigate("/login")
    }
  })

  useEffect(() => {
    getData();
  }, [getData]);

  if (!activeBoard && boards.length > 0)
    dispatch(boardsSlice.actions.setBoardActive({ index: 0 }));
  return (
    <div className=" overflow-hidden  overflow-x-scroll">
      <>
        {boards.length > 0 ? (
          <>
            <Header
                setIsBoardModalOpen={setIsBoardModalOpen}
                isBoardModalOpen={isBoardModalOpen}
                logout={logout}
                simple={page === "applications"}
              />
            <Home
              setIsBoardModalOpen={setIsBoardModalOpen}
              isBoardModalOpen={isBoardModalOpen}
              page={page}
            />
          </>
        ) : (
          <>
            <EmptyBoard type="add" logout={logout} auth={auth} />
          </>
        )}
      </>
    </div>
  );
}

export default TrackerPage;
