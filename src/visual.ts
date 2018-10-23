import Actor from "./actor";

// TODO: 不要にnew Visualされている

export default class Visual {
    private canvas  : HTMLCanvasElement;
    private canvasW : number;
    private canvasH : number;
    private context : CanvasRenderingContext2D;
    private prePosX : number = 0;
    private prePosY : number = 0;
    private playerH : number;
    private playerW : number;

    constructor(actor : Actor){
        this.canvas  = <HTMLCanvasElement>document.getElementById('canvas');
        this.canvasW = this.canvas.width;
        this.canvasH = this.canvas.height;
        this.context = <CanvasRenderingContext2D>this.canvas.getContext('2d');
        this.playerW = this.canvasW / 10;
        this.playerH = this.canvasH / 10;
    }

    update(x : number, y : number){
        this.context.clearRect(this.prePosX, this.prePosY, this.prePosX + this.playerW, this.prePosY + this.playerH);
        this.context.fillRect(x, y, x + this.playerW, y + this.playerH);
        this.prePosX = x;
        this.prePosY = y;
    }

}