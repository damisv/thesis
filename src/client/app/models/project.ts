export enum ProjectPosition {
  manager = 0, member  = 1
}

export class Member {
    constructor(public position: ProjectPosition,
                public email: string,
                public status?: string) {}
}

export class Project {
    constructor(
        public name: string,
        public _id?: string,
        public team: Member[] = [],
        public company?: string,
        public budget: number = 0,
        public typeOf: string = 'public',
        public description?: string
    ) {}
}
