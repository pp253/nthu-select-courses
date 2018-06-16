#!/bin/bash
host='35.201.137.92'
username='pp_pp253'

echo "Connecting to $host via sftp."

sftp $username@$host < ./.bin/script.sh
