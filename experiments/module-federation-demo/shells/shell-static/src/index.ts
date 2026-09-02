console.log("shell-static running");

async function bootstrap() {
  const { mount } = await import("remoteJs/Widget");

  const container = document.querySelector("#app");
  if (container) {
    mount(container, { label: "Hello from shell-static" });
  }
}

bootstrap();
