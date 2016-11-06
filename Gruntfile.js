module.exports = function(grunt) {

    // Add the grunt-mocha-test tasks.
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-shell');

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
            target: './node_modules/.bin/istanbul cover node_modules/.bin/_mocha test/ -R spec'
        }

    });

    grunt.registerTask('mocha', 'mochaTest');
    grunt.registerTask('watch', 'watch');
    grunt.registerTask('lint', 'jshint');
    grunt.registerTask('coverage', 'shell');

    grunt.registerTask('test', ['jshint', 'mochaTest']);
    grunt.registerTask('default', ['jshint', 'mochaTest']);

};
