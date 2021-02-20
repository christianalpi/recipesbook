import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-details',
  template: `
    <div class="row" *ngIf="recipe">
      <div class="col-xs-12">
        <img src="{{ recipe.imagePath }}" alt="{{ recipe.name }}" class="img-responsive" style="max-height: 300px" />
      </div>
    </div>
    <div class="row" *ngIf="recipe">
      <div class="col-xs-12">
        <h1>{{ recipe.name }}</h1>
      </div>
    </div>
    <div class="row" *ngIf="recipe">
      <div class="col-xs-12">
        <div class="btn-group" appDropdown>
          <button type="button" class="btn btn-primary dropdown-toggle">
            Manage Recipe <span class="caret"></span>
          </button>
          <ul class="dropdown-menu">
            <li><a style="cursor: pointer;" (click)='onAddToShoppingList()'>Add Ingredients to Shopping List</a></li>
            <li><a style="cursor: pointer;" (click)='onEditRecipe()'>Edit Recipe</a></li>
            <li><a style="cursor: pointer;" (click)='onDeleteRecipe()'>Delete Recipe</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="row" *ngIf="recipe">
      <div class="col-xs-12">
        {{ recipe.description }}
      </div>
    </div>
    <div class="row" *ngIf="recipe">
      <div class="col-xs-12">
        <ul class="list-group">
          <li class="list-group-item" *ngFor="let ingredient of recipe.ingredients">
            {{ingredient.name}} - {{ingredient.amount}}
          </li>
        </ul>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  recipe: Recipe;
  subscription: Subscription;
  id: number;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.recipe = this.recipeService.getRecipe(this.id);
    });
    if (!this.recipe) {
      this.router.navigate( ['recipes/'] );
    }

    this.subscription = this.recipeService.recipeChanged.subscribe((recipes: Recipe[]) => {
      this.recipe = this.recipeService.getRecipe(this.id);
    });
  }

  onAddToShoppingList(): void {
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onEditRecipe(): void {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDeleteRecipe(): void{
    this.recipeService.deleteRecipe(this.recipe.id)
    this.router.navigate( ['recipes/'] );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
