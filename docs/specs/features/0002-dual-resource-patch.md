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
* **Service Reference**: `src/profile/data/services.js` (lines 53–62: `patchProfile`)
* **Request Payload**:
```json
{
  "bio": "Software Engineer & Lifelong Learner",
  "country": "US",
  "level_of_education": "m",
  "language_proficiencies": [{ "code": "en" }],
  "social_links": [{ "platform": "linkedin", "social_link": "https://linkedin.com/in/example" }]
}