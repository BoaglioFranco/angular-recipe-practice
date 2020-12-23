import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { RecipeService } from '../recipes.service';
import { Recipe } from '../recipe.model';
import { Ingredient } from 'src/app/shared/Ingredient.model';

@Component({
  selector: 'app-edit-recipe',
  templateUrl: './edit-recipe.component.html',
  styleUrls: ['./edit-recipe.component.css']
})
export class EditRecipeComponent implements OnInit {
  isNewRecipe: boolean = true;
  id: string;

  form: FormGroup;
  get formIngredients(){
    return (this.form.get('ingredients') as FormArray);
  }

  constructor(private route: ActivatedRoute, private rpService: RecipeService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        if(params['id'] != null){
          this.isNewRecipe = false;
          this.id = params['id'];
        }  
        this.initForm();
      });
  }

  private initForm(){
    let defaultName = '';
    let defaultPath = '';
    let defaultDesc = '';
    let ingredientsControl = new FormArray([]);

    if(!this.isNewRecipe){
      const recipe = this.rpService.getRecipeById(this.id);
      console.log(this.rpService.recipes[this.id]);
      defaultName = recipe.name;
      defaultPath = recipe.imagePath;
      defaultDesc = recipe.description;
      recipe.ingredients.forEach( (ing) => {
        console.log(ing);
        ingredientsControl.push(new FormGroup({
          'ingName': new FormControl(ing.name, Validators.required),
          'amount': new FormControl(ing.amount, [Validators.required, Validators.pattern(/^[1-9]+[\d]*$/)])
        }));
      });
    }

    this.form = new FormGroup({
      'name': new FormControl(defaultName, Validators.required),
      'path': new FormControl(defaultPath, Validators.required),
      'description': new FormControl(defaultDesc, Validators.required),
      'ingredients': ingredientsControl
    });
    console.log(this.form);
  }

  onAddIngredient(){
    this.formIngredients.push(new FormGroup({
      'ingName': new FormControl(null, Validators.required),
      'amount': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[\d]*$/)]),
    }));
  }

  onRemoveIngredient(i: number){
    this.formIngredients.removeAt(i);
  }

  onSubmit(){
    const ingredients =  this.formIngredients.controls.map((control) => new Ingredient(control.value.ingName, control.value.amount));
    const recipe = new Recipe(this.form.value.name, this.form.value.description, this.form.value.path, ingredients);
    if(!this.isNewRecipe){
      recipe.rpID = this.id;
    }
    this.isNewRecipe ? this.rpService.addRecipe(recipe) : this.rpService.updateRecipe(recipe);
    this.onCancel();
  }

  onCancel(){
    this.router.navigate(["../"], {relativeTo: this.route});
  }

}
