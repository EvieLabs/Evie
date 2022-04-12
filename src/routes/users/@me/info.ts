import { authenticated } from "#root/utils/api/decorators";
import { ApplyOptions } from "@sapphire/decorators";
import {
  ApiRequest,
  ApiResponse,
  methods,
  Route,
  RouteOptions,
} from "@sapphire/plugin-api";

@ApplyOptions<RouteOptions>({
  route: "/users/@me",
})
export class UserRoute extends Route {
  @authenticated()
  public async [methods.GET](request: ApiRequest, response: ApiResponse) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const user = await this.container.client.users.fetch(request.auth!.id);

    return response.json(user);
  }
}
