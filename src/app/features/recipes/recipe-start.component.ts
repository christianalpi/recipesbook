import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recipe-start',
  template: `
    <h3>Please select a Recipe!</h3>
  `,
  styles: [
  ]
})
export class RecipeStartComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
