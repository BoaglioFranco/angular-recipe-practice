import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/Ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: [
    "./shopping-edit.component.css"
  ]
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  
  @ViewChild('form', {static: false})
  form: NgForm;

  isInEditMode: boolean = false;
  editSubscription: Subscription;
  editedIngredient: Ingredient;
  editedIngIndex: number;

  constructor(private slService: ShoppingListService) { }

  ngOnInit(): void {
    this.editSubscription = this.slService.editModeSelected.subscribe( 
      (index: number) => {
        this.isInEditMode= true;
        const ing = this.slService.ingredients[index];
        this.form.form.patchValue({name: ing.name});
        this.form.form.patchValue({amount: ing.amount});
        this.editedIngredient = ing;
        this.editedIngIndex = index;
    });
  }

  ngOnDestroy(): void {
    this.editSubscription.unsubscribe();
  }

  onAddClick(form: NgForm){
    if(!this.isInEditMode){
      this.slService.addIngredients(new Ingredient(form.value.name, form.value.amount));
    }
    else{
      this.editedIngredient = {name: form.value.name, amount: form.value.amount};
      this.slService.editIngredient(this.editedIngIndex, this.editedIngredient);
    }
    this.onClear();
  }

  onClear(){
    this.form.reset();
    this.isInEditMode = false;
    this.editedIngredient = null;
  }

  onRemove(){
    this.slService.removeIngredient(this.editedIngredient);
    this.onClear();
  }
}
