#!/bin/bash
host='140.114.212.43'
username='linaro'

echo "Connecting to $host via sftp."

sftp $username@$host < ./.bin/script.sh
