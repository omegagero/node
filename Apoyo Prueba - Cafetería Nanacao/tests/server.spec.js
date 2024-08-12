const request = require("supertest");
const server = require("../index");

describe("Operaciones CRUD de cafes", () => {

    test("La ruta GET /cafes devuelve un status code 200 y el tipo de dato recibido es un arreglo con por lo menos 1 objeto", async () => {
        const response = await request(server).get("/cafes");
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    test("Se obtiene un código 404 al intentar eliminar un café con un id que no existe", async () => {
        const idInexistente = 999;
        const response = await request(server)
            .delete(`/cafes/${idInexistente}`)
            .set("Authorization", "Bearer token");

        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty("message");
    });

    test("La ruta POST /cafes agrega un nuevo café y devuelve un código 201", async () => {
        const nuevoCafe = { id: 5, nombre: "Latte" };
        const response = await request(server)
            .post("/cafes")
            .send(nuevoCafe);

        expect(response.statusCode).toBe(201);
        expect(response.body).toContainEqual(nuevoCafe);
    });

    test("La ruta PUT /cafes devuelve un status code 400 si intentas actualizar un café enviando un id en los parámetros que sea diferente al id dentro del payload", async () => {
        const idDiferente = 3;
        const cafe = { id: 4, nombre: "Espresso" };
        const response = await request(server)
            .put(`/cafes/${idDiferente}`)
            .send(cafe);

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("message");
    });

});
