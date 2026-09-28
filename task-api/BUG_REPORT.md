# Bug Report – The Untested API

This document describes the bugs identified during testing, where they occur in the codebase, why they happen, and how they were fixed.

---

## Bug 1 – Default task status does not match API specification

**Location**

`src/services/taskService.js` → `create()` function

**Problem**

New tasks were created with `status: "todo"`.

**Why it's a bug**

The assignment specification defines valid statuses as:

* `pending`
* `in-progress`
* `completed`

Using `todo` makes the API inconsistent with its own documentation.

**Steps to reproduce**

```http
POST /tasks
{
  "title": "Write tests"
}
```

**Expected**

```json
{
  "status": "pending"
}
```

**Actual**

```json
{
  "status": "todo"
}
```

**Fix**

Changed the default value from `"todo"` to `"pending"` inside the `create()` function.

---

## Bug 2 – Invalid status query returns HTTP 200 instead of HTTP 400

**Location**

`src/routes/tasks.js` → `GET /tasks`

**Problem**

The route accepted any value for the `status` query parameter and returned an empty array for invalid values.

**Why it's a bug**

`status` is an enum. Invalid values should be rejected instead of silently returning an empty result.

**Steps to reproduce**

```http
GET /tasks?status=banana
```

**Expected**

```http
400 Bad Request
```

```json
{
  "error": "Invalid status"
}
```

**Actual**

```http
200 OK
```

```json
[]
```

**Fix**

Added validation to allow only:

* `pending`
* `in-progress`
* `completed`

and return `400 Bad Request` for any other value.

---

## Bug 3 – Pagination skips the first page

**Location**

`src/services/taskService.js` → `getPaginated()`

**Problem**

Pagination offset was calculated using:

```javascript
const offset = page * limit;
```

**Why it's a bug**

For `page=1` and `limit=2`, offset becomes `2`, so the first two tasks are skipped.

**Expected**

```javascript
const offset = (page - 1) * limit;
```

**Fix**

Updated the offset calculation to `(page - 1) * limit`.

---

## Bug 4 – Completing a task changes its priority

**Location**

`src/services/taskService.js` → `completeTask()`

**Problem**

Completing a task always changed its priority to `"medium"`.

**Why it's a bug**

Task completion should update only completion-related fields, not modify unrelated task data.

**Expected**

Priority remains unchanged.

**Actual**

Priority becomes `"medium"` after completion.

**Fix**

Removed the hardcoded priority update.

---

## Bug 5 – Completing an already completed task overwrites `completedAt`

**Location**

`src/services/taskService.js` → `completeTask()`

**Problem**

The endpoint allowed completing the same task multiple times.

**Why it's a bug**

Each request generated a new completion timestamp, losing the original completion time.

**Expected**

Return an error when a completed task is completed again.

**Fix**

Added a status check before updating the task.
