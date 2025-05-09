import { Object } from "./Objects.js";
import { Utils } from "./utils.js";
import { ENUM } from "./type.js";

export class Battle {
    constructor(canvas, context) {
        this.canvas = canvas;
        this.ctx = context;
        this.height = window.innerHeight;
        this.width = window.innerWidth;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.animation_completed = false
        this.attack_menu = false

        this.pokeimg1 = document.getElementById(ENUM.POKECLASS1)
        this.pokeimg2 = document.getElementById(ENUM.POKECLASS2)


        this.utils = new Utils()


        this.ctx.font = `${Math.floor(this.height * 0.05)/30}rem 'Press Start 2P', sans-serif`;
        this.ctx.fillStyle = "white";

        this.data = '';
        this.starterData = '';

        this.pp1 = 0
        this.totalpp1 = 0
        this.pp2 = 0
        this.totalpp2 = 0
        this.pp3 = 0
        this.totalpp3 = 0
        this.pp4 = 0
        this.totalpp4 = 0

        this.pokename = ''
        this.starter_name = ''
        
        this.secondStarter = ''
        this.thirdStarter = ''

        this.secondStarterData = ''
        this.thirdStarterData = ''

        this.currentPokemon = ''
        this.currentData = ''
        this.currentName = ''

        this.scale = 48;

        this.scene = 'battle'

        this.animation_time = 0;
        this.dialog_time = 0;

        this.bg = new Object(this, 'assets/battle_bg.png')
        this.menus = new Object(this, 'assets/battle_menu.png')

        this.sprites_animation0 = new Object(this, 'assets/player_0.png')
        this.sprites_animation1 = new Object(this, 'assets/player_1.png')
        this.sprites_animation2 = new Object(this, 'assets/player_2.png')
        this.sprites_animation3 = new Object(this, 'assets/player_3.png')
        this.sprites_animation4 = new Object(this, 'assets/player_4.png')


        this.keys = {}
        this.arrow_posx = this.canvas.width * 0.625;
        this.arrow_posy = this.canvas.height * 0.8;

        this.win = false
        this.lose = false
        this.run = false


        this.bag = document.getElementById('bag')
        this.bagOpen = false

        this.selectPokemon = document.getElementById('selection')
        this.pokeSelect = false


        this.isperforming = false
        this.attackerName = ''
        this.moveused = ''

        this.enemyTotalHP = 0
        this.ourStarterTotalHP = 0


        this.update = this.update.bind(this);

        setTimeout(() => {
            this.update();
        }, 100);
    }


    async performMove(attacker, defender, moveUrl, id, classToAdd) {
        let moving = document.getElementById(id)
        moving.classList.add(classToAdd)
        setTimeout(() => {
            moving.classList.remove(classToAdd)
        }, 1000)
        const move = await this.utils.fetchMove(moveUrl);
        let effect = document.getElementById('effect')
        effect.src = 'assets/sounds/attack.wav'
        effect.play()

        if (!move.power) {

            return;
        }

        const attackStat = this.utils.getStat(attacker.stats, "attack");
        const defenseStat = this.utils.getStat(defender.stats, "defense");

        const damage = this.utils.calculateDamage(20, move.power, attackStat, defenseStat);
        defender.hp -= damage;
        if (defender.hp < 0) defender.hp = 0;

        this.isperforming = true

        this.attackerName = attacker.name
        this.moveused = move.name
        setTimeout(() => {
            this.isperforming = false
        }, 2000)

    }

