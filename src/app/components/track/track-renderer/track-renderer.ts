import {
  Component,
  computed,
  effect,
  input,
  OnDestroy,
  OnInit,
  signal,
  ElementRef,
  ViewChild,
  AfterViewInit,
  HostListener,
} from '@angular/core';

import { Track } from '../../../core/models/track.model';
import { Train } from '../train/train';

@Component({
  selector: 'app-track-renderer',
  standalone: true,
  imports: [Train],
  templateUrl: './track-renderer.html',
  styleUrl: './track-renderer.css',
})
export class TrackRenderer implements OnInit, OnDestroy {
  track = input.required<Track>();

  /**
   * Animated position displayed on screen
   */
  currentPosition = signal(0);

  /**
   * Latest backend position
   */
  targetPosition = signal(0);

  private animationId?: number;

  /**
   * Time of previous animation frame
   */
  private lastFrameTime = 0;

  /**
   * Time when last websocket update arrived
   */
  private lastPacketTime = performance.now();

  /**
   * Estimated speed (meters/sec)
   */
  private speed = 0;

  private readonly animationDuration = 5000;

  @ViewChild('trackSvg', { static: true }) private trackSvg?: ElementRef<SVGElement>;

  // measured SVG client width in pixels
  private svgClientWidth = 0;

  // viewBox constants
  private readonly viewBoxTotal = 1200; // viewBox width
  private readonly svgStart = 40;
  private readonly svgWidth = 1120;

  constructor() {
    effect(() => {
      const train = this.track().train;

      if (!train) {
        return;
      }

      const current = this.currentPosition();
      const newPosition = Number(train.position);

      if (!Number.isFinite(newPosition)) {
        return;
      }

      const clampedPosition = Math.max(0, Math.min(this.track().length, newPosition));

      // compute visual limits (in metres) so the wagon graphic doesn't overflow
      const limits = this.computeVisualPosLimits();
      const visualTarget = Math.max(limits.minPos, Math.min(limits.maxPos, clampedPosition));
      const delta = clampedPosition - current;

      // If this renderer hasn't seen the train yet (display at 0) but backend reports
      // it near the far end, initialize the displayed position there so subsequent
      // decreasing updates animate left smoothly instead of teleporting or blocking.
      if (current === 0 && clampedPosition > this.track().length * 0.8) {
        this.currentPosition.set(clampedPosition);
        this.targetPosition.set(clampedPosition);
        this.speed = Number.isFinite(train.speed) && train.speed > 0 ? train.speed : 20;
        return;
      }

      if (train.status === 'STOPPED') {
        this.targetPosition.set(current);
        this.speed = 0;
        return;
      }

      // allow movement in both directions; direction is informational only

      if (clampedPosition >= this.track().length && train.direction === 'RIGHT') {
        this.targetPosition.set(this.track().length);
        this.speed = 0;
        return;
      }

      if (clampedPosition <= 0 && train.direction === 'LEFT') {
        this.targetPosition.set(0);
        this.speed = 0;
        return;
      }

      const defaultSpeed = 20; // meters per second
      this.speed = Number.isFinite(train.speed) && train.speed > 0 ? train.speed : defaultSpeed;
      this.targetPosition.set(visualTarget);

      console.log(
        `Track ${this.track().id}`,
        `Current=${this.currentPosition()}`,
        `Target=${newPosition}`,
        `Speed=${this.speed}`,
      );
    });
  }

  ngOnInit(): void {
    this.updateSvgSize();
    const start = Number(this.track().train.position);

    // Always visually start the wagon on the left side (track end). The
    // logical `position` 0 represents the right end; the left visual maps to
    // `track.length` because we invert the X mapping. Initialize display at
    // left so incoming decreasing-distance updates animate rightwards.
    const initial = Number.isFinite(start) ? start : 0;

    if (initial === 0) {
      this.currentPosition.set(this.track().length);
      this.targetPosition.set(this.track().length);
    } else {
      this.currentPosition.set(initial);
      this.targetPosition.set(initial);
    }

    this.animationId = requestAnimationFrame(this.animate);
  }

  ngAfterViewInit(): void {
    this.updateSvgSize();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateSvgSize();
  }

