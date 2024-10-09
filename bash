#!/bin/bash

# Variables
UAT_DIR="/path/to/uat/files"
DEV_DIR="/path/to/dev/files"
DEV_USER="your_dev_username"
DEV_SERVER="dev-server"
LOG_FILE="/path/to/log_file.log"

# Transfer files using rsync
rsync -avz --progress $UAT_DIR/ $DEV_USER@$DEV_SERVER:$DEV_DIR >> $LOG_FILE 2>&1

if [ $? -eq 0 ]; then
    echo "[$(date)] File transfer completed successfully" >> $LOG_FILE
else
    echo "[$(date)] File transfer failed" >> $LOG_FILE
fi
