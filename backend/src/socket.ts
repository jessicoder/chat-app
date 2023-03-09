import { Server as HttpServer } from 'http';
import { Socket, Server } from 'socket.io';

interface SocketUser {
  socketID: string;
  uid: string;
  uname: string;
  room: string;
}

export class SocketServer {
  public static instance: SocketServer;
  public io: Server;
  public users: { [id: string]: SocketUser } = {};

  constructor(server: HttpServer) {
    SocketServer.instance = this;
    this.io = new Server(server, {
      serveClient: false,
      pingInterval: 10000,
      pingTimeout: 5000,
      cookie: false,
      cors: {
        origin: '*',
      },
    });

    this.io.on('connect', this.startListeners);

    console.info('Socket IO started');
  }

  startListeners = (socket: Socket) => {
    console.info('Connection received from ' + socket.id);

    socket.on('joinroom', (userID, username, room) => {
      this.users[socket.id] = {
        socketID: socket.id,
        uid: userID as string,
        uname: username as string,
        room: room as string,
      };

      socket.join(room);
      socket.broadcast.emit(
        'joinningannoucement',
        `${username} has joined the chat`,
      );
    });

    socket.on('sendmessage', (msg) => {
      const currUser = this.users[socket.id];

      if (currUser === undefined) {
        console.info("User isn't jonning any room");
        return;
      }

      socket.to(currUser.room).emit('receivemessage', {
        userID: currUser.uid,
        username: currUser.uname,
        room: currUser.room,
        message: msg,
      });
    });

    socket.on('disconnect', () => {
      console.info('Disconnect received from ' + socket.id);
      const currUser = this.users[socket.id];
      socket.leave(currUser.room);

      const deleted = delete this.users[socket.id];
      if (!deleted) {
        console.info(`Can not delete ${currUser.uid}`);
      }
    });
  };
}
