import { Component } from "@angular/core";
import { NgForm } from '@angular/forms';
import { Router } from "@angular/router";

import { AuthService } from "./auth.service";

@Component({
    selector: 'auth-component',
    templateUrl: './auth.component.html',
    styles: [ 'button { margin: 10px }']
})
export class AuthComponent{
    constructor(private authService: AuthService, private router: Router){}

    isLoading: boolean = false;
    isLoginMode: boolean = true;
    error: string = null;

    switchMode(){
        this.isLoginMode = !this.isLoginMode;

    }

    onSubmit(form: NgForm){
        if(form.invalid || !form.valid){
            return;
        }

        this.isLoading = true;
        this.error = null;
        if(!this.isLoginMode){
            this.handleRegistration(form.value.email, form.value.password);
        }
        else{
            this.handeLogin(form.value.email, form.value.password);
        }
        form.reset();
    }

    private handleRegistration(email: string, password: string){
        this.authService.signup(email, password).subscribe(
            response => { console.log(response); this.isLoading = false; this.router.navigate(["./recipes"]); },
            error => { this.isLoading = false; this.error = error }
        );
    }

    private handeLogin(email: string, password: string){
        this.authService.login(email, password).subscribe(
            response => { 
            console.log(response);
            this.isLoading = false;
            this.router.navigate(["./recipes"]);},
            error => { this.isLoading = false; this.error = error }
        );
    }

}