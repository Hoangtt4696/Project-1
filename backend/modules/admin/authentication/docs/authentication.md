# Authentication

## Signin 
### Flow 
* User click on hara-work sign in link, generate by build-link.LoginHr(), like :
> https://accounts.hara.vn/connect/authorize?response_mode=form_post&response_type=code%20id_token&scope=offline_access%20openid%20profile%20hac_api%20hr_api%20email%20org%20userinfo&client_id=2c8e395167189b1aaf96817984ada793&redirect_uri=http%3A%2F%2Floc.hara_oes.com%3A3000%2Fhara_oes%2Fadmin%2Fapi%2Fauthentication%2Fhr&nonce=kcjqhdltd

* After login, redirect to callback url, generate by build-link.LoginHrUrlCallBack(), like :
> http://loc.hara_oes.com:3000/hara_oes/admin/api/authentication/hr 

* With request :
  * method : POST
  * body : 
  ```json
  {
    "code"          : "d9bd9d1588ff465bec54f9174dc84f77362a7ec9eab56f350b3d664f6baba9ba",
    "id_token"      : "eyJhbGciOiJSUzI1NiIsImtpZCI6ImUyZTFkZDM4ODJkNTE4YTk2OGQ5MWVlYTU3NmQxNzdhIiwidHlwIjoiSldUIn0.eyJuYmYiOjE1NDM2Nzg2MjgsImV4cCI6MTU0MzczNjIyOCwiaXNzIjoiaHR0cHM6Ly9hY2NvdW50cy5oYXJhLnZuIiwiYXVkIjoiMmM4ZTM5NTE2NzE4OWIxYWFmOTY4MTc5ODRhZGE3OTMiLCJub25jZSI6ImtjanFoZGx0ZCIsImlhdCI6MTU0MzY3ODYyOCwiY19oYXNoIjoiYUYwUi1DbnRONWNxdVZOV1ZzNmpFUSIsInNpZCI6ImNiZTI1NTA2YThhMGU3MWYzNGI3MjNmN2JmOGEyYzg5Iiwic3ViIjoiMjAwMDAwMDAwMjczIiwiYXV0aF90aW1lIjoxNTQzNjc4NjI4LCJpZHAiOiJsb2NhbCIsIm9yZ2lkIjoiMjAwMDAwMDAwMDk0IiwibmFtZSI6IkzDom0gTmd1eeG7hW4gIiwiZW1haWwiOiJsYW0ubmd1eWVuQHNlZWRjb20udm4iLCJvcmduYW1lIjoiVGhlIENvZmZlZSBIb3VzZSAyIiwicm9sZSI6ImFkbWluIiwiYW1yIjpbInB3ZCJdfQ.ESNPa7F8j6mb113Cgq8V5CQuEdO6ddslv6ROaLIETgodc6Gh2sbuFihMayRhivnvkJRMmsZVcUYFzyhIZlaigoHhHzHJfuwEY0-5Kyt61pBupFzGc-Uotc80fb-flxxLPuLEq6J6f5dofmEtijFjRmh3FWxPzedTuScJlu4kbZ3-UGDTESEgjQmVqgiXMVAciFnUQ-qmXucE3ctLi8gX7XP0gxuBltGMZRwcuThSPjxfTv3L1aS_vX5gjMHZOqbNTK7KalV0umasGaV-UE_2tgsB_bDQnEl7i7hsawsyIYwDAizYOf9p5zkBNo2UFmOvvXapzI3PmzR8xG4qAlsKtQ",
    "scope"         : "openid profile email org userinfo hac_api hr_api offline_access",
    "session_state" : "c47lJ8ScKOkm879hbUTgVHdPELiBWLPwgOBl7c5waA4.68dd605d697d08916de534a9e215a1ce"
  }
  ```

