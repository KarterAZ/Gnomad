# Author: Stephen Thomson, Bryce Schultz, Andrew Rice, Karter Zwetschke, Andrew Ramirez
# Date: 1/7/2023
# Purpose: Breaks Oregon into 2 circles with a 250km radius to theoretically cover all of Oregon.
#           Sends 2 requests to the HERE API, parses the bathroom data we need, and inserts it into the Testing Database.

import pymysql

# Connect to the database
connection = pymysql.connect(host='travel.bryceshultz.com',
                             user='codenome',
                             password='Codenome!1',
                             db='codenome_testing')

try:
    with connection.cursor() as cursor:
        # Select rows with duplicate latitude and longitude values
        sql = """
            SELECT latitude, longitude, COUNT(*)
            FROM pins
            WHERE tag_bathroom = 1
            GROUP BY latitude, longitude
            HAVING COUNT(*) > 1;
        """
        cursor.execute(sql)
        duplicates = cursor.fetchall()

        # Remove the duplicate rows
        for duplicate in duplicates:
            latitude, longitude, count = duplicate
            sql = f"""
                DELETE FROM your_table
                WHERE latitude = {latitude} AND longitude = {longitude} AND tag_bathroom = 1
                LIMIT {count-1};
            """
            cursor.execute(sql)

    # Commit the changes
    connection.commit()

finally:
    # Close the connection
    connection.close()
