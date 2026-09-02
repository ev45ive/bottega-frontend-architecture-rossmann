import React from "react";

type Props = {
  message: string;
};

export function CartPanel({ message = "" }: Props) {
  return <div>Cart panel - {message}</div>;
}
