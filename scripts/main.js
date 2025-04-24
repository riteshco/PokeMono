import { Player } from "./Player.js";
import { Object, CollidingObject } from "./Objects.js";
import { Battle } from "./battle.js";
import { Utils } from "./utils.js";

function showLoadingScreen() {
    document.getElementById("loading-screen").style.display = "flex";
}


function hideLoadingScreen() {
    document.getElementById("loading-screen").style.display = "none";
}

export class Game {
    constructor(canvas, context) {
        this.canvas = canvas;
        this.ctx = context;
        this.height = window.innerHeight;
        this.width = window.innerWidth;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.ctx.font = `${Math.floor(this.height * 0.05)}rem 'Press Start 2P', sans-serif`;

        this.ctx.fillStyle = "White";

        this.scene = 'world'

        this.pokimg = document.getElementById('pokemon2')

        this.starter_name = ''


        this.scale = 48;

        this.battle = new Battle(this.canvas, this.ctx);
        this.assets = new Object(this, 'assets/tileset_cleaned.png');
        this.menus = new Object(this, 'assets/battle_menu.png')
        this.colliderAssets = new CollidingObject(this, 'assets/tileset_cleaned.png');
        this.players = new Player(this, 'assets/Sprites_cleaned.png', 335, 670);
        this.utils = new Utils()

        this.update = this.update.bind(this);
        this.data = ''
        this.data2 = ''
        this.data3 = ''

        this.setupDone = false

        setTimeout(() => {
            this.update();
        }, 100);

        this.dialog = 0;
        this.instructionNumber = 0

        this.arrow_posx = this.width * (0.25) - 60
        this.arrow_posy = this.height * (0.8) + 50

        this.audio = document.getElementById('audio')
        this.audio.src = 'assets/sounds/town.mp3'
        this.randomStarter = ''

    }


