module.exports = function (grunt) {
  var modRewrite = require('connect-modrewrite');
  (require('matchdep')).filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    dir: {
      dist: 'dist',
      src: 'src',
      js: 'js',
      image: 'image',
      fonts: 'fonts',
      misc: 'misc',
      build: 'build',
      less: 'less',
      css: 'css',
      coffee: 'coffee',
      jade: 'jade',
      html: 'html',
      docs: 'docs',
      assets: 'assets',
      images: 'images'
    },
    qunit: {
      files: ['test/**/*.html']
    },
    less: {
      development: {
        expand: true,
        cwd: '<%= dir.src %>/<%= dir.less %>/',
        src: '**/*.less',
        dest: '<%= dir.build %>/<%= dir.css %>/',
        ext: '.css'
      }
    },
    jade: {
      dist: {
        options: {
          pretty: true
        },
        expand: true,
        cwd: '<%= dir.src %>/<%= dir.jade %>',
        src: '**/*.jade',
        dest: '<%= dir.dist %>',
        ext: '.html'
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    coffeelint: {
      app: '**/<%= dir.coffee %>/*.coffee'
    },
    coffee: {
      build: {
        expand: true,
        cwd: '<%= dir.src %>/<%= dir.coffee %>',
        src: '**/*.coffee',
        dest: '<%= dir.build %>/<%= dir.js %>',
        ext: '.js'
      }
    },
    copy: {
      html: {
        expand: true,
        cwd: '<%= dir.src %>/<%= dir.html %>',
        src: '**/*',
        dest: '<%= dir.dist %>/<%= dir.template %>/'
      },
      bootstrap_fonts: {
        expand: true,
        cwd: './bower_components/bootstrap/dist/fonts/',
        src: '**/*',
        dest: '<%= dir.dist %>/<%= dir.fonts %>/'
      },
      awesomefont: {
        expand: true,
        cwd: './bower_components/components-font-awesome/fonts/',
        src: '**/*',
        dest: '<%= dir.dist %>/<%= dir.fonts %>/'
      },
      image: {
        expand: true,
        cwd: '<%= dir.src %>/<%= dir.image %>',
        src: '**/*',
        dest: '<%= dir.dist %>/<%= dir.image %>/'
      },
      favicon: {
        expand: true,
        cwd: '<%= dir.src %>/<%= dir.image %>',
        src: 'favicon.png',
        dest: '<%= dir.dist %>/<%= dir.assets %>/<%= dir.images %>'
      },
      misc: {
        expand: true,
        cwd: '<%= dir.src %>/<%= dir.misc %>',
        src: '**/*',
        dest: '<%= dir.dist %>/'
      },
      js_dev: {
        src: '<%= dir.build %>/<%= dir.js %>/libs.js',
        dest: '<%= dir.dist %>/<%= dir.js %>/libs.min.js'
      }
    },
    bower_concat: {
      all: {
        dest: '<%= dir.build %>/<%= dir.js %>/bower_library.js',
        cssDest: '<%= dir.build %>/<%= dir.css %>/bower_libs.css',
        bowerOptions: {
          relative: false
        }
      }
    },
    concat: {
      js: {
        options: {
          separator: ';'
        },
        src: ['<%= dir.build %>/<%= dir.js %>/bower_library.js', '<%= dir.build %>/<%= dir.js %>/*.js'],
        dest: '<%= dir.build %>/<%= dir.js %>/libs.js'
      },
      css: {
        src: ['<%= dir.build %>/<%= dir.css %>/bower_libs.css', '<%= dir.build %>/<%= dir.css %>/*.css'],
        dest: '<%= dir.build %>/<%= dir.css %>/libs.css'
      }
    },
    uglify: {
      dist: {
        files: {
          '<%= dir.dist %>/<%= dir.js %>/libs.min.js': '<%= dir.build %>/<%= dir.js %>/libs.js'
        }
      }
    },
    cssmin: {
      target: {
        files: [
          {
            expand: true,
            cwd: '<%= dir.build %>/<%= dir.css %>',
            src: ['*.css'],
            dest: '<%= dir.dist %>/<%= dir.css %>',
            ext: '.min.css'
          }
        ]
      }
    },
    clean: {
      dist: {
        src: '<%= dir.dist %>'
      },
      dist_js: {
        src: '<%= dir.dist %>/<%= dir.js %>'
      },
      build: {
        src: '<%= dir.build %>'
      },
      build_js: {
        src: '<%= dir.build %>/<%= dir.js %>'
      },
      docs: {
        src: '<%= dir.docs %>'
      },
      images: {
        src: ['<%= dir.dist %>/<%= dir.img %>']
      },
      dev: {
        src: '<%= dir.build %>/<%= dir.js %>/constants-prod.js'
      },
      prod: {
        src: '<%= dir.build %>/<%= dir.js %>/constants-dev.js'
      }
    },
    connect: {
      options: {
        livereload: 35729,
        hostname: '*'
      },
      livereload: {
        options: {
          open: false,
          base: ['<%= dir.dist %>'],
          middleware: function (connect, options) {
            var middlewares;
            middlewares = [];
            middlewares.push(modRewrite(['^[^\\.]*$ /index.html [L]']));
            options.base.forEach(function (base) {
              return middlewares.push(connect["static"](base));
            });
            return middlewares;
          }
        }
      }
    },
    watch: {
      jade: {
        files: '<%= dir.src %>/**/*.jade',
        tasks: ['jade:dist']
      },
      coffee: {
        files: '<%= dir.src %>/**/*.coffee',
        tasks: ['clean:build_js', 'clean:dist_js', 'coffee:build', 'bower_concat', 'concat:js', 'copy:js_dev']
      },
      less: {
        files: '<%= dir.src %>/**/*.less',
        tasks: ['default']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: ['<%= dir.dist %>/**.*']
      }
    }
  });
  grunt.registerTask('default', ['clean', 'jade:dist', 'coffee:build', 'less:development', 'clean:dev', 'bower_concat', 'concat', 'cssmin', 'copy']);
  grunt.registerTask('w', ['default', 'connect', 'watch']);
  grunt.registerTask('build', ['clean', 'jade:dist', 'coffee:build', 'less:development', 'clean:prod', 'bower_concat', 'concat', 'uglify', 'cssmin', 'copy:html', 'copy:bootstrap_fonts', 'copy:awesomefont', 'copy:image', 'copy:favicon', 'copy:misc']);
  grunt.registerTask('heroku:development', ['build']);
};
