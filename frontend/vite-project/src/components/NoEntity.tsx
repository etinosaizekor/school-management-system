import { Button, Text } from "@mantine/core";
import { ReactNode } from "react";

interface NoEntityProps {
  onCreate: () => void;
  message: string;
  createNewText: string;
  Icon: ReactNode;
}

export default function NoEntity({
  onCreate,
  message,
  createNewText,
  Icon,
}: NoEntityProps) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-72 flex flex-col items-center text-center">
        <div className="text-gray-400 mb-4">
          {Icon}
        </div>
        <Text size="lg" className="mb-4">
          {message}
        </Text>
        <Button color="#15803d" onClick={onCreate}>
          {createNewText}
        </Button>
      </div>
    </div>
  );
}
