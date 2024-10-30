import { Car } from '../../interface';
import createElement from './create-element';

export default class Cars {
  cars: Car[] = [];

  currentPage: number = 1;

  carsPerPage: number = 7;

  constructor() {
    this.init();
  }

  async fetchCars(page: number): Promise<Car[]> {
    const response = await fetch(`http://127.0.0.1:3000/garage?_page=${page}&_limit=${this.carsPerPage}`);
    const data = await response.json();
    return data;
  }

  async updateGarage(page: number): Promise<void> {
    const data = await this.fetchCars(page);
    this.cars = data;
    this.renderGarage();
  }

  addCarToGarage(car: Car): void {
    this.cars.push(car);
    this.renderGarage();
  }

  async deleteCarFromGarage(carId: number): Promise<void> {
    this.cars = this.cars.filter((car) => car.id !== carId);
    this.renderGarage();
  }

  renderGarage(): void {
    const garageContainer = document.querySelector('.garage-container') as HTMLElement;
    const garageName = garageContainer.querySelector('.garage-name') as HTMLElement;
    const carsPage = garageContainer.querySelector('.cars-page') as HTMLElement;

    garageName.textContent = `GARAGE (${this.cars.length})`;
    carsPage.innerHTML = '';

    const startIndex = (this.currentPage - 1) * this.carsPerPage;
    const endIndex = startIndex + this.carsPerPage;
    const currentPageCars = this.cars.slice(startIndex, endIndex);

    currentPageCars.forEach((car) => {
      this.createCarElement(car, carsPage);
    });
  }

  createCarElement(car: Car, parentElement: HTMLElement): void {
    const blockCar = createElement('div', 'cars-container', parentElement);
    createElement('p', 'cars-name', blockCar, car.name);
    const buttonsCar = createElement('div', 'cars-buttons', blockCar);
    createElement('button', 'select', buttonsCar, 'SELECT');
    createElement('button', 'remove', buttonsCar, 'REMOVE');
    createElement('button', 'button-A', blockCar, 'A');
    createElement('button', 'button-B', blockCar, 'B');
    const raceCar = createElement('div', 'cars-race', blockCar);
    const carElement = createElement('div', 'car', raceCar);
    carElement.style.backgroundColor = `${car.color}`;
    blockCar.dataset.id = car.id.toString();
    createElement('div', 'flag', raceCar);
  }

  init(): void {
    this.updateGarage(this.currentPage);
  }
}
const cars = new Cars();
cars.init();
