# SPEC-0004: Route Protection & Multi-Viewer Privacy Resolution

- **Status**: IMPLEMENTED
- **Author**: Security & Auth Team
- **Target Files**: `src/routes/AppRoutes.jsx`, `src/profile/ProfilePage.jsx`, `src/profile/data/reducers.js`

---

## 1. Route Protection & Auth Guard
* **Route Path**: `/u/:username`
* **Guard Component**: `AuthenticatedPageRoute` (`src/routes/AppRoutes.jsx`)
* **Behavior**:
  - Authenticated user -> loads `ProfilePage.jsx`.
  - Unauthenticated user -> redirected to login with `?next=/u/:username`.

## 2. Viewer Ownership Determination
The application evaluates ownership in `ProfilePage.jsx`:
`isOwner = (authenticatedUser.username === routeParams.username)`

## 3. Field Visibility Matrix
- If `isOwner === true`: All fields are visible and show Edit buttons.
- If `isOwner === false`:
  - Field visibility `all_users` -> Render field value (no edit button).
  - Field visibility `private` -> Suppress completely (no empty gaps).
- **Note**: Privacy is enforced server-side — the API never returns a private field's value to non-owner viewers. Client-side `isBlockVisible()` in `ProfilePage.jsx` only checks whether the field value is truthy, not the visibility flag itself; "no empty gaps" works because private values arrive as `null`/empty, not because of an explicit client-side visibility check. 

## 4. Feature Toggles & System Overrides
* `DISABLE_VISIBILITY_EDITING`: When `true`, hides the visibility toggle dropdown inside all forms.
* `ACCOUNT_SETTINGS_URL`: Legal name cannot be edited inside the MFE; displays an external link to account settings.
* `disabledCountries`: Array `['RU']` hardcoded in `reducers.js` to disable selection in country forms.