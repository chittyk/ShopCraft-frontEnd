import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    count: 0, // total items in wishlist
  },
  reducers: {
    setWishlistCount: (state, action) => {
      state.count = action.payload;
    },
    incrementWishlistCount: (state) => {
      state.count += 1;
    },
    decrementWishlistCount: (state) => {
      state.count = Math.max(state.count - 1, 0);
    },
    resetWishlistCount: (state) => {
      state.count = 0;
    },
  },
});

export const {
  setWishlistCount,
  incrementWishlistCount,
  decrementWishlistCount,
  resetWishlistCount,
} = wishlistSlice.actions;

export const selectWishlistCount = (state) => state.wishlist.count;

export default wishlistSlice.reducer;
