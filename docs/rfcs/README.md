# Salai RFC Process

RFCs are used for proposals that materially change shared product/technical architecture and benefit from review before implementation.

Use an RFC for changes such as:

- Narrative IR semantics;
- new canonical domain objects or relationship rules;
- major persistence/runtime changes;
- introduction/replacement of core libraries or infrastructure;
- cross-cutting API conventions;
- collaboration/versioning architecture;
- changes that would invalidate several existing features or workspaces.

Do not require an RFC for small implementation choices that are local to one module and easy to reverse.

## File naming

```text
NNNN-short-title.md
```

Example:

```text
0001-one-narrative-ir-multiple-workflows.md
```

## Required sections

- Status
- Summary
- Motivation
- Proposal
- Alternatives considered
- Consequences / risks
- Open questions
- Decision / outcome

## Status lifecycle

```text
Draft → Proposed → Accepted / Rejected / Superseded
```

The pull request containing the RFC is the primary discussion surface.

Once accepted, architectural consequences that represent final decisions should be captured as ADRs. The RFC may remain more detailed and exploratory; the ADR records the final choice and consequences.
