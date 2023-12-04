import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
    const notes = await prisma.note.findMany();

    res.json(notes);
});

app.post("/", async(req, res) => {
    const { title, content } = req.body;

    if(!title || !content) {
        return res
            .status(400)
            .send("title and content fields are required");
    }

    try {
        const note = await prisma.note.create({
            data: { title, content }
        })
        res.json(note);
    } catch (error) {
        res
            .status(500)
            .send("something went wrong");
    }
})

app.put("/:id", async(req, res) => {
    const {title, content} = req.body;
    const id = parseInt(req.params.id);

    if(!title || !content) {
        res
            .status(400)
            .send("title and content fields are required");
    }

    if(!id || isNaN(id)) {
        res
            .status(400)
            .send("id must be a valid number")
    }

    try {
        const updatedNote = await prisma.note.update({
            where: { id },
            data: { title, content }
        })

        res.json(updatedNote);
    } catch (error) {
        res
            .status(500)
            .send("something went wrong")
    }
})

app.delete("/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if(!id || isNaN(id)) {
        return res
            .status(400)
            .send("id must be a valid number")
    }

    try {
        await prisma.note.delete({
            where: { id }
        });
        res.status(204).send();
    } catch (error) {
        res
            .status(500)
            .send("deletion unsuccessful")
    }
});



app.listen(4000, () => {
    console.log("server running on localhost:4000")
});