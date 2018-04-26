export class Message {
    constructor(public _id: string,
                public sender: string,
                public receiver: string,
                public message: string,
                public date_sent: Date
    ) {}
}
