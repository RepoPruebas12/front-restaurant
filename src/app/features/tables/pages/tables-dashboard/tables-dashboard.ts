import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Table {
  id: number;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  currentOrder?: {
    id: string;
    items: number;
    total: number;
    startTime: string;
  };
}

@Component({
  selector: 'app-tables-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tables-dashboard.html',
  styleUrl: './tables-dashboard.css'
})
export class TablesDashboardComponent {
  tables: Table[] = [
    { id: 1, number: 1, capacity: 2, status: 'available' },
    { id: 2, number: 2, capacity: 4, status: 'occupied', currentOrder: { id: '#1235', items: 5, total: 230, startTime: '18:30' } },
    { id: 3, number: 3, capacity: 2, status: 'available' },
    { id: 4, number: 4, capacity: 6, status: 'reserved' },
    { id: 5, number: 5, capacity: 4, status: 'occupied', currentOrder: { id: '#1234', items: 3, total: 125, startTime: '18:45' } },
    { id: 6, number: 6, capacity: 2, status: 'available' },
    { id: 7, number: 7, capacity: 4, status: 'available' },
    { id: 8, number: 8, capacity: 4, status: 'occupied', currentOrder: { id: '#1236', items: 2, total: 78, startTime: '19:00' } },
    { id: 9, number: 9, capacity: 8, status: 'reserved' },
    { id: 10, number: 10, capacity: 2, status: 'available' },
    { id: 11, number: 11, capacity: 4, status: 'available' },
    { id: 12, number: 12, capacity: 6, status: 'occupied', currentOrder: { id: '#1237', items: 4, total: 180, startTime: '19:15' } },
    { id: 13, number: 13, capacity: 2, status: 'available' },
    { id: 14, number: 14, capacity: 4, status: 'available' },
    { id: 15, number: 15, capacity: 2, status: 'available' },
    { id: 16, number: 16, capacity: 4, status: 'available' },
    { id: 17, number: 17, capacity: 6, status: 'reserved' },
    { id: 18, number: 18, capacity: 4, status: 'available' },
    { id: 19, number: 19, capacity: 2, status: 'available' },
    { id: 20, number: 20, capacity: 8, status: 'available' }
  ];

  selectedTable: Table | null = null;
  filterStatus: 'all' | 'available' | 'occupied' | 'reserved' = 'all';

  get filteredTables(): Table[] {
    if (this.filterStatus === 'all') {
      return this.tables;
    }
    return this.tables.filter(table => table.status === this.filterStatus);
  }

  get stats() {
    return {
      total: this.tables.length,
      available: this.tables.filter(t => t.status === 'available').length,
      occupied: this.tables.filter(t => t.status === 'occupied').length,
      reserved: this.tables.filter(t => t.status === 'reserved').length,
      occupancyRate: Math.round((this.tables.filter(t => t.status === 'occupied').length / this.tables.length) * 100)
    };
  }

  selectTable(table: Table) {
    this.selectedTable = table;
  }

  closeModal() {
    this.selectedTable = null;
  }

  setFilter(status: 'all' | 'available' | 'occupied' | 'reserved') {
    this.filterStatus = status;
  }

  getStatusColor(status: string): string {
    const colors = {
      'available': 'bg-green-100 border-green-300 text-green-800',
      'occupied': 'bg-red-100 border-red-300 text-red-800',
      'reserved': 'bg-yellow-100 border-yellow-300 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || '';
  }

  getStatusIcon(status: string): string {
    const icons = {
      'available': '✓',
      'occupied': '●',
      'reserved': '◷'
    };
    return icons[status as keyof typeof icons] || '';
  }
}
