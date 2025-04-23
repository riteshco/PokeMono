import { Object } from "./Objects.js";
import { Game } from "./main.js";


function showLoadingScreen() {
    document.getElementById("loading-screen").style.display = "flex";
}


function hideLoadingScreen() {
    document.getElementById("loading-screen").style.display = "none";
}



async function fetchPokemonStat(data) {
    return {
        name: data.name,
        stats: data.stats,
        moves: data.moves,
        sprite: data.sprites.front_default
    };
}

function getStat(statsArray, statName) {
    return statsArray.find(s => s.stat.name === statName).base_stat;
}

async function fetchMove(moveUrl) {
    const res = await fetch(moveUrl);
    const moveData = await res.json();
    return {
        name: moveData.name,
        power: moveData.power, // can be null!
        accuracy: moveData.accuracy,
        type: moveData.type.name
    };
}

function calculateDamage(level, power, attack, defense) {
    const base = (((2 * level) / 5 + 2) * power * (attack / defense)) / 50 + 2;
    return Math.floor(base * (0.85 + Math.random() * 0.15)); // random factor 0.85-1
}





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

        this.pokeimg1 = document.getElementById('pokemon1')
        this.pokeimg2 = document.getElementById('pokemon2')


        this.ctx.font = "30px 'Press Start 2P', sans-serif";
        this.ctx.fillStyle = "white";

        this.data = '';
        this.starterData = '';


        this.randomPokemons = [
            "bulbasaur", "ivysaur", "venusaur", "charmander", "charmeleon", "charizard", "squirtle", "wartortle", "blastoise",
            "caterpie", "metapod", "butterfree", "weedle", "kakuna", "beedrill", "pidgey", "pidgeotto", "pidgeot", "rattata",
            "raticate", "spearow", "fearow", "ekans", "arbok", "pikachu", "raichu", "sandshrew", "sandslash", "nidoran-f",
            "nidorina", "nidoqueen", "nidoran-m", "nidorino", "nidoking", "clefairy", "clefable", "vulpix", "ninetales",
            "jigglypuff", "wigglytuff", "zubat", "golbat", "oddish", "gloom", "vileplume", "paras", "parasect", "venonat",
            "venomoth", "diglett", "dugtrio", "meowth", "persian", "psyduck", "golduck", "mankey", "primeape", "growlithe",
            "arcanine", "poliwag", "poliwhirl", "poliwrath", "abra", "kadabra", "alakazam", "machop", "machoke", "machamp",
            "bellsprout", "weepinbell", "victreebel", "tentacool", "tentacruel", "geodude", "graveler", "golem", "ponyta",
            "rapidash", "slowpoke", "slowbro", "magnemite", "magneton", "farfetchd", "doduo", "dodrio", "seel", "dewgong",
            "grimer", "muk", "shellder", "cloyster", "gastly", "haunter", "gengar", "onix", "drowzee", "hypno", "krabby",
            "kingler", "voltorb", "electrode", "rayquaza", "arceus"
        ];
        this.pokename = 'pikachu'
        this.starter_name = ''

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

        // this.img = new Image();
        // this.imgReady = false;

        // this.data = ''

        this.keys = {}
        this.arrow_posx = this.canvas.width * 0.625;
        this.arrow_posy = this.canvas.height * 0.8;

        this.win = false
        this.lose = false
        // this.setup = false;


        this.bag = document.getElementById('bag')
        this.bagOpen = false

        this.selectPokemon = document.getElementById('selection')
        this.pokeSelect = false


        this.isperforming = false
        this.attackerName = ''
        this.moveused = ''


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
        const move = await fetchMove(moveUrl);
        let effect = document.getElementById('effect')
        effect.src = 'assets/attack.wav'
        effect.play()

        if (!move.power) {
            console.log(`${move.name} doesn't deal damage.`);
            return;
        }

        const attackStat = getStat(attacker.stats, "attack");
        const defenseStat = getStat(defender.stats, "defense");

        const damage = calculateDamage(20, move.power, attackStat, defenseStat);
        defender.hp -= damage;
        if (defender.hp < 0) defender.hp = 0;

        this.isperforming = true

        this.attackerName = attacker.name
        this.moveused = move.name
        setTimeout(() => {
            this.isperforming = false
        }, 2000)

        console.log(`${attacker.name} used ${move.name}!`);
        console.log(`${defender.name} took ${damage} damage!`);

    }


    async dataGet(name) {
        showLoadingScreen();
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

            if (!response.ok) {
                throw new Error("Couldn't fetch resource")
            }

            const data = await response.json();
            this.data = data;

            hideLoadingScreen();
        } catch (error) {
            console.error(error);
            hideLoadingScreen();
        }
    }

    selectRandomPokemon() {
        let randInt = Math.floor(Math.random() * 100);
        if (randInt === 100) {
            randInt = 99
        }
        this.pokename = this.randomPokemons[randInt]
    }

    async setup() {
        this.selectRandomPokemon()
        await this.dataGet(this.pokename)
        console.log(this.data)
        this.pokeimg2.src = this.data.sprites.front_default
        this.pokeimg2.style.display = 'block'


        this.ourStarter = await fetchPokemonStat(this.starterData);
        this.enemy = await fetchPokemonStat(this.data);

        this.ourStarter.hp = getStat(this.ourStarter.stats, "hp");
        this.enemy.hp = getStat(this.enemy.stats, "hp");
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
            this.pokeimg1.src = this.starterData.sprites.back_default
            this.pokeimg1.style.display = 'block'
        }

        const menuBottomHeight = Math.min(this.canvas.height * 0.3, this.canvas.height * 0.3);
        const menuBottomY = this.canvas.height + this.canvas.height * (0.02) - menuBottomHeight;

        this.menus.draw(298, 56, 238, 51, 0, menuBottomY, this.canvas.width, menuBottomHeight);

        const rightMenuWidth = this.canvas.width / 2.5;
        const rightMenuX = this.canvas.width - rightMenuWidth;
        this.menus.draw(146, 4, 119, 51, rightMenuX, menuBottomY, rightMenuWidth, menuBottomHeight);

        if (this.keys['up']) {
            if (this.arrow_posy === this.canvas.height * 0.9)
                this.arrow_posy -= this.canvas.height * 0.1
            this.keys['up'] = false
        }
        if (this.keys['down']) {
            if (this.arrow_posy === this.canvas.height * 0.8)
                this.arrow_posy += this.canvas.height * 0.1
            this.keys['down'] = false
        }
        if (this.keys['left']) {
            if (this.arrow_posx === this.canvas.width * 0.35) {
                this.arrow_posx -= this.canvas.width * 0.33
            }
            else if (this.arrow_posx > this.canvas.width * 0.625) {
                this.arrow_posx -= this.canvas.width * 0.18
            }

            this.keys['left'] = false
        }
        if (this.keys['right']) {
            if (this.arrow_posx === this.canvas.width * 0.625) {
                this.arrow_posx += this.canvas.width * 0.18
            }
            if (this.arrow_posx >= this.canvas.width * 0.01 && this.arrow_posx < this.canvas.width * 0.3) {
                this.arrow_posx += this.canvas.width * 0.33
            }
            this.keys['right'] = false
        }
        if (!this.animation_completed) {
            this.ctx.fillText(`A wild ${this.pokename} appeared!`, this.canvas.width * 0.035, this.canvas.height * 0.83);
        } else if (!this.isperforming) {
            this.ctx.fillText(`GO ${this.starter_name}!!`, this.canvas.width * 0.035, this.canvas.height * 0.83);
        }

        this.menus.draw(4, 3, 91, 29, this.canvas.width * 0.2, this.canvas.height * 0.09, this.canvas.width * 0.24, this.canvas.height * 0.14) // Enemy stats
        this.ctx.fillStyle = "black"
        this.ctx.fillText(`${this.pokename}`, this.canvas.width * 0.22, this.canvas.height * 0.14)
        this.ctx.fillStyle = "white"
        this.ctx.fillRect(this.canvas.width * 0.2075, this.canvas.height * 0.145, this.canvas.width * 0.225, this.canvas.height * 0.04)
        this.ctx.fillStyle = "black"
        this.ctx.fillText(`HP : ${this.enemy.hp} /${this.data.stats[0].base_stat}`, this.canvas.width * 0.22, this.canvas.height * 0.185)

        if (this.attack_menu) {
            this.menus.draw(297, 3.9, 159, 48, 0, this.canvas.height * 0.74, this.canvas.width * 0.6, this.canvas.height * 0.27);
            const moveNames = this.starterData.moves.slice(0, 4).map(m => m.move.name)
            this.ctx.fillStyle = "black"
            this.ctx.fillText(`${moveNames[0]}`, this.canvas.width * 0.05, this.canvas.height * 0.84);
            this.ctx.fillText(`${moveNames[1]}`, this.canvas.width * 0.38, this.canvas.height * 0.84);
            this.ctx.fillText(`${moveNames[2]}`, this.canvas.width * 0.05, this.canvas.height * 0.94);
            this.ctx.fillText(`${moveNames[3]}`, this.canvas.width * 0.38, this.canvas.height * 0.94);
        }

        this.menus.draw(269, 3.9, 5, 9.2, this.arrow_posx, this.arrow_posy, this.canvas.width * 0.025, this.canvas.height * 0.05);//arrow

        this.menus.draw(12, 45, 91, 36, this.canvas.width * 0.6, this.canvas.height * 0.58, this.canvas.width * 0.3, this.canvas.height * 0.15) // Our Starter stats
        this.ctx.fillStyle = "black"
        this.ctx.fillText(`${this.starter_name}`, this.canvas.width * 0.62, this.canvas.height * 0.63)
        this.ctx.fillStyle = "white"
        this.ctx.fillRect(this.canvas.width * 0.61, this.canvas.height * 0.635, this.canvas.width * 0.285, this.canvas.height * 0.07)
        this.ctx.fillStyle = "black"
        this.ctx.fillText(`HP : ${this.ourStarter.hp} / ${this.starterData.stats[0].base_stat}`, this.canvas.width * 0.62, this.canvas.height * 0.7)

        if (this.isperforming) {
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
                            this.keys['up'] = true;
                            break;
                            
                            case 'ArrowDown':
                                case 's':
                                    this.keys['down'] = true;
                                    break;
                                    
                                    case 'ArrowLeft':
                                        case 'a':
                                            this.keys['left'] = true;
                                            break;
                                            
                                            case 'ArrowRight':
                case 'd':
                    this.keys['right'] = true;
                    break;
                }
            }
        })

        window.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter') {
                if (!this.bagOpen && !this.pokeSelect) {
                    if (!this.win && !this.lose) {

                        if (!this.isperforming) {

                            if (this.arrow_posx === this.canvas.width * 0.625 && this.arrow_posy === this.canvas.height * 0.8 && this.data !== '' && !this.win && !this.lose) {
                                this.arrow_posx = this.canvas.width * 0.02;
                                this.attack_menu = true
                            }
                            else if (this.arrow_posx >= this.canvas.width * 0.7 && this.arrow_posy === this.canvas.height * 0.8 && this.data !== '' && !this.win && !this.lose) {
                                this.bagOpen =true
                                this.bag.style.display = 'block'
                            }
                            else if (this.arrow_posx === this.canvas.width * 0.625 && this.arrow_posy === this.canvas.height * 0.9 && this.data !== '' && !this.win && !this.lose) {
                                this.pokeSelect = true
                                this.selectPokemon.style.display = 'block'
                            }
                            else if (this.arrow_posx >= this.canvas.width * 0.7 && this.arrow_posy === this.canvas.height * 0.9 && this.data !== '' && !this.win && !this.lose) {
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
                                    this.attack_menu = false
                                    window.game.render()
                                    window.game.players.setup();
                                    window.game.controls();
                                    window.game.battle.controls();
                                    window.game.update()
                                }, 1000)
                            }
                            else if (this.arrow_posx === this.canvas.width * 0.02 && this.arrow_posy === this.canvas.height * 0.8 && this.data !== '' && this.attack_menu === true && !this.win && !this.lose) {
                                this.attack_menu = false
                                this.arrow_posx = this.canvas.width * 0.625
                                this.arrow_posy = this.canvas.height * 0.8
                                if (!this.win && !this.lose) {
                                    await this.performMove(this.ourStarter, this.enemy, this.ourStarter.moves[0].move.url, 'pokemon1', 'starter-translate', this.ctx);
                                    setTimeout(async () => {
                                        if (!this.win && !this.lose)
                                            await this.performMove(this.enemy, this.ourStarter, this.enemy.moves[0].move.url, 'pokemon2', 'enemy-translate', this.ctx);
                                    }, 2000)

                                    setTimeout(() => {
                                        if (!this.win && !this.lose) {

                                            this.attack_menu = true
                                            this.arrow_posx = this.canvas.width * 0.02
                                            this.arrow_posy = this.canvas.height * 0.8
                                        }
                                        else {
                                            this.attack_menu = false
                                            this.arrow_posx = this.canvas.width * 0.625
                                            this.arrow_posx = this.canvas.height * 0.8
                                        }
                                    }, 5000)
                                }
                            }
                            else if (this.arrow_posx === this.canvas.width * 0.35 && this.arrow_posy === this.canvas.height * 0.8 && this.data !== '' && this.attack_menu === true) {
                                this.attack_menu = false
                                this.arrow_posx = this.canvas.width * 0.625
                                this.arrow_posy = this.canvas.height * 0.8
                                if (!this.win && !this.lose) {
                                    await this.performMove(this.ourStarter, this.enemy, this.ourStarter.moves[1].move.url, 'pokemon1', 'starter-translate', this.ctx);
                                    setTimeout(async () => {
                                        if (!this.win && !this.lose)
                                            await this.performMove(this.enemy, this.ourStarter, this.enemy.moves[1].move.url, 'pokemon2', 'enemy-translate', this.ctx);
                                    }, 2000)

                                    setTimeout(() => {
                                        if (!this.win && !this.lose) {

                                            this.attack_menu = true
                                            this.arrow_posx = this.canvas.width * 0.35
                                            this.arrow_posy = this.canvas.height * 0.8
                                        }
                                        else {
                                            this.attack_menu = false
                                            this.arrow_posx = this.canvas.width * 0.625
                                            this.arrow_posx = this.canvas.height * 0.8
                                        }
                                    }, 5000)
                                }
                            }
                            else if (this.arrow_posx === this.canvas.width * 0.02 && this.arrow_posy === this.canvas.height * 0.9 && this.data !== '' && this.attack_menu === true) {
                                this.attack_menu = false
                                this.arrow_posx = this.canvas.width * 0.625
                                this.arrow_posy = this.canvas.height * 0.8
                                if (!this.win && !this.lose) {
                                    await this.performMove(this.ourStarter, this.enemy, this.ourStarter.moves[2].move.url, 'pokemon1', 'starter-translate', this.ctx);
                                    setTimeout(async () => {
                                        if (!this.win && !this.lose)
                                            await this.performMove(this.enemy, this.ourStarter, this.enemy.moves[2].move.url, 'pokemon2', 'enemy-translate', this.ctx);
                                    }, 2000)
                                    setTimeout(() => {
                                        if (!this.win && !this.lose) {

                                            this.attack_menu = true
                                            this.arrow_posx = this.canvas.width * 0.02
                                            this.arrow_posy = this.canvas.height * 0.9
                                        }
                                        else {
                                            this.attack_menu = false
                                            this.arrow_posx = this.canvas.width * 0.625
                                            this.arrow_posx = this.canvas.height * 0.8
                                        }
                                    }, 5000)
                                }
                            }
                            else if (this.arrow_posx === this.canvas.width * 0.35 && this.arrow_posy === this.canvas.height * 0.9 && this.data !== '' && this.attack_menu === true) {
                                this.attack_menu = false
                                this.arrow_posx = this.canvas.width * 0.625
                                this.arrow_posy = this.canvas.height * 0.8
                                if (!this.win && !this.lose) {
                                    await this.performMove(this.ourStarter, this.enemy, this.ourStarter.moves[3].move.url, 'pokemon1', 'starter-translate', this.ctx);
                                    setTimeout(async () => {
                                        if (!this.win && !this.lose)
                                            await this.performMove(this.enemy, this.ourStarter, this.enemy.moves[3].move.url, 'pokemon2', 'enemy-translate', this.ctx);
                                    }, 2000)

                                    setTimeout(() => {
                                        if (!this.win && !this.lose) {

                                            this.attack_menu = true
                                            this.arrow_posx = this.canvas.width * 0.35
                                            this.arrow_posy = this.canvas.height * 0.9
                                        }
                                        else {
                                            this.attack_menu = false
                                            this.arrow_posx = this.canvas.width * 0.625
                                            this.arrow_posx = this.canvas.height * 0.8
                                        }
                                    }, 5000)
                                }
                            }
                        }
                    }
                }
                }
                else if (this.bagOpen || this.pokeSelect) {
                    if (e.key === 'b') {
                        this.bag.style.display = 'none'
                        this.bagOpen = false
                        this.selectPokemon.style.display = 'none'
                        this.pokeSelect = false
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
        this.keys['up'] = false
        this.keys['down'] = false
        this.keys['left'] = false
        this.keys['right'] = false
    }


    update() {
        if (!this.win && !this.lose) {
            this.render();
            requestAnimationFrame(this.update); // To loop again and again
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
                this.attack_menu = false
                window.game.render()
                window.game.players.setup();
                window.game.controls();
                window.game.battle.controls();
                window.game.update()
            }, 1000)
        }
    }
}