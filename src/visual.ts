import Actor from './actor';

export default class Visual {
    private canvas  : HTMLCanvasElement;
    private canvasW : number;
    private canvasH : number;
    private playerH : number;
    private playerW : number;

    private player : HTMLDivElement;

    constructor(actor : Actor){
        this.canvas  = <HTMLCanvasElement>document.getElementById('canvas');
        this.canvasW = this.canvas.width;
        this.canvasH = this.canvas.height;
        this.playerW = Math.floor(this.canvasW / 10);
        this.playerH = Math.floor(this.canvasH / 10);
        this.player  = this.generatePlayerObject();
        document.body.appendChild(this.player);
        this.update(actor.posX, actor.posY);
    }

    clear() : void {
        document.body.removeChild(this.player);
    }

    /**
     * 描写の更新
     * @param x 移動後の左上の頂点のx座標
     * @param y 移動後の左上の頂点のy座標
     */
    update(x : number, y : number) : void {
        this.player.style.top  = `${y}px`;
        this.player.style.left = `${x}px`;
    }

    // TODO : 色
    private generatePlayerObject() : HTMLDivElement {
        const newElem = document.createElement('div');
        newElem.className = 'player';
        newElem.style.backgroundColor = 'yellow';
        newElem.style.width  = `${this.playerW}px`;
        newElem.style.height = `${this.playerH}px`;
        newElem.style.position = 'absolute';
        newElem.style.zIndex = '1';
        return newElem;
    }

}