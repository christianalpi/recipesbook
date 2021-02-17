import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { RecipeService } from '../recipe.service';
import { Ingredient } from '../../shared/ingredient.model';
import { Recipe } from '../recipe.model';
import { DataStorageService } from 'src/app/shared/data-storage.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode: boolean = false;
  recipeForm: FormGroup;

  get controls(){
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  constructor(private router: Router, private route: ActivatedRoute, private recipeService: RecipeService, private dataStorageService: DataStorageService) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
    });
  }

  private initForm(){
    let recipeName: string = '';
    let recipeImagePath: string = '';
    let recipeDescription: string = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.id);
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

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, [Validators.required]),
      'imagePath': new FormControl(recipeImagePath, [Validators.required]),
      'description': new FormControl(recipeDescription, [Validators.required]),
      'ingredients': recipeIngredients
    });

  }

  onAddIngredient(){
      const control = new FormGroup({
        'name': new FormControl(null, [Validators.required]),
        'amount': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
      });
      (<FormArray>this.recipeForm.get('ingredients')).push(control);
  }

  onDeleteIngredient(index: number){
      (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  onSubmit(){
    const newRecipe: Recipe = <Recipe>this.recipeForm.value;
    if (this.editMode) {
      this.dataStorageService.updateRecipe({ ...newRecipe,  id: this.id});
    } else {
      this.dataStorageService.addRecipe(newRecipe);
    };
    this.onCancel();
  }

  onCancel(){
    this.router.navigate( ['../'], { relativeTo: this.route });
  }
}
