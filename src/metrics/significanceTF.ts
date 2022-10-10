import {SpectrumTranslater} from "./metricUtils"
import { HydratedGitBlobObject } from "../analyzer/model"
import { MetricCache } from "./metrics"


let translater = new SpectrumTranslater(0, 1, 50, 95)

function getColor(value: number): string {
    return `hsl(20,100%,${translater.inverseTranslate(value)}%)`
  }

export function setColor(blob: HydratedGitBlobObject, cache: MetricCache) {
  var significance = 0
  if(blob.significanceInfo && blob.significanceInfo.info && blob.significanceInfo.info instanceof Map){
    // console.log( blob.significanceInfo.info)
    significance = blob.significanceInfo.info.get("pageRank")!!
  }
    cache.colormap.set(blob.path, getColor(significance))
  }