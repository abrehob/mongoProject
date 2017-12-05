///query2
//unwind friends and create a new collection called flat_users where each document has the following schema:
/*
{
  user_id:xxx
  friends:xxx
}
*/


function unwind_friends(dbname)
{
  db = db.getSiblingDB(dbname)
  
  db.users.aggregate([
    {$project: {user_id: 1, friends: 1, _id: 0}},
    {$unwind: "$friends"},
    {$out: "flat_users"}
  ]);
}