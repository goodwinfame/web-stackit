import express from 'express';
import http from 'http';
import socket from 'socket.io';
import Response from './Response';
import Bash from './Bash';
import { STServer } from "./types/Server";

const app = express();
const server = http.createServer(app);
const io = socket(server);


app.use(express.static('./build'))


io.on('connection', function(client){
    const bash = bindBashEvents(new Bash(client.id));

    client.on('action', function(action: STServer.request){
        /**
         * 消息过滤，非action对象过滤掉
         * action: {type,payload}
         *  */

        bash.process(action);

        //正在处理指令
        ioSender(client.id, new Response(bash.getState()));

    });

    client.on('disconnect', (reason) => {
        bash.destroy();
    });
});


server.listen(8080, function(){
  console.log('server started');
})


function ioSender(id: string, data: Response, type = 'message') {
    io.to(id).emit(type, data);
}

function bindBashEvents(bash: Bash) {

    //命令行绑定事件回调
    bash.on(function (data: Response) {
        ioSender(bash.getId(), data)
    });

    return bash;
}