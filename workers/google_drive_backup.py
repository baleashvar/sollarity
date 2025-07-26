import os
import json
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
import pickle
from datetime import datetime
from data_backup_manager import DataBackupManager

class GoogleDriveBackup:
    def __init__(self):
        self.SCOPES = ['https://www.googleapis.com/auth/drive.file']
        self.service = None
        self.backup_manager = DataBackupManager()
        
    def authenticate(self):
        """Authenticate with Google Drive API"""
        creds = None
        token_file = '../config/drive_token.pickle'
        credentials_file = '../config/drive_credentials.json'
        
        # Load existing token
        if os.path.exists(token_file):
            with open(token_file, 'rb') as token:
                creds = pickle.load(token)
        
        # If no valid credentials, get new ones
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                if not os.path.exists(credentials_file):
                    print("Google Drive credentials file not found!")
                    print("Please download credentials.json from Google Cloud Console")
                    return False
                    
                flow = InstalledAppFlow.from_client_secrets_file(
                    credentials_file, self.SCOPES)
                creds = flow.run_local_server(port=0)
            
            # Save credentials for next run
            with open(token_file, 'wb') as token:
                pickle.dump(creds, token)
        
        self.service = build('drive', 'v3', credentials=creds)
        return True
    
    def create_backup_folder(self):
        """Create Sollarity backup folder in Google Drive"""
        try:
            # Check if folder exists
            results = self.service.files().list(
                q="name='Sollarity_Backups' and mimeType='application/vnd.google-apps.folder'",
                fields="files(id, name)"
            ).execute()
            
            folders = results.get('files', [])
            
            if folders:
                return folders[0]['id']
            
            # Create folder if it doesn't exist
            folder_metadata = {
                'name': 'Sollarity_Backups',
                'mimeType': 'application/vnd.google-apps.folder'
            }
            
            folder = self.service.files().create(
                body=folder_metadata,
                fields='id'
            ).execute()
            
            print(f"Created backup folder: {folder.get('id')}")
            return folder.get('id')
            
        except Exception as e:
            print(f"Error creating backup folder: {e}")
            return None
    
    def upload_backup(self, file_path, folder_id):
        """Upload backup file to Google Drive"""
        try:
            filename = os.path.basename(file_path)
            
            file_metadata = {
                'name': filename,
                'parents': [folder_id]
            }
            
            media = MediaFileUpload(file_path, resumable=True)
            
            file = self.service.files().create(
                body=file_metadata,
                media_body=media,
                fields='id,name,size'
            ).execute()
            
            file_size_mb = int(file.get('size', 0)) / (1024 * 1024)
            print(f"Uploaded to Google Drive: {file.get('name')} ({file_size_mb:.2f} MB)")
            
            return file.get('id')
            
        except Exception as e:
            print(f"Error uploading to Google Drive: {e}")
            return None
    
    def cleanup_old_backups(self, folder_id, keep_days=30):
        """Remove backups older than specified days from Google Drive"""
        try:
            from datetime import timedelta
            cutoff_date = datetime.now() - timedelta(days=keep_days)
            cutoff_str = cutoff_date.isoformat() + 'Z'
            
            # Find old backup files
            results = self.service.files().list(
                q=f"parents in '{folder_id}' and createdTime < '{cutoff_str}'",
                fields="files(id, name, createdTime)"
            ).execute()
            
            old_files = results.get('files', [])
            
            for file in old_files:
                self.service.files().delete(fileId=file['id']).execute()
                print(f"Deleted old backup: {file['name']}")
            
            if old_files:
                print(f"Cleaned up {len(old_files)} old backups from Google Drive")
                
        except Exception as e:
            print(f"Error cleaning up old backups: {e}")
    
    def run_drive_backup(self):
        """Run complete Google Drive backup process"""
        print("Starting Google Drive backup...")
        
        # Authenticate
        if not self.authenticate():
            print("Google Drive authentication failed")
            return False
        
        # Create local backup first
        date_str = datetime.now().strftime('%Y%m%d')
        backup_file = self.backup_manager.create_compressed_backup(date_str)
        
        if not backup_file:
            print("No data to backup")
            return False
        
        # Create/get backup folder
        folder_id = self.create_backup_folder()
        if not folder_id:
            print("Failed to create backup folder")
            return False
        
        # Upload backup
        file_id = self.upload_backup(backup_file, folder_id)
        
        if file_id:
            # Clean up old backups
            self.cleanup_old_backups(folder_id)
            
            # Clean up MongoDB data
            self.backup_manager.cleanup_old_data()
            
            print("Google Drive backup completed successfully")
            return True
        else:
            print("Google Drive backup failed")
            return False

def setup_google_drive():
    """Setup instructions for Google Drive API"""
    print("Google Drive Backup Setup Instructions:")
    print("1. Go to https://console.cloud.google.com/")
    print("2. Create a new project or select existing")
    print("3. Enable Google Drive API")
    print("4. Create credentials (OAuth 2.0 Client ID)")
    print("5. Download credentials.json")
    print("6. Place it in config/drive_credentials.json")
    print("7. Run this script to authenticate")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "setup":
        setup_google_drive()
    else:
        drive_backup = GoogleDriveBackup()
        drive_backup.run_drive_backup()