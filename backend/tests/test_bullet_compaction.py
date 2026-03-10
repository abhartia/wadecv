from app.services.cv_compaction import compact_experience_bullets_for_one_page


def test_compaction_limits_bullets_by_recency() -> None:
    cv_data = {
        "experience": [
            {
                "job_title": "Older Role 1",
                "start_date": "2015-01",
                "end_date": "2016-01",
                "bullets": [f"Old1 bullet {i}" for i in range(5)],
            },
            {
                "job_title": "Older Role 2",
                "start_date": "2017-01",
                "end_date": "2018-01",
                "bullets": [f"Old2 bullet {i}" for i in range(5)],
            },
            {
                "job_title": "Recent Role 1",
                "start_date": "2019-01",
                "end_date": "2021-01",
                "bullets": [f"Recent1 bullet {i}" for i in range(5)],
            },
            {
                "job_title": "Recent Role 2",
                "start_date": "2022-01",
                "end_date": "2024-01",
                "bullets": [f"Recent2 bullet {i}" for i in range(5)],
            },
        ]
    }

    compacted = compact_experience_bullets_for_one_page(cv_data)
    experience = compacted["experience"]

    # Roles sorted by recency should be:
    # - Recent Role 2 (2024-01)
    # - Recent Role 1 (2021-01)
    # - Older Role 2
    # - Older Role 1
    titles_by_score = [
        exp["job_title"]
        for exp in sorted(
            experience,
            key=lambda e: (e.get("end_date") or e.get("start_date") or ""),
            reverse=True,
        )
    ]
    assert titles_by_score[:2] == ["Recent Role 2", "Recent Role 1"]

    # Recent roles should have at most 3 bullets; older roles at most 2 bullets.
    for exp in experience:
        bullets = exp.get("bullets") or []
        if exp["job_title"] in ("Recent Role 2", "Recent Role 1"):
            assert len(bullets) <= 3
        else:
            assert len(bullets) <= 2

