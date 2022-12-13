import { connectionDB } from "../database/db.js"

export async function createCat(req, res) {
    const { name } = req.body;

    if (name === null || name === ""){
        res.sendStatus(400)
        return;
    }

    try {
      await connectionDB.query("INSERT INTO categories (name) VALUES ($1);", [name]); 

      res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function findAllCats(req, res) {
    try{
        const allCategories = await connectionDB.query("SELECT * FROM categories;");

        res.send(allCategories.rows);
    }catch (err) {
        res.status(500).send(err.message);
    }
}