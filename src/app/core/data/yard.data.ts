import { Yard } from '../models/yard.model';

export const INITIAL_YARD: Yard = {
  stationName: 'Nagpur Yard',
  lastUpdated: '',
  tracks: [
    {
      id: 1,
      name: 'Track-1',
      length: 400,
      train: {
        locoId: '',
        position: 0,
        speed: 0,
        direction: 'RIGHT',
        status: 'STOPPED',
      },
      sensors: [
        // your sensors
      ],
      redZone: {
        start: 320,
        end: 400,
      },
    },
    {
      id: 2,
      name: 'Track-2',
      length: 400,
      train: {
        locoId: '',
        position: 0,
        speed: 0,
        direction: 'RIGHT',
        status: 'STOPPED',
      },
      sensors: [],
      redZone: {
        start: 320,
        end: 400,
      },
    },
    {
      id: 3,
      name: 'Track-3',
      length: 400,
      train: {
        locoId: '',
        position: 0,
        speed: 0,
        direction: 'RIGHT',
        status: 'STOPPED',
      },
      sensors: [],
      redZone: {
        start: 320,
        end: 400,
      },
    },
    {
      id: 4,
      name: 'Track-4',
      length: 400,
      train: {
        locoId: '',
        position: 0,
        speed: 0,
        direction: 'RIGHT',
        status: 'STOPPED',
      },
      sensors: [],
      redZone: {
        start: 320,
        end: 400,
      },
    },
  ],
};
