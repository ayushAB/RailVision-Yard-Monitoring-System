import { TestBed } from '@angular/core/testing';
import { Yard } from '../models/yard.model';
import { YardApiService } from './yard-api.service';

describe('YardApiService', () => {
  let service: YardApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YardApiService);
  });

  it('should update track position from websocket payload', () => {
    const initialYard: Yard = {
      stationName: 'Test Yard',
      lastUpdated: '2026-07-27T07:36:34.835Z',
      tracks: [
        {
          id: 1,
          name: 'Track-1',
          length: 100,
          train: {
            locoId: 'WDG4-14567',
            position: 0,
            speed: 12,
            direction: 'RIGHT',
            status: 'MOVING',
          },
          redZone: {
            start: 70,
            end: 100,
          },
          sensors: [],
        },
      ],
    };

    const updatedYard = service.applyTrackUpdates(
      {
        timestamp: '2026-07-27T07:36:36.857Z',
        tracks: [
          {
            trackId: 1,
            distance: 230,
            siren: 0,
            timestamp: '2026-07-27T07:36:36.857Z',
            lastUpdated: 1785137796857,
          },
        ],
      },
      initialYard,
    );

    expect(updatedYard.lastUpdated).toBe('2026-07-27T07:36:36.857Z');
    expect(updatedYard.tracks[0].train.position).toBe(100);
    expect(updatedYard.tracks[0].train.status).toBe('MOVING');
  });
});
