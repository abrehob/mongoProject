//find the oldest friend for each user who has a friend. For simplicity, use only year of birth to determine age, if there is a tie, use the one with smallest user_id
//return a javascript object : key is the user_id and the value is the oldest_friend id
//You may find query 2 and query 3 helpful. You can create selections if you want. Do not modify users collection.
//
//You should return something like this:(order does not matter)
//{user1:userx1, user2:userx2, user3:userx3,...}

function oldest_friend(dbname){
  	db = db.getSiblingDB(dbname)

  	// Create a dictionary which maps each user_id to that user's year of birth
  	var dict = {};
  	var userIdYear = db.users.find({}, {user_id: 1, YOB: 1, _id: 0});
  	for (var i = 0; i < userIdYear.length(); i++) {
  		dict[userIdYear[i]["user_id"]] = userIdYear[i]["YOB"];
  	}

    // Create an array which stores two things for a given user:
    //      The YOB of the oldest friend (so far)
    //      The id of the oldest friend (so far)
    var oldestData = [];
    for (var i = 0; i < userIdYear.length(); i++) {
        oldestData[userIdYear[i]["user_id"]] = [100000, 100000];
    }

    // Create a collection which contains each user paired with each friend with a higher id
    db.users.aggregate([
        {$project: {user_id: 1, friends: 1, _id: 0}},
        {$unwind: "$friends"},
        {$out: "flat_users"}
    ]);

    // Create a collection which contains each user paired with each friend with a lower id
    db.flat_users.find().forEach(
        function(user) {
            db.r_flat_users.insertOne({user_id: user.friends, friends: user.user_id});
        }
    );

    // Iterate through each user's higher-id friends and determine which friend is the oldest
  	db.flat_users.find().forEach(
  		function(doc)
  		{
  			if (dict[doc.friends] < oldestData[doc.user_id][0] || 
  				(dict[doc.friends] == oldestData[doc.user_id][0] &&
                    doc.friends < oldestData[doc.user_id][1]))
  			{
  				oldestData[doc.user_id][0] = dict[doc.friends];
  				oldestData[doc.user_id][1] = doc.friends;
  			}
  		}
  	);

    // Iterate through each user's lower-id friends and determine which friend is the oldest
    // (this also compares the lower-id friends' ages with the higher-id friends' ages)
    db.r_flat_users.find().forEach(
        function(doc)
        {
            if (dict[doc.friends] < oldestData[doc.user_id][0] || 
                (dict[doc.friends] == oldestData[doc.user_id][0] &&
                    doc.friends < oldestData[doc.user_id][1]))
            {
                oldestData[doc.user_id][0] = dict[doc.friends];
                oldestData[doc.user_id][1] = doc.friends;
            }
        }
    );

    // Create a dictionary that maps each user to their oldest friend
    var resultDict = {};
    for (var i = 0; i < oldestData.length; i++) {
        resultDict[i] = oldestData[i][1];
    }

  	return resultDict;
}
