import requests

# Set the API endpoint URL and your API key
endpoint_url = "https://discover.search.hereapi.com/v1/discover"
api_key = "LbzvmA77Y0eEWFQAjTp-LLpUWmISGj3XWe0rRD4Wei4"

# Set the API key for authentication
headers = {
    "Authorization": "Bearer " + api_key
}

# Send a test request to the API endpoint
response = requests.get(endpoint_url, headers=headers)

# Check the status code of the response
if response.status_code == 200:
    print("API key is valid and working")
else:
    print("API key is invalid or not working")
