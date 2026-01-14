import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApiService } from '../../services/auth-api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { LoginRequest } from '../../interfaces/login.interface';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData: LoginRequest = {
    email: '',
    password: '',
    restaurante_id: 1
  };

  errorMessage = '';
  isLoading = false;

  constructor(
    private authApiService: AuthApiService,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  onSubmit(): void {
    if (!this.loginData.email || !this.loginData.password) {
      this.toastService.warning('Campos incompletos', 'Por favor complete todos los campos');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authApiService.login(this.loginData).subscribe({
      next: (response) => {
        this.authService.setCurrentUser(response.user, response.access_token);
        this.toastService.success('¡Bienvenido!', `Hola ${response.user.nombre}`);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Error al iniciar sesión';
        this.toastService.error('Error', 'Credenciales incorrectas');
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
