
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'fast-csv';




export function getSignificanceInfo(): Promise<Map<string, SignificanceInfo>> {
    let result = new Map<string, SignificanceInfo>()
    let promise = new Promise<Map<string, SignificanceInfo>>((resolve, reject) =>{
        fs.createReadStream(path.resolve("../DependencyProject/output/features.csv"))
        .pipe(csv.parse({ headers: true }))
        .on('error', error => console.error(error))
        .on('data', row => {
            let [path, info] = parseRow(row)
            result.set(path, info)
        })
        .on('end', (rowCount: number) => resolve(result))
    })

    return promise
}

export class SignificanceInfo{
    public info: Map<string, number>
    public path: string

    constructor(info: Map<string, number>, path: string){
        this.info = info
        this.path = path
    }

}

function parseRow(row: any): [string, SignificanceInfo] {
    let result = new Map<string, number>()
    result.set("pageRank", row["pageRank"])
    result.set("degreeCentrality", row["degreeCentrality"])
    result.set("inDegreeCentrality", row["inDegreeCentrality"])
    result.set("outDegreeCentrality", row["outDegreeCentrality"])
    result.set("betweennessCentrality", row["betweennessCentrality"])


    let path = row[""]
    let info = new SignificanceInfo(result, path)
    return [path, info] 
}
