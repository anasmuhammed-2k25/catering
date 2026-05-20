import Swal from "sweetalert2";

// Reusable custom-styled alert functions reflecting GrandFort brand guidelines
// Background: Ivory (#f7f3ec), Primary Accent: Burgundy (#7a1e32)

export const showSuccess = (title, text) => {
  return Swal.fire({
    title,
    text,
    icon: "success",
    confirmButtonColor: "#7a1e32",
    background: "#f7f3ec",
    color: "#2c1018",
    customClass: {
      popup: "premium-swal-popup",
      confirmButton: "premium-swal-button",
    }
  });
};

export const showError = (title, text) => {
  return Swal.fire({
    title,
    text,
    icon: "error",
    confirmButtonColor: "#7a1e32",
    background: "#f7f3ec",
    color: "#2c1018",
    customClass: {
      popup: "premium-swal-popup",
      confirmButton: "premium-swal-button",
    }
  });
};

export const showConfirm = (title, text, confirmText = "Yes, proceed") => {
  return Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#7a1e32",
    cancelButtonColor: "#888888",
    confirmButtonText: confirmText,
    cancelButtonText: "Cancel",
    background: "#f7f3ec",
    color: "#2c1018",
    customClass: {
      popup: "premium-swal-popup",
      confirmButton: "premium-swal-button",
      cancelButton: "premium-swal-cancel-button",
    }
  });
};

export const showToast = (icon, title) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: "#f7f3ec",
    color: "#2c1018",
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });
  return Toast.fire({
    icon,
    title
  });
};
