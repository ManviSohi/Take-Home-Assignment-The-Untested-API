# Submission – The Untested API

## Overview

This submission includes automated tests, bug fixes, and the implementation of the `PATCH /tasks/:id/assign` endpoint.

## Tests Added

Implemented tests for:

* POST `/tasks`

  * Successful task creation.
  * Missing title validation.
* GET `/tasks`

  * List all tasks.
  * Filter by status.
  * Pagination.
  * Invalid status query.
* PUT `/tasks/:id`

  * Successful update.
  * Invalid task ID.
  * Invalid status validation.
* PATCH `/tasks/:id/complete`

  * Successful completion.
  * Completing an already completed task.
* DELETE `/tasks/:id`

  * Successful deletion.
* GET `/tasks/stats`

  * Status counts.
  * Overdue count.
* PATCH `/tasks/:id/assign`

  * Successful assignment.
  * Missing `assignedTo`.
  * Empty `assignedTo`.
  * Invalid task ID.

## Bugs Identified

See `BUG_REPORT.md` for detailed descriptions.

Summary:

1. Default status used `todo` instead of `pending`.
2. Invalid status query returned `200` instead of `400`.
3. Pagination skipped the first page.
4. Completing a task twice overwrote completion timestamp.
5. Update endpoint allowed immutable fields to be modified.

## Feature Implemented

### PATCH `/tasks/:id/assign`

Added support for assigning a task to a user.

### Design Decisions

* Added `assignedTo` field to every task.
* Used `PATCH` because only one field is updated.
* Added request validation.
* Returned `400` for invalid requests.
* Returned `404` for missing task IDs.

## Tradeoffs / Notes

* The application uses an in-memory datastore, so test isolation is handled with `taskService._reset()` before each test.
* Validation is handled in the route layer before calling the service layer.
