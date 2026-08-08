import { Injectable, computed, signal } from '@angular/core';
import { Yard } from '../core/models/yard.model';
import { Track } from '../core/models/track.model';

@Injectable({
  providedIn: 'root'
})
export class YardStateService {

  private readonly yardSignal = signal<Yard | null>(null);

  readonly yard = this.yardSignal.asReadonly();

  readonly tracks = computed<Track[]>(() =>
    this.yard()?.tracks ?? []
  );

  readonly selectedTrackId = signal<number>(1);

  readonly selectedTrack = computed(() =>
    this.tracks().find(t => t.id === this.selectedTrackId())
  );

  setYard(data: Yard) {
    this.yardSignal.set(data);
  }

  selectTrack(id: number) {
    this.selectedTrackId.set(id);
  }

}
