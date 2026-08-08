import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-train',
  imports: [],
  templateUrl: './train.html',
  styleUrl: './train.css',
})
export class Train {
  position = input.required<number>();

  x = input.required<number>();
}