  private updateSvgSize() {
    try {
      const el = this.trackSvg?.nativeElement as HTMLElement | undefined;
      if (el && el.clientWidth) {
        this.svgClientWidth = el.clientWidth;
      }
    } catch (e) {
      // ignore
    }
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  /**
   * Runs at ~60 FPS
   */
  private animate = (time: number) => {
    if (!this.lastFrameTime) {
      this.lastFrameTime = time;
    }

    const deltaSeconds = (time - this.lastFrameTime) / 1000;

    this.lastFrameTime = time;

    let current = this.currentPosition();
    const target = this.targetPosition();

    if (!Number.isFinite(current) || !Number.isFinite(target)) {
      this.animationId = requestAnimationFrame(this.animate);
      return;
    }

    if (Math.abs(target - current) < 0.02) {
      current = target;
    } else {
      // Easing: smoothly approach the target using exponential smoothing,
      // but cap movement by the maximum distance the train can travel this frame.
      const deltaPos = target - current;
      const smoothing = 6; // larger = snappier

      // desired movement this frame based on easing
      const desiredMove = deltaPos * (1 - Math.exp(-smoothing * deltaSeconds));

      // maximum allowed movement based on speed (meters/sec)
      let maxMove = this.speed * deltaSeconds;
      if (!Number.isFinite(maxMove) || maxMove <= 0) {
        maxMove = Math.abs(desiredMove);
      }

      const move = Math.sign(desiredMove) * Math.min(Math.abs(desiredMove), maxMove);

      current += move;

      if ((move > 0 && current > target) || (move < 0 && current < target)) {
        current = target;
      }
    }

    // Ensure current never goes out of logical bounds and visual bounds.
    const limits = this.computeVisualPosLimits();
    current = Math.max(0, Math.min(current, this.track().length));
    current = Math.max(limits.minPos, Math.min(current, limits.maxPos));

    this.currentPosition.set(current);

    this.animationId = requestAnimationFrame(this.animate);
  };

  /**
   * Convert meters to SVG coordinate
   */
  trainX = computed(() => {
    let pos = this.currentPosition();

    if (!Number.isFinite(pos)) {
      pos = 0;
    }

    pos = Math.max(0, Math.min(pos, this.track().length));

    // If we have a measured SVG width, map viewBox units to pixels for clamping
    const clientW = this.svgClientWidth || 0;

    if (clientW > 0) {
      const svgStartPx = (this.svgStart / this.viewBoxTotal) * clientW;
      const svgWidthPx = (this.svgWidth / this.viewBoxTotal) * clientW;

      const centerPx =
        svgStartPx + ((this.track().length - pos) / this.track().length) * svgWidthPx;

      const halfW = 160; // px (half train width)
      const minCenter = svgStartPx + halfW;
      const maxCenter = svgStartPx + svgWidthPx - halfW;

      return Math.max(minCenter, Math.min(maxCenter, centerPx));
    }

    // Fallback: compute in viewBox units (older behavior)
    return this.svgStart + ((this.track().length - pos) / this.track().length) * this.svgWidth;
  });

  sensors = computed(() => this.track().sensors);

  sleepers = Array.from({ length: 45 }, (_, i) => i);

  scale = Array.from({ length: 11 }, (_, i) => i);

  sensorX(position: number) {
    const clientW = this.svgClientWidth || 0;

    if (clientW > 0) {
      const svgStartPx = (this.svgStart / this.viewBoxTotal) * clientW;
      const svgWidthPx = (this.svgWidth / this.viewBoxTotal) * clientW;

      return svgStartPx + ((this.track().length - position) / this.track().length) * svgWidthPx;
    }

    return 40 + ((this.track().length - position) / this.track().length) * 1120;
  }

  /**
   * Compute minimum and maximum logical positions (metres) that keep the
   * wagon graphic fully inside the SVG stage, taking current SVG client width
   * into account. Returns values in metres.
   */
  private computeVisualPosLimits() {
    const len = this.track().length;

    // default: full range
    let minPos = 0;
    let maxPos = len;

    if (this.svgClientWidth > 0) {
      const halfW = 160; // px, half wagon width
      const paddingPx = 12; // px of extra visual padding from the dead-end

      // effective half-width including padding
      const effectiveHalfPx = halfW + paddingPx;

      // convert effectiveHalfPx to viewBox units
      const halfW_viewBox = (effectiveHalfPx / this.svgClientWidth) * this.viewBoxTotal;

      const ratio = halfW_viewBox / this.svgWidth; // fraction of svgWidth

      minPos = len * ratio; // cannot go below this logical position
      maxPos = len * (1 - ratio); // cannot go above this logical position
    }

    // clamp safety
    minPos = Math.max(0, Math.min(minPos, len));
    maxPos = Math.max(0, Math.min(maxPos, len));

    return { minPos, maxPos };
  }
}
