import { AppService } from './app.service';
declare class GetServerListeningResponse {
    ok: boolean;
    message: string;
}
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): GetServerListeningResponse;
}
export {};
