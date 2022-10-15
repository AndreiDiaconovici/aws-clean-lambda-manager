import * as AWS from 'aws-sdk'
import { logger } from '../logger'

const LOG_PREFIX_CLASS = 'DynamoDBService'

export class DynamoDBService {
  private static instance: DynamoDBService | undefined

  private readonly dynamoDBInstance
  private readonly dynamoDBTable

  private constructor(dynamoDBTable: string) {
    const LOG_PREFIX_FUNCTION = `${LOG_PREFIX_CLASS} | constructor | `
    this.dynamoDBInstance = new AWS.DynamoDB.DocumentClient({
      apiVersion: '2012-08-10'
    })
    this.dynamoDBTable = dynamoDBTable
    logger.info(`${LOG_PREFIX_FUNCTION}`, DynamoDBService.instance)
  }

  /**
   * Singleton pattern
   * @param dynamoDBTable dynamoDBTable name to operate on
   * @returns DynamoDBService
   */
  public static getInstance(dynamoDBTable: string): DynamoDBService {
    const LOG_PREFIX_FUNCTION = `${LOG_PREFIX_CLASS} | getInstance | `
    if (this.instance == null) {
      logger.info(`${LOG_PREFIX_FUNCTION} creating instance`)
      this.instance = new DynamoDBService(dynamoDBTable)
      return this.instance
    }
    logger.info(`${LOG_PREFIX_FUNCTION} instance already created`)
    return this.instance
  }

  /**
   * Query dynamoDBtable based on GSI
   * @param indexName
   * @param indexValue
   * @returns AWS.DynamoDB.DocumentClient.ItemList
   */
  public async queryItemsByIndex(indexName: string, indexValue: string): Promise<AWS.DynamoDB.DocumentClient.ItemList> {
    const LOG_PREFIX_FUNCTION = `${LOG_PREFIX_CLASS} | queryItemsByIndex | `
    const params = {
      TableName: this.dynamoDBTable,
      IndexName: indexName,
      KeyConditionExpression: `${indexName} = :${indexName}`,
      ExpressionAttributeValues: {
        [`:${indexName}`]: indexValue
      }
    }
    logger.info(`${LOG_PREFIX_FUNCTION} START`, params)
    const result = await this.dynamoDBInstance.query(params).promise()
    logger.info(`${LOG_PREFIX_FUNCTION} Result`, result)
    return result.Items ?? []
  }

  public async createItem(item: any): Promise<void> {
    await this.dynamoDBInstance.put({
      TableName: this.dynamoDBTable,
      Item: item,
      ReturnConsumedCapacity: 'TOTAL'
    }).promise()
  }

  /**
   * Update the item
   * @param key contains the object passed as key params to dynamoDB
   * @param payload contains the properties of the object that must be updated
   */
  public async updateItem(key: any, payload: any): Promise<void> {
    const params = {
      TableName: this.dynamoDBTable,
      Key: key,
      ReturnConsumedCapacity: 'TOTAL'
    }
    const response = await this.dynamoDBInstance.get(params).promise()
    const item = response.Item

    if (item === undefined) {
      throw new Error('Item not founded')
    }

    for (const prop of Object.getOwnPropertyNames(payload)) {
      item[prop] = payload[prop]
    }

    await this.dynamoDBInstance.put({
      TableName: this.dynamoDBTable,
      Item: item,
      ReturnConsumedCapacity: 'TOTAL'
    }).promise()
  }

  /**
   * Query dynamoDBtable based on Partition Key
   * @param keyName
   * @param keyValue
   * @returns AWS.DynamoDB.DocumentClient.ItemList
   */
  public async queryItemByPartitionKey(keyName: string, keyValue: string): Promise<AWS.DynamoDB.DocumentClient.ItemList> {
    const params = {
      TableName: this.dynamoDBTable,
      KeyConditionExpression: `#${keyName} = :${keyName}`,
      ExpressionAttributeNames: {
        [`#${keyName}`]: keyName
      },
      ExpressionAttributeValues: {
        [`:${keyName}`]: keyValue
      },
      ReturnConsumedCapacity: 'TOTAL'
    }

    const item = await this.dynamoDBInstance.query(params).promise()
    return item.Items ?? []
  }

  /**
   * Delete the item
   * @param key contains the object passed as key params to dynamoDB
   */
  public async deleteItem(key: any): Promise<void> {
    const params = {
      TableName: this.dynamoDBTable,
      Key: key,
      ReturnConsumedCapacity: 'TOTAL'
    }

    await this.dynamoDBInstance.delete(params).promise()
  }
}
