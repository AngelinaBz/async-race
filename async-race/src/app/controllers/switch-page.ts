const buttons = document.querySelectorAll('.page-switch');
const garageContainer = document.querySelector('.garage-container') as HTMLElement;
const winnersContainer = document.querySelector('.winners-container') as HTMLElement;
buttons.forEach((button) => {
  button.addEventListener('click', () => {
    if (button.textContent === 'TO GARAGE') {
      garageContainer.classList.remove('unactive');
      winnersContainer.classList.add('unactive');
    } else {
      garageContainer.classList.add('unactive');
      winnersContainer.classList.remove('unactive');
    }
  });
});
