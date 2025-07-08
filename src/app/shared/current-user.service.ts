import {Injectable} from '@angular/core';

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

  setUser(user: any) {
    this.currentUser = user;
  }

  setUserNull(){
    this.currentUser=null;
  }
}
