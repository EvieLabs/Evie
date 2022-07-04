import fastifyPassport from "@fastify/passport";
import type { FastifyInstance } from "fastify";

export default async function AuthRouter(fastify: FastifyInstance) {
  fastify.get(
    "/callback",
    {
      preValidation: fastifyPassport.authenticate("discord", {
        successRedirect: "/",
        authInfo: false,
      }),
    },
    () => {
      fastify.log.info("logged in!");
    }
  );
}

export const autoPrefix = "/public/auth";
