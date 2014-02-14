var colors = require('colors');
var exec = require('child_process').exec;
var request = require('request');
var fs = require('fs');

var cli = {

    /**
     *
     * @param url
     */
    url: function( url ){
        cli.request(url, function(err, data){
            cli.doit( err, data );
        });
    },

    /**
     *
     * @param path
     */
    path: function( path ){
        cli.readFile( path, function( err, data ){
            cli.doit( err, data );
        });
    },

    /**
     *
     * @param err
     * @param data
     */
    doit: function( err, data ){

        if( err ){
            cli.error( err );
        }
        else{
            data.collections.forEach(function(collection){
                // export
                cli.exec( cli.cmd( 'mongoexport', data.export, data.database, collection ), function( exportErr, exportOut ){
                    if( exportErr ){
                        cli.error( exportErr );
                    }
                    else{
                        cli.ok( exportOut );
                        cli.exec( cli.cmd( 'mongoimport', data.import, data.database, collection ), function(importErr, importOut){
                            if( importErr ){
                                cli.error( importErr );
                            }
                            else{
                                cli.ok(importOut);
                            }
                        });
                    }
                });

                // import

            });
        }

    },

    /**
     *
     * @param path
     * @param callback
     */
    readFile: function( path, callback ){
        fs.readFile( path, function(err, data) {
            if( err ){
                callback( err, null );
            }
            else{
                callback( null, JSON.parse(data) );
            }
        });
    },

    /**
     *
     * @param url
     * @param callback
     */
    request: function( url, callback ){
        request(url, function (error, response, body) {

            if( error ){
                callback( error, null );
            }
            else{
                if ( response.statusCode == 200) {
                    callback( null, JSON.parse( body ) );
                }
                else{
                    callback('Se obtubo el código ' + response.statusCode, null);
                }
            }
        });
    },
    /**
     *
     * @param command (mongoexport|mongoimport)
     * @param obj
     * @param database
     * @param collection
     * @returns {string}
     */
    cmd: function( command, obj, database, collection ){

        var result = []
        result.push(command);

        // host
        if( obj.host ){
            result.push('-h '+obj.host);
        }

        // database
        result.push('-d '+database);

        // collection
        result.push('-c '+collection);

        // users
        if( obj.user ){
            result.push('-u '+obj.user);
        }

        // password
        if( obj.password ){
            result.push('-p '+obj.password);
        }

        // out | file
        switch (command){
            case 'mongoexport':
                result.push('-o ' + collection + '.json');
                break;
            case 'mongoimport':
                result.push('--file ' + collection + '.json');
                break;
        }

        return result.join( ' ' );

    },

    /**
     *
     * @param cmd
     */
    exec: function( cmd, callback ){
        exec( cmd, function( err, stdout, stderr ){
            if( err !== null ){
                callback( err, null );
            }
            else{
                if( stderr ){
                    callback( stderr, null );
                }
                else{
                    callback( null, stdout );
                }
            }

        });
    },

    /**
     *
     * @param message
     */
    error: function( message ){
        console.log( colors.red( message ) ) ;
    },

    /**
     *
     * @param message
     */
    ok: function( message ){
        console.log( colors.green( message ) ) ;
    }
};

module.exports = cli;