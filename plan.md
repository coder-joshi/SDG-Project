# Role Access Review and Alignment Plan

## Goal

Align page access and visible actions for Project Developer, Verifier, and Corporate Buyer with the attached role matrix.

## Current findings

- The app has three account roles: `citizen` (Project Developer), `verifier`, and `corporate` (Corporate Buyer).
- Protected routes exist, but some route permissions do not match the role matrix: `/projects` is shared by citizen and verifier; marketplace and project details are available to citizen and verifier; trading is available to corporate and citizen.
- The shared project list displays all project records and its page always offers project registration. The developer view should be limited to that developer's projects; the verifier should use the verification queue to review claims.
- The marketplace project detail includes purchase controls without role-specific presentation, despite the route being open to multiple roles.
- Reports, profile, and settings are shared across roles. Reports currently display the same fixed documents for every role, so role-specific report scope and content should be reviewed.
- These checks are currently client-side. The project has no backend authorization; browser-side route and control restrictions improve the demo UX but cannot protect data or mutations from a determined user.

## Changes made

1. Kept all three existing app roles and preserved the **Citizen** label.
2. Aligned route permissions with the image:
   - **Project Developer:** dashboard, own projects, project submission, credits ledger, reports, profile/settings, and seller trading.
   - **Verifier:** verification queue, all-project list and read-only project/evidence details, approve/reject actions with reasons, registry activity/audit reporting, profile/settings.
   - **Corporate Buyer:** active-project marketplace, project details/location, purchase actions, ESG impact analytics, compliance reports, profile/settings.
3. Filtered Citizen project rows and counts to the signed-in user's `applicantId`; Verifier can see all registered projects and open read-only project details.
4. Removed role-inappropriate marketplace and trading navigation, removed purchase controls for non-corporate roles, and enforced role checks on project creation, verification, and credit purchase actions.
5. Scoped report content and headings by role, and limited Citizen profile payment details to the Citizen account.
6. Run the project's existing TypeScript/build checks after implementation.

## Approval gate

The user approved the plan with the direction to preserve the **Citizen** role label.
