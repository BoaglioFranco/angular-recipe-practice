import { Component, OnInit, OnDestroy } from '@angular/core';

import { RecipeService } from "../recipes/recipes.service";
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
    constructor(private rpService: RecipeService, private authService: AuthService) { }

    isAuthenticated: boolean = false;
    userSubscription: Subscription;

  ngOnInit(): void {
    this.userSubscription = this.authService.user.subscribe( user => {
      this.isAuthenticated = !!user;
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
  onSaveRecipes(){
    this.rpService.firebaseStoreRecipes();
  }

  onLogout(){
    this.authService.logout();
  }

  onFetchData(){
    this.rpService.firebaseFetchRecipes();
  }
}
