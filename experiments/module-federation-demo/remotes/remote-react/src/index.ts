import React from "react";
import { createRoot } from "react-dom/client";
import { CartPanel } from "./Widget";

const container = document.querySelector("#app");
if (container) {
  createRoot(container).render(React.createElement(CartPanel));
}
