# Spec-Driven Development (SDD) — `frontend-app-profile`

Welcome to the Spec-Driven Development (SDD) specification registry for `@edx/frontend-app-profile`.

## 1. What is SDD?
Spec-Driven Development is a practice where the **technical blueprint** (API contracts, UI state machine, Redux/Saga state transitions, and Pact CDC tests) is written, reviewed, and approved **before writing or modifying frontend code**.

## 2. Specification Lifecycle & Statuses
Every specification follows this progression:
- `DRAFT`: Author is drafting the specification.
- `IN_REVIEW`: Shared with Frontend Lead, Backend Lead, and UX for review.
- `APPROVED`: Signed off by all stakeholders; ready for implementation.
- `IMPLEMENTED`: Code, unit tests, and Pact contract tests are merged into `master`.
- `DEPRECATED`: Superceded by a newer specification.

## 3. The 4-Point Review Gate
Before any code is merged, a feature must satisfy:
1. **API Schema Alignment**: Merge-patch payloads match `edx-platform` serializers.
2. **UI State Completeness**: All 4 screen states (`empty`, `editing`, `editable`, `static`) are defined.
3. **State & Saga Integrity**: Redux draft scratchpads, save actions, and async delays are mapped.
4. **Contract Verification**: Pact CDC consumer tests pass (`npm test`).

## 4. How to Create a New Spec
1. Copy `docs/specs/TEMPLATE.md` to `docs/specs/features/XXXX-feature-name.md`.
2. Fill out all sections (API contract, UI states, Redux flow, Pact test).
3. Open a PR or link the Markdown file in Jira for team review.
4. Once `APPROVED`, implement the code and tests against the approved spec.

## 5. Specification Directory Index

| Spec ID | Title | Status | Target Layer |
| :--- | :--- | :--- | :--- |
| **[SPEC-0001](./features/0001-profile-field-contract.md)** | Atomic Profile Field Contract (`SwitchContent` 4-State UI) | `IMPLEMENTED` | UI Forms / Redux Drafts |
| **[SPEC-0002](./features/0002-dual-resource-patch.md)** | Dual-Resource Merge-Patch Save Contract | `IMPLEMENTED` | Services / Sagas / Pact |
| **[SPEC-0003](./features/0003-avatar-media-lifecycle.md)** | Profile Photo Upload, Delete & Two-Stage Resync | `IMPLEMENTED` | Services / Sagas / Avatar UI |
| **[SPEC-0004](./features/0004-privacy-access-control.md)** | Route Protection & Multi-Viewer Privacy Resolution | `IMPLEMENTED` | Routes / Reducers / Privacy |
| **[SPEC-0005](./features/0005-learner-telemetry.md)** | Learner Analytics & BI Telemetry Schemas | `IMPLEMENTED` | Analytics / Services |