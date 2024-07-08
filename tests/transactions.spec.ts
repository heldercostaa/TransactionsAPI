import { execSync } from "node:child_process";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../src/app";

describe("Transactions routes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync("npm run knex migrate:rollback --all");
    execSync("npm run knex migrate:latest");
  });

  it("should be able to create a new transaction", async () => {
    const response = await request(app.server)
      .post("/transaction")
      .send({ title: "New transaction", amount: 5000, type: "deposit" });

    expect(response.statusCode).toEqual(201);
  });

  it("should be able to list all transactions", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transaction")
      .send({ title: "New transaction", amount: 5000, type: "deposit" });

    const cookies = createTransactionResponse.get("Set-Cookie")!;

    const listTransactionsResponse = await request(app.server)
      .get("/transaction")
      .set("Cookie", cookies);

    expect(listTransactionsResponse.statusCode).toBe(200);
    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: "New transaction",
        amount: 5000,
      }),
    ]);
  });

  it("should be able to get a specific transaction", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transaction")
      .send({ title: "New transaction", amount: 5000, type: "deposit" });

    const cookies = createTransactionResponse.get("Set-Cookie")!;

    const listTransactionsResponse = await request(app.server)
      .get("/transaction")
      .set("Cookie", cookies);

    const transactionId = listTransactionsResponse.body.transactions[0].id;

    const getTransactionsResponse = await request(app.server)
      .get(`/transaction/${transactionId}`)
      .set("Cookie", cookies);

    expect(getTransactionsResponse.statusCode).toBe(200);
    expect(getTransactionsResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: "New transaction",
        amount: 5000,
      })
    );
  });

  it("should be able to get transactions balance", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transaction")
      .send({ title: "Deposit transaction", amount: 5000, type: "deposit" });

    const cookies = createTransactionResponse.get("Set-Cookie")!;

    await request(app.server)
      .post("/transaction")
      .set("Cookie", cookies)
      .send({ title: "Withdraw transaction", amount: 100, type: "withdraw" });

    const balanceResponse = await request(app.server)
      .get("/transaction/balance")
      .set("Cookie", cookies);

    expect(balanceResponse.statusCode).toBe(200);
    expect(balanceResponse.body.balance).toEqual({ amount: 4900 });
  });
});
