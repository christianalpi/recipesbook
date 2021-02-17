import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';

export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();

  private ingredients: Ingredient[] = [];

  setIngredients(ingredients: Ingredient[]) {
    this.ingredients = ingredients;
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  getIngredients() {
    return this.ingredients.slice();
  }

  getIngredient(index: number) {
    return this.ingredients[index];
  }

  addIngredient(ingredient: Ingredient) {
    // this.ingredients.push(ingredient);
    this.ingredients = [...this.ingredients, ingredient];
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  addIngredients(ingredients: Ingredient[]) {
    // this.ingredients.push(...ingredients);
    this.ingredients = [...this.ingredients, ...ingredients];
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  // updateIngredient(index: number, newIngredient: Ingredient){
  //   this.ingredients[index] = newIngredient;
  //   this.ingredientsChanged.next(this.ingredients.slice());
  // }

  updateIngredient(newIngredient: Ingredient) {
    this.ingredients = this.ingredients.map( ingredient => (ingredient.id === newIngredient.id ? newIngredient : ingredient));
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  // deleteIngredient(index: number){
  //   this.ingredients.splice(index, 1);
  //   this.ingredientsChanged.next(this.ingredients.slice());
  // }

  deleteIngredient(id: number){
    this.ingredients = this.ingredients.filter(ingredient => ingredient.id !== id);
    this.ingredientsChanged.next(this.ingredients.slice());
  }
}
