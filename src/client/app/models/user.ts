export class User {
    constructor(public email: string,
                public username?: string,
                public firstName?: string,
                public lastName?: string,
                public address?: string,
                public city?: string,
                public country?: string,
                public description?: string
    ) {}
}
