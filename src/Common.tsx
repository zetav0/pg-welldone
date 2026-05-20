import type { FC } from "react";

interface CommonProps {
  label: string;
}

export const Common: FC<CommonProps> = ({ label }) => {
  return <div>{label}</div>;
};
