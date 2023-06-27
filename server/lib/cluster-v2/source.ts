export type Source = {
    source_uid
    source_branch_uid:string,
    source_cluster_uid:string,
    source_in:boolean,
    source_out:boolean,
    source_excludesin:string[],
    source_excludesout:string[]
}

export class SourceManager {
    private sources:Source[];

    constructor() {
        this.sources = [];
    }
}