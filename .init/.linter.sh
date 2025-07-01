#!/bin/bash
cd /home/kavia/workspace/code-generation/bmi-calculator-webapp-118054-3f2b2f31/react_js_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

