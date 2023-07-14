import requests
import json
import ast
import base64
from Crypto.Cipher import AES

# Static variables
base_url = "http://localhost:3000"
list_member_url = base_url + "/client-api/user/2"
headers = {'app': '3211243'}
version = "1.0.0"

key = bytes.fromhex("f3cb6c3a210e75f7072ee2a1bd1ff053607465c1b60785e4a57aff1802ce65a8")

print("********************************")
print("*  Python sample to request to DAP  *")
print("*        Version " + version + "         *")
print("********************************")

unpad = lambda s : s[:-ord(s[len(s)-1:])]

global s
s = requests.Session()
try:
    d = json.loads(s.get(list_member_url, headers=headers, data={}).text)
    ct = base64.b64decode(d["ct"])
    iv = bytes.fromhex(d["iv"])
    cipher = AES.new(key, AES.MODE_CBC, iv)
    result = unpad(cipher.decrypt(ct)).decode("utf8")
    print(result)
    jsonResult = json.loads(result)
    print(jsonResult)
except Exception as e:
    print(e)
