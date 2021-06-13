import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginDataService {

  private IDsource = new BehaviorSubject('');
  currentID = this.IDsource.asObservable();

  constructor() { }

  changeID(ID: any) {
    this.IDsource.next(ID);
  }
}
