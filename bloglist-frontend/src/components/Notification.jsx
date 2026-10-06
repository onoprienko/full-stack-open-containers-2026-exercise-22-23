import { Alert } from '@mui/material';

const Notification = ({ notificationMessage, setNotificationMessage }) => {
  if (notificationMessage.message) {
    setTimeout(() => setNotificationMessage({ message: null }), 5000);
    return (
      <Alert
        style={{ marginTop: 10, marginBottom: 10 }}
        severity={notificationMessage?.type}
      >
        message: {notificationMessage.message}
      </Alert>
    );
  }
};

export default Notification;
