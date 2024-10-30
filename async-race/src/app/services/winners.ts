import { Winner } from '../../interface';

export default class Winners {
  async getWinners(page: number) {
    const response = await fetch(`http://127.0.0.1:3000/winners?_page=${page}&_limit=10`);
    const data = await response.json();
    return data;
  }

  async getWinner(id: number): Promise<Winner | undefined> {
    const response = await fetch('http://127.0.0.1:3000/winners');
    const winners = await response.json();
    const winnerData = winners.find((winner: Winner) => winner.id === id);
    return winnerData;
  }

  async addWinner(winner: Winner): Promise<void> {
    await fetch('http://127.0.0.1:3000/winners', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(winner),
    });
  }

  async deleteWinner(id: number): Promise<void> {
    const response = await fetch('http://127.0.0.1:3000/winners');
    const winners = await response.json();
    const winnerID = winners.find((winner: Winner) => winner.id === id);

    if (winnerID) {
      await fetch(`http://127.0.0.1:3000/winners/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      console.log(`Winner with id ${id} does not exist.`);
    }
  }

  async updateWinner(winner: Winner, id: number): Promise<void> {
    await fetch(`http://127.0.0.1:3000/winners/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(winner),
    });
  }
}
