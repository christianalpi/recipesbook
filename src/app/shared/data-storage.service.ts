import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { delay, map } from 'rxjs/operators';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Ingredient } from './ingredient.model';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http: HttpClient, private recipeService: RecipeService, private shoppingListService: ShoppingListService) { }

  addRecipe(recipe: Recipe){
    this.http.post("http://192.168.1.25:3000/recipes", recipe).subscribe(
      response => {
        this.recipeService.addRecipe(recipe);
        this.fetchRecipes();
      }
    );
  }

  updateRecipe(recipe: Recipe){
    this.http.put(`http://192.168.1.25:3000/recipes/${recipe.id}`, recipe).subscribe(
      response => {
        this.recipeService.updateRecipe(recipe);
      }
    );
  }

  deleteRecipe(index: number){
    this.http.delete(`http://192.168.1.25:3000/recipes/${index}`).subscribe(
      response => {
        this.recipeService.deleteRecipe(index);
      }
    );
  }

  fetchRecipes(){
    this.recipeService.setRecipes([]);
    this.http.get<Recipe[]>("http://192.168.1.25:3000/recipes")
    .pipe(
      map( recipes => {
        return recipes.map( recipe => {
          return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
        })
      })
    )
    .subscribe(
      response => this.recipeService.setRecipes(response)
    );
  }

  addIngredient(ingredient: Ingredient){
    this.http.post("http://192.168.1.25:3000/ingredients", ingredient).subscribe(
      response => {
        this.shoppingListService.addIngredient(ingredient);
        this.fetchRecipes();
      }
    );
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]){
    ingredients.map( ingredient => {
      this.http.post("http://192.168.1.25:3000/ingredients", ingredient).subscribe(
        response => {
          this.shoppingListService.addIngredients(ingredients);
          this.fetchIngredients();
        }
      );
    });
  }

  updateIngredient(ingredient: Ingredient){
    this.http.put(`http://192.168.1.25:3000/ingredients/${ingredient.id}`, ingredient).subscribe(
      response => {
        this.shoppingListService.updateIngredient(ingredient);
      }
    );
  }

  deleteIngredient(id: number){
    this.http.delete(`http://192.168.1.25:3000/ingredients/${id}`).subscribe(
      response => {
        this.shoppingListService.deleteIngredient(id);
      }
    );
  }

  fetchIngredients(){
    this.shoppingListService.setIngredients([]);
    this.http.get<Ingredient[]>("http://192.168.1.25:3000/ingredients")
    .subscribe(
      response => this.shoppingListService.setIngredients(response)
    );
  }

}
