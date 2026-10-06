# SPEC-0003: Profile Photo Upload, Delete & Two-Stage Resync

- **Status**: IMPLEMENTED
- **Author**: Platform Media & Identity Team
- **Target Files**: `src/profile/forms/ProfileAvatar.jsx`, `src/profile/data/services.js`, `src/profile/data/sagas.js`

---

## 1. Overview & Objective
Specifies the multipart upload, removal, and secondary state resynchronization lifecycle for learner profile avatars.

## 2. API Endpoints

### 2.1 Avatar Upload
* **Endpoint**: `/api/user/v1/accounts/{username}/image`
* **Content-Type**: `multipart/form-data`
* **Payload**: `FormData` with `file: Blob | File`
* **Service Reference**: `src/profile/data/services.js` (lines 75–81: `postProfilePhoto`)
* **Response**: `204 No Content` / `200 OK` (does NOT include thumbnail URLs).

### 2.2 Avatar Deletion
* **Endpoint**: `/api/user/v1/accounts/{username}/image`
* **Request Body**: None — plain `DELETE` with no payload and no `Content-Type` header set.
* **Service Reference**: `src/profile/data/services.js` (lines 88–94: `deleteProfilePhoto`)
* **Response**: `204 No Content` / `200 OK`.

## 3. Two-Stage State Resynchronization Lifecycle
Because upload and delete endpoints do not return resized thumbnail URLs, `src/profile/data/sagas.js` executes a mandatory two-stage fetch:
1. `postProfilePhoto` / `deleteProfilePhoto` is called.
2. Sagas immediately call `getAccount(username)` to fetch fresh thumbnail URLs.
3. Updates `state.account.profileImage` (camelCased via `processAccountData`) with `hasImage`, `imageUrlFull`, `imageUrlLarge`, `imageUrlMedium`, `imageUrlSmall`.

## 4. UI & Error Handling (src/profile/forms/ProfileAvatar.jsx)
* **Pre-flight Check**: File size <= 1MB (`MAX_FILE_SIZE_BYTES`), format in `['image/jpeg', 'image/png']` (`ALLOWED_FILE_TYPES`).
* **Note**: Limit corrected to match actual implementation (previously documented as 5MB).
* **Failure State**: Displays user-facing error message (naming the 1MB limit and allowed JPG/PNG types) via a `Toast` popup (`autohide`, `delay={5000}`) that auto-dismisses after 5 seconds without breaking existing avatar view; form resets and no network request is sent when validation fails.