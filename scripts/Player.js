import { Battle } from "./battle.js";


function showLoadingScreen() {
    document.getElementById("loading-screen").style.display = "flex";
}


function hideLoadingScreen() {
    document.getElementById("loading-screen").style.display = "none";
}

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


        this.colliders = [
            { x: 240, y: 462, width: 240, height: 190 },
            { x: 820, y: 414, width: 320, height: 246 },

        ];

        this.bushes = [
            {x: 96, y: 48}, {x: 96, y: 96}, {x: 96, y: 144}, {x: 96, y: 192}, {x: 96, y: 240},
            {x: 144, y: 48}, {x: 144, y: 96}, {x: 144, y: 144}, {x: 144, y: 192}, {x: 144, y: 240},
            {x: 192, y: 48}, {x: 192, y: 96}, {x: 192, y: 144}, {x: 192, y: 192}, {x: 192, y: 240},
            {x: 240, y: 48}, {x: 240, y: 96}, {x: 240, y: 144}, {x: 240, y: 192}, {x: 240, y: 240},
            {x: 288, y: 48}, {x: 288, y: 96}, {x: 288, y: 144}, {x: 288, y: 192}, {x: 288, y: 240},
            {x: 336, y: 48}, {x: 336, y: 96}, {x: 336, y: 144}, {x: 336, y: 192}, {x: 336, y: 240},
            {x: 384, y: 48}, {x: 384, y: 96}, {x: 384, y: 144}, {x: 384, y: 192}, {x: 384, y: 240},
            {x: 432, y: 48}, {x: 432, y: 96}, {x: 432, y: 144}, {x: 432, y: 192}, {x: 432, y: 240},
            {x: 480, y: 48}, {x: 480, y: 96}, {x: 480, y: 144}, {x: 480, y: 192}, {x: 480, y: 240},
            {x: 768, y: 48}, {x: 768, y: 96}, {x: 768, y: 144}, {x: 768, y: 192}, {x: 768, y: 240},
            {x: 816, y: 48}, {x: 816, y: 96}, {x: 816, y: 144}, {x: 816, y: 192}, {x: 816, y: 240},
            {x: 864, y: 48}, {x: 864, y: 96}, {x: 864, y: 144}, {x: 864, y: 192}, {x: 864, y: 240},
            {x: 912, y: 48}, {x: 912, y: 96}, {x: 912, y: 144}, {x: 912, y: 192}, {x: 912, y: 240},
            {x: 960, y: 48}, {x: 960, y: 96}, {x: 960, y: 144}, {x: 960, y: 192}, {x: 960, y: 240},
            {x: 1008, y: 48}, {x: 1008, y: 96}, {x: 1008, y: 144}, {x: 1008, y: 192}, {x: 1008, y: 240},
            {x: 1056, y: 48}, {x: 1056, y: 96}, {x: 1056, y: 144}, {x: 1056, y: 192}, {x: 1056, y: 240},
            {x: 1104, y: 48}, {x: 1104, y: 96}, {x: 1104, y: 144}, {x: 1104, y: 192}, {x: 1104, y: 240},
            {x: 1152, y: 48}, {x: 1152, y: 96}, {x: 1152, y: 144}, {x: 1152, y: 192}, {x: 1152, y: 240},
            {x: 1152, y: 288}, {x: 1152, y: 336}, {x: 1152, y: 384},
            {x: 1200, y: 48}, {x: 1200, y: 96}, {x: 1200, y: 144}, {x: 1200, y: 192}, {x: 1200, y: 240},
            {x: 1200, y: 288}, {x: 1200, y: 336}, {x: 1200, y: 384},
            {x: 1248, y: 48}, {x: 1248, y: 96}, {x: 1248, y: 144}, {x: 1248, y: 192}, {x: 1248, y: 240},
            {x: 1248, y: 288}, {x: 1248, y: 336}, {x: 1248, y: 384},
            {x: 1296, y: 48}, {x: 1296, y: 96}, {x: 1296, y: 144}, {x: 1296, y: 192}, {x: 1296, y: 240},
            {x: 1296, y: 288}, {x: 1296, y: 336}, {x: 1296, y: 384},
            {x: 1344, y: 48}, {x: 1344, y: 96}, {x: 1344, y: 144}, {x: 1344, y: 192}, {x: 1344, y: 240},
            {x: 1344, y: 288}, {x: 1344, y: 336}, {x: 1344, y: 384},
            {x: 1392, y: 48}, {x: 1392, y: 96}, {x: 1392, y: 144}, {x: 1392, y: 192}, {x: 1392, y: 240},
            {x: 1392, y: 288}, {x: 1392, y: 336}, {x: 1392, y: 384},
            {x: 1440, y: 48}, {x: 1440, y: 96}, {x: 1440, y: 144}, {x: 1440, y: 192}, {x: 1440, y: 240},
            {x: 1440, y: 288}, {x: 1440, y: 336}, {x: 1440, y: 384},
            {x: 1488, y: 48}, {x: 1488, y: 96}, {x: 1488, y: 144}, {x: 1488, y: 192}, {x: 1488, y: 240},
            {x: 1488, y: 288}, {x: 1488, y: 336}, {x: 1488, y: 384},
            {x: 1536, y: 48}, {x: 1536, y: 96}, {x: 1536, y: 144}, {x: 1536, y: 192}, {x: 1536, y: 240},
            {x: 1536, y: 288}, {x: 1536, y: 336}, {x: 1536, y: 384},
            {x: 1584, y: 48}, {x: 1584, y: 96}, {x: 1584, y: 144}, {x: 1584, y: 192}, {x: 1584, y: 240},
            {x: 1584, y: 288}, {x: 1584, y: 336}, {x: 1584, y: 384},
            {x: 1632, y: 48}, {x: 1632, y: 96}, {x: 1632, y: 144}, {x: 1632, y: 192}, {x: 1632, y: 240},
            {x: 1632, y: 288}, {x: 1632, y: 336}, {x: 1632, y: 384},
            {x: 1680, y: 48}, {x: 1680, y: 96}, {x: 1680, y: 144}, {x: 1680, y: 192}, {x: 1680, y: 240},
            {x: 1680, y: 288}, {x: 1680, y: 336}, {x: 1680, y: 384},
            {x: 1728, y: 48}, {x: 1728, y: 96}, {x: 1728, y: 144}, {x: 1728, y: 192}, {x: 1728, y: 240},
            {x: 1728, y: 288}, {x: 1728, y: 336}, {x: 1728, y: 384},
            {x: 1776, y: 48}, {x: 1776, y: 96}, {x: 1776, y: 144}, {x: 1776, y: 192}, {x: 1776, y: 240},
            {x: 1776, y: 288}, {x: 1776, y: 336}, {x: 1776, y: 384},
            {x: 1824, y: 48}, {x: 1824, y: 96}, {x: 1824, y: 144}, {x: 1824, y: 192}, {x: 1824, y: 240},
            {x: 1824, y: 288}, {x: 1824, y: 336}, {x: 1824, y: 384}
          ];

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

    async fetchData(name) {
        showLoadingScreen();
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

            if (!response.ok) {
                throw new Error("Couldn't fetch resource")
            }

            const data = await response.json()
            this.data = data
            hideLoadingScreen();
        }
        catch (error) {
            console.error(error);
            hideLoadingScreen();
        }
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


    update() {
        if (this.has_starter) {
            if (this.isInBushes(this.x, this.y)) {

                this.selectRandomPokemon();
                this.game.audio.src = 'assets/sounds/battle.mp3'
                this.game.audio.play()

                this.fetchData(this.pokename)
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



