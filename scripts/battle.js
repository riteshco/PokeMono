import { Object } from "./Objects.js";



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

async function performMove(attacker, defender, moveUrl , id , classToAdd) {
    let moving = document.getElementById(id)
    moving.classList.add(classToAdd)
    setTimeout(()=>{
        moving.classList.remove(classToAdd)
    } , 1000)
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

    const damage = calculateDamage(50, move.power, attackStat, defenseStat);
    defender.hp -= damage;
    if (defender.hp < 0) defender.hp = 0;

    console.log(`${attacker.name} used ${move.name}!`);
    console.log(`${defender.name} took ${damage} damage!`);
}






export class Battle{
    constructor(canvas , context){
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


        this.randomPokemons =[
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

        this.bg = new Object(this , 'assets/battle_bg.png')
        this.menus = new Object(this , 'assets/battle_menu.png')

        this.sprites_animation0 = new Object(this , 'assets/player_0.png')
        this.sprites_animation1 = new Object(this , 'assets/player_1.png')
        this.sprites_animation2 = new Object(this , 'assets/player_2.png')
        this.sprites_animation3 = new Object(this , 'assets/player_3.png')
        this.sprites_animation4 = new Object(this , 'assets/player_4.png')

        // this.img = new Image();
        // this.imgReady = false;

        // this.data = ''
        
        this.keys = {}
        this.arrow_posx = 1200;
        this.arrow_posy = 780;

        this.win = false
        // this.setup = false;
        
        
        this.update = this.update.bind(this);
        
        setTimeout(() => {
            this.update();
        }, 100);
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

    selectRandomPokemon(){
        let randInt = Math.floor(Math.random() * 100);
        if(randInt === 100){
            randInt = 99
        }
        this.pokename = this.randomPokemons[randInt]
    }

    async setup(){
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

    
    
    
    render(){
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = "white";
        
        this.bg.draw(250 , 7 , 238 , 150 , 0 , 0, this.width , this.height);
        
        if(this.animation_completed === false){
            if(Math.floor(this.animation_time/3) <100){
                this.sprites_animation0.draw(0,0, 600 , 670, 0 , 240 , 600 , 670)
            }
            else if(Math.floor(this.animation_time/3) < 200){
                this.sprites_animation1.draw(0 , 0 , 570 , 670 , 0 , 240 , 600 , 670)
            }
            else if(Math.floor(this.animation_time/3) < 300){
                this.sprites_animation2.draw(0 , 0 , 620 , 690 , 0 , 240 , 600 , 670)
            }
            else if(Math.floor(this.animation_time/3) < 400){
                this.sprites_animation3.draw(0 , 0 , 650 , 690 , 0 , 240 , 600 , 670)
            }
            else if(Math.floor(this.animation_time/3) < 500){
                this.sprites_animation4.draw(0 , 0 , 620 , 690 , 0 , 240 , 600 , 670)
                this.animation_completed = true
            }
            this.animation_time +=1;
            if(this.animation_time > 1600){
                this.animation_time =1
            }
        }

        if(this.animation_completed){
            this.pokeimg1.src = this.starterData.sprites.back_default
            this.pokeimg1.style.display = 'block'
        }

        
        
        this.menus.draw(298 , 56 , 238 , 51 , 0 , 714 , this.width , 270);
        this.menus.draw(146 , 4 , 119 , 51 , 3*this.width/5 , 714 , this.width/2.5 , 270);
        
        
        if(this.keys['up']){
            if(this.arrow_posy === 860)
                this.arrow_posy -= 80
            this.keys['up'] = false
        }
        if(this.keys['down']){
            if(this.arrow_posy === 780)
                this.arrow_posy +=80
            this.keys['down'] = false
        }
        if(this.keys['left']){
            if(this.arrow_posx === 1560){
                this.arrow_posx -= 360
            }
            if(this.arrow_posx === 700){
                this.arrow_posx -= 660
            }
            this.keys['left'] = false
        }
        if(this.keys['right']){
            if(this.arrow_posx === 1200){
                this.arrow_posx += 360
            }
            if(this.arrow_posx === 40){
                this.arrow_posx += 660
            }
            this.keys['right'] = false
        }
        if(!this.animation_completed){
            this.ctx.fillText(`A wild ${this.pokename} appeared!` , 70 , 800);
        }else{
            this.ctx.fillText(`GO ${this.starter_name}!!` , 70 , 800);
        }

        this.menus.draw(4 , 3 , 91 , 29 , 400 , 90 , 480 , 120) // Enemy stats
        this.ctx.fillStyle = "black"
        this.ctx.fillText(`${this.pokename}` , 440 , 140)
        this.ctx.fillStyle = "white"
        this.ctx.fillRect(415 , 145 , 450 , 40)
        this.ctx.fillStyle = "black"
        this.ctx.fillText(`HP : ${this.enemy.hp} /${this.data.stats[0].base_stat}` , 440 , 185)
        
        if(this.attack_menu){
            this.menus.draw(297 , 3.9 , 159 , 48 , 0 , 714 , 3*this.width/5 , 270 );
            const moveNames = this.starterData.moves.slice(0, 4).map(m => m.move.name)
            this.ctx.fillStyle = "black"
            this.ctx.fillText(`${moveNames[0]}` , 100 , 820);
            this.ctx.fillText(`${moveNames[1]}` , 760 , 820);
            this.ctx.fillText(`${moveNames[2]}` , 100 , 900);
            this.ctx.fillText(`${moveNames[3]}` , 760 , 900);

        }
        
        this.menus.draw(269 , 3.9 , 5 , 9.2 , this.arrow_posx , this.arrow_posy ,50,50);//arrow

        this.menus.draw(12 , 45 , 91 , 36 , 1200 , 560 , 600 , 150) // Our Starter stats
        this.ctx.fillStyle = "black"
        this.ctx.fillText(`${this.starter_name}` , 1240 , 610)
        this.ctx.fillStyle = "white"
        this.ctx.fillRect(1220 , 615 , 570 , 70)
        this.ctx.fillStyle = "black"
        this.ctx.fillText(`HP : ${this.ourStarter.hp} / ${this.starterData.stats[0].base_stat} ` , 1240 , 670)

        if(this.enemy.hp <=0){
            this.win = true
        }
        else{
            this.win = false
        }

        if(this.win){
            this.menus.draw(299 , 6 , 156 , 43 , this.width*(0.2), this.height * (0.25), this.width * (0.6) ,  this.height*(0.5));
            this.ctx.fillText(`Congrats, You won` , this.width*(0.4) , this.height*(0.45))
            setTimeout(()=>{
                this.ctx.clearRect(0,0,window.innerWidth , window.innerHeight);
                this.scene = 'world'
            } , 3000)
        }
        
    }


    
    controls(){
        window.addEventListener('keydown' , (e)=>{
            this.MakeFalse();
            switch(e.key){
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
        })

        window.addEventListener('keydown' , async(e)=>{
            if(e.key === 'Enter'){
                if(this.arrow_posx === 1200 && this.arrow_posy === 780 && this.data !== '' ){
                    this.arrow_posx = 40;
                    this.attack_menu = true
                }
                else if(this.arrow_posx === 40 && this.arrow_posy === 780 && this.data !== '' && this.attack_menu === true){
                    this.attack_menu = false
                    this.arrow_posx = 1200
                    this.arrow_posy = 780
                    await performMove(this.ourStarter, this.enemy ,  this.ourStarter.moves[0].move.url , 'pokemon1' , 'starter-translate');
                    await performMove(this.enemy ,  this.ourStarter, this.enemy.moves[0].move.url , 'pokemon2' , 'enemy-translate');
                    setTimeout(()=>{
                        this.attack_menu = true
                        this.arrow_posx = 40
                        this.arrow_posy = 780
                    } , 2000)

                }
                else if(this.arrow_posx === 700 && this.arrow_posy === 780 && this.data !== '' && this.attack_menu === true){
                    this.attack_menu = false
                    this.arrow_posx = 1200
                    this.arrow_posy = 780
                    await performMove(this.ourStarter, this.enemy ,  this.ourStarter.moves[1].move.url, 'pokemon1' , 'starter-translate');
                    await performMove(this.enemy ,  this.ourStarter, this.enemy.moves[1].move.url, 'pokemon2' , 'enemy-translate');
                    setTimeout(()=>{
                        this.attack_menu = true
                        this.arrow_posx = 700
                        this.arrow_posy = 780
                    } , 2000)
                }
                else if(this.arrow_posx === 40 && this.arrow_posy === 860 && this.data !== '' && this.attack_menu === true){
                    this.attack_menu = false
                    this.arrow_posx = 1200
                    this.arrow_posy = 780
                    await performMove(this.ourStarter, this.enemy ,  this.ourStarter.moves[2].move.url, 'pokemon1' , 'starter-translate');
                    await performMove(this.enemy ,  this.ourStarter, this.enemy.moves[2].move.url, 'pokemon2' , 'enemy-translate');
                    setTimeout(()=>{
                        this.attack_menu = true
                        this.arrow_posx = 40
                        this.arrow_posy = 860
                    } , 2000)
                }
                else if(this.arrow_posx === 700 && this.arrow_posy === 860 && this.data !== '' && this.attack_menu === true){
                    this.attack_menu = false
                    this.arrow_posx = 1200
                    this.arrow_posy = 780
                    await performMove(this.ourStarter, this.enemy ,  this.ourStarter.moves[3].move.url, 'pokemon1', 'starter-translate');
                    await performMove(this.enemy ,  this.ourStarter, this.enemy.moves[3].move.url, 'pokemon2' , 'enemy-translate');
                    setTimeout(()=>{
                        this.attack_menu = true
                        this.arrow_posx = 700
                        this.arrow_posy = 860
                    } , 2000)
                }

            }
            if(e.key === 'b'){
                this.arrow_posx = 1200;
                this.arrow_posy = 780;
                this.attack_menu = false
            }
        })

    }

    MakeFalse(){
        this.keys['up'] = false
        this.keys['down'] = false
        this.keys['left'] = false
        this.keys['right'] = false
    }


    update() {
        
        this.render();
        requestAnimationFrame(this.update); // To loop again and again
    }
}