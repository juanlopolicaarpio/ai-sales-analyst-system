from dataclasses import dataclass

from app.demo.data import DEMO_OVERVIEW


@dataclass(frozen=True)
class Evidence:
    id: str
    label: str
    period: str


def _evidence(*ids: str) -> list[dict[str, str]]:
    requested = set(ids)
    return [source for source in DEMO_OVERVIEW["sources"] if source["id"] in requested]


def answer_demo_question(question: str) -> dict:
    """Return a deterministic, evidence-linked answer for the public demo.

    Production deployments can swap this adapter for an LLM call. Keeping the
    selection and evidence contract deterministic makes the public demo free,
    testable, and incapable of inventing company data.
    """

    normalized = " ".join(question.lower().split())
    products = DEMO_OVERVIEW["products"]
    declining = sorted((item for item in products if item["growth_pct"] < 0), key=lambda item: item["growth_pct"])

    if any(token in normalized for token in ("product", "declin", "sku", "sell")):
        weakest = declining[0]
        return {
            "answer": (
                f"{weakest['name']} is the clearest product risk: growth is {weakest['growth_pct']:.1f}% "
                f"on ${weakest['revenue']:,.0f} revenue. Solstice Travel Mug is also down 9.4%. "
                "Check stock position, landing-page conversion, and recent campaign mix before discounting."
            ),
            "confidence": "high",
            "evidence": _evidence("product:moss-cable-organizer"),
            "actions": [
                "Compare product-page conversion against the prior period.",
                "Separate demand decline from inventory or traffic-quality issues.",
                "Run a focused merchandising test before changing price.",
            ],
        }

    if any(token in normalized for token in ("conversion", "traffic", "funnel")):
        return {
            "answer": (
                "Traffic is growing, but conversion is the primary constraint. The conversion rate is 3.82%, "
                "down 0.31 percentage points while sessions are up 15.2%. Prioritize channel-quality and "
                "checkout-friction analysis before buying more traffic."
            ),
            "confidence": "high",
            "evidence": _evidence("conversion", "sessions"),
            "actions": [
                "Break conversion down by acquisition channel and device.",
                "Inspect checkout errors and payment drop-off.",
                "Compare new versus returning-customer conversion.",
            ],
        }

    if any(token in normalized for token in ("region", "market", "where")):
        return {
            "answer": (
                "The West is the largest market at $58,280, representing 31.6% of net revenue. "
                "Its scale makes it the best region for a controlled retention or upsell experiment."
            ),
            "confidence": "high",
            "evidence": _evidence("region:west", "revenue"),
            "actions": [
                "Compare repeat-purchase rate by region.",
                "Test an upsell campaign in the West with a fixed holdout.",
                "Track incremental margin, not revenue alone.",
            ],
        }

    return {
        "answer": (
            "Net revenue is $184,620, up 12.4%, with 2,418 orders. The main risk is that conversion fell "
            "to 3.82% even as traffic increased. Protect the revenue trend by diagnosing traffic quality and "
            "checkout friction before scaling acquisition spend."
        ),
        "confidence": "high",
        "evidence": _evidence("revenue", "conversion", "sessions"),
        "actions": [
            "Review funnel conversion by channel and device.",
            "Investigate the two declining products.",
            "Use the West region for the next controlled growth test.",
        ],
    }
