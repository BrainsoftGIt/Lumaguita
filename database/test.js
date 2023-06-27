let { fork } = require("child_process");
let Path = require("path")
let _fork = fork( Path.join( __dirname, "test2.js"), {
    stdio:"pipe"
});

_fork.stdout.on( "data", chunk => {
    console.log( "STDOUT-DATA", chunk.toString() )
});
_fork.stderr.on( "data", chunk => {
    console.log( "STDOUT-ERRO", chunk.toString() )
})