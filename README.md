# VitalBite

This is the starter template for the Atlas Cinema Guru project. It contains the starting code for the movie database application.

![](./images/task-2-a.png)

## Getting Started

- Run `npm install` to install dependencies
- Run `npm run dev` to start the dev server
- Open http://localhost:3000 in a browser

## API Routes Documentation

### Table of Contents

1. [Context Routes](#context-routes)
2. [Diets Routes](#diets-routes)
3. [Preferences Routes](#preferences-routes)

---

### Context Routes

#### Fetch Chat Context by UID

**Endpoint**: `/api/context`

**Method**: `GET`

**Description**: Fetches all chat data for a specific user identified by `uid`.

##### Request Parameters

| Parameter | Type   | Description              | Required |
|-----------|--------|--------------------------|----------|
| `uid`     | `int`  | The unique user ID.      | Yes      |

##### Example Request

```bash
GET /api/context?uid=1
```

##### Example Response (Success)

```json
[
  {
    "chatId": 1,
    "uid": 1,
    "userQuestion": "Can I eat broccoli?",
    "chatResponse": "Yes, but only steamed",
    "recipeId": null,
    "tipId": null,
    "timestamp": "2024-11-18T10:00:00.000Z"
  },
  {
    "chatId": 2,
    "uid": 1,
    "userQuestion": "Suggest a steamed broccoli recipe",
    "chatResponse": "Steamed broccoli (recipe..)",
    "recipeId": 1,
    "tipId": null,
    "timestamp": "2024-11-18T10:05:00.000Z"
  }
]
```

##### Example Response (No Chats Found)

```json
{
  "message": "No chats found for the specified UID"
}
```

##### Example Response (Error)

```json
{
  "error": "Failed to fetch chat context"
}
```

### Diets Routes

#### Fetch All Diet Types

**Endpoint:** `/api/diets`

**Method:** `GET`

**Description:** Fetches all available diet types in the database.

##### Example Request

```bash
GET /api/diets
```
##### Example Response (Success)

```json
[
  { "dietId": 1, "name": "Low FODMAP" },
  { "dietId": 2, "name": "Gluten-Free" },
  { "dietId": 3, "name": "Dairy-Free" }
]
```

##### Example Response (No Diet Types Found)

```json
{
  "message": "No diet types found"
}
```

##### Example Response (Error)

```json
{
  "error": "Failed to fetch diet types"
}
```

#### Fetch Diet Type by dietId

**Endpoint:** `/api/diets?dietId=<dietId>`

**Method:** `GET`

**Description:** Fetches details of a diet type based on the given dietId.


##### Request Parameters

| Parameter | Type   | Description              | Required |
|-----------|--------|--------------------------|----------|
| `dietID`  | `int`  | The ID of the diet.      | Yes      |

##### Example Request

```bash
GET /api/diets?dietId=1
```

##### Example Response (Success)

```json
{
  "dietId": 1,
  "name": "Low FODMAP",
  "description": "A diet low in fermentable oligosaccharides, disaccharides, monosaccharides, and polyols."
}
```

##### Example Response (Diet Type Not Found)

```json
{
  "message": "Diet type not found"
}
```

##### Example Response (Error)

```json
{
  "error": "Failed to fetch diet type"
}
```

#### Fetch Diet IDs by UID

**Endpoint:** `/api/diets?uid=<uid>`

**Method:** `GET`

**Description:** Fetches all dietIds associated with a specific user.

##### Request Parameters

| Parameter | Type   | Description              | Required |
|-----------|--------|--------------------------|----------|
|   `uid`   | `int`  | The unique user ID.      | Yes      |

##### Example Request

```bash
GET /api/diets?uid=1
```

##### Example Response (Success)

```json
[1, 5]
```

##### Example Response (No Diet IDs Found)

```json
{
  "message": "No dietIds found"
}
```

##### Example Response (Error)

```json
{
  "error": "Failed to fetch dietIds"
}
```

### Preferences Routes

#### Fetch Diet IDs by UID

**Endpoint:** `/api/preferences`

**Method:** `GET`

**Description:** Fetches all diet IDs from user preferences for a specific user (uid).

##### Request Parameters

| Parameter | Type   | Description              | Required |
|-----------|--------|--------------------------|----------|
|   `uid`   | `int`  | The unique user ID.      | Yes      |

##### Example Request

```bash
GET /api/preferences?uid=1
```

##### Example Response (Success)

```json
[
  { "dietId": 1 },
  { "dietId": 5 }
]
```

##### Example Response (No Preferences Found)

```json
{
  "message": "No preferences found"
}
```

##### Example Response (Error)

```json
{
  "error": "Failed to fetch preferences"
}
```
