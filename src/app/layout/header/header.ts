import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  readonly now = signal(new Date());

  readonly currentTime = computed(() =>
    this.now().toLocaleTimeString()
  );

  readonly currentDate = computed(() =>
    this.now().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  );

  constructor() {

    setInterval(() => {

      this.now.set(new Date());

    },1000);

  }

}
