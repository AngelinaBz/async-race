import Garage from '../services/crud';
import { createCars, updateCars, updateGarageName } from '../components/garage';
import RaceResponse from '../services/race';
import { Car, FirstSuccessCar } from '../../interface';
import { config } from '../services/config-variable';
import Winners from '../services/winners';
import { updateWinnersTable } from '../components/winners';

const createColor = document.querySelector('.create-color') as HTMLInputElement;
const createInput = document.querySelector('.create-input') as HTMLInputElement;
const createButton = document.querySelector('.create-button') as HTMLElement;
const updateColor = document.querySelector('.update-color') as HTMLInputElement;
const updateInput = document.querySelector('.update-input') as HTMLInputElement;
const updateButton = document.querySelector('.update-button') as HTMLElement;
const garageContainer = document.querySelector('.garage-container') as HTMLElement;
const raceButton = document.querySelector('.race-button') as HTMLElement;
const resetButton = document.querySelector('.reset-button') as HTMLElement;
const winnerMsg = document.querySelector('.winner-msg') as HTMLElement;
//  const carsPage = document.querySelector('cars-page') as HTMLElement;

const garage = new Garage();
const winner = new Winners();

createButton.addEventListener('click', async () => {
  const color = createColor.value;
  const model = createInput.value;
  if (color && model) {
    const response = await fetch('http://127.0.0.1:3000/garage');
    const data: Car[] = await response.json();
    const id = data.length > 0 ? Math.max(...data.map((car) => car.id)) + 1 : 1;
    const car = {
      name: model,
      color,
      id,
    };
    garage.addCarToGarage(car);
    updateGarageName();
    const startIndex = (config.currentPage - 1) * 7;
    const endIndex = Math.min(startIndex + 7, data.length);
    if (endIndex - startIndex < 7) {
      createCars(car);
    }
  }
});

garageContainer.addEventListener('click', async (event) => {
  const target = event.target as HTMLElement;
  if (target.classList.contains('remove')) {
    const carElement = target.closest('.cars-container') as HTMLElement;
    const carId = Number(carElement.dataset.id);

    await garage.deleteCarFromGarage(carId);
    await winner.deleteWinner(carId);

    carElement.remove();
    updateGarageName();
    updateWinnersTable();
  }
});

garageContainer.addEventListener('click', async (event) => {
  const target = event.target as HTMLElement;
  if (target.classList.contains('select')) {
    const carElement = target.closest('.cars-container') as HTMLElement;
    if (carElement) {
      const carId = Number(carElement.dataset.id);
      if (!Number.isNaN(carId)) {
        try {
          const car = await garage.getCarFromGarage(carId);
          if (car) {
            updateInput.value = car.name;
            updateColor.value = car.color;
          }
        } catch (error) {
          console.error('Error', error);
        }
        updateButton.setAttribute('data-id', carId.toString());
      }
    }
  }
});

updateButton.addEventListener('click', async () => {
  const carId = Number(updateButton.dataset.id);
  const color = updateColor.value;
  const model = updateInput.value;
  if (color && model) {
    const car = {
      id: carId,
      name: model,
      color,
    };
    garage.updateCarInGarage(car, carId);
    updateCars(car);
  }
});

function animation(car: HTMLElement, endX: number, duration: number) {
  config.animationActive = true;
  let currentX = car.offsetLeft;
  const frameCount = (duration / 1000) * 60;
  const dX = (endX - car.offsetLeft) / frameCount;
  const tick = () => {
    currentX += dX;
    const newCar = car;
    newCar.style.transform = `translateX(${currentX}px)`;
    if (currentX < endX) {
      config.animationID = requestAnimationFrame(tick);
    }
  };
  tick();
}

const race = new RaceResponse();

