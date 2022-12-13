import { connectionDB } from "../database/db.js"
import dayjs from "dayjs";

export async function createRental(req, res) {
    const { customerId, gameId, daysRented } = req.body;

    const delayFee = null;
    const returnDate = null;
    const rentDate = dayjs().format('YYYY-MM-DD');

    try {
        const rentedGame = await connectionDB.query('SELECT * FROM games WHERE id=$1;', [gameId]);
        if(rentedGame.rows.length === 0){
            res.sendStatus(400);
            return
        }

        const stockTaken = await connectionDB.query('SELECT * FROM rentals WHERE "gameId"=$1 AND "returnDate" is null;',[gameId])
        if(Number(rentedGame.rows[0].stockTotal) - stockTaken.length <= 0){
            res.sendStatus(400);
            return
        }
        const originalPrice = rentedGame.rows[0].pricePerDay * daysRented;

        await connectionDB.query('INSERT INTO rentals("customerId","gameId","rentDate","daysRented","returnDate","originalPrice","delayFee") VALUES ($1,$2,$3,$4,$5,$6,$7);', [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee]);
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function findAllRentals(req, res) {
    const { customerId, gameId } = req.query;

    try {
        if (customerId === undefined && gameId === undefined) {
            const rentalResponse = []
            const rentalData = await connectionDB.query('SELECT rentals.*, customers.name AS custname, games.name AS gamename, games."categoryId", categories.name AS categoryname FROM rentals JOIN customers ON customers.id = rentals."customerId" JOIN games ON games.id=rentals."gameId" JOIN categories ON categories.id = games."categoryId";')

            rentalData.rows.forEach((rentData) => {
                rentalResponse.push({
                    id: rentData.id,
                    customerId: rentData.customerId,
                    gameId: rentData.gameId,
                    rentDate: rentData.rentDate,
                    daysRented: rentData.daysRented,
                    returnDate: rentData.returnDate,
                    originalPrice: rentData.originalPrice,
                    delayFee: rentData.delayFee,
                    customer: {
                        id: rentData.customerId,
                        name: rentData.custname,
                    },
                    game: {
                        id: rentData.gameId,
                        name: rentData.gamename,
                        categoryId: rentData.categoryId,
                        categoryName: rentData.categoryname,
                    },
                })
            })

            res.status(200).send(rentalResponse)
        }
        else if (customerId === undefined && gameId !== undefined) {
            const rentalResponse = []
            const rentalData = await connectionDB.query('SELECT rentals.*, customers.name AS custname, games.name AS gamename, games."categoryId", categories.name AS categoryname FROM rentals JOIN customers ON customers.id = rentals."customerId" JOIN games ON games.id=rentals."gameId" JOIN categories ON categories.id = games."categoryId" WHERE games.id = $1;', [gameId])

            rentalData.rows.forEach((rentData) => {
                rentalResponse.push({
                    id: rentData.id,
                    customerId: rentData.customerId,
                    gameId: rentData.gameId,
                    rentDate: rentData.rentDate,
                    daysRented: rentData.daysRented,
                    returnDate: rentData.returnDate,
                    originalPrice: rentData.originalPrice,
                    delayFee: rentData.delayFee,
                    customer: {
                        id: rentData.customerId,
                        name: rentData.custname,
                    },
                    game: {
                        id: rentData.gameId,
                        name: rentData.gamename,
                        categoryId: rentData.categoryId,
                        categoryName: rentData.categoryname,
                    },
                })
            })

            res.status(200).send(rentalResponse)
        }
        else if (customerId !== undefined && gameId === undefined) {
            const rentalResponse = []
            const rentalData = await connectionDB.query('SELECT rentals.*, customers.name AS custname, games.name AS gamename, games."categoryId", categories.name AS categoryname FROM rentals JOIN customers ON customers.id = rentals."customerId" JOIN games ON games.id=rentals."gameId" JOIN categories ON categories.id = games."categoryId" WHERE customers.id = $1;', [customerId])

            rentalData.rows.forEach((rentData) => {
                rentalResponse.push({
                    id: rentData.id,
                    customerId: rentData.customerId,
                    gameId: rentData.gameId,
                    rentDate: rentData.rentDate,
                    daysRented: rentData.daysRented,
                    returnDate: rentData.returnDate,
                    originalPrice: rentData.originalPrice,
                    delayFee: rentData.delayFee,
                    customer: {
                        id: rentData.customerId,
                        name: rentData.custname,
                    },
                    game: {
                        id: rentData.gameId,
                        name: rentData.gamename,
                        categoryId: rentData.categoryId,
                        categoryName: rentData.categoryname,
                    },
                })
            })

            res.status(200).send(rentalResponse)
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function finalizeRental(req, res) {
    const { id } = req.params;
    const returnDate = dayjs().format("YYYY-MM-DD");

    try {
        const allRentals = await connectionDB.query('SELECT rentals.*, customers.name AS custname, games.name AS gamename, games."categoryId", categories.name AS categoryname FROM rentals JOIN customers ON customers.id = rentals."customerId" JOIN games ON games.id=rentals."gameId" JOIN categories ON categories.id = games."categoryId";');
        const rentalExists = allRentals.rows.filter(rental => rental.id === Number(id))
        if (rentalExists.length === 0) {
            res.sendStatus(404)
            return
        }
        if (rentalExists[0].returnDate !== null) {
            res.sendStatus(400)
            return
        }

        const rentDate = dayjs(rentalExists[0].rentDate).format("YYYY-MM-DD").toString();
        const delayDays = dayjs().diff(rentDate, 'day').toString();
        const delayFee = Number(delayDays) * Number(rentalExists[0].originalPrice);

        await connectionDB.query('UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id = $3;', [returnDate, delayFee, id])
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function removeRental(req, res) {
    const { id } = req.params;

    try {
        const theRental = await connectionDB.query('SELECT * FROM rentals WHERE id= $1;', [id]);

        if (theRental.rows.length === 0) { 
            res.sendStatus(404)
            return
        }
        if (theRental.rows[0].returnDate !== null) {
            res.sendStatus(400)
            return
        }

        await connectionDB.query('DELETE FROM rentals WHERE id=$1;',[id]);

        res.sendStatus(200);

    } catch (err) {
        res.status(500).send(err.message);
    }
}