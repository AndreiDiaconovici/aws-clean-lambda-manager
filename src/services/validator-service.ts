import Ajv from 'ajv'
import { logger } from '../utils'
export class ValidatorService {
  private static instance: undefined | ValidatorService
  private readonly ajvInstance

  private constructor() {
    this.ajvInstance = new Ajv()
  }

  public static getInstance(): ValidatorService {
    if (this.instance == null) {
      this.instance = new ValidatorService()
      return this.instance
    }
    return this.instance
  }

  public async validate(obj: object, schemaPath: string): Promise<void> {
    // Check if schema is already present by doing a get
    schemaPath = schemaPath.replace(/\//g, '_')
    const validateSchema = this.ajvInstance.getSchema(schemaPath)
    // Get schema if present, add it if not
    if (validateSchema === undefined) {
      try {
        const schema = await import('../event/' + schemaPath + '.json')
        this.ajvInstance.addSchema(schema, schemaPath)
        // Recall function in order to validate the object
        await this.validate(obj, schemaPath)
      } catch (error: any) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        throw Error(JSON.stringify({ message: `JSON error: ${error.message}`, statusCode: 502 }))
      }
    } else {
      // Validate

      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (validateSchema(obj)) {
        logger.debug('Event is valid')
      } else {
        logger.error(validateSchema.errors)
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        throw Error(JSON.stringify({ message: validateSchema.errors, statusCode: 502 }))
      }
    }
  }
}
