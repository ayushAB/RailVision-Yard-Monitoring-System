import { Train } from './train.model';
import { Sensor } from './sensor.model';
import { RedZone } from './red-zone.model';

export interface Track {

  id: number;

  name: string;

  length: number;

  train: Train;

  sensors: Sensor[];

  redZone: RedZone;

}
