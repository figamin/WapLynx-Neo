A front-end for [Lynx Chan](https://gitlab.com/mrseth/LynxChan)

For the javascript to work, you will have to create a file named settings.js on the static directory and declare the following variables in it:
* VERBOSE: if true, it will print incoming and outcoming data from the api.
* DISABLE_JS: if true, javascript will not be used.
* API_DOMAIN: domain for the json api.

Example:
```
var VERBOSE = false;
var DISABLE_JS = false;
var API_DOMAIN = 'http://api.localhost:8080/';
```
