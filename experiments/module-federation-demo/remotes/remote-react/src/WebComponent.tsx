import Widget from "./Widget";
import { defineReactWebComponent } from "@mfe/bridge-react";

// Well-known bridge: full prop/attribute/unmount support out of the box.
// defineReactWebComponent("remote-react-widget", CartPanel);
defineReactWebComponent("remote-react-widget", Widget);
