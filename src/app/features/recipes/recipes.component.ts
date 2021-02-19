import { Component, OnInit } from '@angular/core';
import { RecipeService } from './recipe.service';

@Component({
  selector: 'app-recipe',
  template: `
    <div class="row">
      <div class="col-md-5">
        <app-recipe-list></app-recipe-list>
      </div>
      <div class="col-md-7">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class RecipesComponent implements OnInit {

  constructor(private recipeService: RecipeService) { }

  ngOnInit(): void {
    this.recipeService.fetchRecipes();
  }

}
