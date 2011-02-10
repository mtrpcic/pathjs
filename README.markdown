# PathJS #

PathJS is a lightweight, client-side routing library that allows you to create "single page" applications.

# Features #
* Lightweight
* Tested (tests available in the `./tests` directory)
* Supports the `onhashchange` method
* Supports paramaterized routes
* Supports Aspect Oriented Programming
* Compatible with all major browsers
* Allows you to define root routes, and rescue methods

# Using PathJS #

**Explanation**

PathJS allows you to bind methods to specific routes, providing you with the ability to dynamically change the content of your web page.  A route can be any string prepended with a hash, such as:

    #/my/first/route
    #!/hashbang/route
    #kittens

**Binding Routes**

PathJS provides the `Path` object.  This is the root of the library, and is your gateway into route-defining heaven.  You can define your routes like so:

    // Use an anonymous function
    Path.map("#/my/first/route").to(function(){
        alert("Hello, World!");
    });

    // Or define one and use it
    function hello_world(){
        alert("Hello, World!");
    }
    Path.map("#/kittens").to(hello_world);

**Aspect Oriented Programming**

In addition to defining methods that will be executed when a route is activated, you can define methods that will be called _before_ a route
is activated, and _after_ a route is left.  This can be done via the `enter` and `exit` methods, respectively.  They work exactly the same as
the `to` method:

    //Let's add an 'enter' method to one of our routes
	Path.map("#/my/first/route").enter(function(){
	    alert("Enter, minions!");
	});
	
	// You can also chain the methods together
	Path.map("#!/hashbang/route").enter(fade_in).to(function(){
	    alert("Method chaining is great!");
	}).exit(fade_out);

**Route Parameters**

What good would a routing system be if it didn't allow you to use parameters?  If you provide a route that contains a `:token`, that token
will match anything, as long as the rest of the route matches as well.  You can access the parameters inside your methods via the `this.params`
object:

    Path.map("#/users/:name").to(function{
	    alert("Username: " + this.params['name']);
	});
	
The above route will match any of the following `href`s:

    #/users/mike
	#/users/27
	
**Root Route**

If a user were to land on your page without a route defined, you can force them to use a root route.  This route will be automatically selected on page load:

    Path.root("#/home");
	
**Rescue Method**

If a route somehow ended up in your system without being properly bound to an action, you can specify a "rescue" method that will be called.  This lets you provide instant user feedback if they click an undefined route:

    Path.rescue(function(){
	    alert("404: Route Not Found");
	});
	
**Automatic Dispatching**

If a user gets to your page with an already defined route (for example, the click a referral link with the `href` of "www.yoursite.com/media#download"),
PathJS will automatically find and execute the appropriate route methods.

**Listen Carefully**

You can define routes all day long, but if you don't tell us to listen for them, nothing's going to happen.  Once you've got your
routes defined, start the listener up by simply typing:

    Path.listen();

You should *always* wrap your `Path.listen()` statements in some form of "Document Ready" method.  This prevents errors when users come 
to your site with a predefined route.  Without knowing the DOM is completely done loading, that route will be executed, and may try to
perform operations it won't yet have the ability to do.

# Disclaimer #
This code is still under development, and as such, minor revisions may break compatibility with earlier versions of
the library.  Please keep this in mind when using PathJS.

# Copyright and Licensing #
Copyright (c) 2010 Mike Trpcic, released under the MIT license.
