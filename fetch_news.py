#!/usr/bin/env python3
"""Coleta as principais notícias do dia por tema do blog e salva em .daily_news.json."""

import json
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path

FEEDS = {
    "tecnologia": [
        ("Hacker News", "https://hnrss.org/frontpage?count=8"),
        ("Ars Technica", "https://feeds.arstechnica.com/arstechnica/technology-lab"),
    ],
    "ciencia": [
        ("ScienceDaily", "https://www.sciencedaily.com/rss/top/science.xml"),
        ("Phys.org", "https://phys.org/rss-feed/breaking/"),
    ],
    "historia_filosofia": [
        ("Aeon", "https://aeon.co/feed.rss"),
        ("Quanta Magazine", "https://api.quantamagazine.org/feed/"),
    ],
}

OUT_FILE = Path(__file__).resolve().parent / ".daily_news.json"


def fetch_rss(url: str, source: str, limit: int = 5) -> list[dict]:
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 (T4U4T-Blog-Bot/1.0)"},
    )
    items = []
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            data = resp.read()
        root = ET.fromstring(data)
        for item in root.findall(".//item")[:limit]:
            title = (item.findtext("title") or "").strip()
            link = (item.findtext("link") or "").strip()
            desc = (item.findtext("description") or "").strip()
            pub = (item.findtext("pubDate") or "").strip()
            if title and link:
                items.append({
                    "source": source,
                    "title": title,
                    "link": link,
                    "summary": desc[:400],
                    "pubDate": pub,
                })
    except Exception as exc:
        items.append({"source": source, "error": str(exc)})
    return items


def main() -> None:
    result = {
        "generated_at": datetime.now(timezone.utc).astimezone().isoformat(),
        "themes": {},
    }
    for theme, sources in FEEDS.items():
        theme_items = []
        for source_name, url in sources:
            theme_items.extend(fetch_rss(url, source_name, limit=5))
        result["themes"][theme] = theme_items

    OUT_FILE.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Salvo em {OUT_FILE} ({sum(len(v) for v in result['themes'].values())} itens)")


if __name__ == "__main__":
    main()
