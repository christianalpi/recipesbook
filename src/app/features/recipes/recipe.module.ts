import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import { RecipeEditComponent } from './recipe-edit.component';
import { RecipeItemComponent } from './recipe-item.component';
import { RecipeListComponent } from './recipe-list.component';
import { RecipeRoutingModule } from './recipe-routing.module';
import { RecipeStartComponent } from './recipe-start.component';
import { RecipesComponent } from './recipes.component';


@NgModule({
  declarations: [
    RecipesComponent,
    RecipeStartComponent,
    RecipeListComponent,
    RecipeItemComponent,
    // RecipeEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RecipeRoutingModule
  ]
})
export class RecipeModule { }
