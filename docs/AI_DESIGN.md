# AI design

## Goal

The analyst should help a merchant decide what to inspect or change next without inventing metrics. The key design choice is to compute and select evidence before generating language.

```text
question → intent → scoped metrics → deterministic analysis → evidence bundle → answer
```

## Public implementation

The public analyst is deterministic:

- It normalizes the question.
- It selects a supported intent such as product risk, funnel performance, regional performance, or executive summary.
- It selects only the metrics required for that intent.
- It returns answer text, confidence, evidence metadata, and actions.

This makes the demo free to run and easy to test while showing the contract a model adapter must honor.

## Production-oriented extension

A hardened model-backed deployment should:

1. Compute analytics outside the model.
2. Give the model a bounded evidence object rather than raw database access.
3. Require structured output.
4. Validate cited metric IDs against the supplied evidence.
5. Log model, prompt version, latency, token use, and user feedback.
6. Fall back to deterministic templates when the provider is unavailable.

## Guardrails

- Missing information must be called out, not inferred.
- Currency, date windows, and percentage units are formatted consistently.
- Webhook authentication is a channel concern and happens before message processing.
- Credentials remain server-side; no provider credentials exist in the public runtime.
- The public demo never sends its dataset to an external model.

## Evaluation plan

A production evaluation set should cover:

- Correct metric and time-window selection.
- Numerical faithfulness.
- Appropriate refusal when a metric is absent.
- Recommendation relevance.
- Stable output across channel formats.
- Adversarial prompts attempting to override system or data boundaries.
