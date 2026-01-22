import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import {
  selectUserChecked,
  selectUserRole,
} from "../redux/features/user/userSelectors";
import { isTokenValid } from "../utils/auth";

const ProtectedAdmin = () => {
  return <Outlet />;
};

export default ProtectedAdmin;
