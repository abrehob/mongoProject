// query 7: Find the city average friend count per user using MapReduce
// Using the same terminology in query6, we are asking you to write the mapper,
// reducer and finalizer to find the average friend count for each city.


var city_average_friendcount_mapper = function() {
	emit(this.hometown.city, {"numFriends": this.friends.length, "counter": 1});
};

var city_average_friendcount_reducer = function(key, values) {
    var sum = 0;
    var numUsers = 0;

    for (var i = 0; i < values.length; i++) {
    	sum += values[i]["numFriends"];
    	numUsers += values[i]["counter"];
    }

	return {"numFriends": sum, "counter": numUsers};
};

var city_average_friendcount_finalizer = function(key, reduceVal) {
  	var ret = reduceVal["numFriends"] / reduceVal["counter"];
  	return ret;
};
