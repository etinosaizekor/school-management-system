import { Modal, Button, ActionIcon, Container } from "@mantine/core";
import { ReactNode } from "react";
import { IoChevronBack } from "react-icons/io5";

interface CustomModalProps {
  title: string;
  children: ReactNode; // Replacing 'content' with 'children'
  buttonText?: string;
  opened: boolean;
  open?: () => void;
  onClose: () => void;
  size?: string | number;
  withBackButton?: boolean;
  onBackButtonClick?: () => void;
}

export default function CustomModal({
  title,
  children, // Using children for modal body content
  opened,
  onClose,
  size = "md",
  onBackButtonClick = () => void 0,
  withBackButton = true,
}: CustomModalProps) {
  return (
    <>
      <Modal.Root opened={opened} onClose={onClose} size={size}>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header
            style={{
              borderBottom: "1px solid #bcb7b7",
              marginBottom: 10,
              backgroundColor: "rgba(19, 115, 55, 1)",
              color: "#ece8e8",
            }}
          >
            {withBackButton && (
              <ActionIcon
                variant="subtle"
                c="white"
                onClick={() => onBackButtonClick()}
              >
                <IoChevronBack />   
              </ActionIcon>
            )}
            <Modal.Title>
              <h6>{title}</h6>
            </Modal.Title>
            <ActionIcon bg="inherit">
              <Modal.CloseButton
                style={{
                  color: "#fff",
                  backgroundColor: "transparent", // Default background
                }}
              />
            </ActionIcon>
          </Modal.Header>
          <Modal.Body>{children}</Modal.Body>
        </Modal.Content>
      </Modal.Root>

      {/* <Button onClick={open}>{buttonText}</Button> */}
    </>
  );
}
