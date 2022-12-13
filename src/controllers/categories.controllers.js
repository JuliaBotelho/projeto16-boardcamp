import { connectionDB } from "../database/db.js"

export async function createCat(req, res) {
    const { name } = req.body;

    if (name === null || name === "") {
        res.sendStatus(400)
        return;
    }

    try {
        const catExists = await connectionDB.query('SELECT * FROM  categories WHERE name=$1;', [name])
        if (catExists.rows.length > 0) {
            res.sendStatus(409)
            return;
        }
        await connectionDB.query("INSERT INTO categories (name) VALUES ($1);", [name]);

        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function findAllCats(req, res) {
    try {
        const allCategories = await connectionDB.query("SELECT * FROM categories;");

        res.send(allCategories.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
}