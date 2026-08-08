export interface Sensor {

  id: string;

  name: string;

  position: number;      // metres from track start

  battery: number;

  rssi: number;

  temperature: number;

  firmware: string;

  online: boolean;

  lastPacket: string;

}
