export class Message {
    constructor(public sender: string,
                public receiver: string,
                public message: string,
                public date_sent: Date,
                public _id?: string
    ) {}
}
