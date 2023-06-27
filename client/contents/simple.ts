import { ContentView } from "zoo.util/lib/page-resolve";
import {NextFunction, Response, Request } from "express";

let count = 0;
export default new( class SimplePageView implements ContentView{
  async load( req: Request, res: Response, next: NextFunction) {
    return new Promise((resolve)=>{
      setTimeout( ()=>{
        resolve( {
          "title": "Ola Mudo",
          "h5": `JKOHj smnsjdn sm jbdbhds ${ count++}`
        })
      }, 1000 * 10)

    })
  }
});
