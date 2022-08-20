import { Component } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { combineLatest, forkJoin, interval, take } from 'rxjs';
import { FormControl } from '@angular/forms';

const API = 'https://jsonplaceholder.typicode.com';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  input = new FormControl();

  constructor(http: HttpClient) {

    // only emits value when all observables are complete
    forkJoin([
      http.get(`${API}/users`),
      http.get(`${API}/todos`),
      // the interval never completes so it does not emit anything even if subscribed
      interval(1000)
      // so we can use take operator to make it complete after the last value emitted which is '2'
      .pipe(take(3))
    ])
      .subscribe(data => console.log('forkJoin: ', data));

    // emits the last value of each observable every time one of the observables emit
    combineLatest([
      http.get(`${API}/users`),
      http.get(`${API}/todos`),
      // the interval never completes so it does not emit anything even if subscribed
      interval(1000),
      // so we can use take operator to make it complete after the last value emitted which is '2'
      // .pipe(take(3)),
      this.input.valueChanges
    ])
      .subscribe(data => console.log('combineLatest: ', data));
  }

  // summary
  // combineLatest won't emit until every single observable emits each value
  // for example, from the above code, the forkJoin will start emit once the last interval value is emitted
  // whereas the combineLatest will only starts emitting once the input is typed at least one time

}
