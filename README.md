# susi-server

| Route          | HTTP   | Description          |Requirement            |response  |
|----------------|--------|----------------------|-----------------------|----------|
| /users         | GET    | Get all users info   |                       |          |
| /users         | POST   | add a single user    | name, email, password |          |
| /auth          | POST   | login to get a token | email, password       | message, authorization, email, name |