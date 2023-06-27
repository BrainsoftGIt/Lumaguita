require( "../../../../build/upgrade/up" ).dbUpgrade({
    main: require("path")
        //language=file-reference
        .join( __dirname, "_up.json5" )
});