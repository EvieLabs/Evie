import { createFunctionPrecondition } from "@sapphire/decorators";
import {
  HttpCodes,
  type ApiRequest,
  type ApiResponse,
} from "@sapphire/plugin-api";

export const authenticated = () =>
  createFunctionPrecondition(
    (request: ApiRequest) => Boolean(request.auth?.token),
    (_request: ApiRequest, response: ApiResponse) =>
      response.error(HttpCodes.Unauthorized)
  );
