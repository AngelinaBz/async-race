import './garage.css';
import { Car } from '../../interface';
import createElement from './create-element';
import Garage from '../services/crud';
import { config } from '../services/config-variable';

export function createCars(car: Car) {
  const carsPage = document.querySelector('.cars-page') as HTMLElement;
  const blockCar = createElement('div', 'cars-container', carsPage);
  createElement('p', 'cars-name', blockCar, car.name);
  const buttonsCar = createElement('div', 'cars-buttons', blockCar);
  createElement('button', 'select', buttonsCar, 'SELECT');
  createElement('button', 'remove', buttonsCar, 'REMOVE');
  createElement('button', 'button-A', blockCar, 'A');
  const buttonB = createElement('button', 'button-B', blockCar, 'B') as HTMLButtonElement;
  buttonB.disabled = true;
  const raceCar = createElement('div', 'cars-race', blockCar);
  const carElement = createElement('div', 'car', raceCar);
  carElement.style.backgroundColor = `${car.color}`;
  blockCar.dataset.id = car.id.toString();
  createElement('div', 'flag', raceCar);
}

export function updateCars(car: Car) {
  const carElement = document.querySelector(`.cars-container[data-id="${car.id}"]`);
  if (carElement) {
    const nameElement = carElement.querySelector('.cars-name') as HTMLElement;
    const colorElement = carElement.querySelector('.car') as HTMLElement;
    if (nameElement && colorElement) {
      nameElement.textContent = car.name;
      colorElement.style.backgroundColor = car.color;
    }
  }
}

const garage = new Garage();

export const updateGarage = async (page: number) => {
  const data = await garage.getCars(page);
  data.forEach((car: Car) => {
    createCars(car);
  });
};

export const updateGarageName = async () => {
  const garageName = document.querySelector('.garage-name') as HTMLElement;
  fetch('http://127.0.0.1:3000/garage')
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const numberCars = data.length;
      garageName.textContent = `GARAGE (${numberCars})`;
    })
    .catch((error) => {
      console.error('Error', error);
    });
};

export function createGarage() {
  const garageContainer = document.querySelector('.garage-container') as HTMLElement;
  createElement('div', 'garage-name', garageContainer, 'GARAGE ()');
  const pageButtonContainer = createElement('div', 'page-btn-container', garageContainer);
  const prevButton = createElement('button', 'page-prev', pageButtonContainer, 'PREV');
  const pageName = createElement('p', 'page-name', pageButtonContainer, 'PAGE: 1');
  const nextButton = createElement('button', 'page-next', pageButtonContainer, 'NEXT');
  const carsPage = createElement('div', 'cars-page', garageContainer);
  prevButton.addEventListener('click', () => {
    if (config.currentPage > 1) {
      config.currentPage -= 1;
      pageName.textContent = `PAGE: ${config.currentPage}`;
      carsPage.innerHTML = '';
      updateGarage(config.currentPage);
    }
  });
  nextButton.addEventListener('click', () => {
    config.currentPage += 1;
    pageName.textContent = `PAGE: ${config.currentPage}`;
    carsPage.innerHTML = '';
    updateGarage(config.currentPage);
  });
  updateGarageName();
  updateGarage(config.currentPage);
}
createGarage();
