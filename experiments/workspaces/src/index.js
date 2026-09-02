// import { libraryFunction } from "../packages/my-lib/index.js";

console.log("Hello index.js");

async function startApp() {
  //   const { libraryFunction, fakeFunction } = await import("../packages/my-lib/index.js");
  // const { libraryFunction, fakeFunction } = await import("http://localhost:3000/packages/my-lib/index.js");

  // REMBEMER: npm install -> symlink to node-modules:
  const { libraryFunction, fakeFunction } = await import("@myorg/my-lib");

  libraryFunction("Hello");
}

startApp();
