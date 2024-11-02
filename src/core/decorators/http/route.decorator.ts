import 'reflect-metadata'

export enum HttpMethod {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    DELETE = 'delete',
    PATCH = 'patch'
}

interface RouteMetadata {
    path: string;
    method: HttpMethod;
}

export function Route(method: HttpMethod, path: string = '') {
    return function (target: any, propertyKey: string) {
        const routes: RouteMetadata[] = Reflect.getMetadata('routes', target.constructor) || [];
        
        routes.push({
            path,
            method
        });

        Reflect.defineMetadata('routes', routes, target.constructor);
    };
}

export const Get = (path: string = '') => Route(HttpMethod.GET, path);
export const Post = (path: string = '') => Route(HttpMethod.POST, path);
export const Put = (path: string = '') => Route(HttpMethod.PUT, path);
export const Delete = (path: string = '') => Route(HttpMethod.DELETE, path);
export const Patch = (path: string = '') => Route(HttpMethod.PATCH, path);
