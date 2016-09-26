#!/bin/bash

echo "Do you wish to copy the default settings.js file to your static directory? (y/n)"
read answerSettings

if [ "$answerSettings" == "y" ]; then

cp settings.js.example static/js/settings.js

fi


