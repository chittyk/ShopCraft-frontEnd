import {jwtDecode} from "jwt-decode";
import { useDispatch } from "react-redux";
import store from "../redux/store";
import { setUserInfo } from "../redux/features/user/userSlice";

// Save token
export const saveToken = (token) => {
  localStorage.setItem("token", token);
};

// Get token
export const getToken = () => {
  return localStorage.getItem("token");
};

// Remove token
export const removeToken = () => {
  localStorage.removeItem("token");
};

// Check if token is valid
export const isTokenValid = () => {
  const token = getToken();
  if (!token) return false;

  try {
    
    const decoded = jwtDecode(token);
    const user = {
      name:decoded.name,
      email:decoded.email,
      role:decoded.role
    }
    store.dispatch(setUserInfo(user))
    console.log("decoded : ",decoded)
    useDispatch
    const now = Date.now() / 1000;
    return decoded.exp > now;
  } catch (err) {
    console.error("Invalid token:", err);
    return false;
  }
};
