
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    name: null, // store user information
    email: null,
    
};
const userSlice = createSlice({
    name: "user",
    initialState,
    // userSlice.js
reducers: {
  setUserInfo: (state, action) => {
    state.name = action.payload.name;
    state.email = action.payload.email;
  },
  clearUserInfo: (state) => {
    state.name = null;
    state.email = null;
  },
}

});
export const { setUserInfo,clearUserInfo } = userSlice.actions;
export default userSlice.reducer;
