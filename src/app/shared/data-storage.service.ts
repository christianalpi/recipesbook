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

  addRecipe(recipe: Recipe): Observable<void>{
    return this.http.post<void>("http://192.168.1.25:3000/recipes", recipe);
  }

  updateRecipe(recipe: Recipe): Observable<void>{
    return this.http.put<void>(`http://192.168.1.25:3000/recipes/${recipe.id}`, recipe);
  }

  deleteRecipe(index: number): Observable<void>{
    return this.http.delete<void>(`http://192.168.1.25:3000/recipes/${index}`);
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

  addIngredient(ingredient: Ingredient): Observable<void>{
    return this.http.post<void>("http://192.168.1.25:3000/ingredients", ingredient);
  }

  updateIngredient(ingredient: Ingredient): Observable<void>{
    return this.http.put<void>(`http://192.168.1.25:3000/ingredients/${ingredient.id}`, ingredient);
  }

  deleteIngredient(id: number): Observable<void>{
    return this.http.delete<void>(`http://192.168.1.25:3000/ingredients/${id}`);
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
