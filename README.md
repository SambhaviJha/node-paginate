# Readme for node-paginate

node-paginate is a pagination helper function which allows you easily paginate, populate, select, sort, query, and search related documents from your mongodb collection using mongoose.

## Installation
To install node-paginate, use npm
```sh
npm install node-paginate
```

## Usage

```sh
const express = require('express');
const paginate = require('node-paginate');
const User = require('../models/User');

const app = express();

// middleware to parse incoming requests with JSON payloads.
app.use(express.json());

// define your routes
app.post('/users/list', (req, res) => {
    // Use node-paginate function
    const usersList = await paginate(User, req.body);
    res.status(200).json(usersList);
});
```
### paginate(Model, req.body)
Returns promise

### Parameters
- Model - The name of the model whose listing you want.
- req.body 
    - options {Object}
        - populate {Array} - Paths which should be populated.
        - select {Array} - Fields to return (by default returns all fields).
        - pagination {Boolean} - If pagination is set to false, it will return all docs without adding limit condition (by default returns 5 documents).
        - page {Number} - (by default returns 1st page).
        - limit {Number} - (by default returns 5 documents).
        - order {Object} - Sort order.
    - query {Object} - Query criteria.
    - range {Object} 
        - key - Field name.
        - value {Array} - Lower limit and Upper limit of date or number
    - search {Array} - Search array will contain array of key(Field name) and value.

### Return value
- docs {Array} - Array of documents.
- paginate {Object}
    - totalRecords {Number} - Total number of documents in collection that match a query.
    - page {Number} - Current page number.

### Payload
```sh
{
    "options": {
        "populate": [
            {"path": "postId"}
        ],
        "select": ["name", "email", "postId", "createdAt"],
        "pagination": true,
        "page": 1,
        "limit": 5,
        "order": {"name": "desc"}
    },
    "range": {
        "createdAt": ["2024-07-16T03:56:17.000+00:00", "2024-07-26T10:41:28.000+00:00"]
    },
    "query": {},
    "search":[
        ["name", "sa"]
    ]
}
```