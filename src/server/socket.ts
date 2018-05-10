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
      console.log('Connected client');
      socket.emit('connected');
      socket.on('register', data => this.onRegister(socket, data));
      socket.on('joinProject', data => socket.join(data));
    });
  }

  private async onRegister(socket, data) {
    console.log('register ' + socket.id);
    try {
      const decoded = await jwt.verify(data, 'secret');
      assert.notEqual(null, decoded);
      const email = decoded.info.email;
      this.clients[email] = socket.id;
      socket.emit('loginSuccessful', email);
      const result = await DbClient.find({'team.email': email}, DbKeys.projects, {_id: 1, name: 1});
      assert.notEqual(null, result);
      result.forEach(project => {
        socket.join(project._id);
        this.projects[project._id] = project.name;
      });
      console.log('connected ' + email);
    } catch (error) { console.log('emit login error'); socket.emit('loginError'); }
  }

  // Public Methods
  public addProject(id, name) { this.projects[id] = name; }

  public inviteMemberToProject(projectID, notifications: any[]) {
    notifications.forEach(notification => {
      if (this.clients[notification.email]) {
        this.io.to(this.clients[notification.email]).emit('invitation', notification);
      }
    });
  }

  public newTaskArrived(task) {
    this.io.to(task.project_id).emit('taskArrived', task);
  }

  public taskEdited(task) {
    this.io.to(task.project_id).emit('taskEdited', task);
  }

  public taskAssignedToMembers(task) {
    task.assignee_email.forEach(assignee => {
      if (this.clients[assignee]) {
        this.io.to(this.clients[assignee]).emit('taskAssigned', this.projects[task.project_id], task);
      }
    });
  }
  public memberJoinedProject(projectID, email) {
    this.io.to(projectID).emit('memberJoined', this.projects[projectID], email);
    /// add user in room/project
    if (this.clients[email]) {
      this.io.to(this.clients[email]).emit('joinProject', projectID);
    }
    console.log('try join project');
  }

  /// add user in room/project
  public joinRoom(roomID, email) {
    if (this.clients[email]) {
      this.io.to(this.clients[email]).emit('joinProject', roomID);
    }
    console.log('try join room');
  }

  public sentMessage(receiver, message_id) {
    if (this.clients[receiver]) {
      this.io.to(this.clients[receiver]).emit('message', message_id);
    }
  }
  public sentMessageProject(receiver, message) {
    this.io.to(receiver).emit('projectMessage', message);
  }
}
