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
    .subscribe(
      response => this.setIngredients([...this.ingredients, response])
    );
  }

  updateIngredient(updIngredient: Ingredient) {
    this.dataStorageService.updateIngredient(updIngredient)
    .subscribe(
      response => this.setIngredients(
        this.ingredients.map(ingredient => ingredient.id === response.id ? response : ingredient)
      )
    );
  }

  deleteIngredient(id: number){
    this.dataStorageService.deleteIngredient(id)
    .subscribe(
      response => {
        this.setIngredients(
        this.ingredients.filter(ingredient => ingredient.id !== id)
      )}
    );
  }

  fetchIngredients(): void{
    this.dataStorageService.fetchIngredients().subscribe(
      response => this.setIngredients(response)
    );
  }

}

// Promemoria swithMap
  // addIngredient(newIngredient: Ingredient) {
  //   this.dataStorageService.addIngredient(newIngredient)
  //   .pipe(
  //     switchMap(update => this.dataStorageService.fetchIngredients())
  //   )
  //   .subscribe(
  //     response => this.setIngredients(response)
  //   );
  // }
