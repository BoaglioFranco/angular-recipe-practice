import { Injectable } from "@angular/core";

import { Ingredient } from "../shared/Ingredient.model";
import { Subject } from 'rxjs';

@Injectable({providedIn: "root"})
export class ShoppingListService{
    ingredientsChanged = new Subject<Ingredient[]>();
    editModeSelected = new Subject<number>();



    private _ingredients: Ingredient[] = [new Ingredient("Tomatoes", 10), new Ingredient("Milk", 5)];

    get ingredients(){
        return this._ingredients.slice();
    }

    private emitUpdatedList(){
        this.ingredientsChanged.next(this.ingredients);
    }


    addIngredients(...ing: Ingredient[]){
        ing.forEach((newIngredient: Ingredient) =>{
            const i = this._ingredients.findIndex((ing) => ing.name === newIngredient.name);
            i === -1 ? 
            this._ingredients.push(newIngredient) : this._ingredients[i].amount += newIngredient.amount;
        });
        this.emitUpdatedList();
        console.log("dou3?");
    }


    editIngredient(index: number, ing: Ingredient){
        this._ingredients[index] = ing;
        this.emitUpdatedList();
    }

    removeIngredient(toDelete: Ingredient){
        const i = this._ingredients.findIndex((ing) => ing.name === toDelete.name);
        if(i !== -1){
            this._ingredients.splice(i, 1);
        }
        this.emitUpdatedList();
    }

}