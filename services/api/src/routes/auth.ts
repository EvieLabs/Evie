import fastifyPassport from "@fastify/passport";
import type { FastifyInstance } from "fastify";

export default async function AuthRouter(fastify: FastifyInstance) {
  fastify.get(
    "/callback",
    {
      preValidation: fastifyPassport.authenticate("discord", {
        successRedirect: process.env.SUCCESS_AUTH_REDIRECT ?? "/",
        authInfo: false,
      }),
    },
    () => {
      fastify.log.info("logged in!");
    }
  );
}

export const autoPrefix = "/auth";
