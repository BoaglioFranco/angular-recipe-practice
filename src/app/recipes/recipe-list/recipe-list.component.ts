import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Recipe } from "../recipe.model"
import { RecipeService } from "../recipes.service";
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes : Recipe[] = [];
  rpSubscription: Subscription;
  constructor(private rpService: RecipeService, private router: Router) {}

  ngOnInit(): void {
    this.recipes= this.rpService.recipes;
    this.rpSubscription = this.rpService.recipeChanged.subscribe( (updatedList) => {
      this.recipes = updatedList;
    });
  }

  ngOnDestroy(): void {
    this.rpSubscription.unsubscribe();
  }

  onNewRecipe(){
    this.router.navigate(['/recipes', 'new']);
  }

}
