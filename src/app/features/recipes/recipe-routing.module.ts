import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RecipeEditComponent } from './recipe-edit.component';
import { RecipeStartComponent } from './recipe-start.component';
import { RecipesComponent } from './recipes.component';

const routes: Routes = [{ path: '', component: RecipesComponent,
children: [
      { path: '', component: RecipeStartComponent },
      // { path: 'new', component: RecipeEditComponent },
      { path: 'new', loadChildren: () => import('./recipe-edit/recipe-edit.module').then(m => m.RecipeEditModule) },
      { path: ':id', loadChildren: () => import('./recipe-detail/recipe-detail.module').then(m => m.RecipeDetailModule) },
      { path: ':id/edit', loadChildren: () => import('./recipe-edit/recipe-edit.module').then(m => m.RecipeEditModule) },
      // { path: ':id/edit', component: RecipeEditComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipeRoutingModule { }
