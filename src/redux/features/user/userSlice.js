import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: null,
  email: null,
  role: null,
  authChecked: false, // 🔥 REQUIRED
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.authChecked = true; // ✅ VERY IMPORTANT
    },
    clearUserInfo: (state) => {
      state.name = null;
      state.email = null;
      state.role = null;
      state.authChecked = true; // ✅ auth checked but no user
    },
  },
});



export const { setUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;
