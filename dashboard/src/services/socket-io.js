import openSocket from "socket.io-client";
import { getBackendUrl } from "../config";

function connectToSocket() {
    return openSocket("http://localhost:3000");
}

export default connectToSocket;