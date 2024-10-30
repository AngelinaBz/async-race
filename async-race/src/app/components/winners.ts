import { Winner } from '../../interface';
import createElement from './create-element';
import Garage from '../services/crud';
import { config } from '../services/config-variable';

const garage = new Garage();

export default function createWinners() {
  const winnersContainer = createElement('div', 'winners-container', document.body);
  winnersContainer.classList.add('unactive');
  const winnersName = createElement('div', 'winners-name', winnersContainer, 'WINNERS ()');
  const pageButtonContainer = createElement('div', 'page-btn-container', winnersContainer);
  createElement('button', 'page-prev-winner', pageButtonContainer, 'PREV');
  createElement('p', 'page-name-winner', pageButtonContainer, 'PAGE: 1');
  createElement('button', 'page-next-winner', pageButtonContainer, 'NEXT');
  fetch(`http://127.0.0.1:3000/winners?_page=${config.currentPageWinners}&_limit=10`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const numberWinners = data.length;
      winnersName.textContent = `WINNERS (${numberWinners})`;
      const table = document.createElement('table');
      const headerRow = table.insertRow();
      const headers = ['№', 'Wins', 'Time', 'Name', 'Car'];

      headers.forEach((headerText) => {
        const header = document.createElement('th');
        const textNode = document.createTextNode(headerText);
        header.appendChild(textNode);
        headerRow.appendChild(header);
      });
      data.forEach((winner: Winner, index: number) => {
        const row = table.insertRow();
        row.insertCell().textContent = `#${index + 1}`;
        row.insertCell().textContent = String(winner.wins);
        row.insertCell().textContent = String(winner.time);
        garage.getCarFromGarage(winner.id).then((carData) => {
          row.insertCell().textContent = String(carData.name);
          const carElement = createElement('div', 'car-winner', row);
          carElement.style.backgroundColor = `${carData.color}`;
        });
      });
      winnersContainer.appendChild(table);
    })
    .catch((error) => {
      console.error('Error', error);
    });
}
createWinners();

export async function updateWinnersTable() {
  const winnersName = document.querySelector('.winners-name') as HTMLElement;
  const table = document.querySelector('table') as HTMLTableElement;
  const tbody = table.querySelector('tbody');
  if (tbody) {
    fetch('http://127.0.0.1:3000/winners')
      .then((response) => response.json())
      .then((data) => {
        const numberWinners = data.length;
        winnersName.textContent = `WINNERS (${numberWinners})`;
      });
    fetch(`http://127.0.0.1:3000/winners?_page=${config.currentPageWinners}&_limit=10`)
      .then((response) => response.json())
      .then((data) => {
        tbody.innerHTML = '';
        const headerRow = table.insertRow();
        const headers = ['№', 'Wins', 'Time', 'Name', 'Car'];
        headers.forEach((headerText) => {
          const header = document.createElement('th');
          const textNode = document.createTextNode(headerText);
          header.appendChild(textNode);
          headerRow.appendChild(header);
        });

        data.forEach((winner: Winner, index: number) => {
          const row = table.insertRow();
          row.insertCell().textContent = `#${index + 1}`;
          row.insertCell().textContent = String(winner.wins);
          row.insertCell().textContent = String(winner.time);
          garage.getCarFromGarage(winner.id).then((carData) => {
            row.insertCell().textContent = String(carData.name);
            const carElement = createElement('div', 'car-winner', row);
            carElement.style.backgroundColor = `${carData.color}`;
          });
        });
      })
      .catch((error) => {
        console.error('Error', error);
      });
  }
}
const pagePrevButton = document.querySelector('.page-prev-winner') as HTMLElement;
const pageNextButton = document.querySelector('.page-next-winner') as HTMLElement;
const pageName = document.querySelector('.page-name-winner') as HTMLElement;

pagePrevButton.addEventListener('click', () => {
  if (config.currentPageWinners > 1) {
    config.currentPageWinners -= 1;
    updateWinnersTable();
    pageName.textContent = `PAGE: ${config.currentPageWinners}`;
  }
});

pageNextButton.addEventListener('click', () => {
  config.currentPageWinners += 1;
  updateWinnersTable();
  pageName.textContent = `PAGE: ${config.currentPageWinners}`;
});
