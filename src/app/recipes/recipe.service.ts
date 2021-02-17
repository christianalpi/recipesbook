import { ConditionalExpr } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';

@Injectable()
export class RecipeService {
  recipeChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [];

  constructor(private slService: ShoppingListService) { }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipeChanged.next(this.recipes.slice());
  }

  getRecipes(): Recipe[] {
    return this.recipes.slice();
  }

  getRecipe(id: number): Recipe {
    return this.recipes.slice().filter( recipe => (recipe.id === id ))[0];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe): void{
    this.recipes = [...this.recipes, recipe];
    this.recipeChanged.next(this.recipes.slice());
  }

  updateRecipe(newRecipe: Recipe): void{
    this.recipes = this.recipes.map( recipe => (recipe.id === newRecipe.id ? newRecipe : recipe));
    this.recipeChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number): void{
    this.recipes = this.recipes.filter(recipe => recipe.id !== index);
    this.recipeChanged.next(this.recipes.slice());
  }
}
