import pymongo
import os
from dotenv import load_dotenv

load_dotenv('../config/.env')

client = pymongo.MongoClient(os.getenv('MONGO_URI'))
db = client['test']

def check_all_collections():
    """Check all collections in database"""
    print("🔍 Checking all collections...")
    
    collections = db.list_collection_names()
    print(f"📊 Found collections: {collections}")
    
    for collection_name in collections:
        collection = db[collection_name]
        count = collection.count_documents({})
        print(f"  {collection_name}: {count} documents")
        
        if count > 0:
            # Show sample document
            sample = collection.find_one()
            print(f"    Sample: {list(sample.keys()) if sample else 'None'}")
    
    # Specifically check for BONK data
    print(f"\n🔍 Checking for BONK data...")
    bonk_address = 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'
    
    for collection_name in collections:
        collection = db[collection_name]
        
        # Try different field names
        bonk_count_address = collection.count_documents({'address': bonk_address})
        bonk_count_coinAddress = collection.count_documents({'coinAddress': bonk_address})
        
        if bonk_count_address > 0:
            print(f"  {collection_name}: {bonk_count_address} BONK docs (address field)")
        if bonk_count_coinAddress > 0:
            print(f"  {collection_name}: {bonk_count_coinAddress} BONK docs (coinAddress field)")

if __name__ == "__main__":
    check_all_collections()