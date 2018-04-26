export class Notification {
    constructor(public email: string,
                public type: string,
                public link: [string],
                public date: Date,
                public status: string,
                public _id: string
    ) {}
}
