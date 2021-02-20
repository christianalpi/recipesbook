import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from '../features/recipes/recipe.model';
import { map } from 'rxjs/operators';
import { Ingredient } from './ingredient.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http: HttpClient) { }

  addRecipe(recipe: Recipe): Observable<Recipe>{
    return this.http.post<Recipe>("http://192.168.1.25:3000/recipes", recipe);
  }

  updateRecipe(recipe: Recipe): Observable<Recipe>{
    return this.http.patch<Recipe>(`http://192.168.1.25:3000/recipes/${recipe.id}`, recipe);
  }

  deleteRecipe(id: number): Observable<Recipe>{
    return this.http.delete<Recipe>(`http://192.168.1.25:3000/recipes/${id}`);
  }

  fetchRecipes(): Observable<Recipe[]>{
    return this.http.get<Recipe[]>("http://192.168.1.25:3000/recipes")
    .pipe(
      map( recipes => {
        return recipes.map( recipe => {
          return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
        })
      })
    );
  }

  addIngredient(ingredient: Ingredient): Observable<Ingredient>{
    return this.http.post<Ingredient>("http://192.168.1.25:3000/ingredients", ingredient);
  }

  updateIngredient(ingredient: Ingredient): Observable<Ingredient>{
    return this.http.patch<Ingredient>(`http://192.168.1.25:3000/ingredients/${ingredient.id}`, ingredient);
  }

  deleteIngredient(id: number): Observable<Ingredient>{
    return this.http.delete<Ingredient>(`http://192.168.1.25:3000/ingredients/${id}`);
  }

  fetchIngredients(): Observable<Ingredient[]>{
    return this.http.get<Ingredient[]>("http://192.168.1.25:3000/ingredients");
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]): void{
    ingredients.map( ingredient => {
      this.http.post("http://192.168.1.25:3000/ingredients", ingredient)
      .subscribe(
        response => {
          this.fetchIngredients();
        }
      );
    });
  }

}
