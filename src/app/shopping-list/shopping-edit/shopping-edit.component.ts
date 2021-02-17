import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { DataStorageService } from 'src/app/shared/data-storage.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  @ViewChild('f', {static: false}) slForm: NgForm;

  constructor(private slService: ShoppingListService, private dataStorageService: DataStorageService) {}
  subscription: Subscription;
  editMode: boolean = false;
  // editedItemIndex: number;
  editedItem: Ingredient;

  ngOnInit(): void {
    this.subscription = this.slService.startedEditing.subscribe(
      (index: number) => {
        this.editMode = true;
        // this.editedItemIndex = index;
        this.editedItem = this.slService.getIngredient(index);
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      }
    );
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      // this.slService.updateIngredient(newIngredient);
      this.dataStorageService.updateIngredient(newIngredient);
        this.editMode = false;
    }
    else {
      // this.slService.addIngredient(newIngredient);
      this.dataStorageService.addIngredient(newIngredient);
    }
     this.slForm.reset();
  }

  onClear(){
   this.slForm.reset();
   this.editMode = false;
  }

  onDelete() {
    const {name} = this.slForm.value;
    // this.slService.deleteIngredient(name);
    this.dataStorageService.deleteIngredient(name);
    this.onClear();
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}