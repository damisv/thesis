import {MongoClient} from 'mongodb';
import {DbKeys} from './utils';

class DbClient {
  /*
* Connection url's
* 1) Local host
* 2) mLab
 */
  //private url = 'mongodb://localhost:27017/project';
 private url = 'mongodb://admin:admin@ds135820.mlab.com:35820/pmthesis';

  //private dbName = 'project';
  private dbName = 'pmthesis';
  public db;

  public async connect() {
    try {
      const client = await MongoClient.connect(this.url);
      console.log('Connected successfully to database');
      this.db = client.db(this.dbName);
      await this.createCollections();
      return this.db;
    } catch (error) { console.log('MongoDB url host unreachable!'); }
  }

  // Scan/Query
  public findOne(query, collection) {
    return this.db.collection(collection).findOne(query);
  }
  public find(query, collection, projection = {}) {
    return this.db.collection(collection).find(query, projection).toArray();
  }
  // Insert
  public insertOne(data, collection) {
    return this.db.collection(collection).insertOne(data);
  }
  public insertMany(array, collection) {
    return this.db.collection(collection).insertMany(array);
  }
  // Update
  public update(query, set, collection) {
    return this.db.collection(collection).update(query, set);
  }
  public updateOne(query, set, collection) {
    return this.db.collection(collection).updateOne(query, set);
  }
  // Save
  public save(data, collection) {
    return this.db.collection(collection).save(data);
  }
  // Delete
  public deleteOne(data, collection) {
    return this.db.collection(collection).deleteOne(data);
  }

  // Private methods
  private async createCollections() {
    try {
      // Accounts
      await this.db.createCollection(DbKeys.accounts,
        { validator: { $and:
              [
                { password: { $exists: true} },
                { email: { $exists: true } }
              ]
          }
        });
      this.db.collection(DbKeys.accounts).createIndex({email: 1}, {unique: true});
      // User Profiles
      await this.db.createCollection(DbKeys.profiles,
        { validator: { $and:
              [
                { email: { $exists: true } }
              ]
          }
        });
      this.db.collection(DbKeys.profiles).createIndex({email: 1}, {unique: true});
      // Projects
      await this.db.createCollection(DbKeys.projects,
        { validator: { $and:
              [
                { team: { $exists: true }},
                { name: {$exists: true }}
              ]
          }
        });
      // Invites
      await this.db.createCollection(DbKeys.invites,
        { validator: { $and:
              [
                { project: { $exists: true }},
                { invites: {$exists: true }}
              ]
          }
        });
      await this.db.collection(DbKeys.invites).createIndex({project: 1, invites: 1}, {unique: true});
      // Task
      await this.db.createCollection(DbKeys.tasks,
        { validator: { $and:
              [
                { project_id: { $exists: true }},
                { assigner_email: { $exists: true }},
                { assignee_email: {$exists: true }},
                { name: { $exists: true }},
                { description: { $exists: true }},
                { date_created: {$exists: true }},
                { date_start: {$exists: true }},
                { date_end: {$exists: true }},
                { completed: {$exists: true }}
              ]
          }
        });
      // Chat
      await this.db.createCollection(DbKeys.chat,
        { validator: { $and:
              [
                { sender: { $exists: true }},
                { receiver: {$exists: true }},
                { date_sent: {$exists: true }},
                { message: {$exists: true }}
              ]
          }
        });
      // Team
      await this.db.createCollection(DbKeys.team,
        { validator: { $and:
              [
                { name: { $exists: true }},
                { members: {$exists: true }}
              ]
          }
        });
      // Timeline
      await this.db.createCollection(DbKeys.timeline);
      // Notifications
      await this.db.createCollection(DbKeys.notifications,
        { validator: { $and:
              [
                { email: { $exists: true }},
                { type: { $exists: true }},
                { link: {$exists: true }},
                { date: {$exists: true }},
                { status: {$exists: true }}
              ]
          }
        });
      // Calendar Events
      await this.db.createCollection(DbKeys.calendar,
        { validator: { $and:
              [
                { start: { $exists: true }},
                { end: { $exists: true }},
                { title: { $exists: true }}
              ]
          }
        });
      // Settings
      await this.db.createCollection(DbKeys.settings,
        { validator: { $and:
              [
                { email: { $exists: true }}
              ]
          }
        });
      this.db.collection(DbKeys.settings).createIndex({email: 1}, {unique: true});
      console.log('SUCCESS CREATING COLLECTIONS');
    } catch { console.log('CREATING COLLECTIONS FAILED'); }
  }

}

export = new DbClient();