    async setup2(){
        this.utils.showLoadingScreen()
        this.ourStarter = await this.utils.fetchPokemonStat(this.currentData);
        this.ourStarter.hp = await this.utils.getStat(this.ourStarter.stats, "hp");
        this.ourStarterTotalHP = this.ourStarter.hp
        this.pp1= await this.utils.getMovePP(this.ourStarter.moves[0].move.name)
        this.totalpp1 = this.pp1
        this.pp2= await this.utils.getMovePP(this.ourStarter.moves[1].move.name)
        this.totalpp2 = this.pp2
        this.pp3= await this.utils.getMovePP(this.ourStarter.moves[2].move.name)
        this.totalpp3 = this.pp3
        this.pp4= await this.utils.getMovePP(this.ourStarter.moves[3].move.name)
        this.totalpp4 = this.pp4
        this.utils.hideLoadingScreen()
    }

    async setup() {
        this.pokename = await this.utils.GetRandomPokemon()
        this.data = await this.utils.dataGet(this.pokename)
        this.pokeimg2.src = this.data.sprites.front_default
        this.pokeimg2.style.display = 'block'


        this.ourStarter = await this.utils.fetchPokemonStat(this.currentData);
        this.enemy = await this.utils.fetchPokemonStat(this.data);
        this.ourStarter.hp = await this.utils.getStat(this.ourStarter.stats, "hp");
        this.ourStarterTotalHP = this.ourStarter.hp

        this.pp1= await this.utils.getMovePP(this.ourStarter.moves[0].move.name)
        this.totalpp1 = this.pp1
        this.pp2= await this.utils.getMovePP(this.ourStarter.moves[1].move.name)
        this.totalpp2 = this.pp2
        this.pp3= await this.utils.getMovePP(this.ourStarter.moves[2].move.name)
        this.totalpp3 = this.pp3
        this.pp4= await this.utils.getMovePP(this.ourStarter.moves[3].move.name)
        this.totalpp4 = this.pp4


        this.enemy.hp = await this.utils.getStat(this.enemy.stats, "hp");
        this.enemyTotalHP = this.enemy.hp
    }


    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = "white";

        this.bg.draw(250, 7, 238, 150, 0, 0, this.width, this.height);

        if (this.animation_completed === false) {
            if (Math.floor(this.animation_time / 3) < 100) {
                this.sprites_animation0.draw(0, 0, 600, 670, 0, this.canvas.height * 0.26, 600, 670)
            }
            else if (Math.floor(this.animation_time / 3) < 200) {
                this.sprites_animation1.draw(0, 0, 570, 670, 0, this.canvas.height * 0.26, 600, 670)
            }
            else if (Math.floor(this.animation_time / 3) < 300) {
                this.sprites_animation2.draw(0, 0, 620, 690, 0, this.canvas.height * 0.26, 600, 670)
            }
            else if (Math.floor(this.animation_time / 3) < 400) {
                this.sprites_animation3.draw(0, 0, 650, 690, 0, this.canvas.height * 0.26, 600, 670)
            }
            else if (Math.floor(this.animation_time / 3) < 500) {
                this.sprites_animation4.draw(0, 0, 620, 690, 0, this.canvas.height * 0.26, 600, 670)
                this.animation_completed = true
            }
            this.animation_time += 1;
            if (this.animation_time > 1600) {
                this.animation_time = 1
            }
        }

        if (this.animation_completed) {
            this.pokeimg1.src = this.currentData.sprites.back_default
            this.pokeimg1.style.display = 'block'
        }

        const menuBottomHeight = Math.min(this.canvas.height * 0.3, this.canvas.height * 0.3);
        const menuBottomY = this.canvas.height + this.canvas.height * (0.02) - menuBottomHeight;

        this.menus.draw(298, 56, 238, 51, 0, menuBottomY, this.canvas.width, menuBottomHeight);

        const rightMenuWidth = this.canvas.width / 2.5;
        const rightMenuX = this.canvas.width - rightMenuWidth;
        this.menus.draw(146, 4, 119, 51, rightMenuX, menuBottomY, rightMenuWidth, menuBottomHeight);

