import { InputModels, ResponseModels } from '../interfaces'
import { logger } from '../utils'

const LOG_PREFIX_CLASS = 'ExampleApplicationService'

export class ExampleApplicationService {

  constructor() {
  }

  public async getExample(_transformedEvent: InputModels.GetExample): Promise<ResponseModels.Response> {
    const LOG_PREFIX_FUNCTION = `${LOG_PREFIX_CLASS} | getExample |`
    logger.info(`${LOG_PREFIX_FUNCTION} START`)

    try {
      // Application Logic
      return {
        statusCode: 200,
        body: JSON.stringify({ /* Data */ })
      }
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw Error(JSON.stringify({ message: `JSON error: ${error.message}`, statusCode: 502 }))
    }
  }
}
