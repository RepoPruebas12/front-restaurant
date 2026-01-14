import { Injectable } from '@angular/core';
import { toast } from 'ngx-sonner';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  success(message: string, description?: string) {
    toast.success(message, {
      description: description,
      duration: 3000,
    });
  }

  error(message: string, description?: string) {
    toast.error(message, {
      description: description,
      duration: 4000,
    });
  }

  warning(message: string, description?: string) {
    toast.warning(message, {
      description: description,
      duration: 3500,
    });
  }

  info(message: string, description?: string) {
    toast.info(message, {
      description: description,
      duration: 3000,
    });
  }

  loading(message: string) {
    return toast.loading(message);
  }

  promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) {
    return toast.promise(promise, messages);
  }
}
