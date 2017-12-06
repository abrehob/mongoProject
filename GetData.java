import java.io.FileWriter;
import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
//import java.util.TreeSet;
//import java.util.Vector;
import java.util.*;

//json.simple 1.1
// import org.json.simple.JSONObject;
// import org.json.simple.JSONArray;

// Alternate implementation of JSON modules.
import org.json.JSONObject;
import org.json.JSONArray;

public class GetData
{
    static String prefix = "jiaqni.";
	
    // You must use the following variable as the JDBC connection
    Connection oracleConnection = null;
	
    // You must refer to the following variables for the corresponding 
    // tables in your database

    String cityTableName = null;
    String userTableName = null;
    String friendsTableName = null;
    String currentCityTableName = null;
    String hometownCityTableName = null;
    String programTableName = null;
    String educationTableName = null;
    String eventTableName = null;
    String participantTableName = null;
    String albumTableName = null;
    String photoTableName = null;
    String coverPhotoTableName = null;
    String tagTableName = null;

    // This is the data structure to store all users' information
    // DO NOT change the name
    JSONArray users_info = new JSONArray();		// declare a new JSONArray

	
    // DO NOT modify this constructor
    public GetData(String u, Connection c)
    {
	    super();
	    String dataType = u;
	    oracleConnection = c;
	    // You will use the following tables in your Java code
	    cityTableName = prefix+dataType+"_CITIES";
	    userTableName = prefix+dataType+"_USERS";
	    friendsTableName = prefix+dataType+"_FRIENDS";
	    currentCityTableName = prefix+dataType+"_USER_CURRENT_CITY";
	    hometownCityTableName = prefix+dataType+"_USER_HOMETOWN_CITY";
	    programTableName = prefix+dataType+"_PROGRAMS";
	    educationTableName = prefix+dataType+"_EDUCATION";
	    eventTableName = prefix+dataType+"_USER_EVENTS";
	    albumTableName = prefix+dataType+"_ALBUMS";
	    photoTableName = prefix+dataType+"_PHOTOS";
	    tagTableName = prefix+dataType+"_TAGS";
    }
	
    //implement this function
    @SuppressWarnings("unchecked")
    public JSONArray toJSON() throws SQLException
    {
	    // Your implementation goes here....		
		JSONArray users_info = new JSONArray();
		
		try (Statement stmtU = oracleConnection.createStatement
               (ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
             Statement stmtF = oracleConnection.createStatement
               (ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);)
        {
            ResultSet rstU = stmtU.executeQuery("SELECT user_id, first_name, last_name, "+
              "gender, year_of_birth, month_of_birth, day_of_birth FROM "+userTableName);
              
            HashMap<Long,Integer> idIndexMap = new HashMap<Long,Integer>();
            int i = 0;

            // Loop through result set
            Long userID;
            String firstName;
            String lastName;
            String gender;
            int year;
            int month;
            int day;
            String city = "";
            String state = "";
            String country = "";
            
            while (rstU.next())
            {
                userID = rstU.getLong(1);
                firstName = rstU.getString(2);
                lastName = rstU.getString(3);
                gender = rstU.getString(4);
                year = rstU.getInt(5);
                month = rstU.getInt(6);
                day = rstU.getInt(7);
                
                JSONObject u = new JSONObject();
                u.put("user_id", userID);
	            u.put("first_name", firstName);
	            u.put("last_name", lastName);
	            u.put("gender", gender);
	            u.put("YOB", year);
	            u.put("MOB", month);
	            u.put("DOB", day);
	            u.put("friends", new JSONArray());
	            users_info.put(u);
                
                idIndexMap.put(userID, i);
                i += 1;

                Statement stmtC = oracleConnection.createStatement
                  (ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
                ResultSet rstC = stmtC.executeQuery
                 ("SELECT C.city_name, C.state_name, C.country_name "+
                  "FROM "+cityTableName+" C, "+hometownCityTableName+" UHC "+
                  "WHERE UHC.user_id = "+userID+" AND UHC.hometown_city_id = C.city_id");

                // Get the hometown of the current user. Should only
                // go through one iteration of the while loop.
                while (rstC.next())
                {
                    city = rstC.getString(1);
                    state = rstC.getString(2);
                    country = rstC.getString(3);
                }
                
                JSONObject h = new JSONObject();
                h.put("city", city);
                h.put("state", state);
                h.put("country", country);
                u.put("hometown", h);
                
                rstC.close();
                stmtC.close();
            }
            rstU.close();
            stmtU.close();
            
            Long u1_userID;
            Long u2_userID;
            ResultSet rstF = stmtF.executeQuery("SELECT user1_id, user2_id FROM "+friendsTableName);
            while (rstF.next())
            {
                u1_userID = rstF.getLong(1);
                u2_userID = rstF.getLong(2);
                if (u1_userID < u2_userID)
                {
                    users_info.getJSONObject(idIndexMap.get(u1_userID))
                      .getJSONArray("friends").put(u2_userID);
                }
                else
                {
                    users_info.getJSONObject(idIndexMap.get(u2_userID))
                      .getJSONArray("friends").put(u1_userID);
                }
            }
            
            rstF.close();
            stmtF.close();
        }
        catch (SQLException err)
        {
            System.err.println(err.getMessage());
        }
		
	    return users_info;
    }

    // This outputs to a file "output.json"
    public void writeJSON(JSONArray users_info)
    {
	    // DO NOT MODIFY this function
	    try
	    {
	        FileWriter file = new FileWriter(System.getProperty("user.dir")+"/output.json");
	        file.write(users_info.toString());
	        file.flush();
	        file.close();
	    }
	    catch (IOException e)
	    {
	        e.printStackTrace();
	    }
    }
}

