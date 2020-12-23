import { Injectable } from "@angular/core";

import { Recipe } from "./recipe.model";
import { Ingredient } from "../shared/Ingredient.model";
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';
import { map } from "rxjs/operators";
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

@Injectable({providedIn: "root"})
export class RecipeService{

    recipeChanged = new Subject<Recipe[]>();

    
    
    constructor(private slService: ShoppingListService, private http: HttpClient, private authService: AuthService){
        this.authService.user.subscribe(user => {
            if(user){
                this.firebaseFetchRecipes();
            }
        });
    }

    private _recipes: Recipe[] = [];
   
    //REcipes array stuff
    get recipes(){ //Provides a copy of the recipes array
        return this._recipes.slice();
    }


    private emitUpdatedRecipes(){
        this.recipeChanged.next(this.recipes);
    }

    recipeToShoppingList(ings: Ingredient[]){
        this.slService.addIngredients(...ings);
    }


    getRecipeIndex(rpID: string){ //FUCK YOU MAX
        for(let [i, recipe] of this._recipes.entries()){
            if(recipe.rpID === rpID){
                return i;
            }
        }
        return null;
    }

    getRecipeById(rpID: string){
        return this._recipes.find( recipe => recipe.rpID === rpID);
    }

    addRecipe(recipe: Recipe){
        this._recipes.push(recipe);
        this.emitUpdatedRecipes();
    }

    updateRecipe(recipe: Recipe){
        this._recipes[this.getRecipeIndex(recipe.rpID)]= recipe;
        this.emitUpdatedRecipes();
    }

    deleteRecipe(rpID: string){
        const i = this.getRecipeIndex(rpID);
        this._recipes.splice(i, 1);
        this.emitUpdatedRecipes();
    }

    //HTTP STUFF

    firebaseStoreRecipes(){
        this.http.put("https://angular-course-project-e980d.firebaseio.com/recipes.json",
        this._recipes).subscribe(response =>{
            console.log(response);
        });
    }
  
    firebaseFetchRecipes(){
        this.http.get<Recipe[]>("https://angular-course-project-e980d.firebaseio.com/recipes.json")
        .pipe(map( response => response.map( recipe =>{return {...recipe, ingredients: recipe.ingredients? recipe.ingredients : []}})
        ))
        .subscribe(
            response => {
                this._recipes = response
                this.emitUpdatedRecipes();
            });
    }


}






// [
    // {name: "Salchicha a la bolognesa",
    // rpID: "62621809",
    // description: "Sabrosisimo",
    // imagePath: "https://i2.pickpik.com/photos/271/85/296/bratwurst-grill-sausage-barbecue-sausage-preview.jpg",
    // ingredients: [{name: "Salchichon", amount: 1}, {name: "Sauce", amount: 2}]},
    
    // {name: "Salchicha a la bolognesa 2",
    // rpID: "37672813",
    // description: "Mas rico todavia",
    // imagePath: "https://i2.pickpik.com/photos/271/85/296/bratwurst-grill-sausage-barbecue-sausage-preview.jpg",
    // ingredients: [{name: "Salchichon", amount: 2}, {name: "Sauce", amount: 3}]},
    // {name: "Fideos de la semana pasada",
    // rpID: "99966353",
    // description: "Con gusto a champiñon",
    // imagePath: "https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    // ingredients: [{name: "Noodles", amount: 1}, {name: "Fine Herbs", amount: 2}]}
    // ];
