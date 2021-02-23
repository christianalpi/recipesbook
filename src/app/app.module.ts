import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NavbarComponent } from './core/components/navbar.component';

import { RecipeService } from './features/recipes/recipe.service';
import { ShoppingListService } from './features/shopping-list/shopping-list.service';
import { HttpModule } from './shared/http.module';

import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    HttpModule.forRoot({ environment })
  ],
  providers: [
    ShoppingListService,
    RecipeService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
