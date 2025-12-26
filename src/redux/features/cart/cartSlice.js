import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    count: 0, // total items in cart
  },
  reducers: {
    setCartCount: (state, action) => {
      state.count = action.payload;
    },
    incrementCartCount: (state) => {
      state.count += 1;
    },
    decrementCartCount: (state) => {
      state.count = Math.max(state.count - 1, 0);
    },
    resetCartCount: (state) => {
      state.count = 0;
    },
  },
});

export const {
  setCartCount,
  incrementCartCount,
  decrementCartCount,
  resetCartCount,
} = cartSlice.actions;

export const selectCartCount = (state) => state.cart.count;
export default cartSlice.reducer;
