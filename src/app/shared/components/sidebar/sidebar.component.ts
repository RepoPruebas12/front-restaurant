import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MENU_ITEMS, MenuItem } from '../../config/sidebar.config';

declare const initFlowbite: any;

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, AfterViewInit {
  menuItems: MenuItem[] = [];
  currentUserRole: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUserRole = user?.rol || '';
      this.filterMenuByRole();
    });
  }

  ngAfterViewInit() {
    if (typeof initFlowbite === 'function') {
      initFlowbite();
    }
  }

  private filterMenuByRole() {
    if (!this.currentUserRole) {
      this.menuItems = [];
      return;
    }
    this.menuItems = MENU_ITEMS.filter(item =>
      item.roles.includes(this.currentUserRole)
    );
  }
}
