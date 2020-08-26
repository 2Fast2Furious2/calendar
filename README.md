# Airbnb Calendar

> A clone of Airbnb calendar component

## Related Projects

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)

## Usage

## Server API

**TBD***

### Get restaurant info
  * GET `/api/restaurants/:id`

**Path Parameters:**
  * `id` restaurant id

**Success Status Code:** `200`

**Returns:** JSON

```json
    {
      "id": "Number",
      "name": "String",
      "address": "String",
      "phone": "String",
      "website": "String",
      "cost": "Number"
    }
```

```

## Requirements

An `nvmrc` file is included if using [nvm](https://github.com/creationix/nvm).

- Node 6.13.0
- etc

## Development

### Installing Dependencies

From within the root directory:

```sh
npm install -g webpack
npm install
```

