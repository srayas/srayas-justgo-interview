export class User {
    
   
    id: number;
    username: string;
    role: string;
    mobileNumber: number;
    locked:boolean;

    constructor(id: number = 0, username: string = '', role: string = '', mobileNumber: number = 0,locked:boolean=false) {
        this.id = id;
        this.username = username;
        this.role = role;
        this.mobileNumber = mobileNumber;
        this.locked= locked
    }

    bindUserData(data: any): any {
        const user= new User()
        if(data){
            user.username=data.username??null
            user.id=data.id??null
            user.mobileNumber=data.mobileNumber??null
            user.role=data.role??null
            user.locked=data.locked??false
        }
        return user
    }

    bindUserListData(data: any[] | undefined): User[] {
        if (!data || data.length === 0) {
            return [];
        }
        return data
        .filter((item) => item !== undefined)
        .map((item) => new User(
            item.id ?? null,
            item.username ?? null,
            item.role ?? null,
            item.mobileNumber ?? null,
            item.locked??false
        ));
    }
    

}
