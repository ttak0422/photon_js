import Client    from './client';
import Room      from './room';
import { Event } from './constants';

export default class Actor extends Photon.LoadBalancing.Actor {
    client  : Client;
    name    : string;
    actorNr : number;
    isLocal : boolean;


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

}