/**
 * @description The Gruntfile.js - build file. Tragets are:
 *              - grunt test
 *              - grunt package // package for production
 *                - options --concat, --minify, --no-concat, --no-minify
 *              - grunt // test, package
 *
 * @author Fahim Farook
 *
 */
module.exports = function(grunt) {

   "use strict";

   // display the elapsed execution time of grunt tasks
   require("time-grunt")(grunt);

   // load grunt plugins automatically by looking at task names
   // so no need explicit loading. i.e. grunt.loadNpmTasks('grunt-contrib-clean');
   // task -- plugin matching rules
   //    - <task> -> <task>
   //    - <task> -> grunt-<task>
   //    - <task> -> grunt-contrib-<task>
   require("jit-grunt")(grunt, {
      // for tasks whose name doesn't match the plugin name, load it explicitily.
      useminPrepare: "grunt-usemin"
   });

   // build properties
   // build properties
   var config = (function() {
      var build = grunt.file.readJSON(".ibn-battutarc");
      if (!build) {
         grunt.fail.fatal([".ibn-battutarc doesnt exists"]);
      }

      // optimize
      var defaults = {
         js: {
            minify: true,
            concat: true
         }
      }
      if (!build.optimize) {
         grunt.log.error([".ibn-battutarc doesnt define optimize. Commnad line options or defaults will be used."]);
         build.optimize = defaults;
      } else {
         for (var prop in defaults) {
            if (!build.optimize[prop]) {
               build.optimize[prop] = {};
            }
         }
      }

      // dirs
      if (!(build.src && build.test && build.dist && build.temp)) {
         grunt.fail.fatal([".ibn-battutarc doesnt define mandatory directories: src, test, dist, temp"]);
      }

      // .bowerrc
      var bower = grunt.file.readJSON(".bowerrc");
      if (bower) {
         build.bower = bower;
      } else {
         build.bower = {
            directory: "bower_components"
         };
      }
      // bower.json
      bower = grunt.file.readJSON("bower.json");
      if (!bower || !bower.main) {
         grunt.fail.fatal(["bower.json or main section in bower.json is missing. bower.json=" + bower]);
      }
      for (prop in bower) {
         if (bower.hasOwnProperty(prop)) {
            build.bower[prop] = bower[prop];
         }
      }

      // routes
      var routes = {};
      routes["/" + build.bower.directory] = "./" + build.bower.directory;
      build.routes = routes;

      return build;
   }());

   // configuring grunt...
   grunt.initConfig({

      // settings
      config: config,

      // delete files/ directories
      clean: {
         dist: {
            files: [{
               dot: true, // .tmp
               src: [
                  "<%= config.dist %>",
                  "<%= config.temp %>"
               ]
            }]
         },
         temp: ["<%= config.temp %>"]
      },

      // copy resources to dist or tmp
      copy: {
         // copy js files
         // from: src, to: temp
         // to allow minification (without requirejs)
         js_src_temp: {
            expand: true,
            dot: true,
            cwd: "<%= config.src %>",
            src: "**/*.js",
            dest: "<%= config.temp %>"
         },
         // copy js files
         // from: temp, to: dist
         js_temp_dist: {
            expand: true,
            dot: true,
            cwd: "<%= config.temp %>",
            src: "**/*.js",
            dest: "<%= config.dist %>"
         }
      },

      concat: {
         dist: {
            src: ["<%= config.src %>/**/*.js"],
            dest: "<%= config.temp %>/<%= config.bower.main %>"
         }
      },

      // minify js files
      uglify: {
         target: {
            options: {
               mangle: false
            },
            files: [{
               expand: true,
               cwd: "<%= config.temp %>",
               src: ["**/*.js", "!**/*.min.css"],
               dest: "<%= config.dist %>"
            }]
         }
      },

      // run predefined tasks whenever watched file patterns are added, changed or deleted.
      watch: {
         // by default, if Gruntfile.js is being watched, then changes to it will trigger the watch task to restart
         gruntfile: {
            files: ["Gruntfile.js"]
         },
         scripts: {
            files: ["<%= config.src %>/**/*.js"],
            tasks: ["eslint"]
         },
         testScripts: {
            files: ["<%= config.test %>/**/*.js"],
            tasks: ["test"] // registered test task - basically run mocha
         }
      },

      // start browserSync web server - for unit testing only
      // https://github.com/Browsersync/recipes
      // http://www.browsersync.io/docs/options/
      browserSync: {
         options: {
            notify: false, // don't show any ui notifications in the browser.
            background: true
         },
         fromTest: {
            options: {
               port: config.browserSync.testPort,
               host: config.browserSync.testHost,
               open: false,
               server: {
                  baseDir: [config.temp, config.test, config.src],
                  routes: config.routes // The key - url to match :  value - which folder to serve (relative to current directory)
               }
            }
         }
      },

      // validate javascript
      eslint: {
         options: {
            configFile: ".eslintrc" // where to find eslint configurations
         },
         target: [
            "Gruntfile.js",
            "<%= config.src %>/**/*.js",
            "<%= config.test %>/**/*.js",
            "!**/<%= config.bower.directory %>/**/*.js"
         ]
      },

      // mocha unit test configurations
      mocha: {
         task: {
            options: {
               run: true, // inject mocha run code to html. i.e. mocha.run(); into following url page
               // urls to test via browserSync server
               urls: ["http://<%= browserSync.fromTest.options.host %>:<%= browserSync.fromTest.options.port %>/index.html"]
            },
            dest: "<%= config.temp %>/mocha.out" // test report
         }
      }
   });

   // usage: grunt test
   grunt.registerTask("test", function() {
      grunt.task.run([
         "clean:temp",
         "browserSync:fromTest",
         "mocha"
      ]);
   });

   // usage
   // grunt package               - package for production. Concat and minify based on settings provided in .zahrawirc
   // grunt package --concat      - Overrides settings provided in .zahrawirc
   // grunt package --minify      - Overrides settings provided in .zahrawirc
   // grunt package --no-concat   - Overrides settings provided in .zahrawirc
   // grunt package --no-minify   - Overrides settings provided in .zahrawirc
   grunt.registerTask("package", function() {
      // do configs
      var options = [
         "concat",
         "minify",
         "no-concat",
         "no-minify"
      ];

      for (var i = 0, len = options.length; i < len; i++) {
         if (grunt.option(options[i])) {
            var opts = options[i].split("-");

            var val = opts[0] === "no" ? false : true;
            var action = opts[opts.length - 1]; // concat or minify
            config.optimize.js[action] = val;
         }
      }

      var tasks = ["clean"]; // both .tmp and dist

      if (config.optimize.js.concat) {
         tasks.push("concat");
      } else {
         tasks.push("copy:js_src_temp"); // 2.a
      }

      if (config.optimize.js.minify) { // minify
         tasks.push("uglify");
      } else {
         tasks.push("copy:js_temp_dist");
      }

      grunt.task.run(tasks);
   });

   // usage: grunt
   grunt.registerTask("default", [
      "newer:eslint",
      "test",
      "package"
   ]);
};
