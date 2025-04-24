import {Bushes} from "../assets/data/bushes.js"
import { Utils } from "./utils.js";

export class Player {
    constructor(game, path, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.keys = {}
        this.image = new Image();
        this.image.src = path;
        this.height = 670;
        this.width = 335;

        this.data = '';
        this.randomPokemons = ['pikachu' , 'bulbasaur' , 'charmander' , 'arceus']
        this.pokename = 'pikachu'

        this.loaded = false;
        this.image.onload = () => {
            this.loaded = true;
        }
        this.animation_time = 0;
        this.direction = 'down';

        this.worldx = 0
        this.worldy = 0


        this.colliders = [
            { x: 240, y: 462, width: 240, height: 190 },
            { x: 820, y: 414, width: 320, height: 246 },

        ];

        this.utils = new Utils()

        this.bushes = Bushes
        this.has_starter = false

    }

    setup() {
        window.addEventListener("keydown", (e) => {
            this.makeFalse();
            this.keys[e.key] = true;
        });
        window.addEventListener("keyup", (e) => {
            this.keys[e.key] = false;
        });
    }

    makeFalse() {
        this.keys["w"] = false;
        this.keys["s"] = false;
        this.keys["d"] = false;
        this.keys["a"] = false;
    }

    isInBushes(x, y) {
        for (let bush of this.bushes) {
            if (
                x > bush.x &&
                x < bush.x + 48 &&
                y > bush.y &&
                y < bush.y + 48
            ) {
                return true;
            }
        }
        return false;
    }

    isColliding(x, y, width = 48, height = 48) {
        for (let box of this.colliders) {
            if (
                x < box.x + box.width &&
                x + width > box.x &&
                y < box.y + box.height &&
                y + height > box.y
            ) {
                return true;
            }
        }
        return false;
    }


    selectRandomPokemon(){
        let randNum = Math.random();
        if( randNum <= 0.25){
            this.pokename = this.randomPokemons[0]
        }
        else if (randNum <=0.5){
            this.pokename = this.randomPokemons[1]
        }
        else if (randNum <=0.75){
            this.pokename = this.randomPokemons[2]
        }
        else {
            this.pokename = this.randomPokemons[3]
        }
    }


    async update() {
        if (this.has_starter) {
            if (this.isInBushes(this.x, this.y)) {
                this.worldx = this.x
                this.worldy = this.y
                this.selectRandomPokemon();
                this.game.audio.src = 'assets/sounds/battle.mp3'
                this.game.audio.play()

                this.data = this.utils.fetchData(this.pokename)
                    .then(()=>{this.game.scene = 'battle'});

            }
        }
        if(!this.isInBushes(this.x,this.y) || !this.has_starter){

            
            if (this.keys["w"]) {
                if (this.y > this.game.scale * (0.7) && this.y < Math.floor(this.game.height / this.game.scale) * this.game.scale) {
                    if (!this.isColliding(this.x, this.y - 2)) {
                        this.y -= 2;
                    }
                }
            }
            if (this.keys["s"]) {
                if (this.y > 0 && this.y < (Math.floor(this.game.height / this.game.scale) - 1) * this.game.scale) {
                    if (!this.isColliding(this.x, this.y + 2)) {
                        
                        if (this.x <= Math.floor(this.game.width * (0.7) / this.game.scale) * this.game.scale) {
                            this.y += 2;
                    }
                    else {
                        if (this.y <= Math.floor(this.game.height * (0.64) / this.game.scale) * this.game.scale) {
                            this.y += 2;
                        }
                    }
                }
            }
        }
        if (this.keys["l"] || this.keys["a"]) {
            let easter = document.getElementById('easter')
            if(this.keys["l"]){
                easter.src = 'assets/MJ.mp3'
                easter.play()
            }
            else{
                easter.pause()
                easter.src = ""
            }
            if (!this.isColliding(this.x - 2, this.y)) {

                if (this.x > this.game.scale * 1.25 && this.x < Math.floor(this.game.width - 1 / this.game.scale) * this.game.scale) {
                    this.x -= 2;
                }
            }
        }
        if (this.keys["j"] || this.keys["d"]) {
            let easter = document.getElementById('easter')
            if(this.keys["j"]){
                easter.src = 'assets/MJ.mp3'
                easter.play()
            }
            else{
                easter.pause()
                easter.src = ""
            }
            if (!this.isColliding(this.x + 2, this.y)) {
                if (this.x > this.game.scale * 1.20 && this.x < (Math.floor(this.game.width / this.game.scale) - 2) * this.game.scale) {
                    if (this.y <= Math.floor(this.game.height * (0.65) / this.game.scale) * this.game.scale) {
                        this.x += 2;
                    }
                    else {
                        if (this.y >= Math.floor(this.game.height * (0.6) / this.game.scale) * this.game.scale) {
                            if (this.x <= Math.floor(this.game.width * (0.68) / this.game.scale) * this.game.scale) {
                                this.x += 2;
                            }
                        }
                    }
                }
            }
        }

        if (Object.values(this.keys).some(v => v)) {
            this.animationTime++;
        } else {
            this.animationTime = 0;
        }
    }
    }



    render(posx, posy, swidth, sheight, dwidth, dheight) {
        if (this.loaded) {
            this.game.ctx.drawImage(this.image, posx, posy, swidth, sheight, this.x, this.y, dwidth, dheight);
        }
    }

}



