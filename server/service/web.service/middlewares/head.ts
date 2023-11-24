import {app} from "../index";

app.use( (req, res, next) => {
    console.log(`[maguita] new request from ${req.headers.host} | ${req.method}${req.path}`);
    next();
});
app.get([ "/VERSION", "/VER", "/ver", "/version" ], (req, res, next) => {
    res.send( VERSION.NUMBER );
});

app.get( ["/TAG", "/tag"], (req, res, next) => {
    res.send( VERSION.TAG );
});

app.get( ["/VERSION-NAME", "/VER-NAME", "/version-name", "/ver-name"], (req, res, next) => {
    res.send( VERSION.VERSION_CODE );
});

app.get( [ "/REVISION", "/REV", "/REVS", "/revision", "/rev", "/revs" ], (req, res, next) => {
    res.send( VERSION.REVISION );
});
