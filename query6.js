// query6 : Find the Average friend count per user for users
// We define the `friend count` as the number of friends of a user. The average
// friend count per user is the average `friend count` towards a collection of users. In
// this function we ask you to find the `average friend count per user` of the users
// documentsunction
//
// Return a decimal variable as the average user friend count of all users
// in the users document.

function find_average_friendcount(dbname){
  	db = db.getSiblingDB(dbname)
  	
  	// Get the entire list of users along with their friends
  	var result = db.users.find({}, {user_id: 1, friends: 1, _id: 0});
    
    // Find the total number of friends in the database
    var count = 0;
    for (var i = 0; i < result.length(); i++) {
    	count += result[i]["friends"].length;
    }

    return count / result.length();
}
