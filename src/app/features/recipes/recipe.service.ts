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
    .subscribe(
      response => this.setRecipes([...this.recipes, response])
    );
  }

  updateRecipe(updRecipe: Recipe): void{
    this.dataStorageService.updateRecipe(updRecipe)
    .subscribe(
      response => this.setRecipes(this.recipes.map(recipe => recipe.id === response.id ? response : recipe))
    );
  }

  deleteRecipe(id: number): void{
    this.dataStorageService.deleteRecipe(id)
    .subscribe(
      response => this.setRecipes(this.recipes.filter(recipe => recipe.id !== id))
    );
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    ingredients.map(ingredient => {
      this.shoppingList.addIngredient(ingredient);
    });
  }

}





