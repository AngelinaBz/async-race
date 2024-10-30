export default function createElement(
  tag: string,
  className: string,
  container: HTMLElement,
  text?: string,
): HTMLElement {
  const element = document.createElement(tag);
  element.className = className;
  if (text) {
    element.textContent = text;
  }
  container.appendChild(element);
  return element;
}
