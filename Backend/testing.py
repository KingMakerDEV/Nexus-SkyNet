# Backend/testing.py

from Backend.Ingestion.api_ingester import APIIngestor

def main():
    ingestor = APIIngestor()

    # Ask user for a query term
    query = input("Enter a search term for NASA images (e.g., 'sun'): ").strip()
    # query = sanitize_query(query)  # ✅ clean up before sending

    try:
        print("\n🔎 Searching NASA Image and Video Library...")
        search_results = ingestor.search_nasa_images(query)
        print("✅ Search results received.")

        # Display a summary of items
        items = search_results.get("collection", {}).get("items", [])
        if not items:
            print("No results found for:", query)
            return

        print(f"\nFound {len(items)} items for '{query}':")
        for i, item in enumerate(items[:5], start=1):  # show first 5 results
            data = item.get("data", [{}])[0]
            nasa_id = data.get("nasa_id")
            title = data.get("title")
            print(f"{i}. {title} (NASA ID: {nasa_id})")

        # Ask user to pick one NASA ID for deeper inspection
        nasa_id = input("\nEnter a NASA ID from the list above to fetch details: ").strip()

        print("\n📦 Fetching asset manifest...")
        asset = ingestor.get_asset(nasa_id)
        print("Asset manifest:", asset)

        print("\n📑 Fetching metadata...")
        metadata = ingestor.get_metadata(nasa_id)
        print("Metadata:", metadata)

        print("\n💬 Fetching captions...")
        captions = ingestor.get_captions(nasa_id)
        print("Captions:", captions)

    except Exception as e:
        print("❌ Error during API ingestion:", e)


if __name__ == "__main__":
    main()
