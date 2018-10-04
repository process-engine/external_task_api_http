import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';
import {IIdentity} from '@essential-projects/iam_contracts';

import {ExternalTask, IExternalTaskApi} from '@process-engine/external_task_api_contracts';

import {Response} from 'express';

export class ConsumerApiController {
  public config: any = undefined;

  private httpCodeSuccessfulResponse: number = 200;
  private httpCodeSuccessfulNoContentResponse: number = 204;

  private externalTaskApiService: IExternalTaskApi;

  constructor(consumerApiService: IExternalTaskApi) {
    this.externalTaskApiService = consumerApiService;
  }

  public async fetchAndLockExternalTasks(request: HttpRequestWithIdentity, response: Response): Promise<void> {
    const identity: IIdentity = request.identity;

    const result: Array<ExternalTask> = await this.externalTaskApiService.fetchAndLockExternalTasks(identity);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }
}
