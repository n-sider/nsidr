module.exports = function( grunt )
{
    "use strict";

    // Environment variables
    grunt.registerTask( "envDev", "Set environment variables for development", function ()
    {
        grunt.config( "webRoot", "http://dev-local.nstitute.org/" );
        grunt.config( "FBAppID", "872324099517192" );
        grunt.config( "compress", false );

    } );

    grunt.registerTask( "envStaging", "Set environment variables for staging", function ()
    {
        grunt.config( "webRoot", "http://dev.nstitute.org/" );
        grunt.config( "FBAppID", "872324989517103" );
        grunt.config( "compress", true );

    } );

    grunt.registerTask( "envProd", "Set environment variables for production", function ()
    {
        grunt.config( "webRoot", "http://www.nstitute.org/" );
        grunt.config( "FBAppID", "869448453138090" );
        grunt.config( "compress", true );

    } );

    // Task configuration
    grunt.initConfig( {

        pkg: grunt.file.readJSON( "package.json" ),

        watch:
        {
            options:
            {
                atBegin: true,
                event: [ "changed", "added", "deleted" ]
            },
            scripts:
            {
                files: [
                    "source/modules/**/*.js"
                ],
                tasks: [ "envDev", "ngtemplates", "concat:scripts", "replace" ]
            },
            styles:
            {
                files: [
                    "source/modules/*/styles/*.*"
                ],
                tasks: [ "less", "postcss" ]
            },
            templates:
            {
                files: [
                    "source/modules/*/templates/*.*",
                    "!source/modules/_nstitute/templates/index.html"
                ],
                tasks: [ "envDev", "ngtemplates", "concat:scripts", "replace" ]
            },
            index:
            {
                files: [
                    "source/modules/_nstitute/templates/index.html"
                ],
                tasks: [ "envDev", "copy:index", "replace", "ejs" ]
            },
            fonts:
            {
                files: [
                    "source/fonts/**/*.*"
                ],
                tasks: [ "copy:fonts" ]
            },
            favicon:
            {
                files: [
                    "source/favicon/**/*.*"
                ],
                tasks: [ "copy:favicon" ]
            },
            images:
            {
                files: [
                    "source/images/**/*.*"
                ],
                tasks: [ "copy:images" ]
            },
            htaccess:
            {
                files: [
                    "source/.htaccess"
                ],
                tasks: [ "copy:htaccess" ]
            }
        },

        uglify:
        {
            app:
            {
                options: {
                    mangle: {},
                    compress: {},
                    sourceMap: false
                },
                files: {
                    "dist/build/app.js": "dist/build/app.js"
                }
            },
            libraries:
            {
                options: {
                    mangle: false,
                    compress: {},
                    sourceMap: false
                },
                files: {
                    "dist/build/angular.js": "dist/build/angular.js",
                    "dist/build/components.js": "dist/build/components.js"
                }
            }
        },

        less:
        {
            build:
            {
                options: {
                    rootpath: "",
                    compress: "<%= compress %>"
                },
                files: {
                    "dist/build/app.css": [
                        "source/components/css-reset/reset.css",
                        "source/modules/*/styles/*.*"
                    ]
                }
            }
        },

        postcss:
        {
            build:
            {
                options: {
                    processors: [
                        require( "autoprefixer-core" )( { browsers: "IE >= 9, > 1%" } )
                    ]
                },
                files: {
                    "dist/build/app.css": "dist/build/app.css"
                }
            }
        },

        concat:
        {
            scripts:
            {
                src: [
                    "source/modules/*/*.js",
                    "source/modules/*/**/*.js"
                ],
                dest: "dist/build/app.js"
            },
            angular:
            {
                src: [
                    "source/components/angular/angular.js",
                    "source/components/angular-route/angular-route.js",
                    "source/components/angular-touch/angular-touch.js",
                    "source/components/angular-sanitize/angular-sanitize.js",
                    "source/components/angular-messages/angular-messages.js",
                    "source/components/angular-animate/angular-animate.js"
                ],
                dest: "dist/build/angular.js"
            },
            angularMin:
            {
                src: [
                    "source/components/angular/angular.min.js",
                    "source/components/angular-route/angular-route.min.js",
                    "source/components/angular-touch/angular-touch.min.js",
                    "source/components/angular-sanitize/angular-sanitize.min.js",
                    "source/components/angular-messages/angular-messages.min.js",
                    "source/components/angular-animate/angular-animate.min.js"
                ],
                dest: "dist/build/angular.js"
            },
            components:
            {
                src: [
                    "source/components/humps/humps.js",
                    "source/components/vokal-ng-api/dist/vokal-ng-api.min.js"
                ],
                dest: "dist/build/components.js"
            },
            dist:
            {
                src: [
                    "dist/build/angular.js",
                    "dist/build/components.js",
                    "dist/build/app.js"
                ],
                dest: "dist/build/dist.js"
            }
        },

        copy:
        {
            index:
            {
                expand: true,
                cwd: "source/modules/_nstitute/templates/",
                src: "index.html",
                dest: "dist/"
            },
            fonts:
            {
                expand: true,
                cwd: "source/",
                src: "fonts/*",
                dest: "dist/build/"
            },
            favicon:
            {
                expand: true,
                cwd: "source/",
                src: "favicon/*",
                dest: "dist/build/"
            },
            images:
            {
                expand: true,
                cwd: "source/",
                src: "images/*",
                dest: "dist/build/"
            },
            htaccess:
            {
                expand: true,
                cwd: "source/",
                src: ".htaccess",
                dest: "dist/"
            }
        },

        ejs:
        {
            build: {
                options: {
                    compress: "<%= compress %>"
                },
                src: "dist/index.html",
                dest: "dist/index.html",
                overwrite: true
            }
        },

        ngtemplates:
        {
            options: {
                module: "Nstitute",
                htmlmin: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: false,
                    removeAttributeQuotes: false,
                    removeComments: true,
                    removeEmptyAttributes: false,
                    removeRedundantAttributes: false,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true
                },
                concat: "scripts"
            },
            build: {
                src: [
                    "modules/*/templates/*.*",
                    "!modules/_nstitute/templates/index.html"
                ],
                dest: "dist/build/templates.js",
                cwd: "source"
            }
        },

        replace:
        {
            all:
            {
                src: [
                    "dist/index.html",
                    "dist/build/app.js"
                ],
                overwrite: true,
                replacements: [
                    {
                        from: "{{ VERSION }}",
                        to: Date.now()
                    },
                    {
                        from: "{{ WEBROOT }}",
                        to: "<%= webRoot %>"
                    },
                    {
                        from: "{{ FBAPPID }}",
                        to: "<%= FBAppID %>"
                    }
                ]
            }
        }

    } );

    // Load plugins
    grunt.loadNpmTasks( "grunt-contrib-watch" );
    grunt.loadNpmTasks( "grunt-contrib-uglify" );
    grunt.loadNpmTasks( "grunt-contrib-less" );
    grunt.loadNpmTasks( "grunt-contrib-concat" );
    grunt.loadNpmTasks( "grunt-contrib-copy" );
    grunt.loadNpmTasks( "grunt-angular-templates" );
    grunt.loadNpmTasks( "grunt-ejs" );
    grunt.loadNpmTasks( "grunt-text-replace" );
    grunt.loadNpmTasks( "grunt-postcss" );

    // Define tasks
    grunt.registerTask( "default", [
        "envDev",
        "ngtemplates",
        "concat:scripts",
        "concat:angular",
        "concat:components",
        "less",
        "postcss",
        "copy",
        "replace",
        "ejs"
    ] );
    grunt.registerTask( "deployStaging", [
        "envStaging",
        "ngtemplates",
        "concat:scripts",
        "concat:angularMin",
        "concat:components",
        "uglify",
        "less",
        "postcss",
        "copy",
        "replace",
        "concat:dist",
        "ejs"
    ] );
    grunt.registerTask( "deployProd", [
        "envProd",
        "ngtemplates",
        "concat:scripts",
        "concat:angularMin",
        "concat:components",
        "uglify",
        "less",
        "postcss",
        "copy",
        "replace",
        "concat:dist",
        "ejs"
    ] );

};
