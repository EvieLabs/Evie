import { getNumberSecret } from "@evie/config";
import {
  ChannelOptions,
  Server,
  ServerCredentials,
  ServiceDefinition,
  UntypedServiceImplementation,
} from "@grpc/grpc-js";
import { blue, magenta } from "colorette";

export class EvieRPC extends Server {
  private findServicePath(service: ServiceDefinition): string {
    const path = Object.keys(service).find((key) => key === "path");

    if (path) {
      return service[path] as unknown as string;
    }

    const children = Object.keys(service).filter((key) => key !== "path");

    if (children.length === 0) {
      return "unknown";
    }

    if (children.length > 1) {
      return "unknown";
    }

    return this.findServicePath(
      service[children[0]] as unknown as ServiceDefinition
    );
  }

  public constructor(
    sImpls: [ServiceDefinition, UntypedServiceImplementation][],
    options?: ChannelOptions
  ) {
    super(options);
    sImpls.forEach(([service, impl]) => {
      this.addService(service, impl);
      console.log(
        magenta(`[gRPC]`),
        blue(`Added service ${this.findServicePath(service)}`)
      );
    });

    this.bindAsync(
      `127.0.0.1:${getNumberSecret("guildStorePort") ?? "50051"}`,
      ServerCredentials.createInsecure(),
      (err, port) => {
        if (err) {
          throw err;
        }
        console.log(
          magenta(`[gRPC]`),
          blue(`Server Listening on 127.0.0.1:${port}`)
        );
        this.start();
      }
    );
  }
}
