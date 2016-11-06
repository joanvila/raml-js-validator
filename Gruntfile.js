module.exports = function(grunt) {

    // Add the grunt-mocha-test tasks.
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-coveralls');

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
        },

        shell: {
            options: {
                stderr: false
            },
            coverage: './node_modules/.bin/istanbul cover node_modules/.bin/_mocha test/ -R spec'
        },

        coveralls: {
            options: {
                // When true, grunt-coveralls will only print a warning rather than
                // an error, to prevent CI builds from failing unnecessarily (e.g. if
                // coveralls.io is down). Optional, defaults to false.
                force: false
            },

            upload: {
                // LCOV coverage file (can be string, glob or array)
                src: 'coverage/lcov.info',
                options: {
                    // Any options for just this target
                }
            }
        }

    });

    grunt.registerTask('mocha', 'mochaTest');
    grunt.registerTask('watch', 'watch');
    grunt.registerTask('lint', 'jshint');
    grunt.registerTask('coverage', 'shell:coverage');
    grunt.registerTask('uploadcoveralls', 'coveralls:upload');

    grunt.registerTask('test', ['jshint', 'mochaTest', 'shell:coverage']);
    grunt.registerTask('default', ['jshint', 'mochaTest']);

};
