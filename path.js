var Path = {
    'map': function (path) {
        if (Path.routes.hasOwnProperty(path)) {
            return Path.routes[path];
        } else {
            return new Path.core.route(path);
        }
    },
    'root': function (path) {
        Path.routes.root = path;
    },
    'rescue': function (fn) {
        Path.routes.rescue = fn;
    },
    'match': function (path, parameterize) {
        var params = {};
        var route = null;
        var i = null;
        for (route in Path.routes) {
            if (route !== null && route !== undefined) {
                var compare = path;
                if (route.search(/:/) > 0) {
                    for (i = 0; i < route.split("/").length; i++) {
                        if ((i < compare.split("/").length) && (route.split("/")[i][0] === ":")) {
                            params[route.split('/')[i].replace(/:/, '')] = compare.split("/")[i];
                            compare = compare.replace(compare.split("/")[i], route.split("/")[i]);
                        }
                    }
                }

                if (route === compare) {
                    if (parameterize) {
                        Path.routes[route].params = params;
                    }
                    return Path.routes[route];
                }
            }
        }

        return null;
    },
    'dispatch': function () {
        if (Path.routes.current !== location.hash) {
            Path.routes.previous = Path.routes.current;
            Path.routes.current = location.hash;
            var match = Path.match(location.hash, true);
            if (match !== null) {
                match.run();
            } else {
                if (Path.routes.rescue !== null) {
                    Path._exit_previous();
                    /*if (Path.routes[Path.routes.previous].do_exit !== null) {
                        Path.routes[Path.routes.previous].do_exit();
                    }*/

                    Path.routes.rescue();
                }
            }
        }
    },
    'listen': function () {
        if (location.hash === "") {
            if (Path.routes.root !== null) {
                location.hash = Path.routes.root;
            }
        } else {
            Path.dispatch();
        }

        if ("onhashchange" in window) {
            window.onhashchange = Path.dispatch;
        } else {
            setInterval(Path.dispatch, 50);
        }
    },
    '_exit_previous': function () {
        if (Path.routes.previous) {
            var previous = Path.match(Path.routes.previous, false);
            if (previous && previous.do_exit !== null) {
                previous.do_exit();
            }
        }
        
    },
    'core': {
        'route': function (path) {
            this.path = path;
            this.action = null;
            this.do_enter = [];
            this.do_exit = null;
            this.params = {};
            Path.routes[path] = this;
        }
    },
    'routes': {
        'current': null,
        'root': null,
        'rescue': null,
        'previous': null
    }
};
Path.core.route.prototype = {
    'to': function (fn) {
        this.action = fn;
        return this;
    },
    'enter': function (fns) {
        if(fns instanceof Array){
            this.do_enter = this.do_enter.concat(fns);
        } else {
            this.do_enter.push(fns);
        }
        return this;
    },
    'exit': function (fn) {
        this.do_exit = fn;
        return this;
    },
    'run': function () {
        var halt_execution = false;
        Path._exit_previous();

        if (Path.routes[this.path].hasOwnProperty("do_enter")) {
            if (Path.routes[this.path].do_enter.length > 0) {
                for(var i = 0; i < Path.routes[this.path].do_enter.length; i++){
                    result = Path.routes[this.path].do_enter[i]();
                    if(result === false){
                        halt_execution = true;
                        break;
                    }
                }
            }
        }
        if(!halt_execution){
            Path.routes[this.path].action();
        }
    }
};
