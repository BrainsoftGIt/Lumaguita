var remotes = {
    iframes:{ },
    goto( remote ){
        let pathname = remotes.iframes[ remote ].location.pathname;
        if( pathname === location.pathname ) return;
        window.location.href = pathname;
    }
}

if (window.self !== window.top) {
    window.top.document.title = `Remote (${window.document.title})`;
    remotes.iframes[ window.frameElement.id ] = window;
    if( window.top.remotes.iframes ){
        window.top.remotes.iframes[ window.frameElement.id ] = window;
    }
    // window.top.remotes.goto( window.frameElement.id );
}


