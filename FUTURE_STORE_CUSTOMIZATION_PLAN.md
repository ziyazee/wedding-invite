# Future Plan: Store Customization

Status: Proposal for future discussion. Not an implementation commitment.

Expected scale: Up to 15 stores.

## Purpose

Support different dashboards, planning workflows, templates, and forms for each store while keeping the product manageable to maintain. Use this document as the reference for future discussions and update it as decisions are agreed.

Working assumption: A store is a separate customer workspace with its own users, data, settings, and content. Confirm this before implementation.

## Proposed approach

Use one shared application and codebase. Give each store its own configuration and content, with explicit extensions for workflows that need custom behavior.

Resolve settings from shared defaults plus store overrides. A store should only need to define the settings that differ from the defaults. Make the behavior of future default changes explicit so existing stores are not unexpectedly affected.

For this scale, begin with developer-managed configuration and a small set of reusable components. Add administrative editing tools when recurring needs justify them.

## Customization areas

| Area | Examples of store differences | Proposed handling |
| --- | --- | --- |
| Branding | Logo, colors, display name | Store settings and assets |
| Dashboard | Visible sections, section order, labels, default views | Configured reusable sections |
| Planning | Stages, task templates, required steps | Workflow configuration; extensions for complex behavior |
| Templates | Available designs, default wording, store-specific content | Shared template library with store assignments and overrides |
| Forms | Fields, labels, order, required status, conditional visibility | Versioned form definitions |
| Features | Modules available to a store | Store feature settings |
| Permissions | What owners and staff can view or change | Explicit roles and permissions, enforced on the server |

Feature visibility and user permission are separate concerns. Hiding a dashboard section does not enforce access restrictions.

## Store-specific forms

Maintain a shared form renderer that reads a form definition for the current store and use case.

A field definition can specify a stable identifier, type, label, help text, default value, validation, display order, and conditional visibility. Start with field types and conditions required by actual stores.

Keep essential business fields consistent wherever shared workflows or reporting depend on them. Store additional answers separately using stable field identifiers. Changing a label must not change the identity of the saved answer.

Validate submissions on the server against the relevant form definition. Save the form version with each submission so later edits do not make older answers ambiguous. Removing a field from a new version should preserve historical responses.

Use a dedicated form or workflow extension when a store needs behavior that the shared form system cannot express clearly, such as a distinct approval process or calculation.

Example: Store A uses the standard enquiry form. Store B adds an event-type selection and requires a venue. Store C adds an approval step after submission; that step belongs to workflow behavior as well as form configuration.

## Data and store boundaries

Associate store-owned records, settings, template assignments, and form definitions with a store identifier. Determine the active store through authenticated membership and enforce access on the server for reads, writes, uploads, and background work.

Keep shared template definitions distinct from store-owned overrides. Define who can edit shared content and who can change a particular store's setup.

The database and deployment arrangement remain open decisions. The expected store count alone does not require separate deployments for every store.

## Handling customization requests

1. Record the store, the problem, and a concrete example of the desired behavior.
2. Check whether existing settings or content can meet the need.
3. If the requirement is reusable, add a shared configuration option or feature.
4. If the behavior is unique and substantial, add an explicit extension with a clear connection to the shared application.
5. Record the decision, affected data, and maintenance implications in the store's customization record.

Keep store selection and extension registration centralized. Avoid spreading checks for individual store names throughout dashboard and form components.

## Suggested rollout

1. Inventory the first stores' needs and identify what is common and what differs.
2. Define the standard store setup, roles, core data, and configuration structure.
3. Support one standard store and one store with representative dashboard, template, and form differences.
4. Introduce form versioning and a process for reviewing and activating configuration changes.
5. Onboard the remaining stores using the established configuration and extension patterns.
6. Add a settings interface for frequent changes once ownership and editing needs are clear.

Before rollout, verify store data isolation, permissions, default behavior, form validation, historical submissions, and the effect of shared changes on customized stores.

## Store customization record

Maintain a short record for each store containing:

- Store identifier and display name.
- Enabled features and dashboard arrangement.
- Planning workflow and any custom behavior.
- Assigned templates and branding.
- Active form definitions and versions.
- Extensions, reasons for them, and their owner.
- Configuration change history.

## Decisions for future discussion

- Does a store mean an independent customer business or a branch of the same business?
- Can a user belong to more than one store, and is cross-store reporting needed?
- Which fields and workflow steps must remain common across stores?
- Which changes will developers manage, and which may store owners make themselves?
- Do stores need different layouts, different business behavior, or both?
- Should updates to shared templates automatically reach stores or require activation?
- What examples from the first two stores should guide the initial implementation?

## Current agreement and proposal boundary

The stated need is customization of dashboards, planning, templates, and potentially forms for a maximum of 15 stores. This document preserves a proposed architecture and rollout for that future work. Implementation details and the open decisions above still need discussion.
