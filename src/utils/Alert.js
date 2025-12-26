import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const toastConfig = {
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
  background: "#111827", // dark background
  color: "#facc15", // yellow text
  iconColor: "#facc15",
};

export const successAlert = (message) => {
  MySwal.fire({
    ...toastConfig,
    icon: "success",
    title: message || "Success!",
  });
};

export const errorAlert = (message) => {
  MySwal.fire({
    ...toastConfig,
    icon: "error",
    title: message || "Something went wrong!",
    iconColor: "#f87171",
  });
};

export const warningAlert = (message) => {
  MySwal.fire({
    ...toastConfig,
    icon: "warning",
    title: message || "Please check your input!",
    iconColor: "#facc15",
  });
};
