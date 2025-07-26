import pymongo
import json
import os
import zipfile
import schedule
import time
from datetime import datetime, timedelta
from dotenv import load_dotenv
from google_drive_backup import GoogleDriveBackup

load_dotenv('../config/.env')

class SollarityBackup:
    def __init__(self):
        self.client = pymongo.MongoClient(os.getenv('MONGO_URI'))
        self.db = self.client['test']
        self.coins_collection = self.db['coins']
        self.backup_dir = '../backups'
        self.drive_backup = GoogleDriveBackup()
        
        if not os.path.exists(self.backup_dir):
            os.makedirs(self.backup_dir)
    
    def get_old_data(self):
        """Get data older than 24 hours"""
        cutoff_time = datetime.utcnow() - timedelta(hours=24)
        return list(self.coins_collection.find({"lastUpdated": {"$lt": cutoff_time}}))
    
    def create_backup(self):
        """Create compressed backup"""
        old_data = self.get_old_data()
        
        if not old_data:
            print("No old data to backup")
            return None
        
        date_str = datetime.now().strftime('%Y%m%d')
        
        # Create JSON backup
        backup_data = {
            'export_date': date_str,
            'coins_count': len(old_data),
            'coins': old_data
        }
        
        json_file = f"{self.backup_dir}/sollarity_backup_{date_str}.json"
        with open(json_file, 'w') as f:
            json.dump(backup_data, f, default=str, indent=2)
        
        # Create ZIP
        zip_file = f"{self.backup_dir}/sollarity_backup_{date_str}.zip"
        with zipfile.ZipFile(zip_file, 'w', zipfile.ZIP_DEFLATED) as zipf:
            zipf.write(json_file, os.path.basename(json_file))
        
        os.remove(json_file)  # Clean up JSON file
        
        print(f"Backup created: {zip_file} ({len(old_data)} records)")
        return zip_file
    
    def cleanup_old_data(self):
        """Remove old data from MongoDB"""
        cutoff_time = datetime.utcnow() - timedelta(hours=24)
        result = self.coins_collection.delete_many({"lastUpdated": {"$lt": cutoff_time}})
        print(f"Cleaned up {result.deleted_count} old records from MongoDB")
    
    def run_backup(self):
        """Run complete backup process"""
        print(f"Starting backup - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Create local backup
        backup_file = self.create_backup()
        
        if not backup_file:
            return False
        
        success = True
        
        # Try Google Drive upload
        try:
            if self.drive_backup.authenticate():
                folder_id = self.drive_backup.create_backup_folder()
                if folder_id and self.drive_backup.upload_backup(backup_file, folder_id):
                    print("Google Drive backup successful")
                    self.drive_backup.cleanup_old_backups(folder_id)
                else:
                    print("Google Drive backup failed")
                    success = False
            else:
                print("Google Drive authentication failed")
                success = False
        except Exception as e:
            print(f"Google Drive error: {e}")
            success = False
        
        # Clean up MongoDB if backup succeeded
        if success:
            self.cleanup_old_data()
        
        return success
    
    def start_scheduler(self):
        """Start daily backup scheduler"""
        print("Sollarity Backup Scheduler")
        print("Daily backup at 2:00 AM")
        print("Press Ctrl+C to stop")
        
        schedule.every().day.at("02:00").do(self.run_backup)
        
        try:
            while True:
                schedule.run_pending()
                time.sleep(60)
        except KeyboardInterrupt:
            print("\nBackup scheduler stopped")

if __name__ == "__main__":
    import sys
    backup = SollarityBackup()
    
    if len(sys.argv) > 1 and sys.argv[1] == "manual":
        backup.run_backup()
    else:
        backup.start_scheduler()