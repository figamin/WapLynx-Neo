**PenumbraLynx** is an updated version of [8TailedLynx](https://gitgud.io/obongo/8TailedLynx)'s Penumbra version.

Install by cloning anywhere and then pointing it to the engine on the global settings. Make sure to check out the correct tag.

To personalize your chan please read LynxChan's documentation on templates.

The favicon in the static directory is served from mongo and will need to be uploaded into MongoDB manually. To do this you need to get the 
mongofiles tool and run

> mongofiles -h localhost -d {dbName} -p 27017 -l {/path/to/yourfavicon} put /favicon.ico

This front end currently requires you to set the URI of the overboard as "overboard".

If you wish to disable javascript for development purposes, declare the variable DISABLE_JS on a file named settings.js and set it's value to any boolean true.

Example:
```
var DISABLE_JS = false;
```

A note on the settings file, every page links to it, so if you don't want a bunch of 404's popping up, you should create this file.