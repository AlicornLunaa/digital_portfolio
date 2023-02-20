export default class Boid {

    private x: number;
    private y: number;
    private vX: number = 0;
    private vY: number = 0;
    
    private width: number;
    private height: number;
    private sightRadius: number = 100;
    private border: number = 30;

    constructor(x: number, y: number, w: number, h: number){
        this.x = x;
        this.y = y;

        this.width = w;
        this.height = h;
    }

    public updateViewport(w: number, h: number){
        this.width = w;
        this.height = h;
    }
    
    public update(others: Boid[]){
        if(this.x >= this.width - this.border) this.vX -= 0.1;
        if(this.x <= this.border) this.vX += 0.1;

        if(this.y >= this.height - this.border) this.vY -= 0.1;
        if(this.y <= this.border) this.vY += 0.1;

        let centerX = 0;
        let centerY = 0;
        let separationX = 0;
        let separationY = 0;
        let matchX = 0;
        let matchY = 0;

        for(let b of others){
            let dist = Math.sqrt(Math.pow(b.x - this.x, 2) + Math.pow(b.y - this.y, 2));

            if(b == this) continue;
            if(dist < this.sightRadius){
                separationX -= (b.x - this.x);
                separationY -= (b.y - this.y);
            }

            centerX += b.x;
            centerY += b.y;
            matchX += b.vX;
            matchY += b.vY;
        }

        centerX /= others.length - 1;
        centerY /= others.length - 1;
        matchX /= others.length - 1;
        matchY /= others.length - 1;

        if(Math.sqrt(this.vX * this.vX + this.vY * this.vY) < 5){
            this.vX += ((centerX - this.x) / 10000) + (separationX / 5000) + ((matchX - this.y) / 100000);
            this.vY += ((centerY - this.y) / 10000) + (separationY / 5000) + ((matchY - this.y) / 100000);
        }

        this.x += this.vX * 0.1;
        this.y += this.vY * 0.1;
    }

    public avoid(x: number, y: number){
        let dist = Math.sqrt(Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2));
        let ang = Math.atan2(x - this.x, y - this.y);

        if(dist < this.sightRadius * 1.5){
            this.vX += Math.sin(ang) * -0.4;
            this.vY += Math.cos(ang) * -0.4;
        }
    }

    public avoidRect(x: number, y: number, w: number, h: number){
        let distX = ((x + w / 2) - this.x);
        let distY = ((y + h / 2) - this.y);
        
        if(this.x >= x && this.x <= x + w && this.y >= y && this.y <= y + h){
            this.vX -= 0.4 * Math.sign(distX);
            this.vY -= 0.4 * Math.sign(distY);
        }
    }

    public draw(ctx: CanvasRenderingContext2D){
        ctx.fillStyle = "#BBBBBB";
        ctx.strokeStyle = "#BBBBBB";
        ctx.lineWidth = 1.8;

        ctx.translate(this.x, this.y);
        ctx.rotate(Math.atan2(this.vY, this.vX) + (Math.PI / 2));
        ctx.scale(1, 1);
        
        ctx.beginPath();
        ctx.moveTo(5, 0);
        ctx.lineTo(0, 10);
        ctx.lineTo(10, 10);
        ctx.closePath();
        ctx.stroke();

        ctx.resetTransform();
    }

}