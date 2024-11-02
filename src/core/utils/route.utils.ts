import { Handler, IRouter } from 'express';
import { controllers } from '../../controllers'
import { MetadataKeys } from '../decorators/metadata.keys';
import express from 'express'
import { Methods } from '../decorators/http';

type Router = {
  method: Methods,
  path: string,
  handlerName: string
}

export function registerControllers(app: express.Application, showRoutes: boolean = false) {
  const info: Array<{ api: string, handler: string }> = [];
  
  controllers.forEach((controllerClass) => {
    const controllerInstance: { [handleName: string]: Handler } = new controllerClass() as any;
  
    const basePath: string = Reflect.getMetadata(MetadataKeys.BASE_PATH, controllerClass);
    const routers: Router[] = Reflect.getMetadata(MetadataKeys.ROUTERS, controllerClass);
  
    const exRouter = express.Router();
  
    routers.forEach((router: Router) => {
      const { handlerName, path, method } = router
      exRouter[method](path, controllerInstance[String(handlerName)].bind(controllerInstance));
  
      info.push({
        api: `${method.toLocaleUpperCase()} ${basePath + path}`,
        handler: `${controllerClass.name}.${String(handlerName)}`,
      });
    });
  
    app.use(basePath, exRouter);
  });
  
  if (showRoutes)
    console.table(info);
}