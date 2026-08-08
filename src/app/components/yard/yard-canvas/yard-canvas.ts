import { Component, computed, inject } from '@angular/core';
import { YardStateService } from '../../../services/yard-state.service';
import { TrackRenderer } from '../../track/track-renderer/track-renderer';

@Component({
  selector: 'app-yard-canvas',
  imports: [TrackRenderer],
  templateUrl: './yard-canvas.html',
  styleUrl: './yard-canvas.css',
})
export class YardCanvas {
  yardState = inject(YardStateService);
  // Show only tracks that are currently moving. Limit to first 4.
  tracks = computed(() =>
    this.yardState
      .tracks()
      .filter((t) => t.train && t.train.status === 'MOVING')
      .slice(0, 4),
  );
}
