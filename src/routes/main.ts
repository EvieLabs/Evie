import { ApplyOptions } from "@sapphire/decorators";
import {
  ApiRequest,
  ApiResponse,
  methods,
  Route,
  RouteOptions,
} from "@sapphire/plugin-api";

@ApplyOptions<RouteOptions>({ route: "" })
export class UserRoute extends Route {
  public [methods.GET](_request: ApiRequest, response: ApiResponse) {
    response.json({ message: "Hello World" });
  }
}
