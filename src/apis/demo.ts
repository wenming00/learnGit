import http from "../utils/request"
import type * as Demo from "./types/demo"

/**
 * demo
 */
export function getMessage() {
  return http.get<Demo.demoReq>('/v1/demo')
}