import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Notification types
export const showToast = {
  success: (message) => toast.success(message, { autoClose: 3000 }),
  error: (message) => toast.error(message, { autoClose: 5000 }),
  processing: (message) => toast.info(message, { autoClose: false }),
  dismiss: () => toast.dismiss()
};

// Component to render notification container
export function NotificationSystem() {
  return (
    <ToastContainer
      position="top-right"
      newestOnTop
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
}
