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

def connect_bolcom_api():
  global token
  global token_valid
  logging.info ("getting new token")
  client_id = '5c3f649e-8a9c-4578-b18b-07b232484e15'
  client_secret = 'njdYzTb!(62V6PlecWb7olqg1HFN3ameXOd4TDOnxN!cR@HQ3kTtvoAblAGU)dqc'
  try:
    logging.info ("getting new token bol.com")
    url = "https://login.bol.com/token?grant_type=client_credentials&client_id="+client_id+"&client_secret="+client_secret
    payload={}
    response = requests.request("POST", url, data=payload, timeout=5)
    token = response.json()['access_token']
    token_valid = datetime.now() + timedelta(seconds=535)
    logging.info ("got token, return")
    return
  except Exception as e:
    logging.info ("something wrong with requesting token")
    print (e)

def check_token():
  global token
  global token_valid
  try:
      # Connect to the database
      conn, c = db_connect()
      # Execute the query
      query = "SELECT expire_date FROM att_token"
      c.execute(query)
      result = c.fetchone()
      if result:
          expire_date = result[0]
      else:
          print("Token not found")
  except mysql.connector.Error as e:
      print("Database Error:", e)

  if expire_date < datetime.now():
    logging.info ("request new token")
    connect_bolcom_api ()
    UPDATE = "UPDATE att_token SET access_token = %s, expire_date = %s"
    val = token, token_valid
    c.execute(UPDATE,val)
    conn.commit()
  if conn.is_connected():
      c.close()
      conn.close()    

check_token()

openapi_token = get_token ("36f8c527-e573-4311-a3cc-ee70c53937bf", "MIc7kX3mTYaVd0@@5Jn)saZ6B?t6yna8UGPfH4tVfeXoxvkAxj1BMnYLe3QWHqOA")
for x in global_ids:
  get_families(x[0], openapi_token)



