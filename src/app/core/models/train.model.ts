export interface Train {

  locoId: string;

  position: number;

  speed: number;

  direction: 'LEFT' | 'RIGHT';

  status: 'MOVING' | 'STOPPED';

}
