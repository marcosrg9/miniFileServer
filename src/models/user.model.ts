export class User {

    name:       string;
    pass:       string;
    lastPath:   string;

    constructor(name: string, pass: string, lastPath: string) {
        Object.assign(this, { name, pass, lastPath });
    }
}