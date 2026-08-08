import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  menu = signal<MenuItem[]>([
    { icon: 'pi pi-home', title: 'Dashboard', route: '/' },
    // { icon: 'pi pi-bolt', title: 'Live Monitoring', route: '/live' },
    // { icon: 'pi pi-microchip', title: 'Sensors', route: '/sensors' },
    // { icon: 'pi pi-map', title: 'Tracks', route: '/tracks' },
    // { icon: 'pi pi-database', title: 'Data Logs', route: '/logs' },
    // { icon: 'pi pi-bell', title: 'Alerts', route: '/alerts' },
    // { icon: 'pi pi-chart-line', title: 'Reports', route: '/reports' },
    // { icon: 'pi pi-cog', title: 'Settings', route: '/settings' },
    // { icon: 'pi pi-users', title: 'Users', route: '/users' }
  ]);
}
