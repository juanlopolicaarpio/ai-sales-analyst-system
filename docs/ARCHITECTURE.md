# Architecture

## Product boundary

AI Sales Analyst separates four concerns:

1. Commerce ingestion and persistence.
2. Deterministic analytics and anomaly detection.
3. Evidence packaging and natural-language analysis.
4. Delivery through web and notification interfaces.

The public runtime exercises concerns 2–4 with synthetic data. External commerce, model, and messaging systems are represented as boundaries, not bundled connectors.

## System view

```mermaid
flowchart TB
  subgraph Clients
    WEB[React web app]
    CHANNELS[Notification channels]
  end

  subgraph Service[FastAPI service]
    ROUTES[REST routes]
    QUERY[Intent and evidence selection]
    ANALYTICS[Deterministic analytics]
    AGENT[Grounded analyst]
  end

  subgraph Runtime
    DEMO[(Synthetic demo data)]
    DB[(Operational store)]
    MODEL[LLM provider]
    COMMERCE[Commerce platform]
  end

  WEB --> ROUTES
  CHANNELS -. deployment adapter .-> ROUTES
  ROUTES --> QUERY --> ANALYTICS
  QUERY --> AGENT
  ANALYTICS --> DEMO
  ANALYTICS -. storage port .-> DB
  AGENT -. model port .-> MODEL
  ANALYTICS -. ingestion port .-> COMMERCE
```

## Public-demo request flow

```mermaid
sequenceDiagram
  participant U as Reviewer
  participant UI as React dashboard
  participant API as FastAPI
  participant S as Evidence selector
  participant D as Synthetic dataset

  U->>UI: Ask which products need attention
  UI->>API: POST /api/demo/ask
  API->>S: Normalize intent
  S->>D: Select relevant metrics
  D-->>S: Metrics and source metadata
  S-->>API: Answer, confidence, evidence, actions
  API-->>UI: Typed response
```

## Engineering decisions

### Analytics before language

Numerical aggregation, trend detection, and anomaly scoring belong in deterministic services. The language layer explains selected evidence; it does not calculate business truth.

### Explicit evidence contract

An answer includes source identifiers and periods. That contract can be rendered in a dashboard, notification, or audit log and tested without snapshotting prose.

### Public code has a deliberate boundary

The public release contains no historical merchant connector or credential schema. A deployment replaces the synthetic repository behind an ingestion port and keeps vendor authentication at the edge.

### Progressive deployment

The static frontend can demonstrate the product alone. Adding FastAPI enables the analyst API. Persistence, model, commerce, and notification adapters can then be introduced independently.
