// query 1: find users who live in the specified city. 
// Returns an array of user_ids.

function find_user(city, dbname){
    db = db.getSiblingDB(dbname)

    var result = db.users.find({"hometown.city": city}, {user_id: 1, _id: 0});
    
    var jsArray = [];
    for (var i = 0; i < result.length(); i++) {
    	jsArray[i] = result[i]["user_id"];
    }

    return jsArray;
}
