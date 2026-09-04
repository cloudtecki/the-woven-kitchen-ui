import { APIEndpoints } from "core/base/enum/api";
import { HealthSchema } from "core/base/schema";
import { HealthResponse } from "core/base/type/health";
import { ServiceBase } from "core/http/base.service";
import { ApiIResult } from "core/http/type";

export class HealthService extends ServiceBase {
    static getHealth(): Promise<ApiIResult<HealthResponse>> {
        return this.get(APIEndpoints.GET_HEALTH, HealthSchema);
    }
}
