// Plain vanilla-JS "component": exposes a mount/unmount pair instead of a framework tree.
export function mount(container: HTMLElement, props: { label?: string } = {}) {
  const { label = "Vanilla JS Remote" } = props;
  let count = 0;

  container.innerHTML = `
    <div class="remote-js-widget" style="border:1px solid #999;padding:1rem;border-radius:6px;">
      <h3>${label}</h3>
      <p>Rendered by <strong>remote-js</strong> (no framework) via <code>remoteJs/Widget</code>.</p>
      <button type="button">Clicked 0 times</button>
    </div>
  `;

  // button is always present, it's part of the innerHTML set right above
  const button = container.querySelector("button")!;
  const onClick = () => {
    count += 1;
    button.textContent = `Clicked ${count} times`;
  };
  button.addEventListener("click", onClick);

  return function unmount() {
    button.removeEventListener("click", onClick);
    container.innerHTML = "";
  };
}
