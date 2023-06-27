const { execSync } = require("child_process");

const run = function ( command ) {
    try{
        return  execSync(command).toString().trim();
    } catch (e) {
        return null;
    }
}

/**@constructor*/
export class GitAppVersion {
    isGit;
    major;
    minor;
    path;
    version;
    hash;
    hashShort;
    gitDir;

    /**
     * GitAppVersion constructor.
     * @param gitDir
     * @param start { int }
     */
    constructor( gitDir, start ) {

        if( !start ) start = 1;
        start = start * 100;
        let cmdIsGit, cmdCount, cmdHashShort, cmdHash, cmdDate;

        if( gitDir ){
            cmdIsGit = `cd ${gitDir}; git rev-parse --is-inside-work-tree`;
            cmdCount = `cd ${gitDir}; git rev-list --all --count`;
            cmdHashShort = `cd ${gitDir}; git log --pretty=\"%h\" -n1 HEAD`;
            cmdHash = `cd ${gitDir}; git log --pretty=\"%H\" -n1 HEAD`;
        } else{
            cmdIsGit = `git rev-parse --is-inside-work-tree`;
            cmdCount = `git rev-list --all --count`;
            cmdHashShort = `git log --pretty="%h" -n1 HEAD`;
            cmdHash = `git log --pretty="%H" -n1 HEAD`;
        }

        try{
            this.isGit = run( cmdIsGit ) === "true"
            if( !this.isGit ) return;
            let hash = run( cmdHash );
            let hashShort = run( cmdHashShort );
            let totalRev = Number( run( cmdCount ) );

            totalRev = totalRev + start;

            const path = (totalRev%10).toFixed();

            totalRev = totalRev/10;
            const minor = (totalRev%10).toFixed();

            totalRev = totalRev/10;
            const major = (totalRev%10).toFixed();
            this.major = major;
            this.minor = minor;
            this.path = path;
            this.hash = hash;
            this.hashShort = hashShort;
            this.gitDir = gitDir;
            this.version = `v${major}.${minor}.${path}-${ hashShort }`;
        } catch (e) {
            console.error( e );
        }
    }
}

export const gitVersion = new GitAppVersion( __dirname, 1 );
