import { Modal, Button, ActionIcon, Container, Text, Box } from "@mantine/core";
import { ReactNode } from "react";
import { IoChevronBack } from "react-icons/io5";

interface CustomModalProps {
  title: string;
  children: ReactNode;
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
  children,
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
              marginBottom: 10,
              backgroundColor: "rgba(19, 115, 55, 1)",
              color: "#ece8e8",
              display: "flex",
              justifyContent: "space-between",
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
            <Text fw="bold">{title}</Text>
            <Box>
              <Modal.CloseButton
                style={{
                  color: "#fff",
                  backgroundColor: "transparent",
                }}
              />
            </Box>
          </Modal.Header>
          <Modal.Body>{children}</Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}
