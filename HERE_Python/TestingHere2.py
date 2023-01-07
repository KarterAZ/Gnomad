from sys import argv, stderr, exit
from json import dumps
import logging
import http.client
import json
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

usage = """Usage:
    hgs_access_test.py <key-id> <key_secret>
"""
clid = "7rCT77hOpd9VBv8K0DAxag"
clsec = "OyOPKetreHVGT5Ry5koisPp84dI4OjD7wTNrHYDsSllkk54-P5_Blkq2KobpEA6QY0BPvkqyyBClzrS7xtU90w"

search_query = 'https://discover.search.hereapi.com/v1/discover?in=circle:42.2249,-121.7817;r=115000&q=bathroom'

# 1. Retrieve token
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

# 2. Use it in HERE Geocoding And Search query header
headers = {'Authorization': f'{token_type} {token}'}
search_results = dumps(get(search_query, headers=headers).json(), indent=2)

# print(f'results:\n{search_results}')

# Parse JSON
pdata = json.loads(search_results)

for item in pdata['items']:
    title = item['title']
    address = item['address']['label']
    latitude = item['position']['lat']
    longitude = item['position']['lng']

    # Print for testing
    print(f'Title: {title}')
    print(f'Address: {address}')
    print(f'Position: ({latitude}, {longitude})')
    
