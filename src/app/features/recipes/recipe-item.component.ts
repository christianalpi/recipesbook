import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from './recipe.model';

@Component({
  selector: 'app-recipe-item',
  template: `
    <a style="cursor: pointer;" [routerLink]="[index]" class="list-group-item clearfix" routerLinkActive="active">
      <div class="pull-left">
        <span>{{ recipe.id }}</span>
        <h4 class="list-group-item-heading">{{ recipe.name }}</h4>
        <p class="list-group-item-text">{{recipe.description}}</p>
      </div>
      <div class="pull-right">
        <img src="{{recipe.imagePath}}" alt="{{ recipe.name }} " class="img-responsive" style="max-height: 50px;">
      </div>
    </a>
  `,
  styles: [
    `
    h4 {
      display: inline-block;
    }

    span{
      padding-right: 5px;
    }
    `
  ]
})
export class RecipeItemComponent implements OnInit {

  @Input() recipe: Recipe;
  @Input() index: number;

  ngOnInit(): void {}

}
