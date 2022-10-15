export interface Input {
  requestBody?: any
  pathParameters?: any
  queryParameters?: any
  httpMethod: string
  path: string
}

export interface GetExample extends Input {
  queryParameters: {
    exampleParameter: string
  }
}
