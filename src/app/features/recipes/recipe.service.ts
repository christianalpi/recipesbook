import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Recipe } from './recipe.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  recipeChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [];

  constructor(private shoppingList: ShoppingListService, private dataStorageService: DataStorageService) { }

  getRecipes(): Recipe[] {
    return this.recipes.slice();
  }

  setRecipes(recipes: Recipe[]): void {
    this.recipes = recipes;
    this.recipeChanged.next(this.recipes.slice());
  }

  getRecipe(id: number): Recipe {
    return this.recipes.slice().filter( recipe => (recipe.id === id ))[0];
  }

  fetchRecipes(): void{
    this.dataStorageService.fetchRecipes().subscribe(
      response => this.setRecipes(response)
    );
  }

  addRecipe(newRecipe: Recipe): void{
    this.dataStorageService.addRecipe(newRecipe)
    .pipe(
      switchMap(update => this.dataStorageService.fetchRecipes())
    )
    .subscribe(
      response => this.setRecipes(response)
    );
  }

  updateRecipe(recipe: Recipe): void{
    this.dataStorageService.updateRecipe(recipe)
    .pipe(
      switchMap(update => this.dataStorageService.fetchRecipes())
    )
    .subscribe(
      response => this.setRecipes(response)
    );
  }

  deleteRecipe(id: number): void{
    this.dataStorageService.deleteRecipe(id)
    .pipe(
      switchMap(update => this.dataStorageService.fetchRecipes())
    )
    .subscribe(
      response => this.setRecipes(response)
    );
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.dataStorageService.addIngredientsToShoppingList(ingredients);
  }

}





