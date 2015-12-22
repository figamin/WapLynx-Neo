#!/bin/bash

if [ -z $1 ]; then
  echo "Usage: ./set-domain.sh yourdomain. The string 'localhost:8080' will be replaced by yourdomain on all files."
else
  find . -type f \( -name "*.css" -o -name "*.html" \) -exec sed -i "s/localhost:8080/$1/g" {} +
fi


