# SPEC-0001: Atomic Profile Field Contract (SwitchContent 4-State UI)

- **Status**: IMPLEMENTED
- **Author**: Platform UI Team
- **Target Files**: `src/profile/forms/*`, `src/profile/forms/elements/SwitchContent.jsx`, `src/profile/data/reducers.js`

---

## 1. Overview & Objective
Defines the standard architectural contract for all editable profile attribute fields in `frontend-app-profile` (`Bio`, `Country`, `Education`, `PreferredLanguage`, `SocialLinks`).

## 2. UI State Matrix (SwitchContent)
Every field component delegates rendering to `SwitchContent.jsx` using one of 4 discrete states:

| State | Evaluation Condition | Visual Elements |
| :--- | :--- | :--- |
| **`empty`** | `isOwner === true` AND `fieldValue === null \|\| fieldValue === ''` AND `currentlyEditing !== fieldName` | Button with plus icon: "Add {field}" |
| **`editing`** | `isOwner === true` AND `currentlyEditing === fieldName` | Input control, `Visibility` dropdown, `FormControls` (Save / Cancel) |
| **`editable`** | `isOwner === true` AND `fieldValue !== null` AND `currentlyEditing !== fieldName` | Rendered value display + Edit pencil icon |
| **`static`** | `isOwner === false` | Rendered text if `visibility === 'all_users'`; null (suppressed) if `private` |

## 3. Draft State Scratchpad Protocol
1. When user clicks "Edit" or "Add", `OPEN_FORM` sets `currentlyEditingField = fieldName`.
2. As user types, `UPDATE_DRAFT` mutates `state.drafts[fieldName]`. Committed state `state.account[fieldName]` is untouched.
3. On "Cancel", `CLOSE_FORM` closes the input and `RESET_DRAFTS` discards all scratchpad data without network traffic.
4. On "Save", `SAVE_PROFILE` initiates the saga submission.

## 4. Implemented Form Files
* `src/profile/forms/Bio.jsx` (lines 15–50)
* `src/profile/forms/Country.jsx` (lines 20–55)
* `src/profile/forms/Education.jsx` (lines 15–45)
* `src/profile/forms/PreferredLanguage.jsx` (lines 15–45)
* `src/profile/forms/SocialLinks.jsx` (lines 20–60)