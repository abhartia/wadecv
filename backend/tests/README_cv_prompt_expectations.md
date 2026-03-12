## CV prompt expectations (golden structures)

This file documents the **expected structure** of CV JSON produced by the prompt
defined in `app/services/cv_generator.py`. It is intended as a reference when
manually evaluating prompt changes, rather than as an automated test.

### Degrees vs certifications

When you manually run CV generation for a profile that has both degrees and
professional certifications, the resulting `generated_cv_data` should follow
these rules:

- Degrees (MBA, JD, MD, MSc, BSc, etc.) and degree-granting institutions appear
  **only** in the `education` array.
- The `skills.certifications` array contains **only non-degree credentials**
  such as professional certifications, licenses, and bar admissions.
- Degree names and schools must **not** be repeated inside
  `skills.certifications`.

An example golden structure is stored in
`backend/tests/fixtures_cv_prompt_expectations.json` under the key
`degree_and_certifications_example`.

### Strategic vs technical emphasis

When you manually run CV generation for:

- A **strategy- or Chief-of-Staff–oriented role** (for example, a job
  description that emphasizes leadership, operating cadence, stakeholder
  management, governance, and executive communication), you should observe:
  - The professional summary leads with strategic impact, leadership, and
    operating leverage, with technical background mentioned only as context.
  - The `skills.technical` list is short and high-signal (2–3 compact phrases),
    while `skills.soft` is richer and focused on executive-level stakeholder
    management, cross-functional leadership, operating cadence, strategy
    execution, change management, and governance.
  - Experience bullets lead with business outcomes, stakeholder alignment,
    governance, and cross-regional or cross-functional coordination, bringing
    in technical details only when they directly support those outcomes.

- A **technically oriented role** (for example, a job description that
  emphasizes building or operating technical systems, data or AI products, or
  hands-on engineering/ML work), you should observe:
  - The professional summary leads with hands-on technical leadership and depth,
    with strategy and operations used as supporting context for technical
    contributions.
  - The `skills.technical` list can be more detailed, capturing key languages,
    platforms, architectures, and tools that matter most for the role, while
    `skills.soft` remains focused but shorter.
  - Experience bullets lead with technical design, implementation, and
    measurable technical results (for example, improvements in reliability,
    scalability, performance, or accuracy), bringing in strategy or operations
    only when they directly support those technical results.

These expectations should hold regardless of the specific job title; the model
should infer the appropriate emphasis from the **content** of the job
description, guided by the prompt instructions.

