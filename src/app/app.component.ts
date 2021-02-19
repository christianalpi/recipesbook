import { Component } from '@angular/core';
// import { Router, Route } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <app-navbar></app-navbar>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <router-outlet></router-outlet>
            </div>
        </div>
    </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'RecipesBook';

  constructor() {}

}
