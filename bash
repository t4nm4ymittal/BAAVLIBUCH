#!/bin/bash

# Variables
UAT_DIR="/path/to/uat/files"       # Update this with the UAT directory path
DEV_DIR="/path/to/dev/files"       # Update this with the destination directory path on dev
DEV_USER="your_dev_username"       # Replace with your dev server username
DEV_SERVER="dev-server"            # Replace with your dev server hostname or IP
LOG_FILE="/path/to/log_file.log"   # Path to log file

# Generate yesterday's date in the format YYYYMMDD (adjust format if needed)
YESTERDAY_DATE=$(date -d "yesterday" +"%Y%m%d")

# File name pattern - update the prefix as per your actual file naming convention
FILE_PATTERN="somename_$YESTERDAY_DATE"

# Transfer files using rsync
rsync -avz --progress "$UAT_DIR/$FILE_PATTERN" $DEV_USER@$DEV_SERVER:$DEV_DIR >> $LOG_FILE 2>&1

# Check if the transfer was successful
if [ $? -eq 0 ]; then
    echo "[$(date)] File transfer completed successfully" >> $LOG_FILE
else
    echo "[$(date)] File transfer failed" >> $LOG_FILE
fi
