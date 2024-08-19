import React from "react";
import { Modal, Button } from "@mantine/core"; // Replace with your UI library components if different

interface ConfirmationModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void; // Add this prop to handle the confirm action
  loading?: boolean; // Optional: Loading state for confirm button
  title: string
  confirmationMessage: string
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  opened,
  onClose,
  onConfirm,
  title,
  confirmationMessage,
  loading = false, // Default to false if not provided
}) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      size="sm"
      padding={30}
    >
      <p>{confirmationMessage}</p>
      <div className="flex justify-between gap-10 w-full">
        <Button mt={10} onClick={onClose}>
          Cancel
        </Button>
        <Button mt={10} color="red" onClick={onConfirm} loading={loading}>
          Confirm
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
