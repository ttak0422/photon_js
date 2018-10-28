import Client    from './client';
import Visual    from './visual';
import { Event } from './constants';

export default class Actor extends Photon.LoadBalancing.Actor {
    client  : Client;
    name    : string;
    actorNr : number;
    isLocal : boolean;

    private visual : Visual;
    private readonly speed : number = 10;

    public posX = 0;
    public posY = 0;

    constructor(client : Client, name : string, actorNr : number, isLocal : boolean){
        super(name, actorNr, isLocal);
        this.client  = client;
        this.name    = name;
        this.actorNr = actorNr;
        this.isLocal = isLocal;
    }

    getRoom(){
        return super.getRoom();
    }

    hasVisual(){
        return !!(this.visual);
    }

    setVisual(visual : Visual){
        this.visual = visual;
        this.visual.update(this.posX, this.posY);
    }

    clearVisual(){
        if(!!this.visual){
            this.visual.clear();
        }
    }

    /**
     * クライアントによるアクターの更新
     */
    update(){
        if(this.isLocal){
            this.updateLocal();
        }else{
            this.updateRemote();
        }
    }

    /**
     * 自アクターの更新
     */
    updateLocal(){
        console.log("updateLocal");
    }

    /**
     * 他アクターの更新
     */
    updateRemote(){
        console.log("updateRemote");
    }

    /**
     * 移動処理を行う
     * @param nxtPosX 移動後のx座標
     * @param nxtPosY 移動後のy座標
     */
    move(nxtPosX : number, nxtPosY : number){
        this.posX = nxtPosX;
        this.posY = nxtPosY;
        if(this.visual){
            this.visual.update(nxtPosX, nxtPosY);
        }
    }

    /**
     * 移動処理の呼び出し，Moveイベントの発行を行う．
     * @param x -1, 0, 1
     * @param y -1, 0, 1
     */
    moveLocal(x : number, y : number){
        const nxtPosX = this.posX + this.speed * x;
        const nxtPosY = this.posY + this.speed * y;
        this.move(nxtPosX, nxtPosY);
        this.raiseEvent(Event.Move, { 0 : [nxtPosX, nxtPosY] });
    }

}