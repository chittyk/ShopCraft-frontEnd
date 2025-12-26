import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import cartReducer from "./features/cart/cartSlice";
import userReducer from "./features/user/userSlice";
import wishlistReducer from "./features/wishlist/wishlistSlice";

// 1. Persist config for USER only
const persistConfig = {
  key: "user",
  storage,
  whitelist: ["name", "email"],
};

// 2. Persisted User Reducer
const persistedUserReducer = persistReducer(persistConfig, userReducer);

// 3. Combine all reducers
const rootReducer = combineReducers({
  cart: cartReducer,
  user: persistedUserReducer,
  wishlist: wishlistReducer,   // ✅ FIXED HERE
});

// 4. Create store
export const store = configureStore({
  reducer: rootReducer,
});

// 5. Persistor
export const persistor = persistStore(store);

export default store;
