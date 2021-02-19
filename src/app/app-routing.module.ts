import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  { path: 'recipes', loadChildren:
    () => import('./features/recipes/recipe.module')
    .then(m => m.RecipeModule) },
  { path: 'shopping-list', loadChildren:
    () => import('./features/shopping-list/shopping-list.module')
    .then(m => m.ShoppingListModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
