import { Injectable } from '@angular/core';
import {User} from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  private currentUser: string | null;

  constructor() {
    this.currentUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
  }

  getUser(): any {
    return this.currentUser;
  }

  setUserNull(){
    this.currentUser=null;
  }
}
