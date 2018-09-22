# susi-server

| Route          | HTTP   | Description             |Requirement                       |response                                            |
|----------------|--------|-------------------------|----------------------------------|----------------------------------------------------|
| /users         | GET    | Get all users info      |                                  |                                                    |
| /users         | POST   | add a single user       | name, email, password,birthdate  |                                                    |
| /auth          | POST   | login to get a token    | email, password                  | message, authorization, email, name                |
| /prescription  | GET    | get prescription of current user | header: authorization; body: label, route, expDate,  stock, userId, times | _id, label, route, expDate, stock, userId, times,createdAt, updatedAt,  schedule ([{_id, userId, prescriptionId, time}]) |
||||||
||||||
||||||
|||||| 