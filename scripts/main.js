import { Player } from "./Player.js";
import { Object , CollidingObject } from "./Objects.js";
import { Battle } from "./battle.js";

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

        this.ctx.font = `${Math.floor(this.height * 0.05)}px 'Press Start 2P', sans-serif`;

        this.ctx.fillStyle = "White";

        this.scene = 'world'

        this.pokimg = document.getElementById('pokemon2')

        this.randomPokemons = ['pikachu' , 'bulbasaur' , 'charmander' , 'arceus']
        this.pokename = ''

        this.starter_name = ''

        
        this.scale = 48;
        
        this.battle = new Battle(this.canvas , this.ctx);
        this.assets = new Object(this, 'assets/tileset_cleaned.png');
        this.menus = new Object(this , 'assets/battle_menu.png')
        this.colliderAssets = new CollidingObject(this, 'assets/tileset_cleaned.png');
        this.players = new Player(this, 'assets/Sprites_cleaned.png' , 335 , 670);

        this.update = this.update.bind(this);
        this.data = ''

        this.setupDone = false

        setTimeout(() => {
            this.update();
        }, 100);

        this.dialog = 0;

        this.arrow_posx = this.width * (0.25) - 60
        this.arrow_posy = this.height*(0.8) + 50

        this.audio = document.getElementById('audio')
        this.audio.src = 'assets/town.mp3'

        this.pokemonNames = [
            "geodude", "mewtwo", "rhydon", "togepi", "cyndaquil", "golem", "arbok", "nidorino", "natu", "scyther",
            "sunkern", "tentacool", "lanturn", "vileplume", "goldeen", "kingler", "bellossom", "rattata", "seadra", "butterfree",
            "lickitung", "kabutops", "zapdos", "gastly", "marowak", "hoppip", "drowzee", "rhyhorn", "machoke", "hypno",
            "slowking", "mr. mime", "mankey", "shellder", "nidoran♀", "wobbuffet", "clefairy", "pidgeotto", "sentret", "beedrill",
            "hitmonchan", "mareep", "dewgong", "meganium", "poliwhirl", "seaking", "sudowoodo", "azumarill", "exeggcute", "muk",
            "quilava", "doduo", "machop", "omanyte", "grimer", "victreebel", "ampharos", "machamp", "rapidash", "skiploom",
            "togetic", "eevee", "jynx", "flaaffy", "crobat", "tentacruel", "dunsparce", "hoothoot", "dodrio", "psyduck",
            "gloom", "graveler", "typhlosion", "tangela", "noctowl", "sandslash", "quilava", "slowbro", "ledyba", "magikarp",
            "farfetch’d", "starmie", "umbreon", "misdreavus", "butterfree", "weedle", "clefable", "poliwrath", "aerodactyl", "exeggutor",
            "kadabra", "omastar", "kangaskhan", "charizard", "togepi", "wooper", "togetic", "kabuto", "machamp", "primeape",
            "charmeleon", "blastoise", "cleffa", "scyther", "ninetales", "gengar", "tentacool", "flaaffy", "wigglytuff", "azumarill",
            "cloyster", "arcanine", "hypno", "vaporeon", "croconaw", "magnemite", "bellossom", "meowth", "sunflora", "jolteon",
            "marowak", "diglett", "lapras", "nidoran♂", "hoothoot", "rapidash", "magneton", "alakazam", "seadra", "typhlosion",
            "bayleef", "pikachu", "pinsir", "nidoqueen", "igglybuff", "ivysaur", "sentret", "butterfree", "cleffa", "clefairy",
            "raichu", "dragonair", "muk", "victreebel", "snubbull", "chikorita", "wigglytuff", "hitmonchan", "jolteon", "marill",
            "weezing", "arbok", "wartortle", "hitmonlee", "rattata", "chinchou", "feraligatr", "forretress", "machop", "haunter",
            "charizard", "pidgeotto", "espeon", "misdreavus", "gastly", "persian", "electrode", "jynx", "krabby", "starmie",
            "staryu", "kadabra", "exeggcute", "charmeleon", "togepi", "alakazam", "lickitung", "nidoqueen", "poliwhirl", "snorlax",
            "poliwag", "porygon", "dragonite", "fearow", "pidgeot", "magneton", "jigglypuff", "sandslash", "bulbasaur", "kakuna"
          ];
        this.randomStarter = 'groudon'

    }

    render() {

        if(this.scene === 'world'){

            this.ctx.clearRect(0, 0, this.width, this.height);
            
            // --- Rendering grass ---
            for (let i = 0; i < Math.floor(this.width / this.scale)+1; ++i) {
                for (let j = 0; j < (this.height / this.scale); ++j) {
                    if (i%4==0) {
                        this.assets.draw(8, 66, 12, 12, 48 * i, 48 * j, 48, 48);
                    } else if (i%4==1) {
                        this.assets.draw(25, 66, 12, 12, 48 * i, 48 * j, 48, 48);
                    } else {
                        this.assets.draw(59, 66, 12, 12, 48 * i, 48 * j, 48, 48);
                    }
                }
            }
            
            // --- Rendering paths ---
            for(let i=0; i< Math.floor(this.width/this.scale)*(0.6) ; ++i){
                this.assets.draw(147.4 , 50.3 , 7.3 , 7.3 , 48*i , 672 , 48 , 48) //path with top border
                this.assets.draw(138.4 , 59.3 , 7.3 , 7.3 , 48*i , 720 , 48 , 48) //mid path
                this.assets.draw(156.4 , 59.3 , 7.3 , 7.3 , 48*i , 768 , 48 , 48) //mid path 2
                this.assets.draw(147.4 , 68.3 , 7.3 , 7.3 , 48*i , 816 , 48 , 48) //path with bottom border
            }
            this.assets.draw(147.4 , 50.3 , 7.3 , 7.3 , (this.width)*0.6 , 672 , 48 , 48) 
            this.assets.draw(147.4 , 50.3 , 7.3 , 7.3 , (this.width)*0.6+this.scale , 672 , 48 , 48)
            this.assets.draw(165.4 , 50.3 , 7.3 , 7.3 , (this.width)*0.6+2*this.scale , 672 , 48 , 48) //path with top right diagonal border
            this.assets.draw(156.4 , 50.3 , 7.3 , 7.3 , (this.width)*0.6+2*this.scale , 672+this.scale , 48 , 48) //path with semi top right diagonal border
            this.assets.draw(165.4 , 50.3 , 7.3 , 7.3 , (this.width)*0.6+3*this.scale , 672+this.scale , 48 , 48)
            for(let i=Math.floor(this.height/this.scale)*(0.8) ; i< Math.floor(this.height/this.scale) + 2;++i){
                this.assets.draw(165.4 , 59.3 , 7.3 , 7.3 , (this.width)*0.6+3*this.scale , 48*i , 48 , 48) //path with right border
                this.assets.draw(138.4 , 59.3 , 7.3 , 7.3 , (this.width)*0.6+2*this.scale , 48*i , 48 , 48) 
                this.assets.draw(156.4 , 59.3 , 7.3 , 7.3 , (this.width)*0.6+1*this.scale , 48*(i-1) , 48 , 48)
            }
            this.assets.draw(138.4 , 59.3 , 7.3 , 7.3 , (this.width)*0.6 , 48*(Math.floor(this.height/this.scale)*(0.8)-1) , 48 , 48)
            this.assets.draw(138.4 , 59.3 , 7.3 , 7.3 , (this.width)*0.6 , 48*(Math.floor(this.height/this.scale)*(0.8)) , 48 , 48)
            this.assets.draw(138.4 , 59.3 , 7.3 , 7.3 , (this.width)*0.6 , 48*(Math.floor(this.height/this.scale)*(0.8)+1) , 48 , 48)
            this.assets.draw(129.4 , 59.3 , 7.3 , 7.3 , (this.width)*0.6 , 48*(Math.floor(this.height/this.scale)*(0.8)+2), 48 , 48) //path with left border
            this.assets.draw(129.4 , 59.3 , 7.3 , 7.3 , (this.width)*0.6 , 48*(Math.floor(this.height/this.scale)*(0.8)+3), 48 , 48)
            this.assets.draw(129.4 , 59.3 , 7.3 , 7.3 , (this.width)*0.6 , 48*(Math.floor(this.height/this.scale)*(0.8)+4), 48 , 48)
            
            for(let j=0 ; j<Math.floor(this.height/this.scale)*(0.7) + 1; ++j){
                this.assets.draw(129.4 , 59.3 , 7.3 , 7.3 , (this.width)*0.3 , (j-1)*this.scale, 48 , 48)
                this.assets.draw(138.4 , 59.3 , 7.3 , 7.3 , (this.width)*0.3 + this.scale , j*this.scale , 48 , 48)
                this.assets.draw(156.4 , 59.3 , 7.3 , 7.3 , (this.width)*0.3 +2*this.scale, j*this.scale , 48 , 48)
                this.assets.draw(165.4 , 59.3 , 7.3 , 7.3 , (this.width)*0.3 +3*this.scale, (j-1)*this.scale , 48 , 48)
            }
            this.assets.draw(156.4 , 50.3 , 7.3 , 7.3 , (this.width)*0.3 +3*this.scale, Math.floor(this.height/this.scale)*(0.7)*this.scale , 48 , 48)
            this.assets.draw(138.4 , 50.3 , 7.3 , 7.3 , (this.width)*0.3 , Math.floor(this.height/this.scale)*(0.7)*this.scale , 48 , 48)
            
            
            
            
            // --- Rendering Player ---
            let frame = Math.floor(this.players.animationTime / 20) % 3;
            if(this.players.keys["ArrowDown"] || this.players.keys["s"]){
                this.players.direction = 'down';
                if (frame === 0) {
                    this.players.render(25.3, 49.8, 15.49, 24, 46.5, 72);
                }
                else if (frame === 1) {
                    this.players.render(42.3, 49.8, 15.49, 24, 46.5, 72);
                }
                else{
                    this.players.render(8.3, 49.8, 15.49, 24, 46.5, 72);
                }
            }
            else if(this.players.keys["l"] || this.players.keys["d"]){
                this.players.direction = 'right';
                if (frame === 0) {
                    this.players.render( 42.3, 147.7 , 15.49 , 24 , 46.5 , 72);
                }
                else if (frame ===1){
                    this.players.render( 25.3, 147.7 , 15.49 , 24 , 46.5 , 72);
                }
                else{
                    this.players.render( 8.3, 147.7 , 15.49 , 24 , 46.5 , 72);
                }
            }
            else if(this.players.keys["j"] || this.players.keys["a"]){
                this.players.direction = 'left';
                if (frame === 0) {
                    this.players.render( 8.3, 114.8 , 15.49 , 24 , 46.5 , 72);
                }
                else if (frame ===1){
                    this.players.render( 25.3, 114.8 , 15.49 , 24 , 46.5 , 72);
                }
                else{
                    this.players.render( 42.3, 114.8 , 15.49 , 24 , 46.5 , 72);
                }
            }
            else if(this.players.keys["ArrowUp"] || this.players.keys["w"]){
                this.players.direction = 'up';
                if (frame === 0) {
                    this.players.render( 8.3, 82.8 , 15.49 , 24 , 46.5 , 72);
                }
                else if (frame ===1){
                    this.players.render( 25.3, 82.8 , 15.49 , 24 , 46.5 , 72);
                }
                else{
                    this.players.render( 42.3, 82.8 , 15.49 , 24 , 46.5 , 72);
                }
            }
            else{
                if(this.players.direction === 'down'){
                    this.players.render(25.3, 49, 15.49, 24, 46.5, 72);
                }
                if(this.players.direction === 'up'){
                    this.players.render( 25.3, 82.8 , 15.49 , 24 , 46.5 , 72);
                }
                if(this.players.direction === 'left'){
                    this.players.render( 25.3, 114.8 , 15.49 , 24 , 46.5 , 72);
                }
                if(this.players.direction === 'right'){
                    this.players.render( 25.3, 147.7 , 15.49 , 24 , 46.5 , 72);
                }
            }

            // let bushes = []
            
            
            // --- Rendering bushes ---
            for(let i=2; i<Math.floor(this.width*0.99/this.scale);++i){
                for(let j=1 ; j < Math.floor(this.height * 0.7 / this.scale) ; ++j){        
                    if(!(i>Math.floor(this.width*0.25/this.scale) && i<Math.floor(this.width*0.4/this.scale))){
                        if(j < Math.floor(this.height * 0.45/this.scale)){
                            this.assets.draw(6, 81, 16, 16, 48 * i, 48 * j, 48, 48);
                            let x = 48 * i;
                            let y = 48 * j;
                            // bushes.push({x, y});
                        }
                        else{
                            if(i > Math.floor(this.width * 0.58 / this.scale)){
                                this.assets.draw(6, 81, 16, 16, 48 * i, 48 * j, 48, 48);
                                // let x = 48*i;
                                // let y = 48*j;
                                // bushes.push({x,y});
                            }
                        }
                    }
                }
            }
            // console.log(bushes);
                
                
            // --- Rendering trees ---
            for (let i = 0; i < this.width / this.scale; ++i) {
                for (let j = -0.5; j < this.height / this.scale; j += 0.5) {
                    if (j == -0.5) {
                        if(i!==Math.floor((this.width * 0.2)/this.scale)+1 && i!==Math.floor((this.width * 0.2)/this.scale)+2 && i!==Math.floor((this.width * 0.2)/this.scale)+3){
                            this.colliderAssets.draw(94, 28, 32, 52, 64 * i, 104 * j, 64, 104);
                        }
                    } 
                    else if (j >= Math.floor(((this.height*(0.46) )/ this.scale))){
                        if(i<Math.floor((this.width * 0.44)/this.scale)+1){
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
            for(let i=Math.floor(this.width * 0.7 / this.scale);i<=(Math.floor(this.width * 0.7 / this.scale)+10);++i){
                for(let j=Math.floor(this.height * 0.7/this.scale);j<=(Math.floor(this.height * 0.7/this.scale)+6);++j){
                    this.assets.draw(21.4 , 4 , 15 , 14.4 , i*this.scale , j*this.scale , 48 , 48)
                }
            }
            
            
            
            this.colliderAssets.draw(110.3 , 104.3 , 7.4 , 7.4 , Math.floor(this.width * 0.7 / this.scale)*this.scale ,Math.floor(this.height * 0.7/this.scale)*this.scale , 48 , 48)
            for(let i=1; i<10;++i){
                this.colliderAssets.draw(119.3 , 104.3 , 15 , 3 , (Math.floor(this.width * 0.7 / this.scale)+i)*this.scale ,Math.floor(this.height * 0.7/this.scale)*this.scale , 48 , 24)
            }
            this.colliderAssets.draw(136.2 , 104.3 , 7.4 , 7.4 , (Math.floor(this.width * 0.7 / this.scale)+10)*this.scale ,Math.floor(this.height * 0.7/this.scale)*this.scale , 48 , 48)
            for(let j=1; j<7; ++j){
                this.colliderAssets.draw(110.3 , 113.3 , 4 , 7.4 , Math.floor(this.width * 0.7 / this.scale)*this.scale ,(Math.floor(this.height * 0.7/this.scale)+j)*this.scale , 24 , 48)
                this.colliderAssets.draw(139.3 , 113.8 , 4 , 6.4 , (Math.floor(this.width * 0.7 / this.scale)+10.33)*this.scale ,(Math.floor(this.height * 0.7/this.scale)+j)*this.scale , 32 , 48)
            }
            
            // --- Rendering buildings ---
            this.colliderAssets.draw(8 , 158 , 80 , 72 , 240 , 462 , 240 , 210);
            this.colliderAssets.draw(14 , 340 , 112 , 90 , 810 , 414 , 336 , 270);


            // --- Rendering instructions ---
            if(this.players.x >= 305 && this.players.x <= 345 && this.players.y >= 630 && this.players.y <=670){

                const menuX = this.width * 0.2;
                const menuY = this.height * 0.05;
                const menuWidth = this.width * 0.6;
                const menuHeight = this.height * 0.9;   

                this.menus.draw(299, 6, 156, 43, menuX, menuY, menuWidth, menuHeight); 

                const textX = menuX + this.width * 0.02;
                const textStartY = menuY + this.height * 0.1;
                const lineHeight = this.height * 0.055;
                
                this.ctx.fillText('INSTRUCTIONS :-', textX, textStartY);
                this.ctx.fillText('1.) Go in front of main building to', textX, textStartY + lineHeight * 1);
                this.ctx.fillText('choose your starter pokemon.', textX, textStartY + lineHeight * 2);
                this.ctx.fillText('2.) Navigate through menu screens', textX, textStartY + lineHeight * 3);
                this.ctx.fillText('using arrow keys and enter to', textX, textStartY + lineHeight * 4);
                this.ctx.fillText('proceed through them.', textX, textStartY + lineHeight * 5);
                this.ctx.fillText('3.) Movements through w,a,s,d!', textX, textStartY + lineHeight * 6);
                this.ctx.fillText('4.) After you get your starter buddy', textX, textStartY + lineHeight * 7);
                this.ctx.fillText(',you can go to the bushes to find and', textX, textStartY + lineHeight * 8);
                this.ctx.fillText('fight with wild pokemons.', textX, textStartY + lineHeight * 9);
                this.ctx.fillText('5.) Just move to remove this screen', textX, textStartY + lineHeight * 10);
                this.ctx.fillText('and if you again want to read', textX, textStartY + lineHeight * 11);
                this.ctx.fillText('come back here again', textX, textStartY + lineHeight * 12);
            }            


            // --- Rendering dialogs ---
            if(this.players.x >=940 && this.players.x <=999 && this.players.y >= 660 && this.players.y <= 690 ){
                this.menus.draw(297 , 3.9 , 159 , 48  , this.width*(0.2), this.height * (0.8), this.width * (0.6) ,  this.height*(0.15));
                this.ctx.fillStyle = "Black";
                if(this.dialog === 0){
                    this.ctx.fillText('Choose one of the Three Starters --- ' , this.width * (0.2) + 40,  this.height*(0.8) + 60)
                    this.ctx.fillText('Press ENTER!! ' , this.width * (0.2) + 40,  this.height*(0.8) + 100)
                }
                else if(this.dialog === 1){
                    this.ctx.fillText('Pikachu' , this.width * (0.25) ,  this.height*(0.8) + 85)
                    this.ctx.fillText('Rayquaza' , this.width * (0.45) ,  this.height*(0.8) + 85)
                    this.ctx.fillText('Random' , this.width * (0.65) ,  this.height*(0.8) + 85)
                    this.menus.draw(269 , 3.9 , 5 , 9.2 , this.arrow_posx , this.arrow_posy ,50,50);
                }
                else if(this.dialog === 2){
                    this.ctx.fillText(`You Chose ${this.starter_name}!` , this.width * (0.25) ,  this.height*(0.8) + 85)
                }
            }

                
        }

        else if (this.scene === 'battle'){
            this.battle.render()
        }
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

    async update() {
        if(this.scene === 'world'){

            this.players.update();
            this.render();
            requestAnimationFrame(this.update); // To loop again and again
        }
        else if(this.scene === 'battle'){
            if(!this.setupDone){
                await this.battle.setup()
                this.setupDone = true
            }
            this.battle.update();
            // if(this.battle.scene === 'world'){
            //     this.scene = 'world';          // switch back to world
            //     this.setupDone = false;       // reset for next battle
            //     this.audio.src = 'assets/town.mp3';
            //     this.audio.play();
            
            // }
        }
    }

    controls(){
        window.onkeydown = (e)=>{
            if(e.key === 'Enter'){
                if(this.battle.arrow_posx === 1560 && this.battle.arrow_posy === 860){
                    this.scene = 'world'
                    // console.log(this.scene)
                }
                if(this.players.x >=940 && this.players.x <=999 && this.players.y >= 660 && this.players.y <= 690 && this.dialog ===0){
                    setTimeout(()=>{
                        this.dialog = 1;
                    }, 200)
                }
                if(this.players.x >=940 && this.players.x <=999 && this.players.y >= 660 && this.players.y <= 690 && this.dialog ===1){
                    setTimeout(async()=>{
                    this.dialog = 2;
                    if(this.arrow_posx === this.width * (0.25) - 60){
                        this.starter_name = 'pikachu'
                        this.battle.starter_name = 'pikachu'
                        await this.dataGet('pikachu');
                        this.battle.starterData = this.data
                        this.players.has_starter = true
                    }
                    if(this.arrow_posx === this.width * (0.45) - 60){
                        this.starter_name = 'rayquaza'
                        this.battle.starter_name = 'rayquaza'
                        await this.dataGet('rayquaza');
                        this.battle.starterData = this.data
                        this.players.has_starter = true
                    }
                    if(this.arrow_posx === this.width * (0.65) - 60){
                        let randint = Math.floor(Math.random() * 199.99)
                        this.randomStarter = this.pokemonNames[randint]
                        this.starter_name = this.randomStarter
                        this.battle.starter_name = this.randomStarter
                        await this.dataGet(this.randomStarter);
                        this.battle.starterData = this.data
                        this.players.has_starter = true
                    }
                },200)
                }
            }
            if(e.key === 'ArrowLeft'){
                if(this.arrow_posx === this.width * (0.45) - 60){
                    this.arrow_posx = this.width * (0.25) - 60
                }
                if(this.arrow_posx === this.width * (0.65) - 60){
                    this.arrow_posx = this.width * (0.45) - 60
                }
            }
            if(e.key === 'ArrowRight'){
                if(this.arrow_posx === this.width * (0.45) - 60){
                    this.arrow_posx = this.width * (0.65) - 60
                }
                if(this.arrow_posx === this.width * (0.25) - 60){
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
            setTimeout(()=>{
            ctx.clearRect(0,0,window.innerWidth , window.innerHeight);
            ctx.drawImage(image, 0, 0, window.innerWidth, window.innerHeight);
            resolve() }, 500)
        };
    });
}




window.addEventListener('load' , async function(){
    const canvas = document.getElementById('map');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let myAudio = document.getElementById('audio')
    

    if(!IntroDone){
        myAudio.src = 'assets/opening.mp3'
        myAudio.play()
        await IntroShow(ctx , 'assets/image1.png')
        await IntroShow(ctx , 'assets/image2.png')
        await IntroShow(ctx , 'assets/image3.png')
        await IntroShow(ctx , 'assets/image4.png')
        ctx.font = `${Math.floor(canvas.height * 0.05)}px 'Press Start 2P', sans-serif`
        ctx.fillStyle = 'White'
        ctx.fillText('Press ENTER to start!!' , canvas.width * (0.02) , canvas.height * (0.77))
        window.addEventListener('keydown' , (e)=>{
            if(!IntroDone && e.key === 'Enter'){
                ctx.clearRect(0,0,window.innerWidth , window.innerHeight)
                IntroDone = true
                myAudio.pause()
                const game = new Game(canvas , ctx);
        
                game.render();
                game.players.setup();
                game.controls();
                game.battle.controls();
                game.update();

            }
        })
        
    }
    else{
        const game = new Game(canvas , ctx);
        
        game.render();
        game.players.setup();
        game.controls();
        game.battle.controls();
        game.update();
    }


})