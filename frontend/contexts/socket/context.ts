import { Socket } from "socket.io-client";
import { createContext } from "vm";

export interface ISocketContextState {
  socket: Socket | undefined;
  uid: string;
  users: string[];
}

export const defaultSocketContextState: ISocketContextState = {
  socket: undefined,
  uid: '',
  users: [],
}

export type TSocketContextActions = 'update_socket' | 'update_uid' | 'update_users' | 'remove_user';

export type TSocketContextPayload = string | string[] | Socket;

export interface ISocketContextActions {
  type: TSocketContextActions;
  payload: TSocketContextPayload;
}

export const socketReducer = (state: ISocketContextState, action: ISocketContextActions) => {
   console.log(`Message Received - Action: ${action.type}, payload: ${action.payload}`);
   
   switch (action.type) {
    case 'update_socket':
       return { ...state, socket: action.payload as Socket};
    case 'update_uid':
        return { ...state, userid: action.payload as string};
    case 'update_users':
        return { ...state, users: action.payload as string[]};
    case 'remove_user':
        return { ...state, users:  state.users.filter((uid) => uid != (action.payload as string))};
    default:
      return { ...state};
   }
}
