import request from 'supertest'
import {app, HTTP_STATUSES} from "../../index";

describe("/course", () => {
    beforeAll(async () => {
        await request(app).delete("/__test__/data")
    })


    it("should return 200 and empty array", async () => {
        await request(app)
            .get("/courses")
            .expect(200, []);
    })

    it("should return 404 for not existing course", async () => {
        await request(app)
            .get("/courses/1")
            .expect(404);
    })

    it(`should'nt create course with incorrect input data`, async () => {
        await request(app)
            .post("/courses")
            .send({ title: "" })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)
    })

    let createdCourse: any = null;
    it(`should create create course with correct input data`, async () => {
        const createResponse = await request(app)
            .post("/courses")
            .send({ title: "it-incubator course" })
            .expect(HTTP_STATUSES.CREATED_201)

        createdCourse = createResponse.body

        expect(createdCourse).toEqual({
            id: expect.any(Number),
            title: "it-incubator course"
        })

        await request(app)
            .get("/courses")
            .expect(HTTP_STATUSES.OK_200, [createdCourse]);
    })

    let createdCourse2: any = null
    it(`create one more course`, async () => {
        const createResponse = await request(app)
            .post("/courses")
            .send({ title: "it-incubator course 2" })
            .expect(HTTP_STATUSES.CREATED_201)

        createdCourse2 = createResponse.body

        expect(createdCourse2).toEqual({
            id: expect.any(Number),
            title: "it-incubator course 2"
        })

        await request(app)
            .get("/courses")
            .expect(HTTP_STATUSES.OK_200, [createdCourse, createdCourse2]);
    })

    it(`should'nt update course with incorrect input data`, async () => {
        await request(app)
            .put("/courses/" + createdCourse.id)
            .send({ title: "" })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get("/courses/" + createdCourse.id)
            .expect(HTTP_STATUSES.OK_200, createdCourse);
    })

    it(`should'nt update course that not exist`, async () => {
        await request(app)
            .put("/courses/" + -100)
            .send({ title: "good title" })
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it(`should update course with correct input data `, async () => {
        await request(app)
            .put("/courses/" + createdCourse.id)
            .send({ title: "good new title" })
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get("/courses/" + createdCourse.id)
            .expect(HTTP_STATUSES.OK_200, {
                ...createdCourse,
                title: "good new title"
            });

        await request(app)
            .get("/courses/" + createdCourse2.id)
            .expect(HTTP_STATUSES.OK_200, createdCourse2);
    })

    it(`should dele both courses `, async () => {
        await request(app)
            .delete("/courses/" + createdCourse.id)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get("/courses/" + createdCourse.id)
            .expect(HTTP_STATUSES.NOT_FOUND_404);

        await request(app)
            .delete("/courses/" + createdCourse2.id)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get("/courses/" + createdCourse2.id)
            .expect(HTTP_STATUSES.NOT_FOUND_404);

        await request(app)
            .get("/courses")
            .expect(HTTP_STATUSES.OK_200, []);
    })



})