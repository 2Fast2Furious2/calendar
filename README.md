# Airbnb Calendar

> A clone of Airbnb calendar component

## Related Projects

TBD

## Table of Contents

1. [Usage](#Usage)
1. [Server API](#ServerAPI)
1. [Development](#development)

## Usage

TBD

## Server API

**TBD***

### Get reservation information
  * GET `/rooms/:room_id/reservation`

**Path Parameters:**
  * `room_id` room ID

**Success Status Code:** `200`

**Returns:** JSON

```json
    {
      "nightly_fee" : "smallint",
      "rating" : "decimal",
      "reviews" : "smallint",
      "minimum_stay" : "tinyint",
      "maximum_guest" : "tinyint",
      "booked_date" : "Array(Date)"
    }
```

### Create a new reservation
  * POST `/rooms/:room_id/reservation`

  **Path Parameters:**
  * `room_id` room ID

  **Success Status Code:** `202`

  Server will accept any reservations in the correct format, but will only insert the record if there are no detected conflicts with pre-existing reservations for the room.

  **Request Body**: Expects JSON with the following keys:
  ```json
      {
        "check_in": "Date(YYYY-MM-DD)",
        "check_out": "Date(YYYY-MM-DD)"
      }
  ```
  (Note: for purposes of SDC the server will assign the submitted reservation to a random user account)

### Delete an existing reservation
  * DELETE `/rooms/:room_id/reservation`

  **Path Parameters:**
    * `room_id` room ID

  **Success Status Code:** `201`

  **Request Body**: Expects JSON with the following keys:
  ```json
      {
        "reservation_id": "Number"
      }
  ```

## Requirements

TBD

## Development

### Installing Dependencies

From within the root directory:

```sh
npm install -g webpack
npm install
```

## Development

### Installing Dependencies

From within the root directory:

```sh
npm install -g webpack
npm install
```
