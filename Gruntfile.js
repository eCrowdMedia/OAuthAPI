/*jshint node:true*/

var path = require('path');
var LIVERELOAD_PORT = 35729,
    lrSnippet = require('connect-livereload')({
        port: LIVERELOAD_PORT,
        excludeList: []
    });
var mountFolder;

mountFolder = function (connect, dir) {
  return connect.static(path.resolve(dir));
};

module.exports = function(grunt) {

    var config = {
        root: '.',
        src: 'src',
        dist: 'dist',
        hellojs: 'src/hello.js'
    };

    // Project configuration.
    grunt.initConfig({
        config: config,
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %>\n' + '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' + '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' + ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        clean: {
            coffee: ['.tmp'],
            dist: ['<%= config.dist %>/']
        },
        coffee: {
            options: {
                bare: true
            },
            compile: {
                expand: true,
                cwd: '<%= config.src %>',
                src: ['{,*/}*.coffee'],
                dest: '.tmp',
                ext: '.js'
            },
            test: {
                expand: true,
                flatten: true,
                cwd: 'test/fixtures/',
                src: ['*.coffee'],
                dest: '.tmp/test/fixtures',
                ext: '.js'
            }
        },
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                src: [
                    'src/start.frag',
                    '<%= config.hellojs %>',
                    '.tmp/modules/*.js',
                    '.tmp/config.js',
                    '.tmp/main.js',
                    '.tmp/api/*.js',
                    'src/end.frag'
                ],
                dest: '<%= config.dist %>/<%= pkg.name %>.js'
            },
            server: {
                src: '<%= concat.dist.src %>',
                dest: '.tmp/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: '<%= config.dist %>/<%= pkg.name %>.min.js'
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: true,
                boss: true,
                eqnull: true,
                devel: true,
                browser: true,
                globals: {
                    hello: true,
                    readmoo: true
                }
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            src_test: {
                src: '.tmp/*.js'
            },
            test_test: {
                src: ['test/fixtures/*.js']
            }
        },
        watch: {
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    ".tmp"
                ]
            },
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            coffee: {
                files: '<%= config.src %>/**/*.coffee',
                tasks: ['coffee']
            }
        },
        connect: {
            options: {
                port: 8080
            },
            server: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'test'),
                            mountFolder(connect, 'bower_components')
                        ];
                    }
                }
            }
        },
        jasmine: {
            test: {
                src: ['.tmp/<%= pkg.name %>.js'],
                options: {
                    outfile: 'test/index.html',
                    specs: 'test/specs/*Spec.js',
                    helpers: 'test/helpers/*Helper.js',
                    keepRunner: true
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    grunt.registerTask('dev', function () {
        grunt.task.run(['clean', 'coffee', 'jshint', 'concat']);
    });

    grunt.registerTask('server', function () {
        grunt.task.run(['dev', 'connect:server', "concat:server", "watch"]);
    });

    grunt.registerTask('test', function () {
        grunt.task.run(['dev', "jasmine"]);
    });

    grunt.registerTask('build', ['dev', 'uglify']);

    // Default task.
    grunt.registerTask('default', ['test', 'uglify']);

};
