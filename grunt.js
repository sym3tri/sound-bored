/*global module:false*/
module.exports = function(grunt) {
  'use strict';

  // Load up npm task plugins
  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-requirejs');
  grunt.loadNpmTasks('grunt-exec');
  // Load up local tasks
  grunt.loadTasks('grunt/tasks');
  grunt.loadTasks('grunt/helpers');

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    lint: {
      grunt: 'grunt.js',
      server: ['lib/**/*.js', 'app/**/*.js'],
      specs: 'spec/**/*.js',
      client: 'public/js/**/*.js'
    },
    recess: {
      dev: {
        src: ['public/less/base.less'],
        dest: 'public/dist/style.css',
        options: {
          compile: true
        }
      },
      prod: {
        src: ['public/less/*.less'],
        dest: 'public/dist/style.css',
        options: {
          compile: true,
          compress: true
        }
      }
    },
    requirejs: {
      //baseUrl: 'public/js',
      //name: 'main',
      //mainConfigFile: 'public/js/main.js',
      //out: 'public/dist/main.built.js',
      //preserveLicenseComments: false
      appDir: 'public/js',
      baseUrl: './',
      dir: 'public/dist/js',
      name: 'main',
      mainConfigFile: 'public/js/main.js',
      preserveLicenseComments: false,
      optimizeAllPluginResources: true,
      findNestedDependencies: true
    },
    handlebars: {
      srcRoot: 'public/templates/',
      src: 'public/templates/**/*.handlebars',
      dest: 'public/dist/templates/'
    },
    mochaphantom: {
      src: 'test/**/*.js',
      requirejsConfig: '',
      // The port here must match the one used below in the server config
      testRunnerUrl: 'http://127.0.0.1:3002/testrunner/index.html'
    },
    server: {
      port: 3002,
      base: '.'
    },
    copy: {
      dist: {
        files: {
          'public/dist/require.min.js': 'public/js/extern/require/require.min.js',
          'public/dist/require.js': 'public/js/extern/require/require.js',
          'public/dist/index.html': 'public/index.html'
        }
      }
    },
    watch: {
      less: {
        files: ['public/less/**/*.less'],
        tasks: 'less'
      },
      templates: {
        files: ['<config:handlebars.src>'],
        tasks: 'templates'
      },
      lint: {
        files: ['<config:lint.client>', '<config:lint.server>'],
        tasks: 'lint'
      }
    },
    jshint: {
      // Defaults
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        strict: true,
        es5: true,
        trailing: true,
        maxlen: 80
      },
      globals: {
        define: true,
        require: true
      },
      server: {
        options: {
          node: true,
          es5: true,
          strict: true
        },
        globals: {}
      },
      client: {
        options: {
          browser: true
        },
        globals: {
          webkitAudioContext: true,
          webkitRequestAnimationFrame: true,
          console: true,
          Float32Array: true,
          Uint8Array: true,
          Blob: true
        }
      },
      specs: {
        options: {},
        globals: {
          jasmine: true,
          describe: true,
          it: true,
          ait: true,
          expect: true,
          spyOn: true,
          beforeEach: true,
          afterEach: true,
          setFixtures: true
        }
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('less', 'recess:dev');
  grunt.registerTask('compile', 'requirejs');
  grunt.registerTask('templates', 'handlebars');

  // Does a basic build.
  grunt.registerTask('default', 'lint templates copy recess:dev');
  // Does a full production-ready build and compresses and minifies everything.
  grunt.registerTask('prod', 'lint templates requirejs recess:prod');
  grunt.registerTask('test', 'server mochaphantom');
};
