// query 7: Find the city average friend count per user using MapReduce
// Using the same terminology in query6, we are asking you to write the mapper,
// reducer and finalizer to find the average friend count for each city.


var city_average_friendcount_mapper = function() {
	emit(this.hometown.city, this.friends.length);
};

var city_average_friendcount_reducer = function(key, values) {
    var count = 0;
    for (var i = 0; i < values.length; i++) {
    	count += values[i];
    }

	return count / values.length;
};

var city_average_friendcount_finalizer = function(key, reduceVal) {
  var ret = reduceVal;
  return ret;
}