        if (this.keys[ENUM.UP]) {
            if (this.arrow_posy === this.canvas.height * 0.9)
                this.arrow_posy -= this.canvas.height * 0.1
            this.keys[ENUM.UP] = false
        }
        if (this.keys[ENUM.DOWN]) {
            if (this.arrow_posy === this.canvas.height * 0.8)
                this.arrow_posy += this.canvas.height * 0.1
            this.keys[ENUM.DOWN] = false
        }
        if (this.keys[ENUM.LEFT]) {
            if (this.arrow_posx === this.canvas.width * 0.35) {
                this.arrow_posx -= this.canvas.width * 0.33
            }
            else if (this.arrow_posx > this.canvas.width * 0.625) {
                this.arrow_posx -= this.canvas.width * 0.18
            }

            this.keys[ENUM.LEFT] = false
        }
        if (this.keys[ENUM.RIGHT]) {
            if (this.arrow_posx === this.canvas.width * 0.625) {
                this.arrow_posx += this.canvas.width * 0.18
            }
            if (this.arrow_posx >= this.canvas.width * 0.01 && this.arrow_posx < this.canvas.width * 0.3) {
                this.arrow_posx += this.canvas.width * 0.33
            }
            this.keys[ENUM.RIGHT] = false
        }
        if (!this.animation_completed) {
            this.ctx.fillText(`A wild ${this.pokename} appeared!`, this.canvas.width * 0.035, this.canvas.height * 0.83);
        } else if (!this.isperforming) {
            this.ctx.fillText(`GO ${this.currentName}!!`, this.canvas.width * 0.035, this.canvas.height * 0.83);
        }

        this.menus.draw(4, 3, 91, 29, this.canvas.width * 0.2, this.canvas.height * 0.09, this.canvas.width * 0.24, this.canvas.height * 0.14)
        this.ctx.fillStyle = "black"
        this.ctx.fillText(`${this.pokename}`, this.canvas.width * 0.22, this.canvas.height * 0.14)
        this.ctx.fillStyle = "red"
        this.ctx.fillRect(this.canvas.width * 0.2075, this.canvas.height * 0.145, (this.canvas.width * 0.225), this.canvas.height * 0.04)
        this.ctx.fillStyle = "green"
        this.ctx.fillRect(this.canvas.width * 0.2075, this.canvas.height * 0.145, (this.canvas.width * 0.225) * (this.enemy.hp/this.enemyTotalHP), this.canvas.height * 0.04)
        this.ctx.fillStyle = "black"
        this.ctx.fillText(`HP : ${this.enemy.hp} /${this.enemyTotalHP}`, this.canvas.width * 0.22, this.canvas.height * 0.185)

        if (this.attack_menu) {
            this.menus.draw(297, 3.9, 159, 48, 0, this.canvas.height * 0.74, this.canvas.width * 0.6, this.canvas.height * 0.27);
            const moveNames = this.currentData.moves.slice(0, 4).map(m => m.move.name)
            this.ctx.fillStyle = "black"
            if(this.pp1===0){
                this.ctx.fillStyle = "red"
            }
            this.ctx.fillText(`${moveNames[0]} ${this.pp1}/${this.totalpp1}`, this.canvas.width * 0.05, this.canvas.height * 0.84);
            this.ctx.fillStyle = "black"
            if(this.pp2===0){
                this.ctx.fillStyle = "red"
            }
            this.ctx.fillText(`${moveNames[1]} ${this.pp2}/${this.totalpp2}`, this.canvas.width * 0.38, this.canvas.height * 0.84);
            this.ctx.fillStyle = "black"
            if(this.pp3===0){
                this.ctx.fillStyle = "red"
            }
            this.ctx.fillText(`${moveNames[2]} ${this.pp3}/${this.totalpp3}`, this.canvas.width * 0.05, this.canvas.height * 0.94);
            this.ctx.fillStyle = "black"
            if(this.pp4===0){
                this.ctx.fillStyle = "red"
            }
            this.ctx.fillText(`${moveNames[3]} ${this.pp4}/${this.totalpp4}`, this.canvas.width * 0.38, this.canvas.height * 0.94);
        }

