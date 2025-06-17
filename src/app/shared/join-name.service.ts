import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JoinNameService {

  constructor() { }

  getFullName(firstName?: string, lastName?: string, middleName?: string): string {
    return [firstName, middleName, lastName].filter(Boolean).join(' ');
  }
}
