import { Track } from './track.model';

export interface Yard {

  stationName: string;

  lastUpdated: string;

  tracks: Track[];

}
