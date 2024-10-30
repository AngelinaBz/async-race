import { Car } from '../../interface';

export default class Garage {
  async getCars(page: number) {
    const response = await fetch(`http://127.0.0.1:3000/garage?_page=${page}&_limit=7`);
    const data = await response.json();
    return data;
  }

  async getCarFromGarage(id: number): Promise<Car> {
    const response = await fetch(`http://127.0.0.1:3000/garage/${id}`);
    const data = await response.json();
    return data;
  }

  async addCarToGarage(car: Car): Promise<void> {
    await fetch('http://127.0.0.1:3000/garage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(car),
    });
  }

  async deleteCarFromGarage(id: number): Promise<void> {
    await fetch(`http://127.0.0.1:3000/garage/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async updateCarInGarage(car: Car, id: number): Promise<void> {
    await fetch(`http://127.0.0.1:3000/garage/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(car),
    });
  }
}
