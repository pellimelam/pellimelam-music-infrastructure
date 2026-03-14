import json
import os
from collections import defaultdict

INPUT_FILE = "dataset/tracks_classified.json"
OUTPUT_DIR = "radios/generated"

os.makedirs(OUTPUT_DIR, exist_ok=True)


def load_dataset():
    with open(INPUT_FILE, "r") as f:
        return json.load(f)


def main():

    dataset = load_dataset()

    radios = defaultdict(list)

    for track in dataset:

        instrument = track.get("instrument", "unknown")

        for url in track.get("audio_urls", []):
            radios[instrument].append({
                "title": track.get("title", ""),
                "url": url
            })

    for instrument, tracks in radios.items():
        if instrument == "unknown":
            continue

        filename = os.path.join(OUTPUT_DIR, f"{instrument}.json")

        with open(filename, "w") as f:
            json.dump(tracks, f, indent=2)

        print("Radio created:", instrument, "-", len(tracks), "tracks")


if __name__ == "__main__":
    main()
