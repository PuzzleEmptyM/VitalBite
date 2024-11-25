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