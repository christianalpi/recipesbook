import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Recipe } from '../features/recipes/recipe.model';
import { map } from 'rxjs/operators';
import { Ingredient } from './ingredient.model';
import { Observable } from 'rxjs';
import { EnvironmentConfig, ENV_CONFIG } from 'src/environments/environment-config.interface';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  public apiUrl: string;

  constructor(private http: HttpClient, @Inject(ENV_CONFIG) private config: EnvironmentConfig) {
    this.apiUrl = `${config.environment.baseUrl}`;
   }

  addRecipe(recipe: Recipe): Observable<Recipe>{
    return this.http.post<Recipe>(`${this.apiUrl}/recipes`, recipe);
  }

  updateRecipe(recipe: Recipe): Observable<Recipe>{
    return this.http.patch<Recipe>(`${this.apiUrl}/recipes/${recipe.id}`, recipe);
  }

  deleteRecipe(id: number): Observable<Recipe>{
    return this.http.delete<Recipe>(`${this.apiUrl}/recipes/${id}`);
  }

  fetchRecipes(): Observable<Recipe[]>{
    return this.http.get<Recipe[]>(`${this.apiUrl}/recipes`)
    .pipe(
      map( recipes => {
        return recipes.map( recipe => {
          return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
        })
      })
    );
  }

  addIngredient(ingredient: Ingredient): Observable<Ingredient>{
    return this.http.post<Ingredient>(`${this.apiUrl}/ingredients`, ingredient);
  }

  updateIngredient(ingredient: Ingredient): Observable<Ingredient>{
    return this.http.patch<Ingredient>(`${this.apiUrl}/ingredients/${ingredient.id}`, ingredient);
  }

  deleteIngredient(id: number): Observable<Ingredient>{
    return this.http.delete<Ingredient>(`${this.apiUrl}/ingredients/${id}`);
  }

  fetchIngredients(): Observable<Ingredient[]>{
    return this.http.get<Ingredient[]>(`${this.apiUrl}/ingredients`);
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]): void{
    ingredients.map( ingredient => {
      this.http.post(`${this.apiUrl}/ingredients`, ingredient)
      .subscribe(
        response => {
          this.fetchIngredients();
        }
      );
    });
  }

}
