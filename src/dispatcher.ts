import { InputModels } from './interfaces'
import { ExampleApplicationService, ValidatorService } from './services'
import { logger } from './utils'

enum Endpoints {
  GET_EXAMPLE = '/v1/example:GET'
}

export async function dispatcher(transformedEvent: InputModels.Input): Promise<{ statusCode: number, body: any }> {
  const exampleApplicationService = new ExampleApplicationService();
  const validator = ValidatorService.getInstance()
  const API = `${transformedEvent.path}:${transformedEvent.httpMethod}`

  await validator.validate(transformedEvent, API)
  switch (API) {
    // case Endpoints.GET_EXAMPLE: {
    //   return await exampleApplicationService.getExample(transformedEvent as InputModels.GetExample)
    // }
    default: {
      logger.error(`Method not implemented! - ${transformedEvent.path}:${transformedEvent.httpMethod}`)
      throw new Error(JSON.stringify({ message: 'Method not implemented!', statusCode: 501 }))
    }
  }
}
