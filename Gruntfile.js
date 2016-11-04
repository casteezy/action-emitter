module.exports = function (grunt) {
    "use strict";

    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

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
                    // 'app/lib/font-awesome/font-awesome.css': 'node_modules/bootstrap-sass',
                    // 'app/lib/font-awesome/font-awesome.css': 'node_modules/font-awesome/font-awesome.scss',
                    'app/dist/app.css': 'app/index.scss',
                }
            }
        },

        watch: {
            scripts: {
                files: [
                    'app/index.scss',
                ],
                tasks: ['sass'],
                options: {
                    spawn: false,
                    livereload: 3000
                },
            },
        }
    });


    /**
     * Registers/starts a watch for running the SVO app.
     */
    grunt.registerTask('build', ['sass']);
    grunt.registerTask('default', ['build', 'watch']);
}
