#!/usr/bin/env bash
#   Use this script to test if a given TCP host/port are available

# The MIT License (MIT)
# Copyright (c) 2016-2021 vishnubob

set -e

TIMEOUT=15
QUIET=0
HOST=""
PORT=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    -h|--host)
      HOST="$2"
      shift 2
      ;;
    -p|--port)
      PORT="$2"
      shift 2
      ;;
    -t|--timeout)
      TIMEOUT="$2"
      shift 2
      ;;
    -q|--quiet)
      QUIET=1
      shift
      ;;
    *)
      shift
      ;;
  esac
done

if [[ -z "$HOST" || -z "$PORT" ]]; then
  echo "Usage: $0 -h host -p port [-t timeout] [-q]"
  exit 1
fi

for ((i=0;i<TIMEOUT;i++)); do
  if nc -z "$HOST" "$PORT"; then
    [[ $QUIET -ne 1 ]] && echo "Host $HOST:$PORT is available!"
    exit 0
  fi
  sleep 1
  [[ $QUIET -ne 1 ]] && echo "Waiting for $HOST:$PORT... ($((i+1))/$TIMEOUT)"

done

[[ $QUIET -ne 1 ]] && echo "Timeout after $TIMEOUT seconds waiting for $HOST:$PORT"
exit 1 