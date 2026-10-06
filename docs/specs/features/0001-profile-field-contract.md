# SPEC-0001: Atomic Profile Field Contract
- **Status**: IMPLEMENTED
- **Author**: Profile Experience Team
- **Target Files**: `src/profile/forms/Bio.jsx`, `src/profile/forms/Name.jsx`, `src/profile/forms/Country.jsx`, `src/profile/forms/Education.jsx`, `src/profile/forms/PreferredLanguage.jsx`, `src/profile/data/services.js`, `src/profile/data/sagas.js`

---
## 1. Overview & Business Context
Specifies the shared save/visibility contract and 4-mode UI behavior for any atomic, single-value editable profile field (`<fieldKey>`) — e.g. `bio`, `name`, `country`, `levelOfEducation`. `bio` is used throughout as the worked example.

## 2. API & Data Contract
### 2.1 Primary Endpoint Specification
* **API Service**: User Account API
* **Endpoint / Path**: `/api/user/v1/accounts/{username}`
* **Method**: `PATCH`
* **Content-Type**: `application/merge-patch+json`
* **Service Function**: `src/profile/data/services.js` -> `patchProfile(username, { [fieldKey]: value })` (e.g. `patchProfile(username, { bio: 'text' })`; see SPEC-0002 §2.1 for full contract)

### 2.2 Request Payload Schema
```json
{
  "<field_name>": "string"
}
```
Example (`bio`):
```json
{
  "bio": "string"
}
```

### 2.3 Response Payload Schema & Status
* **Status**: `200 OK`
```json
{
  "username": "string",
  "<field_name>": "string"
}
```

### 2.4 Secondary Resource (Visibility)
* **Endpoint**: `/api/user/v1/preferences/{username}` via `patchPreferences(username, { visibility<FieldKey> })` (e.g. `visibilityBio`; see SPEC-0002 §2.2)
* **Payload**:
```json
{
  "visibility": { "<field_name>": "all_users | private" }
}
```

## 3. UI State Matrix (4 Modes — `SwitchContent`, shared across all field forms)
| Mode | Trigger Condition | Visual Presentation & User Controls |
|---|---|---|
| `empty` | `<field>` is `null` (Viewer is Owner) | Renders `EmptyContent` call-to-action (e.g. Bio: "Add a short bio", `profile.bio.empty`) |
| `editing` | Field form opened (Viewer is Owner) | Input bound to `<field>` + `FormControls` (Save/Cancel + `visibility<FieldKey>` dropdown) |
| `editable` | `<field>` is populated (Viewer is Owner) | `EditableItemHeader` showing `<field>` value + Edit button + visibility badge (if enabled) |
| `static` | Viewed by another learner | `EditableItemHeader` showing `<field>` value only, no edit controls; field omitted entirely if `visibility<FieldKey> === 'private'` |

## 4. State Management (Redux & Sagas)
### 4.1 Redux Store Schema Additions
* **Committed State**: `account.<fieldKey>` / `preferences.visibility.<fieldKey>`
* **Draft Scratchpad**: `drafts.<fieldKey>`, `drafts.visibility<FieldKey>`
* **Form Errors**: `formErrors.<fieldKey>`

### 4.2 Action Types & Flow
* `UPDATE_DRAFT`: Updates `drafts.<fieldKey>` in Redux on input change (`useHandleChange`).
* `SAVE_PROFILE`: Dispatched on form submit (`useHandleSubmit`); triggers `handleSaveProfile` saga (SPEC-0002 §3).
* `SAVE_PROFILE_SUCCESS`: Commits `accountResult.<fieldKey>` / `preferencesResult.visibility.<fieldKey>` to state.
* `CLOSE_FORM`: Form closed after 1000ms delay.
* `RESET_DRAFTS`: Scratchpad cleared after 300ms delay.

## 5. Contract Testing (Pact CDC)
* **Test File**: `src/profile/data/pact-profile.test.js`
* **Contract JSON**: `src/pacts/frontend-app-profile-edx-platform.json`
* **Consumer**: `frontend-app-profile`
* **Provider**: `edx-platform`

## 6. Internationalization & Accessibility (i18n & a11y)
* **Message File**: Per-field messages file, e.g. `src/profile/forms/Bio.messages.jsx`
* **Message IDs**: Generic pattern `profile.<field>.<label|empty|placeholder>`; Bio example: `profile.bio.about.me` (label), `profile.bio.empty` (empty-state prompt, defined inline in `Bio.jsx`)
* **ARIA Requirements**: Editing form uses `role="dialog"` with `aria-labelledby={`${formId}-label`}`; input is labeled via `Form.Group controlId={formId}`; validation errors rendered via `Form.Control.Feedback`.
