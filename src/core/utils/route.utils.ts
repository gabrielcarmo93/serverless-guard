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
  
  if (showRoutes) {
    const infos = info.map(({api, handler}) => {
      const [method, rawRoute] = api.split(" ")

      const controller = rawRoute.split("/")[1]
      
      return {
        api, handler, method, controller,
      }
    }).sort((a, b) => {
      const routeCompare = a.controller.localeCompare(b.controller);
      if (routeCompare !== 0) return routeCompare;
      
      return a.method.localeCompare(b.method);
    })

    console.table(infos);
  }
}