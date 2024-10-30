export interface Car {
  name: string;
  color: string;
  id: number;
}

export interface Winner {
  id: number;
  wins: number;
  time: number;
}

export interface FirstSuccessCar {
  carId: number;
  durationInSeconds: number;
  carName: HTMLElement;
}
