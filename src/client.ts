import Room      from './room';
import Actor     from './Actor';
import Visual    from './visual';
import { Event } from './constants';

// TODO: 途中から入ると他のプレイヤーの位置が(0,0)

export default class Client extends Photon.LoadBalancing.LoadBalancingClient {
    wss     : boolean;
    id      : string;
    version : string;

    autoConnect : boolean = true;
    masterStart : boolean = false;

    private timerToken : number = null;
    private readonly intervalTime : number = 1000;

    constructor(wss : boolean, id  : string, version : string){
        super(wss ? Photon.ConnectionProtocol.Wss : Photon.ConnectionProtocol.Ws, id, version);
        this.wss     = wss;
        this.id      = id;
        this.version = version;

        const addr = this.masterStart ? this.getMasterServerAddress() : this.getNameServerAddress();
        console.log(`Init addr : ${addr}, id : ${id}, version : ${version}`);

        this.myActor().setName(`Actor_${Math.floor(Math.random() * 10000)}`);
    }

    roomFactory(name : string){
        return new Room(name);
    }

    actorFactory(name : string, actorNr : number, isLocal : boolean){
        return new Actor(this, name, actorNr, isLocal);
    }

    myRoom(){
        return <Room>super.myRoom();
    }

    myActor(){
        return <Actor>super.myActor();
    }

    myRoomActors(){
        return <Room>super.myRoomActors();
    }

    onJoinRoom(){
        console.log(`Room[${this.myRoom().name}]に入室しました`);
        this.setupScene();
    }

    onActorJoin(actor : Actor){
        console.log(`Actor ${actor.actorNr} が入室しました`);
        if(!actor.hasVisual()) actor.setVisual(new Visual(actor));
    }

    onActorLeave(actor : Actor){
        if(!actor.isLocal){
            actor.clearVisual();
        }
        console.log(`Actor ${actor.actorNr} が退出しました`);
    }

    onEvent(code : number, content : any, actorNr : number){
        switch(code){
            case Event.Move:
                const actor = <Actor>(this.myRoomActors()[actorNr]);
                actor.move(content[0][0], content[0][1]);
                console.log(`Event.Move ${content[0][0]} ${content[0][1]}`)
                break;
            default:
                break;
        }
    }

    onStateChange = (() => {
        const LBC = Photon.LoadBalancing.LoadBalancingClient;
        return (state) => {
            const stateText =
                state == LBC.State.Joined ?
                    `State: ${LBC.StateToName(state)}, RoomName: ${this.myRoom().name}` :
                    `State: ${LBC.StateToName(state)}`;
            console.log(stateText);
            switch(state){
                case LBC.State.ConnectedToNameServer:
                    this.getRegions();
                    this.connectToRegionMaster("JP");
                    break;
                case LBC.State.ConnectedToMaster:
                    // this.WebRpc("GetGameList");
                    break;
                case LBC.State.JoinedLobby:
                    if(this.autoConnect){
                        console.log(`joining random room ...`);
                        this.joinRandomRoom();
                        console.log(`RoomName: ${this.myRoom().name}`);
                    }
                    break;
                default:
                    break;
            }
        };
    })();

    onOperationResponse(errorCode : number, errorMessage : string, code : number, content : any) {
        if(errorCode){
            switch(code){
                case Photon.LoadBalancing.Constants.OperationCode.JoinRandomGame:
                    switch(errorCode){
                        case Photon.LoadBalancing.Constants.ErrorCode.NoRandomMatchFound:
                            console.log(`Join Random ${errorCode} : 入室できる部屋が見つからなかったので部屋を作成して入室します．`);
                            this.createRoom();
                            break;
                        default:
                            console.log(`Join Random ${errorCode}`);
                            break;
                    }
                default:
                    console.log(`Operarion Response Error ${errorCode}, ${errorMessage}, ${code}, ${content}`);
                    break;
            }
        }
    }

    start(){
        this.setCustomAuthentication("username=" + "yes" + "&token=" + "yes");
        if(this.masterStart){
            this.connect({ keepMasterConnection : true });
        }else{
            this.connectToRegionMaster("JP");
        }

        this.setupUI();
        this.setupScene();

        this.timerToken = setInterval(() => {
            this.update();
        }, this.intervalTime);
    }

    stop(){
        if(this.timerToken != null) clearInterval(this.timerToken);
    }

    update(){
        for(let x in this.myRoomActors()){
            if(x === "-1") break; // 誰もいない
            this.myRoomActors()[x].update();
        }
    }

    private setupUI(){
        window.addEventListener("keydown", ( () => {
            const key = {
                37 : [-1, 0], //left
                39 : [ 1, 0], //right
                40 : [ 0, 1], //down
                38 : [ 0,-1], //up
            };
            return (e) => {
                if(key[e.keyCode]){
                    const [x, y] = key[e.keyCode];
                    this.myActor().moveLocal(x, y);
                }
            }
        })());
    }

    private setupScene(){
        for(let aNr in this.myRoomActors()){
            const actor = <Actor>this.myRoomActors()[aNr];
            if(!actor.hasVisual()) actor.setVisual(new Visual(actor));
        }
    }

}