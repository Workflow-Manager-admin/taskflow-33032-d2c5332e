#!/bin/bash
cd /home/kavia/workspace/code-generation/taskflow-33032-d2c5332e/taskflow_web_app
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