* Pass this code to haravan-token-manager business to get access token, refresh token, params
  * access_token : 9b2b45757d78fa7a439c63dc939645358fdfea12411257ea6ad0bdb05a6ad564
  * refresh_token : 46a7ebbd60eb89f7659ae4c59517dd519eccb9ab22a45e96b293ebbde2acc94c
  * params :
  ```json
  {
    "id_token"     : "eyJhbGciOiJSUzI1NiIsImtpZCI6ImUyZTFkZDM4ODJkNTE4YTk2OGQ5MWVlYTU3NmQxNzdhIiwidHlwIjoiSldUIn0.eyJuYmYiOjE1NDM2NzkwNTYsImV4cCI6MTU0MzczNjY1NiwiaXNzIjoiaHR0cHM6Ly9hY2NvdW50cy5oYXJhLnZuIiwiYXVkIjoiMmM4ZTM5NTE2NzE4OWIxYWFmOTY4MTc5ODRhZGE3OTMiLCJub25jZSI6ImtjanFoZGx0ZCIsImlhdCI6MTU0MzY3OTA1NiwiYXRfaGFzaCI6Ijl1NkpfX2RUa3JqS1RIWVVNSnhsY0EiLCJzaWQiOiJjYmUyNTUwNmE4YTBlNzFmMzRiNzIzZjdiZjhhMmM4OSIsInN1YiI6IjIwMDAwMDAwMDI3MyIsImF1dGhfdGltZSI6MTU0MzY3ODYyOCwiaWRwIjoibG9jYWwiLCJvcmdpZCI6IjIwMDAwMDAwMDA5NCIsIm5hbWUiOiJMw6JtIE5ndXnhu4VuICIsImVtYWlsIjoibGFtLm5ndXllbkBzZWVkY29tLnZuIiwib3JnbmFtZSI6IlRoZSBDb2ZmZWUgSG91c2UgMiIsInJvbGUiOiJhZG1pbiIsImFtciI6WyJwd2QiXX0.ULcuQ5OMgrl0lJHiD-08iNKR4JEsnjYHvn1-pYfabV8QthhMKIvj4AUU4gdswIhFxwQupZdNT7d2wf7F4hWBgolUojbj73U-dAeu7LDU45wDMi-qc4Vv2nA2CsmrrN94DOiLsUa7WbKupj-Sf1ynaSR0gjCpRIvsam6a4EkI4zCPF0Sn8ui5YK-JCK00Vf-561oWLOmIFNheSkNBMtayACJ5JDpy81WQKqYjiV_GGw5bNYMp66a57CRuBA8aWdDJZKeHORylx6Ru6GoMKXLtZMK7J33PVLhT4MLEfiiExvj8Rjo--4R_hCI7xqpXCEJCVh2kqRLwpJOlf4PnmT4gog",
    "access_token" : "9b2b45757d78fa7a439c63dc939645358fdfea12411257ea6ad0bdb05a6ad564",
    "expires_in"   : 57600,
    "token_type"   : "Bearer"
  }
  ```

* Get user info with this access token and params.token_type :
```json
{
    "orgid"   : "200000000094",
    "name"    : "Lâm Nguyễn ",
    "email"   : "lam.nguyen@seedcom.vn",
    "orgname" : "The Coffee House 2",
    "role"    : "admin",
    "sub"     : "200000000273"
}
```

* Only allow user have role = 'admin' access

* Update ( or add if not exists) token info of this user 
```json
{
  "orgid"         : "200000000094",
  "email"         : "lam.nguyen@seedcom.vn",
  "access_token"  : "9b2b45757d78fa7a439c63dc939645358fdfea12411257ea6ad0bdb05a6ad564",
  "refresh_token" : "46a7ebbd60eb89f7659ae4c59517dd519eccb9ab22a45e96b293ebbde2acc94c",
  "token_type"    : "Bearer",
  "expires_in"    : 57600,
}
```

* setTimeout to refresh token before expired

* Generate jwt token with payload :
```json 
{
  "orgid"         : "200000000094",
  "email"         : "lam.nguyen@seedcom.vn",
}
```

* Update user-token document with new jwt token

* Send jwt token to client
--------------------------------

## Check token
* validate token, if valid :
  * find setting.haravan with user info in token payload
  * assign access_token to req.session
  * callAPI can use this access_token to access hara-work api services