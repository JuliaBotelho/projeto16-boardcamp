import { connectionDB } from "../database/db.js"

export async function createGame(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    if (name === "" || name === null || stockTotal <= 0 || pricePerDay <= 0) {
        res.sendStatus(400)
        return;
    }


    try {
        await connectionDB.query('INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5);', [name, image, stockTotal, categoryId, pricePerDay]);

        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function findAllGames(req, res) {
    const { name } = req.query;

     try {
        if(name === undefined){
            const allGames = await connectionDB.query('SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId"= categories.id;');

            res.send(allGames.rows);
        }else{
            const allGamesWithFilter = await connectionDB.query('SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId"= categories.id WHERE LOWER(games.name) LIKE $1;', [`%${name}%`]);

            res.send(allGamesWithFilter.rows);
        }

    } catch (err) {
        res.status(500).send(err.message);
    } 
}