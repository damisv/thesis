export class Notification {
    constructor(public email: string,
                public type: string,
                public link: [string],
                public date: Date,
                public status: string,
                public _id: string
    ) {}
}

export class NotificationSettings {
  constructor(public myTask: string,
              public memberJoined: string,
              public invite: [string],
              public message: Date,
              public error: string,
              public _id: string
  ) {}
}
