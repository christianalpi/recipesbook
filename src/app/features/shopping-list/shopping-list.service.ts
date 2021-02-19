import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { Ingredient } from 'src/app/shared/ingredient.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();

  private ingredients: Ingredient[] = [];

  constructor(private dataStorageService: DataStorageService) { }

  setIngredients(ingredients: Ingredient[]) {
    this.ingredients = ingredients;
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  // getIngredients() {
  //   return this.ingredients.slice();
  // }

  getIngredient(index: number) {
    return this.ingredients[index];
  }

  addIngredient(newIngredient: Ingredient) {
    this.dataStorageService.addIngredient(newIngredient)
    .pipe(
      switchMap(update => this.dataStorageService.fetchIngredients())
    )
    .subscribe(
      response => this.setIngredients(response)
    );
  }

  updateIngredient(ingredient: Ingredient) {
    this.dataStorageService.updateIngredient(ingredient)
    .pipe(
      switchMap(update => this.dataStorageService.fetchIngredients())
    )
    .subscribe(
      response => this.setIngredients(response)
    );
  }

  deleteIngredient(id: number){
    this.dataStorageService.deleteIngredient(id)
    .pipe(
      switchMap(update => this.dataStorageService.fetchIngredients())
    )
    .subscribe(
      response => this.setIngredients(response)
    );
  }

  fetchIngredients(): void{
    this.dataStorageService.fetchIngredients().subscribe(
      response => this.setIngredients(response)
    );
  }

}
