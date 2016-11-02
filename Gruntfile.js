module.exports = function(grunt) {

    // Add the grunt-mocha-test tasks.
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.initConfig({

        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/**/*.js']
            }
        },

        watch: {
            js: {
                files: ['bin/**/*.js', 'lib/**/*.js'],
                tasks: ['jshint'],
            }
        },

        jshint: {
            options: {
                'esversion': 6,
                'node': true,
                'mocha': true
            },
            all: [
                'Gruntfile.js',
                'bin/**/*.js',
                'lib/**/*.js',
                '!node_modules/**/'
            ]
        }

    });

    grunt.registerTask('mocha', 'mochaTest');
    grunt.registerTask('watch', 'watch');
    grunt.registerTask('lint', 'jshint');

    grunt.registerTask('test', ['jshint', 'mochaTest']);
    grunt.registerTask('default', ['jshint', 'mochaTest']);

};
