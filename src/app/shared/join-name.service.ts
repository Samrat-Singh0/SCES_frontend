import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JoinNameService {

  constructor() { }

  getFullName(firstName?: string, middleName?: string, lastName?: string): string {
    return [firstName, middleName, lastName].filter(Boolean).join(' ');
  }
}