        this.menus.draw(269, 3.9, 5, 9.2, this.arrow_posx, this.arrow_posy, this.canvas.width * 0.025, this.canvas.height * 0.05);

        this.menus.draw(12, 45, 91, 36, this.canvas.width * 0.6, this.canvas.height * 0.58, this.canvas.width * 0.3, this.canvas.height * 0.15)
        this.ctx.fillStyle = "black"
        this.ctx.fillText(`${this.currentName}`, this.canvas.width * 0.62, this.canvas.height * 0.63)
        this.ctx.fillStyle = "red"
        this.ctx.fillRect(this.canvas.width * 0.61, this.canvas.height * 0.635, this.canvas.width * 0.285 , this.canvas.height * 0.06)
        this.ctx.fillStyle = "green"
        this.ctx.fillRect(this.canvas.width * 0.61, this.canvas.height * 0.635, this.canvas.width * 0.285 * (this.ourStarter.hp/this.ourStarterTotalHP), this.canvas.height * 0.06)
        this.ctx.fillStyle = "black"
        this.ctx.fillText(`HP : ${this.ourStarter.hp} / ${this.ourStarterTotalHP}`, this.canvas.width * 0.62, this.canvas.height * 0.68)

        if (this.isperforming) {
            this.attack_menu =false
            this.ctx.fillStyle = "white"
            this.ctx.fillText(`${this.attackerName} used ${this.moveused}!`, this.canvas.width * 0.035, this.canvas.height * 0.83);
        }
        else {
            this.ctx.fillStyle = "black"
        }

        if (this.enemy.hp <= 0) {
            this.win = true
            this.attack_menu = false
        }
        else {
            this.win = false
        }
        if (this.ourStarter.hp <= 0) {
            this.lose = true
            this.attack_menu = false
        }
        else {
            this.lose = false
        }

