import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  template: `
    <nav class="navbar navbar-defaul">
      <div class="container-fluid">
        <div class="navbar-header">
          <a href="#" class="navbar-brand">Recipe Book</a>
        </div>

        <div class="collapse navbar-collapse" id="test">
          <ul class="nav navbar-nav">
            <li routerLinkActive="active"><a routerLink="/recipes">Recipes</a></li>
            <li routerLinkActive="active"><a routerLink="/shopping-list">Shopping List</a></li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [
  ]
})
export class NavbarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
