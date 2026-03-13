import requests
import json
import os

API_URL = "https://archive.org/advancedsearch.php"

QUERY = "mediatype:audio AND (nadaswaram OR shehnai OR temple OR carnatic OR classical)"

ROWS = 200

OUTPUT_FILE = "dataset/tracks.json"


def search_archive():

    params = {
        "q": QUERY,
        "fl[]": ["identifier", "title", "creator"],
        "rows": ROWS,
        "output": "json"
    }

    r = requests.get(API_URL, params=params)

    data = r.json()

    return data["response"]["docs"]


def load_dataset():

    if not os.path.exists(OUTPUT_FILE):
        return []

    with open(OUTPUT_FILE, "r") as f:
        return json.load(f)


def save_dataset(data):

    with open(OUTPUT_FILE, "w") as f:
        json.dump(data, f, indent=2)


def main():

    print("Searching archive...")

    results = search_archive()

    dataset = load_dataset()

    existing_ids = {x["identifier"] for x in dataset}

    new_tracks = []

    for item in results:

        identifier = item["identifier"]

        if identifier in existing_ids:
            continue

        track = {
            "identifier": identifier,
            "title": item.get("title", ""),
            "creator": item.get("creator", ""),
            "source": "archive_org"
        }

        new_tracks.append(track)

    dataset.extend(new_tracks)

    save_dataset(dataset)

    print(f"Added {len(new_tracks)} new tracks")


if __name__ == "__main__":
    main()
