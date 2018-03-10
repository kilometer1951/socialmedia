class Users {
    
    constructor(){
        this.users = [];
    }
    
    
    //add all users connected to a room
    AddUserData(id, name, room){
         var users = {id, name, room };
         this.users.push(users);
         return users;
    }
    
    RemoveUser(id){
        var user = this.GetUser(id);
		if (user) {
			this.users = this.users.filter((user) => user.id !== id );
		}
		return user;
    }
    
    GetUser(id){
        var getUser = this.users.filter((userId) => {
			return userId.id === id;
		})[0];
		return getUser;
    }
    
    //list all users connected to a room
    GetUsersList(room){
        var users = this.users.filter((user) => user.room === room );
        
        var namesArray = users.map((user) => user.name );
        
        let NamesArray = namesArray;
		let newNamesArray = Array.from(new Set(NamesArray));
	//	console.log(newNamesArray);
		return newNamesArray;
    }
    
}

module.exports = {Users};