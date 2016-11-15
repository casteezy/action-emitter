module.exports = function(grunt) {
    "use strict";

    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-ts');

    grunt.initConfig({

        /**
         * Compile Sass files to CSS using node-sass.
         */
        sass: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    'src/app/dist/css/app.css': 'src/app/app.scss',
                }
            }
        },

        /**
         * Copy files/folders into other directories
         */
        copy: {
            main: {
                files: [{
                    cwd: 'node_modules/font-awesome/',
                    src: ['css/*', 'fonts/*'],
                    expand: true,
                    dest: 'src/app/lib/font-awesome/',
                    filter: 'isFile'
                }, {
                    cwd: 'node_modules/bootstrap/dist',
                    src: ['css/*.min.*', 'fonts/*', 'js/*.min.*'],
                    expand: true,
                    dest: 'src/app/lib/bootstrap/',
                    filter: 'isFile'
                }, {
                    cwd: 'node_modules/jquery/dist/',
                    src: ['jquery.min.js', 'jquery.min.map'],
                    expand: true,
                    dest: 'src/app/lib/jquery/',
                    filter: 'isFile'
                }, {
                    cwd: 'node_modules/',
                    src: [
                        'angular/*.min.js',
                        'angular/*.min.js.map',
                        'angular-route/*.min.*',
                        'angular-sanitize/*.min.*'
                    ],
                    expand: true,
                    dest: 'src/app/lib/',
                    filter: 'isFile'
                }],
            },
        },

        /**
         * Compile all TS files. Wraps the `tsc` command-line compiler
         */
        ts: {
            default: {
                options: {
                    additionalFlags: '--pretty'
                },
                src: ["src/app/**/*.ts", "!node_modules/**"],
                dest: 'src/app/dist/js'
            }
        },


        watch: {
            scripts: {
                files: [
                    'src/app/app.scss',
                ],
                tasks: ['sass'],
                options: {
                    spawn: false,
                    livereload: 3000
                },
            },
        }
    });

    // Copy npm package files into dist/ folder and compile sass
    grunt.registerTask('build', ['copy', 'sass', 'ts']);

    // Compile sass and watch for sass changes
    grunt.registerTask('default', ['sass', 'ts', 'watch']);
};
