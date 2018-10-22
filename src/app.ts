import CONFIG from './config';
import Client from './Client';
const APP_WSS     = CONFIG.photon.Wss;
const APP_ID      = CONFIG.photon.Id;
const APP_VERSION = CONFIG.photon.Version;

const client = new Client(APP_WSS, APP_ID, APP_VERSION);
client.start();
