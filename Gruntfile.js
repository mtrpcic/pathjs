module.exports = function(grunt) {
  grunt.initConfig({

    connect: {
      server: {
        options: {
          port: 9001,
          base: '.'
        }
      }
    },

    webdriver: {
      pathjs: {
        options: {
          logLevel: 'silent',
          browser: 'firefox',
          binary: null
        },
        url: 'http://localhost:9001/tests/path.js.test.html',
        tests: ['./tests/spec/pathjsSpec.js']
      },
      pathjs_min: {
        options: {
          logLevel: 'silent',
          browser: 'firefox',
          binary: null
        },
        url: 'http://localhost:9001/tests/path.min.js.test.html',
        tests: ['./tests/spec/pathjsSpec.js']
      }
    },

    uglify: {
      my_target: {
        files: {
          'path.min.js': ['path.js']
        }
      }
    },

    jshint: {
      options: {
        "globals": {
          "exports": true,
          "buster": true
        }
      },
      all: ['Gruntfile.js', 'path.js', 'tests/spec/**/*.js']
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-webdriver');

  grunt.registerTask('default', ['jshint', 'uglify', 'connect', 'webdriver']);

};
