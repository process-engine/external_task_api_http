import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';

import {IExternalTaskApi} from '@process-engine/external_task_api_contracts';

import {Response} from 'express';

export class ExternalTaskApiController {

  private httpCodeSuccessfulResponse = 200;
  private httpCodeSuccessfulNoContentResponse = 204;

  private externalTaskApiService: IExternalTaskApi;

  constructor(externalTaskApiService: IExternalTaskApi) {
    this.externalTaskApiService = externalTaskApiService;
  }

  public async fetchAndLockExternalTasks(request: HttpRequestWithIdentity, response: Response): Promise<void> {

    const identity = request.identity;

    const payload = request.body;

    const result = await this.externalTaskApiService.fetchAndLockExternalTasks(
      identity,
      payload.workerId,
      payload.topicName,
      payload.maxTasks,
      payload.longPollingTimeout,
      payload.lockDuration,
    );

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async extendLock(request: HttpRequestWithIdentity, response: Response): Promise<void> {

    const externalTaskId = request.params.external_task_id;
    const identity = request.identity;

    const payload = request.body;

    await this.externalTaskApiService.extendLock(identity, payload.workerId, externalTaskId, payload.additionalDuration);

    response.status(this.httpCodeSuccessfulNoContentResponse).send();
  }

  public async handleBpmnError(request: HttpRequestWithIdentity, response: Response): Promise<void> {

    const externalTaskId = request.params.external_task_id;
    const identity = request.identity;

    const payload = request.body;

    await this.externalTaskApiService.handleBpmnError(identity, payload.workerId, externalTaskId, payload.errorCode);

    response.status(this.httpCodeSuccessfulNoContentResponse).send();
  }

  public async handleServiceError(request: HttpRequestWithIdentity, response: Response): Promise<void> {

    const externalTaskId = request.params.external_task_id;
    const identity = request.identity;

    const payload = request.body;

    await this.externalTaskApiService.handleServiceError(identity, payload.workerId, externalTaskId, payload.errorMessage, payload.errorDetails);

    response.status(this.httpCodeSuccessfulNoContentResponse).send();
  }

  public async finishExternalTask(request: HttpRequestWithIdentity, response: Response): Promise<void> {

    const externalTaskId = request.params.external_task_id;
    const identity = request.identity;

    const payload = request.body;

    await this.externalTaskApiService.finishExternalTask(identity, payload.workerId, externalTaskId, payload.result);

    response.status(this.httpCodeSuccessfulNoContentResponse).send();
  }

}
