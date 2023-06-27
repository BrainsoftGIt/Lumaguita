import chalk, {Chalk} from "chalk";

export const colors = new class ClusterColors {

    private _identifier;
    private _name;
    private _route;
    private _path;
    private _event;
    private _direction;
    private _action_success;
    private _action_failed;
    private _title;

    constructor() {
        let sets = this.sets();
        sets.identifier( chalk.underline.bold.italic.yellowBright );
        sets.name( chalk.yellow );
        sets.route( chalk.cyanBright );
        sets.path( chalk.cyan );
        sets.event( chalk.magentaBright );
        sets.action( chalk.greenBright, chalk.redBright );
        sets.title( chalk.blueBright.underline );
    }

    identifier( name:string ){ return this._identifier( name ) }
    name( name:string ){ return this._name( name ) }
    route( name:string ){ return this._route( name ) }
    path( name:string ){ return this._path( name ) }
    event( name:string ){ return this._event( name ) }
    direction( name:string ){ return this._direction( name ) }
    title( name:string ){ return this._title( name ) }
    action( validator:boolean|(()=> boolean), onTrue:string, onFalse:string ) {
        if( typeof validator === "function" ) validator = validator();
        if( validator ) return this._action_success( onTrue )
        else return this._action_failed( onFalse )
    }

    sets(){
        const self = this;
        return {
            identifier(  color:Chalk ){ self._identifier =color },
            name(  color:Chalk ){ self._name =color },
            route(  color:Chalk ){ self._route =color },
            path(  color:Chalk ){ self._path =color },
            event(  color:Chalk ){ self._event =color },
            direction(  color:Chalk ){ self._direction =color },
            title(  color:Chalk ){ self._title =color },
            action(  success:Chalk, failed:Chalk ){
                self._action_success = success;
                self._action_failed = failed;

            }
        }
    }
}