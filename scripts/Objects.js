export class Object{
    constructor(game , path){
        this.game = game
        this.image = new Image();
        this.image.src = path;

        this.loaded = false;
        this.image.onload = ()=>{
            this.loaded = true;
        }

    }
    draw(posx , posy , swidth , sheight , dx , dy ,  dwidth , dheight){
        if (this.loaded ){
            this.game.ctx.drawImage(this.image, posx , posy , swidth , sheight , dx , dy , dwidth , dheight );
        }
    }
}

export class CollidingObject{
    constructor(game , path){
        this.game = game
        this.image = new Image();
        this.image.src = path;

        this.loaded = false;
        this.image.onload = ()=>{
            this.loaded = true;
        }

    }
    draw(posx , posy , swidth , sheight , dx , dy ,  dwidth , dheight){
        if (this.loaded ){
            this.game.ctx.drawImage(this.image, posx , posy , swidth , sheight , dx , dy , dwidth , dheight );
        }
    }
}