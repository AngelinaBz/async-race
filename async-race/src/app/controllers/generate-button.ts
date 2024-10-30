import { createCars, updateGarageName } from '../components/garage';
import { Car } from '../../interface';
import Garage from '../services/crud';
//  import { config } from '../services/config-variable';

const carName = ['Audi', 'BMW', 'Cadillac', 'Chevrolet', 'Citroen', 'Daewoo', 'FORD', 'Toyota', 'Hyundai', 'Lada'];
const carModel = ['Elantra', 'Focus', 'Matiz', 'Lanos', 'X3', 'X6', 'Q7', 'A4', 'Camry', 'Solaris'];
const generateButton = document.querySelector('.generate-button') as HTMLElement;

const garage = new Garage();

const generateCars = async () => {
  const promises = [];
  const response = await fetch('http://127.0.0.1:3000/garage');
  const data: Car[] = await response.json();
  const id = data.length > 0 ? Math.max(...data.map((car) => car.id)) + 1 : 1;
  const carsToAdd = Math.min(100, 7 - data.length);
  for (let i = 0; i < 100; i += 1) {
    const color = `#${Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padEnd(6, '0')}`;
    const name = `${carName[Math.floor(Math.random() * carName.length)]} ${carModel[Math.floor(Math.random() * carModel.length)]}`;
    const car = {
      name,
      color,
      id: id + i + 1,
    };
    promises.push(garage.addCarToGarage(car));
    if (i < carsToAdd) {
      createCars(car);
    }
  }

  try {
    await Promise.all(promises);
    updateGarageName();
  } catch (error) {
    console.error('Error:', error);
  }
};

generateButton.addEventListener('click', () => {
  generateCars();
});
