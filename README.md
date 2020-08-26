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
