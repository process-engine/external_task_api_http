import {wrap} from 'async-middleware';

import {BaseRouter} from '@essential-projects/http_node';
import {IIdentityService} from '@essential-projects/iam_contracts';

import {restSettings} from '@process-engine/external_task_api_contracts';

import {ExternalTaskApiController} from './external_task_api_controller';
import {createResolveIdentityMiddleware} from './middlewares/index';

export class ExternalTaskApiRouter extends BaseRouter {

  private externalTaskApiRestController: ExternalTaskApiController;
  private identityService: IIdentityService;

  constructor(externalTaskApiRestController: ExternalTaskApiController, identityService: IIdentityService) {
    super();
    this.externalTaskApiRestController = externalTaskApiRestController;
    this.identityService = identityService;
  }

  public get baseRoute(): string {
    return 'api/external_task/v1';
  }

  public async initializeRouter(): Promise<void> {
    this.registerMiddlewares();

    const controller = this.externalTaskApiRestController;

    this.router.post(restSettings.paths.fetchAndLockExternalTasks, wrap(controller.fetchAndLockExternalTasks.bind(controller)));
    this.router.post(restSettings.paths.extendLock, wrap(controller.extendLock.bind(controller)));
    this.router.post(restSettings.paths.handleBpmnError, wrap(controller.handleBpmnError.bind(controller)));
    this.router.post(restSettings.paths.handleServiceError, wrap(controller.handleServiceError.bind(controller)));
    this.router.post(restSettings.paths.finishExternalTask, wrap(controller.finishExternalTask.bind(controller)));
  }

  private registerMiddlewares(): void {
    const resolveIdentity = createResolveIdentityMiddleware(this.identityService);
    this.router.use(wrap(resolveIdentity));
  }

}
