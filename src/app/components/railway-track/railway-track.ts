import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-railway-track',
  imports: [],
  templateUrl: './railway-track.html',
  styleUrl: './railway-track.css',
})
export class RailwayTrack {

  readonly trackLength = 100;

  readonly trainDistance = signal(48.3);

  readonly redZoneStart = 70;

  readonly trainX = computed(() => {
    return 120 + (this.trainDistance() / 100) * 900;
  });

  readonly distanceFromS1 = computed(() =>
    this.trainDistance().toFixed(1)
  );

  readonly distanceFromS2 = computed(() =>
    (100 - this.trainDistance()).toFixed(1)
  );

  sleepers = Array.from({ length: 42 }, (_, i) => i);

}