    render() {

        if (this.scene === 'world') {

            this.ctx.clearRect(0, 0, this.width, this.height);

            // --- Rendering grass ---
            for (let i = 0; i < Math.floor(this.width / this.scale) + 1; ++i) {
                for (let j = 0; j < (this.height / this.scale); ++j) {
                    if (i % 4 == 0) {
                        this.assets.draw(8, 66, 12, 12, 48 * i, 48 * j, 48, 48);
                    } else if (i % 4 == 1) {
                        this.assets.draw(25, 66, 12, 12, 48 * i, 48 * j, 48, 48);
                    } else {
                        this.assets.draw(59, 66, 12, 12, 48 * i, 48 * j, 48, 48);
                    }
                }
            }

            // --- Rendering paths ---
            for (let i = 0; i < Math.floor(this.width / this.scale) * (0.6); ++i) {
                this.assets.draw(147.4, 50.3, 7.3, 7.3, 48 * i, 672, 48, 48)
                this.assets.draw(138.4, 59.3, 7.3, 7.3, 48 * i, 720, 48, 48)
                this.assets.draw(156.4, 59.3, 7.3, 7.3, 48 * i, 768, 48, 48)
                this.assets.draw(147.4, 68.3, 7.3, 7.3, 48 * i, 816, 48, 48)
            }
            this.assets.draw(147.4, 50.3, 7.3, 7.3, (this.width) * 0.6, 672, 48, 48)
            this.assets.draw(147.4, 50.3, 7.3, 7.3, (this.width) * 0.6 + this.scale, 672, 48, 48)
            this.assets.draw(165.4, 50.3, 7.3, 7.3, (this.width) * 0.6 + 2 * this.scale, 672, 48, 48)
            this.assets.draw(156.4, 50.3, 7.3, 7.3, (this.width) * 0.6 + 2 * this.scale, 672 + this.scale, 48, 48)
            this.assets.draw(165.4, 50.3, 7.3, 7.3, (this.width) * 0.6 + 3 * this.scale, 672 + this.scale, 48, 48)
            for (let i = Math.floor(this.height / this.scale) * (0.8); i < Math.floor(this.height / this.scale) + 2; ++i) {
                this.assets.draw(165.4, 59.3, 7.3, 7.3, (this.width) * 0.6 + 3 * this.scale, 48 * i, 48, 48)
                this.assets.draw(138.4, 59.3, 7.3, 7.3, (this.width) * 0.6 + 2 * this.scale, 48 * i, 48, 48)
                this.assets.draw(156.4, 59.3, 7.3, 7.3, (this.width) * 0.6 + 1 * this.scale, 48 * (i - 1), 48, 48)
            }
            this.assets.draw(138.4, 59.3, 7.3, 7.3, (this.width) * 0.6, 48 * (Math.floor(this.height / this.scale) * (0.8) - 1), 48, 48)
            this.assets.draw(138.4, 59.3, 7.3, 7.3, (this.width) * 0.6, 48 * (Math.floor(this.height / this.scale) * (0.8)), 48, 48)
            this.assets.draw(138.4, 59.3, 7.3, 7.3, (this.width) * 0.6, 48 * (Math.floor(this.height / this.scale) * (0.8) + 1), 48, 48)
            this.assets.draw(129.4, 59.3, 7.3, 7.3, (this.width) * 0.6, 48 * (Math.floor(this.height / this.scale) * (0.8) + 2), 48, 48)
            this.assets.draw(129.4, 59.3, 7.3, 7.3, (this.width) * 0.6, 48 * (Math.floor(this.height / this.scale) * (0.8) + 3), 48, 48)
            this.assets.draw(129.4, 59.3, 7.3, 7.3, (this.width) * 0.6, 48 * (Math.floor(this.height / this.scale) * (0.8) + 4), 48, 48)

            for (let j = 0; j < Math.floor(this.height / this.scale) * (0.7) + 1; ++j) {
                this.assets.draw(129.4, 59.3, 7.3, 7.3, (this.width) * 0.3, (j - 1) * this.scale, 48, 48)
                this.assets.draw(138.4, 59.3, 7.3, 7.3, (this.width) * 0.3 + this.scale, j * this.scale, 48, 48)
                this.assets.draw(156.4, 59.3, 7.3, 7.3, (this.width) * 0.3 + 2 * this.scale, j * this.scale, 48, 48)
                this.assets.draw(165.4, 59.3, 7.3, 7.3, (this.width) * 0.3 + 3 * this.scale, (j - 1) * this.scale, 48, 48)
            }
            this.assets.draw(156.4, 50.3, 7.3, 7.3, (this.width) * 0.3 + 3 * this.scale, Math.floor(this.height / this.scale) * (0.7) * this.scale, 48, 48)
            this.assets.draw(138.4, 50.3, 7.3, 7.3, (this.width) * 0.3, Math.floor(this.height / this.scale) * (0.7) * this.scale, 48, 48)


            // --- Rendering bushes ---
            for (let i = 2; i < Math.floor(this.width * 0.99 / this.scale); ++i) {
                for (let j = 1; j < Math.floor(this.height * 0.7 / this.scale); ++j) {
                    if (!(i > Math.floor(this.width * 0.25 / this.scale) && i < Math.floor(this.width * 0.4 / this.scale))) {
                        if (j < Math.floor(this.height * 0.45 / this.scale)) {
                            this.assets.draw(6, 81, 16, 16, 48 * i, 48 * j, 48, 48);
                            let x = 48 * i;
                            let y = 48 * j;
                        }
                        else {
                            if (i > Math.floor(this.width * 0.58 / this.scale)) {
                                this.assets.draw(6, 81, 16, 16, 48 * i, 48 * j, 48, 48);
                            }
                        }
                    }
                }
            }


            // --- Rendering Player ---
            let frame = Math.floor(this.players.animationTime / 20) % 3;
            if (this.players.keys["s"]) {
                this.players.direction = 'down';
                if (frame === 0) {
                    this.players.render(25.3, 49.8, 15.49, 24, 46.5, 72);
                }
                else if (frame === 1) {
                    this.players.render(42.3, 49.8, 15.49, 24, 46.5, 72);
                }
                else {
                    this.players.render(8.3, 49.8, 15.49, 24, 46.5, 72);
                }
            }
            else if (this.players.keys["l"] || this.players.keys["d"]) {
                this.players.direction = 'right';
                if (frame === 0) {
                    this.players.render(42.3, 147.7, 15.49, 24, 46.5, 72);
                }
                else if (frame === 1) {
                    this.players.render(25.3, 147.7, 15.49, 24, 46.5, 72);
                }
                else {
                    this.players.render(8.3, 147.7, 15.49, 24, 46.5, 72);
                }
            }
            else if (this.players.keys["j"] || this.players.keys["a"]) {
                this.players.direction = 'left';
                if (frame === 0) {
                    this.players.render(8.3, 114.8, 15.49, 24, 46.5, 72);
                }
                else if (frame === 1) {
                    this.players.render(25.3, 114.8, 15.49, 24, 46.5, 72);
                }
                else {
                    this.players.render(42.3, 114.8, 15.49, 24, 46.5, 72);
                }
            }
            else if (this.players.keys["w"]) {
                this.players.direction = 'up';
                if (frame === 0) {
                    this.players.render(8.3, 82.8, 15.49, 24, 46.5, 72);
                }
                else if (frame === 1) {
                    this.players.render(25.3, 82.8, 15.49, 24, 46.5, 72);
                }
                else {
                    this.players.render(42.3, 82.8, 15.49, 24, 46.5, 72);
                }
            }
            else {
                if (this.players.direction === 'down') {
                    this.players.render(25.3, 49, 15.49, 24, 46.5, 72);
                }
                if (this.players.direction === 'up') {
                    this.players.render(25.3, 82.8, 15.49, 24, 46.5, 72);
                }
                if (this.players.direction === 'left') {
                    this.players.render(25.3, 114.8, 15.49, 24, 46.5, 72);
                }
                if (this.players.direction === 'right') {
                    this.players.render(25.3, 147.7, 15.49, 24, 46.5, 72);
                }
            }


            // --- Rendering trees ---
            for (let i = 0; i < this.width / this.scale; ++i) {
                for (let j = -0.5; j < this.height / this.scale; j += 0.5) {
                    if (j == -0.5) {
                        if (i !== Math.floor((this.width * 0.2) / this.scale) + 1 && i !== Math.floor((this.width * 0.2) / this.scale) + 2 && i !== Math.floor((this.width * 0.2) / this.scale) + 3) {
                            this.colliderAssets.draw(94, 28, 32, 52, 64 * i, 104 * j, 64, 104);
                        }
                    }
                    else if (j >= Math.floor(((this.height * (0.46)) / this.scale))) {
                        if (i < Math.floor((this.width * 0.44) / this.scale) + 1) {
                            this.colliderAssets.draw(94, 28, 32, 52, 64 * i, 104 * j, 64, 104);
                        }
                    }
                    else {
                        this.colliderAssets.draw(94, 28, 32, 52, 0, 104 * j, 64, 104);
                        this.colliderAssets.draw(94, 28, 32, 52, (this.width / this.scale) * 47, 104 * j, 64, 104);
                    }
                }
            }


            // --- Rendering Pool ---
            for (let i = Math.floor(this.width * 0.7 / this.scale); i <= (Math.floor(this.width * 0.7 / this.scale) + 10); ++i) {
                for (let j = Math.floor(this.height * 0.7 / this.scale); j <= (Math.floor(this.height * 0.7 / this.scale) + 6); ++j) {
                    this.assets.draw(21.4, 4, 15, 14.4, i * this.scale, j * this.scale, 48, 48)
                }
            }



            this.colliderAssets.draw(110.3, 104.3, 7.4, 7.4, Math.floor(this.width * 0.7 / this.scale) * this.scale, Math.floor(this.height * 0.7 / this.scale) * this.scale, 48, 48)
            for (let i = 1; i < 10; ++i) {
                this.colliderAssets.draw(119.3, 104.3, 15, 3, (Math.floor(this.width * 0.7 / this.scale) + i) * this.scale, Math.floor(this.height * 0.7 / this.scale) * this.scale, 48, 24)
            }
            this.colliderAssets.draw(136.2, 104.3, 7.4, 7.4, (Math.floor(this.width * 0.7 / this.scale) + 10) * this.scale, Math.floor(this.height * 0.7 / this.scale) * this.scale, 48, 48)
            for (let j = 1; j < 7; ++j) {
                this.colliderAssets.draw(110.3, 113.3, 4, 7.4, Math.floor(this.width * 0.7 / this.scale) * this.scale, (Math.floor(this.height * 0.7 / this.scale) + j) * this.scale, 24, 48)
                this.colliderAssets.draw(139.3, 113.8, 4, 6.4, (Math.floor(this.width * 0.7 / this.scale) + 10.33) * this.scale, (Math.floor(this.height * 0.7 / this.scale) + j) * this.scale, 32, 48)
            }

            // --- Rendering buildings ---
            this.colliderAssets.draw(8, 158, 80, 72, 240, 462, 240, 210);
            this.colliderAssets.draw(14, 340, 112, 90, 810, 414, 336, 270);


            // --- Rendering instructions ---
            if (this.players.x >= 305 && this.players.x <= 345 && this.players.y >= 630 && this.players.y <= 670) {

                const menuX = this.width * 0.2;
                const menuY = this.height * 0.05;
                const menuWidth = this.width * 0.6;
                const menuHeight = this.height * 0.9;

                if (this.instructionNumber === 0) {
                    this.ctx.globalAlpha = 0.5
                    this.menus.draw(297, 3.9, 159, 48, this.width * (0.2), this.height * (0.8), this.width * (0.6), this.height * (0.15));
                    this.ctx.globalAlpha = 1
                    this.ctx.fillStyle = "Black";
                    this.ctx.fillText('Press ENTER for Instructions', this.width * (0.2) + 40, this.height * (0.8) + 60)
                    this.ctx.fillText('Press "B" to get back on this menu', this.width * (0.2) + 40, this.height * (0.8) + 100)
                }
                else if (this.instructionNumber === 1) {

                    this.ctx.globalAlpha = 0.8
                    this.menus.draw(299, 6, 156, 43, menuX, menuY, menuWidth, menuHeight);
                    this.ctx.globalAlpha = 1
                    const textX = menuX + this.width * 0.02;
                    const textStartY = menuY + this.height * 0.1;
                    const lineHeight = this.height * 0.055;
                    this.ctx.fillStyle = "black"
                    let instructionsArray = ['INSTRUCTIONS :-','1.) Go in front of main building to','choose your starter pokemon.','2.) Navigate through menu screens','using arrow keys and enter to','proceed through them.','3.) Movements through w,a,s,d!','4.) After you get your starter buddy',',you can go to the bushes to find and','fight with wild pokemons.','5.) Just move to remove this screen','and if you again want to read','come back here again']
                    for(let i=0; i<13;++i){
                        this.ctx.fillText(instructionsArray[i] , textX , textStartY + lineHeight * i)
                    }
                }
            }
            else {
                this.instructionNumber = 0
            }


            // --- Rendering dialogs ---
            if (this.players.x >= 940 && this.players.x <= 999 && this.players.y >= 660 && this.players.y <= 690) {
                this.ctx.globalAlpha = 0.5
                this.menus.draw(297, 3.9, 159, 48, this.width * (0.2), this.height * (0.8), this.width * (0.6), this.height * (0.15));
                this.ctx.globalAlpha = 1
                this.ctx.fillStyle = "Black";
                if (this.dialog === 0) {
                    this.ctx.fillText('Choose one of the Three Starters --- ', this.width * (0.2) + 40, this.height * (0.8) + 60)
                    this.ctx.fillText('Press ENTER!! ', this.width * (0.2) + 40, this.height * (0.8) + 100)
                }
                else if (this.dialog === 1) {
                    this.ctx.fillText('Pikachu', this.width * (0.25), this.height * (0.8) + 85)
                    this.ctx.fillText('Rayquaza', this.width * (0.45), this.height * (0.8) + 85)
                    this.ctx.fillText('Random', this.width * (0.65), this.height * (0.8) + 85)
                    this.menus.draw(269, 3.9, 5, 9.2, this.arrow_posx, this.arrow_posy, 50, 50);
                }
                else if (this.dialog === 2) {
                    this.ctx.fillText(`You Chose ${this.starter_name}!`, this.width * (0.25), this.height * (0.8) + 85)
                    setTimeout(() => {
                        this.dialog = 3;
                    }, 1500)
                }
                else if (this.dialog === 3) {
                    this.ctx.fillText('Choose your Second Pokemon --- ', this.width * (0.2) + 40, this.height * (0.8) + 60)
                    this.ctx.fillText('Press ENTER!! ', this.width * (0.2) + 40, this.height * (0.8) + 100)
                }
                else if (this.dialog === 4) {
                    this.ctx.fillText('Darkrai', this.width * (0.25), this.height * (0.8) + 85)
                    this.ctx.fillText('Charizard', this.width * (0.45), this.height * (0.8) + 85)
                    this.ctx.fillText('Random', this.width * (0.65), this.height * (0.8) + 85)
                    this.menus.draw(269, 3.9, 5, 9.2, this.arrow_posx, this.arrow_posy, 50, 50);
                }
                else if (this.dialog === 5) {
                    this.ctx.fillText(`You Chose ${this.battle.secondStarter}!`, this.width * (0.25), this.height * (0.8) + 85)
                    setTimeout(() => {
                        this.dialog = 6;
                    }, 1500)
                }
                else if (this.dialog === 6) {
                    this.ctx.fillText('Choose your Third Pokemon --- ', this.width * (0.2) + 40, this.height * (0.8) + 60)
                    this.ctx.fillText('Press ENTER!! ', this.width * (0.2) + 40, this.height * (0.8) + 100)
                }
                else if (this.dialog === 7) {
                    this.ctx.fillText('Squirtle', this.width * (0.25), this.height * (0.8) + 85)
                    this.ctx.fillText('Chikorita', this.width * (0.45), this.height * (0.8) + 85)
                    this.ctx.fillText('Random', this.width * (0.65), this.height * (0.8) + 85)
                    this.menus.draw(269, 3.9, 5, 9.2, this.arrow_posx, this.arrow_posy, 50, 50);
                }
                else if (this.dialog === 8) {
                    this.ctx.fillText(`You Chose ${this.battle.thirdStarter}!`, this.width * (0.25), this.height * (0.8) + 85)
                    setTimeout(() => {
                        this.dialog = 9;
                    }, 1500)
                }
                else if (this.dialog === 9) {
                    this.ctx.fillText(`You Chose all three!`, this.width * (0.25), this.height * (0.8) + 85)
                }
            }


        }
        else if (this.scene === 'battle') {
            this.battle.render()
        }
    }

