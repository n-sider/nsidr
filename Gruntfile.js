"use strict";

module.exports = function ( grunt )
{
    var path = require( "path" );
    var env = grunt.option( "env" ) || "local";

    grunt.initConfig( {
        env: grunt.file.readJSON( "env.json" )[ env ],
        envName: env,
        version: grunt.option( "gitver" ) || Date.now(), // for deployment
        slackApiToken: grunt.option( "slacktoken" )
    } );

    require( "load-grunt-config" )( grunt, {
        configPath: path.join( process.cwd(), "node_modules", "dominatr-grunt", "grunt" ),
        overridePath: path.join( process.cwd(), "grunt" ),
        mergeFunction: function ( obj, ext )
        {
            return require( "config-extend" )( obj, ext );
        }
    } );
};
