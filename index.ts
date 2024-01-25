import express from 'express'

export const app = express()
const port = 3000

export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404,
}
const jsonMiddleware = express.json()

app.use(jsonMiddleware);

const db = {
    courses: [
        {id: 1, title: "frontend"},
        {id: 2, title: "backend"},
        {id: 3, title: "devops"},
        {id: 4, title: "mobile"},
    ]
}

app.get('/new', (req, res) => {
    res.json("SUCCESS")
})

app.get('/courses', (req, res) => {
    if (req.query.title) {
        const foundedCoursesByTitle = db.courses.filter(course => course.title.indexOf(req.query.title as string) > -1)
        res.json(foundedCoursesByTitle)
    }

    res.json(db.courses)
})
app.get('/courses/:id', (req, res) => {
    const foundedCourse = db.courses.find(book => book.id === +req.params.id)

    if (!foundedCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    res.json(foundedCourse)
})
app.post('/courses', (req, res) => {
    if (!req.body.title) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }

    const createdCourse = {
        id: +new Date(),
        title: req.body.title
    }

    db.courses.push(createdCourse)

    res.status(HTTP_STATUSES.CREATED_201)
        .json(createdCourse)

})
app.delete('/courses/:id', (req, res) => {
    db.courses = db.courses.filter(book => book.id !== +req.params.id)

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})
app.put('/courses/:id', (req, res) => {

    if (!req.body.title) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            .json({ error: "title is empty" })
        return
    }
    const foundedCourse = db.courses.find(book => book.id === +req.params.id)

    if (!foundedCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    foundedCourse.title = req.body.title

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})


app.delete("/__test__/data", (req, res) => {
    db.courses = [];

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})