    async update() {
        if (this.scene === 'world') {
            this.setupDone = false
            this.players.update();
            this.render();
            requestAnimationFrame(this.update);
        }
        else if (this.scene === 'battle') {
            if (!this.setupDone) {
                this.battle.currentData = this.battle.starterData
                this.battle.currentName = this.battle.starter_name
                await this.battle.setup()
                this.setupDone = true
            }
            this.battle.update();
        }
    }

    controls() {
        window.onkeydown = (e) => {
            if (e.key === 'Enter') {
                if (this.players.x >= 305 && this.players.x <= 345 && this.players.y >= 630 && this.players.y <= 670) {
                    if (this.instructionNumber === 0) {
                        this.instructionNumber = 1;
                    }
                }
                if (this.players.x >= 940 && this.players.x <= 999 && this.players.y >= 660 && this.players.y <= 690 && this.dialog === 0) {
                    setTimeout(() => {
                        this.dialog = 1;
                    }, 200)
                }
                if (this.players.x >= 940 && this.players.x <= 999 && this.players.y >= 660 && this.players.y <= 690 && this.dialog === 3) {
                    setTimeout(() => {
                        this.dialog = 4;
                    }, 200)
                }
                if (this.players.x >= 940 && this.players.x <= 999 && this.players.y >= 660 && this.players.y <= 690 && this.dialog === 6) {
                    setTimeout(() => {
                        this.dialog = 7;
                    }, 200)
                }
                if (this.players.x >= 940 && this.players.x <= 999 && this.players.y >= 660 && this.players.y <= 690 && this.dialog === 1) {
                    setTimeout(async () => {
                        this.dialog = 2;
                        if (this.arrow_posx === this.width * (0.25) - 60) {
                            this.starter_name = 'pikachu'
                            this.battle.starter_name = 'pikachu'
                            this.data = await this.utils.dataGet('pikachu');
                            this.battle.starterData = this.data
                            this.players.has_starter = true
                        }
                        if (this.arrow_posx === this.width * (0.45) - 60) {
                            this.starter_name = 'rayquaza'
                            this.battle.starter_name = 'rayquaza'
                            this.data = await this.utils.dataGet('rayquaza');
                            this.battle.starterData = this.data
                            this.players.has_starter = true
                        }
                        if (this.arrow_posx === this.width * (0.65) - 60) {
                            this.randomStarter = await this.utils.GetRandomPokemon()
                            this.starter_name = this.randomStarter
                            this.battle.starter_name = this.randomStarter
                            this.data = await this.utils.dataGet(this.randomStarter);
                            this.battle.starterData = this.data
                            this.players.has_starter = true
                        }
                    }, 200)
                }
                if (this.players.x >= 940 && this.players.x <= 999 && this.players.y >= 660 && this.players.y <= 690 && this.dialog === 4) {
                    setTimeout(async () => {
                        this.dialog = 5;
                        if (this.arrow_posx === this.width * (0.25) - 60) {
                            this.battle.secondStarter = 'darkrai'
                            this.data2 = await this.utils.dataGet('darkrai');
                            this.battle.secondStarterData = this.data2
                        }
                        if (this.arrow_posx === this.width * (0.45) - 60) {
                            this.battle.secondStarter = 'charizard'
                            this.data2 = await this.utils.dataGet('charizard');
                            this.battle.secondStarterData = this.data2
                        }
                        if (this.arrow_posx === this.width * (0.65) - 60) {
                            this.randomStarter = await this.utils.GetRandomPokemon()
                            this.battle.secondStarter = this.randomStarter
                            this.data2 = await this.utils.dataGet(this.randomStarter);
                            this.battle.secondStarterData = this.data2
                        }
                    }, 200)
                }
                if (this.players.x >= 940 && this.players.x <= 999 && this.players.y >= 660 && this.players.y <= 690 && this.dialog === 7) {
                    setTimeout(async () => {
                        this.dialog = 8;
                        if (this.arrow_posx === this.width * (0.25) - 60) {
                            this.battle.thirdStarter = 'squirtle'
                            this.data3 = await this.utils.dataGet('squirtle');
                            this.battle.thirdStarterData = this.data3
                        }
                        if (this.arrow_posx === this.width * (0.45) - 60) {
                            this.battle.thirdStarter = 'chikorita'
                            this.data3 = await this.utils.dataGet('chikorita');
                            this.battle.thirdStarterData = this.data3
                        }
                        if (this.arrow_posx === this.width * (0.65) - 60) {
                            this.randomStarter = await this.utils.GetRandomPokemon()
                            this.battle.thirdStarter = this.randomStarter
                            this.data3 = await this.utils.dataGet(this.randomStarter);
                            this.battle.thirdStarterData = this.data3
                        }
                    }, 200)
                }
            }
            if (e.key === 'b') {
                if (this.players.x >= 305 && this.players.x <= 345 && this.players.y >= 630 && this.players.y <= 670) {
                    if (this.instructionNumber === 1) {
                        this.instructionNumber = 0;
                    }
                }
            }
            if (e.key === 'ArrowLeft') {
                if (this.arrow_posx === this.width * (0.45) - 60) {
                    this.arrow_posx = this.width * (0.25) - 60
                }
                if (this.arrow_posx === this.width * (0.65) - 60) {
                    this.arrow_posx = this.width * (0.45) - 60
                }
            }
            if (e.key === 'ArrowRight') {
                if (this.arrow_posx === this.width * (0.45) - 60) {
                    this.arrow_posx = this.width * (0.65) - 60
                }
                if (this.arrow_posx === this.width * (0.25) - 60) {
                    this.arrow_posx = this.width * (0.45) - 60
                }
            }
        }

        this.audio.play()

    }
}

