import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { Header } from '../header/header';


@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    Sidebar,
    Header
  ],
  templateUrl: './shell.html',
  styleUrls: ['./shell.css']
})
export class ShellComponent {}
