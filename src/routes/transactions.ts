import { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { knex } from "../database";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";

export async function transactionsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", async (request, reply) => {
    console.log(`[${request.method}] ${request.url}`);
  });

  app.get(
    "/",
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const { sessionId } = request.cookies;

      const transactions = await knex("transaction")
        .where("session_id", sessionId)
        .select();

      return { transactions };
    }
  );

  app.get("/:id", { preHandler: [checkSessionIdExists] }, async (request) => {
    const getTransactionParamsSchema = z.object({ id: z.string().uuid() });
    const { id } = getTransactionParamsSchema.parse(request.params);

    const { sessionId } = request.cookies;
    const transaction = await knex("transaction")
      .where({
        session_id: sessionId,
        id,
      })
      .first();

    return { transaction };
  });

  app.get(
    "/balance",
    { preHandler: [checkSessionIdExists] },
    async (request) => {
      const { sessionId } = request.cookies;
      const balance = await knex("transaction")
        .where("session_id", sessionId)
        .sum("amount", { as: "amount" })
        .first();

      return { balance };
    }
  );

  app.post("/", async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["deposit", "withdraw"]),
    });

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body
    );

    let sessionId = request.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();
      reply.cookie("sessionId", sessionId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    await knex("transaction").insert({
      id: randomUUID(),
      title,
      amount: type === "deposit" ? amount : amount * -1,
      session_id: sessionId,
    });

    return reply.status(201).send();
  });
}
