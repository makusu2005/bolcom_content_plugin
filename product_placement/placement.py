import requests
import json
import mysql.connector
import time
import requests
from io import StringIO
import csv
import logging
from datetime import datetime, timedelta
import os
import bugsnag
import string
from bs4 import BeautifulSoup


token = ''
token_valid = datetime.now() - timedelta(seconds=5000)
logging.basicConfig(format='%(asctime)s - %(message)s', level=logging.INFO)

def db_connect():
  connecting = True
  failed = 0
  while connecting:
    try:
      conn = mysql.connector.connect(
      host="es89.siteground.eu",
      user="uvco1p1rfwej2",
      password="czsagnkcmnkl",
      database='dbm0gnmrgx5rpo'
      )
      c = conn.cursor(buffered=True)
      return (conn, c)
    except Exception as e:
      logging.info (e)
      failed += 1
      logging.info("failed to connect, wait & retry")
      time.sleep(20*failed)
      if failed == 10:
        logging.info ("failed to connect. Stop")
        quit()


def token_online():
  global token
  try:
      # Connect to the database
      conn, c = db_connect()
      # Execute the query
      query = "SELECT access_token FROM att_token"
      c.execute(query)

      # Fetch the access_token
      result = c.fetchone()
      if result:
          access_token = result[0]
          token = access_token
      else:
          print("Token not found")
  except mysql.connector.Error as e:
      print("Database Error:", e)

  finally:
      # Close the database connection
      if conn.is_connected():
          c.close()
          conn.close()




def find_lowest_subcategory(data):
    if 'subcategories' in data and data['subcategories']:
        return find_lowest_subcategory(data['subcategories'][0])
    else:
        return {'name': data['name'], 'id': data['id']}


def pos_bol():
  import requests
  global token
  url = "https://api.bol.com/retailer/products/list"

  payload = "{\n  \"countryCode\": \"NL\",\n  \"searchTerm\": \"laptop\",\n  \"categoryId\": \"4770\",\n  \"filterRanges\": [\n    {\n      \"rangeId\": \"PRICE\",\n      \"min\": 0,\n      \"max\": 0\n    }\n  ],\n  \"filterValues\": [\n    {\n      \"filterValueId\": \"30639\"\n    }\n  ],\n  \"sort\": \"RELEVANCE\",\n  \"page\": 1\n}"
  headers = {
    'Accept': 'application/vnd.retailer.v9+json',
        'Authorization': 'Bearer '+token,

    'Accept-Language': 'nl'
  }

  response = requests.request("POST", url, headers=headers, data=payload)

  print(response.text)



def get_position(cat_id, target_ean, cat_name):
  global token
  page = 1
  while page < 20:
    url = "https://api.bol.com/retailer/products/list" 
    payload = json.dumps(
      {
    "countryCode" : "NL",
    "categoryId" : cat_id,
    "sort" : "RELEVANCE",
    "page" : + page
      }
      )
    headers = {
    'Accept': 'application/vnd.retailer.v9+json', 
    'Authorization': 'Bearer '+token,
    'Content-Type': 'application/vnd.retailer.v9+json',
    'Accept-Language': 'nl-NL'
    }
    response = requests.request("POST", url, headers=headers, data=payload)
    data = response.json()
    code = response.status_code
    if data == {}:
      logging.info ("data is empty")
    if data != {}:
      # Search for the value in the JSON data
      found_index = None
      for index, product in enumerate(data.get("products", [])):
          for ean_item in product.get("eans", []):
              if ean_item.get("ean") == target_ean:
                  found_index = index + 1
                  break
          if found_index is not None:
              break

      if found_index is not None:
          print(f"EAN {target_ean} found at spot {found_index} for category {cat_name}")
          return
      else:
          page += 1
          logging.info ("page " + str(page))
          input (data)

def get_placement(product_ean):
  global token
  global token_valid
  category_info = []
  images_total = 0
  url = "https://api.bol.com/retailer/products/"+ product_ean+"/placement" 
  payload = {}
  headers = {
  'Accept': 'application/vnd.retailer.v9+json', 
  'Authorization': 'Bearer '+token,
  'Content-Type': 'application/vnd.retailer.v9+json'
  }
  response = requests.request("GET", url, headers=headers, data=payload)
  data = response.json()
  code = response.status_code
  #input (data)
  if code == 404 or code == 403 or code == 400:
    logging.info ("not found, code = " + str(code))
  if code not in (202,200):
    logging.info ("Kreeg geen 200 of 202 op images, maar een " + str(code))
    logging.info (data)
  else:
    if data == {}:
      logging.info ("data is empty")
    if data != {}:
      for category in data['categories']:
        lowest_subcategory = find_lowest_subcategory(category)
        category_info.append(lowest_subcategory)
      print("Lowest subcategory info for each category:")
      for info in category_info:
          cat_id = info['id']
          print(info['id'])
          print(info['name'])
          get_position(cat_id,product_ean,info['name'])
token_online()
pos_bol()
get_placement('8720892093998')  
