def is_evren_related(question: str) -> bool:
    evren_keywords = [
        "evren ai", "evren", "bootcamp", "courses", "team", "mission",
        "ai training", "vision", "objectives", "platform", "founder",
        "services", "projects", "pricing", "contact", "career",
        "website", "KPIs", "kpi", "key performance indicators","location"
    ]
    return any(keyword in question.lower() for keyword in evren_keywords)
