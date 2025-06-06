import React from "react";

// PUBLIC_INTERFACE
function Notification({ message, onDismiss, type = "info" }) {
  /** Simple notification bar for reminders or overdue/complete tasks */
  if (!message) return null;
  return (
    <div className={`notification notification-${type}`}>
      <span>{message}</span>
      <button className="notification-dismiss" onClick={onDismiss}>&times;</button>
    </div>
  );
}

export default Notification;
