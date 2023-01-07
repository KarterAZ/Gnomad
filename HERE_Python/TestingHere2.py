# Author: Stephen Thomson, Bryce Schultz, Andrew Rice, Karter Zwetschke, Andrew Ramirez
# Date: 1/7/2023
# Purpose: Breaks the US into 100 circles with a 250km radius to theoretically cover the entire US.
#           Sends 100 requests to the HERE API, parses the bathroom data we need, and inserts it into the Testing Database.

from sys import argv, stderr, exit
from json import dumps
import logging
import http.client
import json
import mysql.connector
import math
http.client.HTTPConnection.debuglevel = 1

logging.basicConfig()
logging.getLogger().setLevel(logging.DEBUG)
requests_log = logging.getLogger('requests.packages.urllib3')
requests_log.propagate = True
requests_log.setLevel(logging.DEBUG)

try:
    from requests_oauthlib import OAuth1
except ImportError as e:
    raise ImportError(f'{e.msg}\nPackage available at https://pypi.org/project/requests-oauthlib')

try:
    from requests import get, post, HTTPError
except ImportError as e:
    raise ImportError(f'{e.msg}\nPackage available at https://pypi.org/project/requests')

# Connect/Insert to database function
def insert_data(title, street, latitude, longitude):
    cnx = mysql.connector.connect(user='codenome', password='Codenome!1', host='travel.bryceschultz.com', database='codenome_testing')
    cursor = cnx.cursor()

    # Construct the INSERT statement
    stmt = "INSERT INTO pins (title, street, latitude, longitude) VALUES (%s, %s, %s)"
    values = (title, street, latitude, longitude)

    # Execute the statement
    cursor.execute(stmt, values)

    # Commit the changes to the database
    cnx.commit()

    # Close the connection to the database
    cnx.close()
    
usage = """Usage:
    hgs_access_test.py <key-id> <key_secret>
"""
clid = "7rCT77hOpd9VBv8K0DAxag"
clsec = "OyOPKetreHVGT5Ry5koisPp84dI4OjD7wTNrHYDsSllkk54-P5_Blkq2KobpEA6QY0BPvkqyyBClzrS7xtU90w"

# Retrieve token
try:
    data = {
        'grantType': 'client_credentials',
        'clientId': clid,
        'clientSecret': clsec
        }
except IndexError:
    stderr.write(usage)
    exit(1)

response = post(
    url='https://account.api.here.com/oauth2/token',
    auth=OAuth1(clid, client_secret=clsec) ,
    headers= {'Content-type': 'application/json'},
    data=dumps(data)).json()

try:
    token = response['accessToken']
    token_type = response['tokenType']
    expire_in = response['expiresIn']
except KeyError as e:
    print(dumps(response, indent=2))
    exit(1)

# Use it in HERE Geocoding And Search query header
headers = {'Authorization': f'{token_type} {token}'}

# Box with Grid corner Coordinates
min_lat = 41.991794
max_lat = 46.292035
min_lng = -124.566244
max_lng = -116.463504

# Set Values and Calculate Number of Circles Needed
width = math.fabs(max_lng - min_lng)
height = math.fabs(max_lat - min_lat)
circle_radius = 250
box_area = width * height
circle_area = 3.14 * circle_radius * circle_radius
num_circles = box_area / circle_area

# Set Start Point
x = min_lat + circle_radius
y = min_lng + circle_radius

# Generate center points
center_points = []
for i in range(int(num_circles)):
    #Append
    center_points.append((x, y))
    #Next Coordinates
    x += 2 * circle_radius
    if x > max_lat:
        x = min_lng + circle_radius
        y += 2 * circle_radius

# Iterate through the center points
for point in center_points:
    # Construct the search query
    search_query = f'https://discover.search.hereapi.com/v1/discover?in=circle:{point[0]},{point[1]};r=250000&q=bathroom'

    #Peform Search
    search_results = dumps(get(search_query, headers=headers).json(), indent=2)

    # Parse JSON
    pdata = json.loads(search_results)

    #Iterate through items to create place
    for item in pdata['items']:
        place = {
            'title': item['title'],
            'street': item['address']['label'],
            'latitude': item['position']['lat'],
            'longitude': item['position']['lng']
        }
        #Call the function
        insert_data(place)

        # Print for testing
        #print(f'Title: {title}')
        #print(f'Address: {address}')
        #print(f'Position: ({latitude}, {longitude})')
    
