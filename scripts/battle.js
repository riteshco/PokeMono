import { Object } from "./Objects.js";

function showLoadingScreen() {
    document.getElementById("loading-screen").style.display = "flex";
}


function hideLoadingScreen() {
    document.getElementById("loading-screen").style.display = "none";
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


        this.randomPokemons = ['pikachu' , 'bulbasaur' , 'charmander' , 'arceus']
        this.pokename = 'pikachu'
        this.starter_name = ''

        this.scale = 48;

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

    async setup(){
        this.selectRandomPokemon()
        await this.dataGet(this.pokename)
        console.log(this.data)
        this.pokeimg2.src = this.data.sprites.front_default
        this.pokeimg2.style.display = 'block'
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
        this.ctx.fillText(`HP : ${this.data.stats[0].base_stat} /${this.data.stats[0].base_stat}` , 440 , 185)
        
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
        this.ctx.fillText(`HP : ${this.starterData.stats[0].base_stat} / ${this.starterData.stats[0].base_stat} ` , 1240 , 670)


        
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

        window.addEventListener('keydown' , (e)=>{
            if(e.key === 'Enter'){
                if(this.arrow_posx === 1200 && this.arrow_posy === 780 && this.data !== ''){
                    this.arrow_posx = 40;
                    this.attack_menu = true
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