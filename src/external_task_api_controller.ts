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

    const identity: IIdentity = request.identity;

    const payload: FetchAndLockRequestPayload = request.body;

    // Note: The Controller cannot possibly know what type the requesting resource is expecting here.
    const result: Array<ExternalTask<any>> =
      await this.externalTaskApiService.fetchAndLockExternalTasks<any>(identity,
                                                                       payload.workerId,
                                                                       payload.topicName,
                                                                       payload.maxTasks,
                                                                       payload.longPollingTimeout,
                                                                       payload.lockDuration);

    response.status(this.httpCodeSuccessfulResponse).json(result);
  }

  public async extendLock(request: HttpRequestWithIdentity, response: Response): Promise<void> {

    const externalTaskId: string = request.params.external_task_id;
    const identity: IIdentity = request.identity;

    const payload: ExtendLockRequestPayload = request.body;

    await this.externalTaskApiService.extendLock(identity, payload.workerId, externalTaskId, payload.additionalDuration);

    response.status(this.httpCodeSuccessfulNoContentResponse).send();
  }

  public async handleBpmnError(request: HttpRequestWithIdentity, response: Response): Promise<void> {

    const externalTaskId: string = request.params.external_task_id;
    const identity: IIdentity = request.identity;

    const payload: HandleBpmnErrorRequestPayload = request.body;

    await this.externalTaskApiService.handleBpmnError(identity, payload.workerId, externalTaskId, payload.errorCode);

    response.status(this.httpCodeSuccessfulNoContentResponse).send();
  }

  public async handleServiceError(request: HttpRequestWithIdentity, response: Response): Promise<void> {

    const externalTaskId: string = request.params.external_task_id;
    const identity: IIdentity = request.identity;

    const payload: HandleServiceErrorRequestPayload = request.body;

    await this.externalTaskApiService.handleServiceError(identity, payload.workerId, externalTaskId, payload.errorMessage, payload.errorDetails);

    response.status(this.httpCodeSuccessfulNoContentResponse).send();
  }

  public async finishExternalTask(request: HttpRequestWithIdentity, response: Response): Promise<void> {

    const externalTaskId: string = request.params.external_task_id;
    const identity: IIdentity = request.identity;

    // Note: The Controller cannot possibly know what type the requesting resource is expecting here.
    const payload: FinishExternalTaskRequestPayload<any> = request.body;

    await this.externalTaskApiService.finishExternalTask<any>(identity, payload.workerId, externalTaskId, payload.result);

    response.status(this.httpCodeSuccessfulNoContentResponse).send();
  }
}
