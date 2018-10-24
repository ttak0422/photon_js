import Client    from './client';
import Room      from './room';
import { Event } from './constants';
import Visual from './visual';

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

    // TODO: 見直し
    move(x : number, y : number){
        this.posX += this.speed * x;
        this.posY += this.speed * y;
        if(this.visual){
            this.visual.update(this.posX, this.posY);
        }
    }

    moveLocal(x : number, y : number){
        this.raiseEvent(Event.Move, { 1 : [this.posX, this.posY] });
        this.move(x, y);
    }

    moveRemote(){

    }

}