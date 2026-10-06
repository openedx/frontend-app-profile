# SPEC-0002: Dual-Resource Merge-Patch Save Contract

- **Status**: IMPLEMENTED
- **Author**: Platform Architecture Team
- **Target Files**: `src/profile/data/services.js`, `src/profile/data/sagas.js`, `src/profile/data/pact-profile.test.js`

---

## 1. Overview & Objective
Specifies the contract for simultaneously updating learner profile attributes and field privacy settings across two separate REST resources using `application/merge-patch+json`.

## 2. Endpoint Contracts

### 2.1 Account Resource Patch
* **Endpoint**: `/api/user/v1/accounts/{username}`
* **Method**: `PATCH`
* **Headers**: `Content-Type: application/merge-patch+json`, `Authorization: Bearer <JWT>`
* **Service Reference**: `src/profile/data/services.js` (lines 41–53: `patchProfile`)
* **Request Payload**:
```json
{
  "bio": "Software Engineer & Lifelong Learner",
  "country": "US",
  "level_of_education": "m",
  "language_proficiencies": [{ "code": "en" }],
  "social_links": [{ "platform": "linkedin", "social_link": "https://linkedin.com/in/example" }]
}
```
* **Response**: `200 OK` with the full updated account object (camelCased by `processAccountData` before being returned to callers).
* **Error Handling**: Non-2xx responses are passed through `processAndThrowError`, which attaches `processedData` (camelCased `response.data`, typically `{ fieldErrors, ... }`) to the thrown error for saga-level handling.

### 2.2 Preferences Resource Patch
* **Endpoint**: `/api/user/v1/preferences/{username}`
* **Method**: `PATCH`
* **Headers**: `Content-Type: application/merge-patch+json`, `Authorization: Bearer <JWT>`
* **Service Reference**: `src/profile/data/services.js` (lines 99–116: `patchPreferences`)
* **Request Payload**: Visibility flags are snake_cased then remapped from flat `visibility_*` keys to a nested `visibility.*` object via `convertKeyNames`:
```json
{
  "visibility": {
    "bio": "all_users",
    "course_certificates": "all_users",
    "country": "private",
    "date_joined": "all_users",
    "level_of_education": "private",
    "language_proficiencies": "all_users",
    "name": "all_users",
    "social_links": "custom",
    "time_zone": "private"
  },
  "account_privacy": "custom"
}
```
* **Response**: `204 No Content`. The endpoint does not return the updated preferences object, so `patchPreferences` returns the original (pre-patch) `params` as a placeholder (`// TODO: Once the server returns the updated preferences object, return that.`).

## 3. Saga Orchestration (src/profile/data/sagas.js — `handleSaveProfile`)
1. Reads pending edits via `handleSaveProfileSelector`, splitting `drafts` into `accountDrafts` (profile fields) and `preferencesDrafts` (`visibility*` fields).
2. If any visibility field changed, forces `preferencesDrafts.accountPrivacy = 'custom'`.
3. Dispatches `saveProfileBegin()`.
4. If `accountDrafts` is non-empty, calls `patchProfile(username, accountDrafts)` and keeps the result as `accountResult`.
5. If `preferencesDrafts` is non-empty, calls `patchPreferences(username, preferencesDrafts)` then immediately calls `getPreferences(username)` to fetch the authoritative updated preferences (since the PATCH response is empty), used as `preferencesResult`.
6. Dispatches `saveProfileSuccess(accountResult, preferencesResult)`, then after short delays closes the active form and resets save/draft state.
7. On failure: if the error carries `processedData.fieldErrors`, dispatches `saveProfileFailure(fieldErrors)`; otherwise resets save state and rethrows.

## 4. Pact Contract Testing
* **Reference**: `src/profile/data/pact-profile.test.js`
* Verifies the account and preferences PATCH requests above against the provider contract (request shape, headers, and expected response status) to catch breaking API changes before they reach production.