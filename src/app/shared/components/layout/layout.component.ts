import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  template: `
    <div class="flex h-screen overflow-hidden">
      <app-sidebar></app-sidebar>
      <main class="flex-1 overflow-y-auto bg-gray-100">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class LayoutComponent {}
