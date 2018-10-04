import {HttpRequestWithIdentity} from '@essential-projects/http_contracts';
import {IIdentity} from '@essential-projects/iam_contracts';

import {
  ExtendLockRequestPayload,
  ExternalTask,
  FetchAndLockRequestPayload,
  FinishExternalTaskRequestPayload,
  HandleBpmnErrorRequestPayload,
  HandleServiceErrorRequestPayload,
  IExternalTaskApi,
  restSettings,
} from '@process-engine/external_task_api_contracts';

import {Response} from 'express';

export class ExternalTaskApiController {
  public config: any = undefined;

  private httpCodeSuccessfulResponse: number = 200;
  private httpCodeSuccessfulNoContentResponse: number = 204;

  private externalTaskApiService: IExternalTaskApi;

  constructor(externalTaskApiService: IExternalTaskApi) {
    this.externalTaskApiService = externalTaskApiService;
  }

  public async fetchAndLockExternalTasks(request: HttpRequestWithIdentity, response: Response): Promise<void> {

    const workerId: string = request.params[restSettings.params.workerId];
    const identity: IIdentity = request.identity;

    const payload: FetchAndLockRequestPayload = request.body;

    const result: Array<ExternalTask> =
      await this
        .externalTaskApiService
        .fetchAndLockExternalTasks(identity, workerId, payload.topicName, payload.maxTasks, payload.longPollingTimeout, payload.lockDuration);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async extendLock(request: HttpRequestWithIdentity, response: Response): Promise<void> {

    const externalTaskId: string = request.params[restSettings.params.externalTaskId];
    const workerId: string = request.params[restSettings.params.workerId];
    const identity: IIdentity = request.identity;

    const payload: ExtendLockRequestPayload = request.body;

    await this.externalTaskApiService.extendLock(identity, workerId, externalTaskId, payload.additionalDuration);

    response.status(this.httpCodeSuccessfulNoContentResponse).send();
  }

  public async handleBpmnError(request: HttpRequestWithIdentity, response: Response): Promise<void> {

    const externalTaskId: string = request.params[restSettings.params.externalTaskId];
    const workerId: string = request.params[restSettings.params.workerId];
    const identity: IIdentity = request.identity;

    const payload: HandleBpmnErrorRequestPayload = request.body;

    await this.externalTaskApiService.handleBpmnError(identity, workerId, externalTaskId, payload.errorCode);

    response.status(this.httpCodeSuccessfulNoContentResponse).send();
  }

  public async handleServiceError(request: HttpRequestWithIdentity, response: Response): Promise<void> {

    const externalTaskId: string = request.params[restSettings.params.externalTaskId];
    const workerId: string = request.params[restSettings.params.workerId];
    const identity: IIdentity = request.identity;

    const payload: HandleServiceErrorRequestPayload = request.body;

    await this.externalTaskApiService.handleServiceError(identity, workerId, externalTaskId, payload.errorMessage, payload.errorDetails);

    response.status(this.httpCodeSuccessfulNoContentResponse).send();
  }

  public async finishExternalTask(request: HttpRequestWithIdentity, response: Response): Promise<void> {

    const externalTaskId: string = request.params[restSettings.params.externalTaskId];
    const workerId: string = request.params[restSettings.params.workerId];
    const identity: IIdentity = request.identity;

    const payload: FinishExternalTaskRequestPayload = request.body;

    await this.externalTaskApiService.finishExternalTask(identity, workerId, externalTaskId, payload.result);

    response.status(this.httpCodeSuccessfulNoContentResponse).send();
  }
}
