# `frontend-app-profile` Slots

* [`org.openedx.frontend.slot.profile.additionalProfileFields.v1`](./AdditionalProfileFieldsSlot/)

The header and the footer are the shell's; see
[frontend-base](https://github.com/openedx/frontend-base) for their slots.

## Renamed slots

These slots were plugin slots of the legacy micro-frontend, under the ids below. They follow
[the frontend-base slot naming ADR](https://github.com/openedx/frontend-base/blob/main/docs/decisions/0009-slot-naming-and-lifecycle.rst)
now, and are configured through `site.config` rather than `env.config`. No aliases are kept.

| Legacy plugin slot id | Slot id |
|---|---|
| `org.openedx.frontend.profile.additional_profile_fields.v1` | `org.openedx.frontend.slot.profile.additionalProfileFields.v1` |
| `org.openedx.frontend.layout.footer.v1` (alias `footer_slot`) | the shell's `org.openedx.frontend.slot.footer.main.v1` |
