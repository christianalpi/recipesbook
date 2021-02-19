import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';

@Component({
  selector: 'app-recipe-list',
  template: `
    <div class="row">
      <div class="col-xs-12">
        <button class="btn btn-success" (click)="onNewRecipe()">New Recipe</button>
      </div>
      </div>
      <hr>
      <div class="row" *ngIf="recipes">
      <div class="col-xs-12">
        <app-recipe-item *ngFor="let recipe of recipes; let i = index" [recipe]="recipe" [index]="+recipe.id">
        </app-recipe-item>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class RecipeListComponent implements OnInit, OnDestroy {

  recipes: Recipe[];
  subscription: Subscription;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.subscription = this.recipeService.recipeChanged.subscribe((recipes: Recipe[]) => {
      this.recipes = recipes;
    });
    this.recipes = this.recipeService.getRecipes();
  }

  onNewRecipe(): void{
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  ngOnDestroy(): void{
    this.subscription.unsubscribe();
  }

}