        if (this.win) {
            this.ctx.fillStyle = 'black'
            this.menus.draw(299, 6, 156, 43, this.canvas.width * 0.2, this.canvas.height * 0.25, this.canvas.width * 0.6, this.canvas.height * 0.5);
            this.ctx.fillText(`Congrats, You won`, this.canvas.width * 0.4, this.canvas.height * 0.45)
            setTimeout(() => {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.endBattle()
                this.scene = 'world'
            }, 3000)
        }
        if (this.lose) {
            this.ctx.fillStyle = 'black'
            this.menus.draw(299, 6, 156, 43, this.canvas.width * 0.2, this.canvas.height * 0.25, this.canvas.width * 0.6, this.canvas.height * 0.5);
            this.ctx.fillText(`Ahh! You Lost!`, this.canvas.width * 0.4, this.canvas.height * 0.45)
            setTimeout(() => {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.endBattle()
                this.scene = 'world'
            }, 3000)
        }
    }

    controls() {
        window.addEventListener('keydown', (e) => {
            if(!this.bagOpen){
                this.MakeFalse();
                switch (e.key) {
                    case 'ArrowUp':
                        case 'w':
                            this.keys[ENUM.UP] = true;
                            break;
                            
                            case 'ArrowDown':
                                case 's':
                                    this.keys[ENUM.DOWN] = true;
                                    break;
                                    
                                    case 'ArrowLeft':
                                        case 'a':
                                            this.keys[ENUM.LEFT] = true;
                                            break;
                                            
                                            case 'ArrowRight':
                case 'd':
                    this.keys[ENUM.RIGHT] = true;
                    break;
                }
            }
        })

        window.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter') {
                if (!this.bagOpen && !this.pokeSelect && !this.isperforming) {
                    if (!this.win && !this.lose) {

                        if (!this.isperforming) {

                            if (this.arrow_posx === this.canvas.width * 0.625 && this.arrow_posy === this.canvas.height * 0.8 && this.data !== '' && !this.win && !this.lose && !this.attack_menu) {
                                setTimeout(()=>{
                                    if(!this.isperforming)
                                    this.arrow_posx = this.canvas.width * 0.02;
                                    this.attack_menu = true
                                } , 500)
                            }
                            else if (this.arrow_posx >= this.canvas.width * 0.7 && this.arrow_posy === this.canvas.height * 0.8 && this.data !== '' && !this.win && !this.lose) {
                                this.bagOpen =true
                                this.bag.style.display = 'block'
                                let instructions = document.getElementById('PokelistInstruction')

                                instructions.innerHTML = 'Press "B" to go back!'
                            }
                            else if (this.arrow_posx === this.canvas.width * 0.625 && this.arrow_posy === this.canvas.height * 0.9 && this.data !== '' && !this.win && !this.lose) {
                                this.pokeSelect = true
                                this.selectPokemon.style.display = 'block'
                                let instructions = document.getElementById('PokelistInstruction')
                                
                                instructions.innerHTML = `Press "F" to select ${this.starter_name} , "G" for ${this.secondStarter} and "H" to select ${this.thirdStarter} and Press "B" to go back!`
                            }
                            else if (this.arrow_posx >= this.canvas.width * 0.7 && this.arrow_posy === this.canvas.height * 0.9 && this.data !== '' && !this.win && !this.lose) {
                                this.run = true
                            }
                            else if (this.arrow_posx <= this.canvas.width * 0.05 && this.arrow_posy === this.canvas.height * 0.8 && this.data !== '' && this.attack_menu === true && !this.win && !this.lose) {
                                if(this.pp1>0)
                                this.attack_menu = false
                                this.arrow_posx = this.canvas.width * 0.625
                                this.arrow_posy = this.canvas.height * 0.8
                                if (!this.win && !this.lose ) {
                                    await this.performMove(this.ourStarter, this.enemy, this.ourStarter.moves[0].move.url, ENUM.POKECLASS1, 'starter-translate', this.ctx);
                                    setTimeout(async () => {
                                        if (!this.win && !this.lose)
                                            this.pp1 -= 1;
                                            await this.performMove(this.enemy, this.ourStarter, this.enemy.moves[0].move.url, ENUM.POKECLASS2, 'enemy-translate', this.ctx);
                                    }, 2000)
                                }
                            }
                            else if (this.arrow_posx >= this.canvas.width * 0.30 && this.arrow_posy === this.canvas.height * 0.8 && this.data !== '' && this.attack_menu === true) {
                                if(this.pp2>0)
                                this.attack_menu = false
                                this.arrow_posx = this.canvas.width * 0.625
                                this.arrow_posy = this.canvas.height * 0.8
                                if (!this.win && !this.lose) {
                                    await this.performMove(this.ourStarter, this.enemy, this.ourStarter.moves[1].move.url, ENUM.POKECLASS1, 'starter-translate', this.ctx);
                                    setTimeout(async () => {
                                        if (!this.win && !this.lose)
                                            this.pp2 -= 1;
                                            await this.performMove(this.enemy, this.ourStarter, this.enemy.moves[1].move.url, ENUM.POKECLASS2, 'enemy-translate', this.ctx);
                                    }, 2000)
                                }
                            }
                            else if (this.arrow_posx <= this.canvas.width * 0.05 && this.arrow_posy === this.canvas.height * 0.9 && this.data !== '' && this.attack_menu === true) {
                                if(this.pp3>0)
                                this.attack_menu = false
                                this.arrow_posx = this.canvas.width * 0.625
                                this.arrow_posy = this.canvas.height * 0.8
                                if (!this.win && !this.lose) {
                                    await this.performMove(this.ourStarter, this.enemy, this.ourStarter.moves[2].move.url, ENUM.POKECLASS1, 'starter-translate', this.ctx);
                                    setTimeout(async () => {
                                        if (!this.win && !this.lose)
                                            this.pp3 -= 1;
                                            await this.performMove(this.enemy, this.ourStarter, this.enemy.moves[2].move.url, ENUM.POKECLASS2, 'enemy-translate', this.ctx);
                                    }, 2000)
                                }
                            }
                            else if (this.arrow_posx >= this.canvas.width * 0.30 && this.arrow_posy === this.canvas.height * 0.9 && this.data !== '' && this.attack_menu === true) {
                                if(this.pp4>0)
                                this.attack_menu = false
                                this.arrow_posx = this.canvas.width * 0.625
                                this.arrow_posy = this.canvas.height * 0.8
                                if (!this.win && !this.lose) {
                                    await this.performMove(this.ourStarter, this.enemy, this.ourStarter.moves[3].move.url, ENUM.POKECLASS1, 'starter-translate', this.ctx);
                                    setTimeout(async () => {
                                        if (!this.win && !this.lose)
                                            this.pp4 -= 1;
                                            await this.performMove(this.enemy, this.ourStarter, this.enemy.moves[3].move.url, ENUM.POKECLASS2, 'enemy-translate', this.ctx);
                                    }, 2000)
                                }
                            }
                        }
                    }
                }
                }
                else if (this.bagOpen || this.pokeSelect) {

                    let instructions = document.getElementById('PokelistInstruction')
                    if (e.key === 'b') {
                        this.bag.style.display = 'none'
                        this.bagOpen = false
                        this.selectPokemon.style.display = 'none'
                        this.pokeSelect = false
                        
                        instructions.innerHTML = ''
                    }
                    if(this.pokeSelect){

                        if (e.key === 'f'){
                            this.currentData = this.starterData
                            this.currentName = this.starter_name
                            await this.setup2()
                            this.selectPokemon.style.display = 'none'
                            this.pokeSelect = false
                            
                            instructions.innerHTML = ''
                        }
                        if(this.secondStarter !=''){
                            if(e.key === 'g'){
                                this.currentData = this.secondStarterData
                                this.currentName = this.secondStarter
                                await this.setup2()
                                this.selectPokemon.style.display = 'none'
                                this.pokeSelect = false
                                
                                instructions.innerHTML = ''
                            }
                        }
                        if(this.thirdStarter !=''){
                            if(e.key === 'h'){
                                this.currentData = this.thirdStarterData
                                this.currentName = this.thirdStarter
                                await this.setup2()
                                this.selectPokemon.style.display = 'none'
                                this.pokeSelect = false
                                
                                instructions.innerHTML = ''
                            }
                        }
                    }
                }
            if (e.key === 'b') {
                this.arrow_posx = this.canvas.width * 0.625;
                this.arrow_posy = this.canvas.height * 0.8;
                this.attack_menu = false
            }
        })
    }

    MakeFalse() {
        this.keys[ENUM.UP] = false
        this.keys[ENUM.DOWN] = false
        this.keys[ENUM.LEFT] = false
        this.keys[ENUM.RIGHT] = false
    }


    update() {
        if (!this.win && !this.lose && !this.run) {
            this.render();
            requestAnimationFrame(this.update);
        }
        else {
            setTimeout(() => {
                this.pokeimg2.src = ''
                this.pokeimg1.src = ''
                this.pokeimg2.style.display = 'none'
                this.pokeimg1.style.display = 'none'
                this.ctx.fillStyle = 'black'
                window.game.players.x = 335
                window.game.players.y = 670
                window.game.scene = 'world'
                this.win = false
                this.lose = false
                this.animation_completed = false
                this.isperforming = false
                this.attack_menu = false
                this.run = false
                this.arrow_posx = this.canvas.width * 0.625;
                this.arrow_posy = this.canvas.height * 0.8;
                let audio = document.getElementById('audio')
                audio.src = 'assets/sounds/town.mp3'
                audio.play()
                window.game.render()
                window.game.players.setup();
                window.game.controls();
                window.game.battle.controls();
                window.game.update()
            }, 1000)
        }
    }
}