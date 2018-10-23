import {WEBSOCKET_CONNECT, WEBSOCKET_SEND} from '../middleware/websocket';
export const MESSAGE_RECEIVED = 'MESSAGE_RECEIVED';
export const CHAT_MESSAGE = 'CHAT_MESSAGE';
export const USER_JOINED = 'USER_JOINED';
export const USER_STATS = 'USER_STATS';
export const USER_LEFT = 'USER_LEFT';

let uid = 0

const eventToActionAdapters = {
  CHAT_MESSAGE: ({id, timestamp, payload:{user, message}}) =>
  ({ type:MESSAGE_RECEIVED, payload:{ id, timestamp, user, message }}),
  USER_STATS: ({payload}) => ({type: USER_STATS, payload}),
  USER_LEFT: ({payload}) => ({type: USER_LEFT, payload})
};

const parseMsg = ({clerkName, message}) => ({
  type: MESSAGE_RECEIVED,
  payload:{ id: uid++, timestamp: Date.now(), user: clerkName, message }
})

export function messageToActionAdapter(msg){
  const event = JSON.parse(msg.data);
  return parseMsg(event)
}

export function connectToChatServer(url) {
  return dispatch => {
    dispatch({type: WEBSOCKET_CONNECT, payload: {url}});
  }
}

function overTheSocket(type, payload) {
  return {
    type: WEBSOCKET_SEND,
    payload: {
      "registrationRequestUuid": "b9ed0585-144a-4076-8ab6-6bbe5cea5798",
      "carAlias": "myCar1",
      "message": payload.message,
      "userName": "Jan Kowalski"
    }
  };
}


function doubleDispatch(type, payload){
 return dispatch => {
   dispatch(overTheSocket(type, payload));
   dispatch({type, payload});
 }
}

export function sendMessage(user, message) {
  return dispatch => {
    dispatch(overTheSocket(CHAT_MESSAGE,{user, message}));
  }
}

export function joinChat(user) {
  return {
    type: USER_JOINED,
    payload: {user}
  };
}
