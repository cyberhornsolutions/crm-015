import { toast } from "react-toastify";
export const toastify = (message, status) => {
  if (status === "success") {
    toast.success(message);
  } else {
    toast.error(message);
  }
};
