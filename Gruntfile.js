/*global module:false*/
module.exports = function(grunt) {

    var config = {
        root: '.',
        src: 'src',
        dist: 'dist',
        lib: 'lib'
    };

    // Project configuration.
    grunt.initConfig({
        config: config,
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %>\n' + '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' + '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' + ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        clean: {
            coffee: ['<%= config.src %>/.tmp/'],
            dist: ['<%= config.dist %>/']
        },
        coffee: {
            compile: {
                expand: true,
                flatten: true,
                cwd: '<%= config.src %>',
                src: ['*.coffee'],
                dest: '<%= config.src %>/.tmp/',
                ext: '.js'
            }
        },
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                src: ['<%= config.lib %>/hello.js', '<%= config.src %>/.tmp/*.js'],
                dest: '<%= config.dist %>/<%= pkg.name %>.js'
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
                globals: {}
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            src_test: {
                src: '<%= config.src %>/.tmp/*.js'
            }
        },
        watch: {
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
            test: {
                options: {
                    port: 8080,
                    base: '.',
                    keepalive: true
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

    // Default task.
    grunt.registerTask('default', ['clean', 'coffee', 'jshint', 'concat', 'uglify']);

};
