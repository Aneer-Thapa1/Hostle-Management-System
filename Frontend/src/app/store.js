import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
// import socketReducer from "../features/SocketSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;
