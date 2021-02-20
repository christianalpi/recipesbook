import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  template: `
    <div class="row" *ngIf="recipeForm">
      <div class="col-xs-12">
        <form [formGroup]="recipeForm" (ngSubmit)="onSubmit()">
          <div class="row">
            <div class="col-xs-12">
              <button type="submit" class="btn btn-success" [disabled]="!recipeForm.valid">Save</button>
              <button type="button" class="btn btn-danger" (click)='onCancel()'>Cancel</button>
            </div>
          </div>
          <div class="row">
            <div class="col-xs-12">
              <div class="form-group">
                  <label for="name">Name</label>
                  <input type="text" id="name" formControlName="name" class="form-control">
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-xs-12">
              <div class="form-group">
                <label for="imagePath">Image URL</label>
                <input type="text" id="imagePath" formControlName="imagePath" class="form-control"
                #imagePath>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-xs-12">
              <img [src]="imagePath.value" alt="" class="img-responsive">
            </div>
          </div>
          <div class="row">
            <div class="col-xs-12">
              <div class="form-group">
                <label for="description">Description</label>
                <textarea type="text" id="description" formControlName="description" class="form-control" rows="6"></textarea>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-xs-12" formArrayName="ingredients">
              <div class="row" *ngFor="let ingredientCtrl of controls; let i = index" [formGroupName]="i" style="margin-top:10px;">
                <div class="col-xs-8">
                  <input type="text" formControlName="name" class="form-control">
                </div>
                <div class="col-xs-2">
                  <input type="number" formControlName="amount" class="form-control">
                </div>
                <div class="col-xs-2">
                  <button class="btn btn-danger" (click)='onDeleteIngredient(i)'>X</button>
                </div>
              </div>
              <hr>
              <div class="row">
                <div class="col-xs-12">
                  <button type="button" class="button btn btn-success" (click)="onAddIngredient()">Add Ingredient</button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
  `
    input.ng-invalid.ng-touched, textarea.ng-invalid.ng-touched{
      border: 1px solid red;
    }
  `
  ]
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode: boolean = false;
  recipeForm: FormGroup;

  get controls(){
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  constructor(private router: Router, private route: ActivatedRoute, private recipeService: RecipeService) {}

  ngOnInit(): void {
    const cancel: boolean = this.recipeService.getRecipes().length == 0;
    if (cancel) {
      this.onCancel();
    }
    else {
      this.route.params.subscribe((params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
      });
    }
  }

  private initForm(): void{
    let recipeName: string = '';
    let recipeImagePath: string = '';
    let recipeDescription: string = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.id);
      if (recipe) {
        recipeName = recipe.name;
        recipeImagePath = recipe.imagePath;
        recipeDescription = recipe.description;
        if (recipe.ingredients) {
          recipe.ingredients.map(({name, amount}) => {
            recipeIngredients.push(
              new FormGroup({
                'name': new FormControl(name, [Validators.required]),
                'amount': new FormControl(amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
              })
            );
          });
        }
      }
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, [Validators.required]),
      'imagePath': new FormControl(recipeImagePath, [Validators.required]),
      'description': new FormControl(recipeDescription, [Validators.required]),
      'ingredients': recipeIngredients
    });

  }

  onAddIngredient(): void{
      const control = new FormGroup({
        'name': new FormControl(null, [Validators.required]),
        'amount': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
      });
      (<FormArray>this.recipeForm.get('ingredients')).push(control);
  }

  onDeleteIngredient(index: number): void{
      (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  onSubmit(): void{
    const newRecipe: Recipe = <Recipe>this.recipeForm.value;
    if (this.editMode) {
      this.recipeService.updateRecipe({ ...newRecipe,  id: this.id});
      this.editMode = false;
    } else {
      this.recipeService.addRecipe(newRecipe);
    };
    this.onCancel();
  }

  onCancel(): void{
    this.router.navigate( ['recipes', this.id])
  }

}
