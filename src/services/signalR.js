import { HubConnectionBuilder } from '@microsoft/signalr';

let connection;

export const startSignalRConnection = () => {
  connection = new HubConnectionBuilder()
    .withUrl('https://cricxi.onrender.com/contestHub')
    .withAutomaticReconnect()
    .build();

  connection.start()
    .then(() => console.log('SignalR Connected'))
    .catch(err => console.error('SignalR Connection Error: ', err));

  return connection;
};

export const subscribeToContestUpdates = (callback) => {
  connection.on('ReceiveContestUpdate', (contestId) => {
    callback(contestId);
  });
};