import { notifications } from "@mantine/notifications";
import { FaCheck, FaTimes } from "react-icons/fa";

interface NotificationOptions {
  title: string;
  message: string;
  type: "success" | "error";
}

export function displayNotification({
  title,
  message,
  type,
}: NotificationOptions) {
  notifications.show({
    title,
    message,
    icon: type === "success" ? <FaCheck /> : <FaTimes />,
    color: type === "success" ? "teal" : "red",
    position: 'top-right'
  
  });
}

