import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

import { catchError, tap } from "rxjs/operators";
import { throwError, BehaviorSubject } from "rxjs";

import { User } from "./user.model";
import { Router } from '@angular/router';

interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;    
}

@Injectable({providedIn: 'root'})
export class AuthService {
    constructor(private http: HttpClient, private router: Router){}

    user = new BehaviorSubject<User>(null);
    tokenExpirationTimer = null;


    signup(email: string, password: string){
        return this.http.post<AuthResponseData>("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAZgaFnnavV7t6hHt0g0k8eDUA9oYHMabk",
        {
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(catchError(this.handleError), tap(this.handleAuth));
    }

    login(email: string, password: string){
        return this.http.post<AuthResponseData>("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAZgaFnnavV7t6hHt0g0k8eDUA9oYHMabk",
        {
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(catchError(this.handleError), tap(this.handleAuth.bind(this)));
    }


    private handleError(errorResponse: HttpErrorResponse){
        console.log(errorResponse);
        let errorMsg = 'An unknown error has ocurred';
        if(!(errorResponse.error && errorResponse.error.error)){
            return throwError(errorMsg);
        }
        
        switch(errorResponse.error.error.message){
            case 'EMAIL_EXISTS': 
                errorMsg = 'This email is already in use.';
                break;
            case "INVALID_PASSWORD":
                errorMsg = 'Invalid password.';
                break;
            case "EMAIL_NOT_FOUND":
                errorMsg = 'Email not found';
                break;
            case "USER_DISABLED":
                errorMsg = 'This account has been suspended';
                break;
            
        }
        return throwError(errorMsg);
    }   

    private handleAuth(resData: AuthResponseData){
        const expDate: Date = new Date(new Date().getTime() + +resData.expiresIn * 1000);
        const user = new User(resData.email, resData.localId, resData.idToken, expDate);
        console.log(this.user);
        this.user.next(user);
        this.autoLogout(+resData.expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    logout(){
        this.user.next(null);
        this.router.navigate(["/"]);
        localStorage.removeItem('userData');
        if(this.tokenExpirationTimer){
            clearTimeout(this.tokenExpirationTimer);
        }

    }

    autoLogout(remainingTokenDuration: number){
        console.log(remainingTokenDuration);
        this.tokenExpirationTimer = setTimeout( () => { this.logout() }, remainingTokenDuration);
    }

    autoLogin(){
        let userData: {
            email: string,
            id: string,
            _token: string,
            tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('userData'));
        if(!userData) return;

        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData.tokenExpirationDate));

        if(loadedUser.token){
            this.user.next(loadedUser);
           
            const remainingTime = new Date(userData.tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(remainingTime);
        }

    }

}