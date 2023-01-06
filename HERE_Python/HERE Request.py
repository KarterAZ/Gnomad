Python 3.11.1 (tags/v3.11.1:a7a450f, Dec  6 2022, 19:58:39) [MSC v.1934 64 bit (AMD64)] on win32
Type "help", "copyright", "credits" or "license()" for more information.
import requests
import json

 
# Set the API endpoint and your API key
endpoint = "https://discover.search.hereapi.com/v1/discover"
api_key = 'LbzvmA77Y0eEWFQAjTp-LLpUWmISGj3XWe0rRD4Wei4'
 
# Set the search query and other parameters
params = {
    "at": "42.2249,-121.7817",  #Center of Klamath Falls, Oregon
    "q": "bathroom",  #Category Search
    "radius": 25  #Radius of search from center point
}

#Set the API key for authentication
headers = {
    "Authorization": "Bearer LbzvmA77Y0eEWFQAjTp-LLpUWmISGj3XWe0rRD4Wei4"
    }

# Send the request and retrieve the response
response = requests.get(endpoint, params=params, headers=headers)
 
# Check the status code of the response
if response.status_code != 200:
    print("Error: API request failed")
else:
    # Print the results of the API query
    results = response.json()
    print(json.dumps(results, indent=2))
