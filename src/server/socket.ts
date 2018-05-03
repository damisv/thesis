import {Server} from 'socket.io';
import DbClient = require('./database/dbClient');
import * as assert from 'assert';
import {DbKeys} from './database/utils';
const jwt = require('jsonwebtoken');

export class IOServer {
  // Protected properties
  protected io: Server;

  // Private properties
  private clients = {};
  private projects = {};
  public num = 5;

  constructor(io: Server) {
    this.io = io;
    this.listen();
  }

  // Private methods
  private listen() {
    this.io.on('connection', (socket: any) => {
      console.log('Connected client on port TRALALALALALA.');
      socket.on('register', data => this.onRegister(socket, data));
    });
  }

  private async onRegister(socket, data) {
    console.log('register ' + socket.id);
    try {
      const decoded = await jwt.verify(data, 'secret');
      assert.notEqual(null, decoded);
      const email = decoded.info.email;
      this.clients[email] = socket;
      socket.emit('loginSuccessful');
      const result = await DbClient.find({'team.email': email}, DbKeys.projects, {_id: 1, name: 1});
      assert.notEqual(null, result);
      result.forEach(project => {
        socket.join(project._id);
        this.projects[project._id] = project.name;
      });
      socket.emit('connected');
      console.log('connected ' + email);
    } catch (error) { console.log('emit login error'); socket.emit('loginError'); }
  }

  // Public Methods
  public addProject(id, name) { this.projects[id] = name; }

  public inviteMemberToProject(projectID, notifications: any[]) {
    const projectName = this.projects[projectID];
    notifications.forEach(notification => {
      console.log('invite' + notification.email);
      this.io.to(this.clients[notification.email].id).emit('Invitation', projectName, notification);
    });
  }

  public taskAssignedToMembers(projectID, task , assignees) {
    assignees.forEach(assignee => {
      this.io.to(this.clients[assignee].id).emit('taskAssigned', this.projects[projectID], task);
    });
  }
  public memberJoinedProject(projectID, email) {
    this.io.to(projectID).emit('memberJoined', this.projects[projectID], email);
    /// add user in room/project
    this.clients[email].join(projectID);
  }

  /// add user in room/project
  public joinRoom(roomID, email) {
    console.log('join room1');
    console.log('email ' + email);
    console.log('room id ' + roomID);
    this.clients[email].join(roomID);
    console.log('join room2');
  }

  public sentMessage(receiver, message_id) {
    this.io.to(this.clients[receiver]).emit('message', message_id);
  }
  public sentMessageProject(receiver, message_id) {
    this.io.to(receiver).emit('projectMessage', message_id);
  }
}
