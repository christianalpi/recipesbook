import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  template: `
    <div class="row">
      <div class="col-xs-12">
        <form (ngSubmit)="onSubmit(f)" #f="ngForm">
          <div class="row">
            <div class="col-xs-5 form-group" hidden>
              <label for="name">id</label>
              <input type="text" id="id" class="form-control" name="id" ngModel>
            </div>
            <div class="col-xs-5 form-group">
              <label for="name">Name</label>
              <input type="text" id="name" class="form-control" name="name" ngModel required>
            </div>
            <div class="col-xs-2 form-group">
              <label for="amount">Amount</label>
              <input id="amount" class="form-control" type="number" name="amount" ngModel required patter="^[1-9]+[0-9]*$">
            </div>
          </div>
          <div class="row">
            <div class="col-xs-12">
              <button class="btn btn-success" type="submit" [disabled]="!f.valid">{{ editMode ? 'Update' : 'Add'}}</button> &nbsp;
              <button class="btn btn-danger" type="button" (click)="onDelete()" [disabled]="!editMode">Delete</button> &nbsp;
              <button class="btn btn-primary" type="button" (click)="onClear()">Clear</button> &nbsp;
            </div>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  @ViewChild('f', {static: false}) slForm: NgForm;

  constructor(private shoppingListService: ShoppingListService) {}
  subscription: Subscription;
  editMode: boolean = false;
  // editedItemIndex: number;
  editedItem: Ingredient;

  ngOnInit(): void {
    this.subscription = this.shoppingListService.startedEditing.subscribe(
      (index: number) => {
        this.editMode = true;
        // this.editedItemIndex = index;
        this.editedItem = this.shoppingListService.getIngredient(index);
        this.slForm.setValue({
          id: this.editedItem.id,
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      }
    );
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.id, value.name, value.amount);

    if (this.editMode) {
      this.shoppingListService.updateIngredient(newIngredient);
      this.editMode = false;
    }
    else {
      this.shoppingListService.addIngredient(newIngredient);
    }
     this.slForm.reset();
  }

  onClear(){
   this.slForm.reset();
   this.editMode = false;
  }

  onDelete() {
    const {id} = this.slForm.value;
    this.shoppingListService.deleteIngredient(id);
    this.onClear();
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
