import { Ingredient } from '../shared/Ingredient.model';

export class Recipe{
    name: string;
    description: string;
    imagePath: string;
    ingredients: Ingredient[];
    rpID: string;

    constructor(name: string, description: string, imagePath: string, ingredients: Ingredient[], rpID?: string){
        this.name = name;
        this.description = description;
        this.imagePath = imagePath;
        this.ingredients = ingredients;
        if(rpID){
            this.rpID = rpID;
        } else {
            this.rpID = Math.round(Math.random() * 100000000).toString();
        }
    }
}