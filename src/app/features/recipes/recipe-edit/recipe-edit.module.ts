import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecipeEditRoutingModule } from './recipe-edit-routing.module';
import { RecipeEditComponent } from './recipe-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [RecipeEditComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RecipeEditRoutingModule
  ]
})
export class RecipeEditModule { }
