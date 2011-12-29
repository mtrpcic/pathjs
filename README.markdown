# PathJS #

PathJS is a lightweight, client-side routing library that allows you to create "single page" applications using Hashbangs and/or HTML5 pushState.

# Features #
* Lightweight
* Supports the HTML5 History API, the 'onhashchange' method, and graceful degredation
* Supports root routes, rescue methods, paramaterized routes, optional route components (dynamic routes), and Aspect Oriented Programming
* Well Tested (tests available in the `./tests` directory)
* Compatible with all major browsers (Tested on Firefox 3.6, Firefox 4.0, Firefox 5.0, Chrome 9, Opera 11, IE7, IE8, IE9)
* Independant of all third party libraries, but plays nice with all of them

# Using PathJS - A Brief Example #

    function clearPanel(){
        // You can put some code in here to do fancy DOM transitions, such as fade-out or slide-in.
    }
    
    Path.map("#/users").to(function(){
        alert("Users!");
    });
    
    Path.map("#/comments").to(function(){
        alert("Comments!");
    }).enter(clearPanel);
    
    Path.map("#/posts").to(function(){
        alert("Posts!");
    }).enter(clearPanel);
    
    Path.root("#/posts");
    
    Path.listen();

# Documentation and Tips #
Any of the examples above confuse you?  Read up on the details in the [wiki](https://github.com/mtrpcic/pathjs/wiki).

# Examples #
You can find examples on the official [Github Page](http://mtrpcic.github.com/pathjs).

# Running Tests #
To run the tests, simply navigate to the `./tests` folder and open the HTML file in your browser.  Please note that the HTML5 History API is not compatible with the
`file://` protocol, and to run the tests in the `tests/pushstate` folder, you will need to run them through a webserver such as nginx or Apache.

# Next Steps #
* Adding support for "after" callbacks
* Deprecating the "enter" callback in favour of "before"

# Pull Requests #
To make a pull request, please do the following:

* Mention what specific version of PathJS you were using when you encountered the issue/added the feature.  This can be accessed by doing `Path.version` in a debugger console
* Provide a [pastie](http://pastie.org/) or [gist](https://gist.github.com/) that demonstrates the bug/feature
* Make sure you update the test suite with your changes.  **All tests must pass**
* Make sure to update the minified version of the source
* Do **not** modify the `Path.version` attribute.  I will modify that manually when merging the request

# Disclaimer #
This code is provided with no warranty.  While I strive to maintain backwards compatibility, the code is still under active development.  As this is the case, some revisions may break break compatibility with earlier versions of the library.  Please keep this in mind when using PathJS.

# Copyright and Licensing #
Copyright (c) 2011 Mike Trpcic, released under the MIT license.
