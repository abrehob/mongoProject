// query 4: find user pairs such that, one is male, second is female,
// their year difference is less than year_diff, and they live in same
// city and they are not friends with each other. Store each user_id
// pair as arrays and return an array of all the pairs. The order of
// pairs does not matter. Your answer will look something like the following:
// [
//      [userid1, userid2],
//      [userid1, userid3],
//      [userid4, userid2],
//      ...
//  ]
// In the above, userid1 and userid4 are males. userid2 and userid3 are females.
// Besides that, the above constraints are satisifed.
// userid is the field from the userinfo table. Do not use the _id field in that table.

  
function suggest_friends(year_diff, dbname)
{
  	db = db.getSiblingDB(dbname)
  	var result = db.users.find();
  	var friends = [];
  	var already_friends = false;
  	// Loop through each user.
  	for (var m = 0; m < result.length(); m++)
  	{
   		// Compare to all other users.
    	for (var f = 0; f < result.length(); f++)
    	{
      		// Check if constraints for friendship are satisfied.
      		// Will not produce duplicate friend pairs, because
      		// male is always first and female second.
      		if (result[m]["gender"] == "male" && result[f]["gender"] == "female" &&
          		result[m]["hometown"]["city"] == result[f]["hometown"]["city"] &&
          		result[m]["hometown"]["state"] == result[f]["hometown"]["state"] &&
          		result[m]["hometown"]["country"] == result[f]["hometown"]["country"] &&
          		Math.abs(result[m]["YOB"] - result[f]["YOB"]) < year_diff)
      		{
        		// Make sure this pair of users is not already friends.
        		already_friends = false;
        		if (result[m]["user_id"] < result[f]["user_id"])
        		{
          			for (var i = 0; !already_friends && i < result[m]["friends"].length; i++)
          			{
            			if (result[m]["friends"][i] == result[f]["user_id"])
              				already_friends = true;
          			}
        		}
        		else
        		{
          			for (var i = 0; !already_friends && i < result[f]["friends"].length; i++)
          			{
            			if (result[f]["friends"][i] == result[m]["user_id"])
              				already_friends = true;
          			}
        		}
        		if (!already_friends)
          			friends.push([result[m]["user_id"], result[f]["user_id"]]);
      		}
    	}
  	}

  	return friends;
}