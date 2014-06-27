module.exports = function(grunt) {
    grunt.initConfig({
        uglify: {
            options: {
                mangle: true,
                compress: true,
                sourceMap: 'dest/exam.js.map',
                banner: '/* Nightingale Studio 2014 golovim@gmail.com */\n'
            },
            target: {
                src: 'src/exam.js',
                dest: 'dist/exam.min.js'
            }
        },
        jshint: {
            build: {
                src: 'src/*.js',
                options: {
                    "eqeqeq": true,
                    "curly": true,
                    "eqnull": true,
                    "browser": true,
                    "unused": true,
                    "undef": true,
                    "indent": 4,
                    "latedef": true,
                    "camelcase": true,
                    "maxdepth": 2,
                    "funcscope": true,
                    "notypeof": true,
                    "globals": {
                        $: true
                    }
                }
            },
            dev: {
                src: 'src/*.js',
                options: {
                    "eqeqeq": true,
                    "curly": true,
                    "undef": true,
                    "eqnull": true,
                    "browser": true,
                    "indent": 4,
                    "latedef": true,
                    "camelcase": true,
                    "maxdepth": 2,
                    "funcscope": true,
                    "notypeof": true,
                    "globals": {
                        $: true
                    }
                }
            }
        },
        watch: {
            dev: {
                files: ['src/*.js', 'test/*.js', '*.html', 'css/*.css'],
                tasks: ['jshint:dev', 'jasmine', 'notify:test']
            }
        },
        clean: {
            target: ['dist']
        },
        karma: {
            dev: {
                configFile: 'karma.conf.js',
                browsers: ['PhantomJS']
            },
            travis: {
                configFile: 'karma.conf.js',
                browsers: ['Firefox']
            },
            build: {
                configFile: 'karma.conf.js',
                browsers: ['Safari', 'Chrome', 'Firefox']
            }
        },
        connect: {
            server: {
                options: {
                    port: 3333,
                    open: {
                        target: 'http://localhost:3333'
                    }
                }
            }
        },
        notify: {
            test: {
                options: {
                    title: 'Exam.js',
                    message: 'Tests passed!'
                }
            }
        },
        coveralls: {
            options: {
                // LCOV coverage file relevant to every target
                src: 'coverage/**/*.info'
            }
        },
        jasmine: {
            exam: {
                src: 'src/**/*.js',
                options: {
                    specs: 'test/*Spec.js',
                    helpers: 'spec/*Helper.js'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-coveralls');
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    grunt.registerTask('test', ['jasmine']);
    grunt.registerTask('travis-ci-test', ['jshint', 'karma:travis', 'coveralls']);
    grunt.registerTask('default', ['clean', 'jshint:build', 'karma:build', 'uglify', 'coveralls']);
    grunt.registerTask('dev', ['watch']);
};
