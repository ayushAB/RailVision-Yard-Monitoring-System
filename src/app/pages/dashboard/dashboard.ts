import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DashboardCard } from '../../components/common/dashboard-card/dashboard-card';
import { KpiCard } from '../../components/common/kpi-card/kpi-card';
import { YardApiService } from '../../core/api/yard-api.service';
import { YardStateService } from '../../services/yard-state.service';
import { YardCanvas } from '../../components/yard/yard-canvas/yard-canvas';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardCard, KpiCard, YardCanvas],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, OnDestroy {
  private subscription?: Subscription;

  constructor(
    private api: YardApiService,
    private yardState: YardStateService,
  ) {}

  ngOnInit() {
    this.subscription = this.api.connect().subscribe((data) => {
      this.yardState.setYard(data);
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.api.disconnect();
  }
}
