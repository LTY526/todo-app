import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  getValue(key: string): string {
    return localStorage.getItem(key) ?? '';
  }

  setValue(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  getAsTypedList<T>(key: string): Array<T> {
    try {
      const str: string = localStorage.getItem(key) ?? '[]';
      return JSON.parse(str);
    } catch (err) {
      return [];
    }
  }

  clearEntry(key: string): void {
    localStorage.removeItem(key);
  }
}
