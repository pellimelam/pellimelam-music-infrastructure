import json

INPUT_FILE = "dataset/tracks.json"
OUTPUT_FILE = "dataset/tracks_cleaned.json"

KEYWORDS = [
    "nadaswaram",
    "nagaswaram",
    "shehnai",
    "melam",
    "thavil",
    "mridangam",
    "chenda",
    "carnatic",
    "temple",
    "instrumental"
]


def normalize(value):

    if isinstance(value, list):
        return " ".join(value)

    if isinstance(value, str):
        return value

    return ""


def load_dataset():
    with open(INPUT_FILE, "r") as f:
        return json.load(f)


def save_dataset(data):
    with open(OUTPUT_FILE, "w") as f:
        json.dump(data, f, indent=2)


def is_relevant(track):

    title = normalize(track.get("title"))
    creator = normalize(track.get("creator"))

    text = (title + " " + creator).lower()

    for keyword in KEYWORDS:
        if keyword in text:
            return True

    return False


def main():

    dataset = load_dataset()

    cleaned = []
    seen = set()

    for track in dataset:

        identifier = track.get("identifier")

        if identifier in seen:
            continue

        seen.add(identifier)

        if not track.get("audio_urls"):
            continue

        if not is_relevant(track):
            continue

        cleaned.append(track)

    save_dataset(cleaned)

    print("Dataset cleaning complete")
    print("Original tracks:", len(dataset))
    print("Cleaned tracks:", len(cleaned))
    print("Saved to:", OUTPUT_FILE)


if __name__ == "__main__":
    main()
