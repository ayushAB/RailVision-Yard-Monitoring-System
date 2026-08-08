import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Yard } from '../models/yard.model';
import { INITIAL_YARD } from '../data/yard.data';

interface TrackUpdatePayload {
  timestamp?: string;
  tracks: Array<{
    trackId: number;
    distance?: number;
    siren?: number;
    event?: 'stopped' | 'crossing';
    timestamp?: string;
    lastUpdated?: number;
  }>;
}

@Injectable({
  providedIn: 'root',
})
export class YardApiService {
  private readonly websocketUrl = 'ws://localhost:1880/ws/tracks';

  private socket: WebSocket | null = null;

  private readonly yardSubject = new BehaviorSubject<Yard>(structuredClone(INITIAL_YARD));

  getYard(): Observable<Yard> {
    return this.yardSubject.asObservable();
  }

  connect(): Observable<Yard> {
    if (!this.socket) {
      this.socket = new WebSocket(this.websocketUrl);

      this.socket.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          const payload = msg.payload as TrackUpdatePayload;

          const current = this.yardSubject.getValue();

          const updated = this.applyTrackUpdates(payload, current);

          this.yardSubject.next(updated);
        } catch (error) {
          console.error('Failed to parse websocket payload', error);
        }
      };

      this.socket.onerror = (err) => {
        console.error(err);
      };
    }

    return this.yardSubject.asObservable();
  }

  disconnect(): void {
    this.socket?.close();
    this.socket = null;
  }

  private applyTrackUpdates(payload: TrackUpdatePayload, baseYard: Yard): Yard {
    const trackMap = new Map(baseYard.tracks.map((track) => [track.id, track]));

    payload.tracks.forEach((update) => {
      const existing = trackMap.get(update.trackId);

      if (!existing) {
        return;
      }

      if (update.event === 'stopped' || update.event === 'crossing') {
        const position =
          update.event === 'crossing'
            ? existing.train.direction === 'RIGHT'
              ? existing.length
              : 0
            : existing.train.position;

        trackMap.set(update.trackId, {
          ...existing,
          train: {
            ...existing.train,
            position,
            status: 'STOPPED',
          },
        });

        return;
      }

      if (update.distance === undefined || !Number.isFinite(update.distance)) {
        return;
      }

      const position = Math.max(0, Math.min(existing.length, update.distance));

      // If the existing train is at 0 and the first reported distance is near the far end,
      // treat this as a newly-initialized train that should move LEFT (towards 0).
      let direction = existing.train.direction;
      if (existing.train.position === 0 && position > existing.length * 0.8) {
        direction = 'LEFT';
      } else {
        direction =
          position < existing.train.position
            ? 'LEFT'
            : position > existing.train.position
              ? 'RIGHT'
              : existing.train.direction;
      }

      trackMap.set(update.trackId, {
        ...existing,
        train: {
          ...existing.train,
          position,
          direction,
          status: position === 0 ? 'STOPPED' : 'MOVING',
        },
      });
    });

    return {
      ...baseYard,
      lastUpdated: payload.timestamp ?? baseYard.lastUpdated,
      tracks: [...trackMap.values()],
    };
  }
}
