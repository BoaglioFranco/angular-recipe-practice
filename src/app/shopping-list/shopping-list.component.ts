import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/Ingredient.model';

import { ShoppingListService } from "./shopping-list.service";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styles: []
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  ingredients: Ingredient[] = [];
  ingredientsChangedSubscription: Subscription;
  constructor(private slService: ShoppingListService) { }

  ngOnInit(): void {
    this.ingredients = this.slService.ingredients;
    this.ingredientsChangedSubscription = this.slService.ingredientsChanged
    .subscribe((ingList: Ingredient[])=>{
      this.ingredients = ingList;
    });
  }

  onEditItem(index: number){
    this.slService.editModeSelected.next(index);
  }

  ngOnDestroy(){
    this.ingredientsChangedSubscription.unsubscribe()
  }
}
