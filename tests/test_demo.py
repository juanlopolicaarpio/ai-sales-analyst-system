from fastapi.testclient import TestClient

from app.demo.analyst import answer_demo_question
from app.demo.data import DEMO_OVERVIEW
from app.main import app


client = TestClient(app)


def test_dataset_is_explicitly_synthetic():
    assert DEMO_OVERVIEW["store"]["platform"] == "Synthetic commerce feed"
    assert len(DEMO_OVERVIEW["metrics"]) == 4
    assert len(DEMO_OVERVIEW["products"]) >= 5


def test_product_question_returns_product_evidence():
    result = answer_demo_question("Which products are declining?")
    assert result["confidence"] == "high"
    assert any(source["id"].startswith("product:") for source in result["evidence"])
    assert len(result["actions"]) == 3


def test_funnel_question_is_grounded_in_funnel_sources():
    result = answer_demo_question("Why is conversion down even with more traffic?")
    evidence_ids = {source["id"] for source in result["evidence"]}
    assert evidence_ids == {"conversion", "sessions"}
    assert "3.82%" in result["answer"]


def test_demo_api_contract():
    overview = client.get("/api/demo/overview")
    answer = client.post(
        "/api/demo/ask",
        json={"question": "Which products need attention?"},
    )

    assert overview.status_code == 200
    assert overview.json()["store"]["name"] == "Juniper & Co."
    assert answer.status_code == 200
    assert answer.json()["confidence"] == "high"
    assert answer.headers["X-Request-ID"]