garageContainer.addEventListener('click', async (event) => {
  const target = event.target as HTMLButtonElement;
  if (target.classList.contains('button-A')) {
    const buttonB = target.nextElementSibling as HTMLButtonElement;
    target.disabled = true;
    buttonB.disabled = false;
    const carElement = target.closest('.cars-container') as HTMLElement;
    const carId = Number(carElement.dataset.id);
    const carImg = carElement.querySelector('.car') as HTMLElement;
    const raceWidth = carElement.offsetWidth - carImg.offsetWidth;
    try {
      const { velocity, distance } = await race.start(carId);
      console.log('Received velocity:', velocity);
      const duration = Math.round(distance / velocity);
      animation(carImg, raceWidth, duration);
      const data = await race.drive(carId);
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
      if (config.animationActive) {
        cancelAnimationFrame(config.animationID);
        config.animationActive = false;
        await race.stop(carId);
      }
    }
  }
});

garageContainer.addEventListener('click', async (event) => {
  const target = event.target as HTMLButtonElement;
  if (target.classList.contains('button-B')) {
    const buttonA = target.previousElementSibling as HTMLButtonElement;
    target.disabled = true;
    buttonA.disabled = false;
    const carElement = target.closest('.cars-container') as HTMLElement;
    const carId = Number(carElement.dataset.id);
    const carImg = carElement.querySelector('.car') as HTMLElement;
    try {
      cancelAnimationFrame(config.animationID);
      config.animationActive = false;
      carImg.style.transform = 'translateX(0px)';
      const data = await race.stop(carId);
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }
  }
});

async function addWinner(firstSuccessCar: FirstSuccessCar | null) {
  if (firstSuccessCar !== null) {
    const existingWinner = await winner.getWinner(firstSuccessCar.carId);
    const winnerData = {
      id: firstSuccessCar.carId,
      wins: 1,
      time: firstSuccessCar.durationInSeconds,
    };
    if (existingWinner) {
      const winnerupdateData = {
        id: firstSuccessCar.carId,
        wins: existingWinner.wins + 1,
        time: Math.min(firstSuccessCar.durationInSeconds, existingWinner.time),
      };
      await winner.updateWinner(winnerupdateData, winnerupdateData.id);
    } else {
      await winner.addWinner(winnerData);
    }
    await updateWinnersTable();
  }
}

raceButton.addEventListener('click', async () => {
  const carElements = document.querySelectorAll('.cars-container');
  const promises = Array.from(carElements).map(async (carElement: Element) => {
    const carId = Number((carElement as HTMLElement).dataset.id);
    const carImg = carElement.querySelector('.car') as HTMLElement;
    const carName = carElement.querySelector('.cars-name') as HTMLElement;
    const raceWidth = (carElement as HTMLElement).offsetWidth - carImg.offsetWidth;
    try {
      const { velocity, distance } = await race.start(carId);
      const duration = Math.round(distance / velocity);
      animation(carImg, raceWidth, duration);
      const data = await race.drive(carId);
      const durationInSeconds = Math.round(duration / 1000);
      if (data.success === true) {
        return { carId, durationInSeconds, carName };
      }
    } catch (error) {
      console.error('Error:', error);
      if (config.animationActive) {
        cancelAnimationFrame(config.animationID);
        config.animationActive = false;
        await race.stop(carId);
      }
    }
    throw new Error('error');
  });
  try {
    const firstSuccessCar = await Promise.any(promises);
    winnerMsg.style.display = 'block';
    winnerMsg.textContent = `Winner: ${firstSuccessCar?.carName.textContent} - ${firstSuccessCar?.durationInSeconds}sec`;
    addWinner(firstSuccessCar);
  } catch (error) {
    console.error('No winner');
  }
});

resetButton.addEventListener('click', async () => {
  const carElements = document.querySelectorAll('.cars-container');
  carElements.forEach(async (carElement: Element) => {
    const carId = Number((carElement as HTMLElement).dataset.id);
    const carImg = carElement.querySelector('.car') as HTMLElement;
    try {
      cancelAnimationFrame(config.animationID);
      winnerMsg.style.display = 'none';
      config.animationActive = false;
      carImg.style.transform = 'translateX(0px)';
      const data = await race.stop(carId);
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }
  });
});
