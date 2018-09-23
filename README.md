# susi-server

| Route          | HTTP   | Description             |Requirement                       |response                                            |
|----------------|--------|-------------------------|----------------------------------|----------------------------------------------------|
| /users         | GET    | Get all users info      |                                  |                                                    |
| /users         | POST   | add a single user       | name, email, password,birthdate  |                                                    |
| /auth          | POST   | login to get a token    | email, password                  | message, authorization, email, name                |
| /prescription  | POST   | post prescription of current user | header: authorization; body: label, route, expDate,  stock, userId, times | body ( _id, label, route, expDate, stock, userId, times,createdAt, updatedAt,  schedule ([{_id, userId, prescriptionId, time}]) ) |
| /prescription  | GET   | get prescription of current user | header: authorization; query:userId | body ( _id, label, route, expDate, stock, userId, times,createdAt, updatedAt,  schedule ([{_id, userId, prescriptionId, time}]) ) |
| /config | GET | Get a config of current user | header: authorization; query: userId; | body: morning, afternoon, night;|
|/config | POST| Create a config of current user| header: authorization; query: userId; body: morning, afternoon, night;| info, body ( _id, morning, afternoon, night, userId, createdAt, updatedAt )  |
|/config| PUT | Update a config of current user| header: authorization; query: configId body: morning, afternoon, night| info, newConfig ( _id,morning, afternoon, night, userId, createdAt, upadatedAt ) |
|||||| 