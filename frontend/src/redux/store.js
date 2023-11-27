import { configureStore } from "@reduxjs/toolkit";
import boardsSlice from "./boardsSlice";

const store = configureStore({
  reducer: {
    boards: boardsSlice.reducer,
    // applications: applicationSlice.reducer
  },
});

export default store;
