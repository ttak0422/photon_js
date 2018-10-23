import Room from './room';
import Actor from './Actor';

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
    }

    onActorJoin(actor : Actor){
        console.log(`Actor ${actor.actorNr} が入室しました`);
    }

    onActorLeave(actor : Actor){
        console.log(`Actor ${actor.actorNr} が退出しました`);
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

}