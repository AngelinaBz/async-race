export default class RaceResponse {
  async start(id: number): Promise<{ velocity: number; distance: number }> {
    const response = await fetch(`http://127.0.0.1:3000/engine?id=${id}&status=started`, {
      method: 'PATCH',
    });
    const data = await response.json();
    return data;
  }

  async drive(id: number) {
    const response = await fetch(`http://127.0.0.1:3000/engine?id=${id}&status=drive`, {
      method: 'PATCH',
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }
    const data = await response.json();
    return data;
  }

  async stop(id: number) {
    const response = await fetch(`http://127.0.0.1:3000/engine?id=${id}&status=stopped`, {
      method: 'PATCH',
    });
    const data = await response.json();
    return data;
  }
}
