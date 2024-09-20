import React from "react";
import { Modal, Button } from "@mantine/core";

interface ConfirmationModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  title: string;
  confirmationMessage: string;
  size?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  opened,
  onClose,
  onConfirm,
  title,
  confirmationMessage,
  loading = false,
  size = "md",
}) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      size={size}
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
