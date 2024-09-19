import { ActionIcon, Divider } from "@mantine/core";
import { IoChevronBack } from "react-icons/io5";

interface ModalTitleWithButtonProps {
  title: string;
  onIconClick: () => void;
}

export default function ModalTitleWithBackIcon({
  title,
  onIconClick,
}: ModalTitleWithButtonProps) {
  return (
    <>
    <div className=" flex gap-1 items-center w-full">
      <ActionIcon variant="subtle" onClick={onIconClick} mb={20} mt={15}>
        <IoChevronBack size={100}/>
      </ActionIcon>
      <h6>{title}</h6>
    </div>
      <Divider color="blue"/>
    </>
  );
}
