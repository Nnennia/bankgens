Base URL: "http://localhost:3000"

1.  Create User
Endpoint: 'POST/create'
Description: Create a new user with the provided details
Request Body: {
    "owner":"John Doe",
    "amount": 1000,
    "date": "date"
}

Response:
{
  "message": "User created successfully",
  "user": {
    "_id": "user_id",
    "owner": "John Doe",
    "amount": 1000,
    "date": "01 January 2022",
    "balance": 0  // Initial balance
  }
}
Error Response:
{
  "error": "Invalid request body"
}

2. Withdrawal
Endpoint: "POST/withdrawal"
Description: Initiates a withdrawal for a user with details provided
Request Body: {
  "owner": "John Doe",
  "date": "01 January 2022"
}
Response:{
  "message": "Withdrawal successful",
  "withdrawalAmount": 1050.00,
  "tax": 30.00
}
Error Response:{
  "error": "User not found"
}

3. Get All Users
Endpoint: 'GET /get'
Description: Retrieves a list of all users.
Response:[
  {
    "_id": "user_id_1",
    "owner": "John Doe",
    "amount": 1000,
    "date": "01 January 2022",
    "balance": 1020.00
  },
  {
    "_id": "user_id_2",
    "owner": "Jane Smith",
    "amount": 1500,
    "date": "15 February 2022",
    "balance": 1530.00
  }
]

4. List Users with Pagination
Endpoint: GET /list?page=1
Description: Retrieves a paginated list of users (10 users per page).
Query Parameters:
`page`: Page number (default: 1)

Response:[
  {
    "_id": "user_id_1",
    "owner": "John Doe",
    "amount": 1000,
    "date": "01 January 2022",
    "balance": 1020.00
  },

]
