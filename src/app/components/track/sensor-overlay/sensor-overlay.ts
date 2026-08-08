import { Component, computed, input } from '@angular/core';
import { Sensor } from '../../../core/models/sensor.model';

@Component({
  selector: 'app-sensor-overlay',
  imports: [],
  templateUrl: './sensor-overlay.html',
  styleUrl: './sensor-overlay.css',
})
export class SensorOverlay {
  sensors = input.required<Sensor[]>();

  length = input.required<number>();

  readonly items = computed(() => {
    return this.sensors().map((sensor) => ({
      ...sensor,

      left: (sensor.position / this.length()) * 100,
    }));
  });
}