let IntroDone = false

async function IntroShow(ctx, path) {
    return new Promise((resolve) => {
        const image = new Image();
        image.src = path;
        image.onload = () => {
            setTimeout(() => {
                ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
                ctx.drawImage(image, 0, 0, window.innerWidth, window.innerHeight);
                resolve()
            }, 500)
        };
    });
}




window.addEventListener('load', async function () {
    if (window.innerWidth < 768) {  // adjust threshold if needed
        document.getElementById('mobile-warning').style.display = 'block';
      }
    const canvas = document.getElementById('map');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let myAudio = document.getElementById('audio')


    if (!IntroDone) {
        myAudio.src = 'assets/sounds/opening.mp3'
        myAudio.play()
        await IntroShow(ctx, 'assets/image1.png')
        await IntroShow(ctx, 'assets/image2.png')
        await IntroShow(ctx, 'assets/image3.png')
        await IntroShow(ctx, 'assets/image4.png')
        ctx.font = `${Math.floor(canvas.height * 0.05)/20}rem 'Press Start 2P', sans-serif`
        ctx.fillStyle = 'White'
        ctx.fillText('Press ENTER to start!!', canvas.width * (0.02), canvas.height * (0.77))
        window.addEventListener('keydown', (e) => {
            if (!IntroDone && e.key === 'Enter') {
                ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
                IntroDone = true
                myAudio.pause()
                const game = new Game(canvas, ctx);
                window.game = game;

                game.render();
                game.players.setup();
                game.controls();
                game.battle.controls();
                game.update();

            }
        })

    }
    else {
        const game = new Game(canvas, ctx);
        window.game = game;

        game.render();
        game.players.setup();
        game.controls();
        game.battle.controls();
        game.update();
    }


})