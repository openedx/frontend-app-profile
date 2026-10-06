# SPEC-0005: Learner Analytics & BI Telemetry Schemas

- **Status**: IMPLEMENTED
- **Author**: Data & Analytics Engineering
- **Target Files**: `src/profile/ProfilePage.jsx`, `src/profile/forms/*`

---

## 1. Overview & Objective
Defines telemetry schemas for learner interactions inside `frontend-app-profile` dispatched via `@edx/frontend-platform/analytics`.

## 2. Event Schemas & Triggers

### 2.1 Profile Viewed Event
* **Event Name**: `edx.profile.viewed`
* **Trigger**: Dispatched on successful mount of `ProfilePage.jsx` when profile data is loaded.
* **Implementation Reference**: `src/profile/ProfilePage.jsx` (`sendTrackingLogEvent('edx.profile.viewed', { username })`)
* **Note**: Event name corrected to match actual implementation (previously documented as `edx.bi.user.profile.viewed`). Current payload only includes `username`. The extended schema below (`category`, `action`, `is_owner`, etc.) is **planned/future work**, not current behavior.
* **Payload Schema (current)**:
​```json
{
  "username": "string"
}
​```
* **Payload Schema (planned — not yet implemented)**:
​```json
{
  "category": "profiles",
  "action": "viewed",
  "is_owner": true,
  "has_custom_avatar": true,
  "account_privacy": "all_users"
}
​```

### 2.2 Field Saved Event (PLANNED — not yet implemented)
​```json
{
  "category": "profiles",
  "action": "saved_field",
  "field_name": "bio",
  "visibility_setting": "all_users"
}
​```

### 2.3 Avatar Upload/Delete Event (PLANNED — not yet implemented)
​```json
{
  "category": "profiles",
  "action": "uploaded | deleted"
}
​```