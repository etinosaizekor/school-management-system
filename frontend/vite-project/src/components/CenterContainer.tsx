import { ReactNode } from "react";

function CenterContainer({ children }: { children: ReactNode }) {
  return <div className=" flex w-full justify-center pt-24">{children}</div>;
}

export default CenterContainer;
