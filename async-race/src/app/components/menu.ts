import './menu.css';
import createElement from './create-element';

export default function createMenu() {
  const switchContainer = createElement('div', 'switch-container', document.body);
  const garageContainer = createElement('div', 'garage-container', document.body);
  const menuContainer = createElement('div', 'menu-container', garageContainer);
  const configContainer = createElement('div', 'config-container', menuContainer);
  const createContainer = createElement('div', 'config', configContainer);
  const updateContainer = createElement('div', 'config', configContainer);
  const buttonsContainer = createElement('div', 'config', configContainer);
  const updateColor = createElement('input', 'update-color', updateContainer);
  const createColor = createElement('input', 'create-color', createContainer);

  for (let i = 0; i < 2; i += 1) {
    createElement('button', 'page-switch', switchContainer, i === 0 ? 'TO GARAGE' : 'TO WINNERS');
  }

  createColor.setAttribute('type', 'color');
  updateColor.setAttribute('type', 'color');
  createColor.setAttribute('value', '#C0C0C0');
  updateColor.setAttribute('value', '#C0C0C0');
  createElement('input', 'create-input', createContainer);
  createElement('input', 'update-input', updateContainer);
  createElement('button', 'create-button', createContainer, 'CREATE');
  createElement('button', 'update-button', updateContainer, 'UPDATE');
  createElement('button', 'race-button', buttonsContainer, 'RACE');
  createElement('button', 'reset-button', buttonsContainer, 'RESET');
  createElement('button', 'generate-button', buttonsContainer, 'GENERATE CARS');
  createElement('p', 'winner-msg', document.body);
}
createMenu();
