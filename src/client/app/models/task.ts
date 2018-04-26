export class Task {
    constructor(
                public type: TaskType,
                public project_id?: string,
                public project_name?: string,
                public assigner_email?: string,
                public name?: string,
                public description?: string,
                public assignee_email?: string[],
                public dependencies?: [Dependency],
                public date_start?: Date,
                public date_end?: Date,
                public completed: boolean = false,
                public _id?: string,
                public date_created?: Date,
                ) {}

    hasRights(email: string): boolean {
      if (this.assigner_email && this.assignee_email) {
        console.log('WTF????');
        return this.assigner_email === email || this.assignee_email.findIndex(value => value === email) !== -1;
      }
      return false;
    }
}

export class Dependency {
  constructor(public taskID: string,
              public name: string,
              public type: string,
  ) {}
}

export enum TaskType { task = 0, issue = 1, feedback = 2 }


