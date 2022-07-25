import connection from "../dbStrategy/pgdb.js";
import dayjs from 'dayjs' ;
import rentalSchema from "../schemas/rentalSchema.js";

export async function getRentals(req, res){
    const customerId = parseInt(req.query.customerId);
    const gameId = parseInt(req.query.gameId);

    try {

        if(customerId){
            const {rows: rentals} = await connection.query(`SELECT json_build_object(
                'id', r.id,
                'customerId', r."customerId",
                'gameId', r."gameId",
                'rentDate', r."rentDate",
                'daysRented', r."daysRented",
                'returnDate', r."returnDate",
                'originalPrice', r."originalPrice",
                'delayFee', r."delayFee",
                'customer', json_build_object(
                        'id', c.id,
                        'name', c.name
                    ),
                'game', json_build_object(
                    'id', g.id,
                    'name', g.name,
                    'categoryId', g."categoryId",
                    'categoryName', cat.name
                    )
                )FROM rentals r JOIN customers c ON r."customerId" = c.id JOIN games g ON r."gameId" = g.id JOIN categories cat ON g."categoryId" = cat.id WHERE r."customerId" = $1;`, [customerId]
        );
        const rentalsByCustomerId = rentals.map(e => e = e.json_build_object);
        return res.send(rentalsByCustomerId);
        }

        if(gameId){
            const {rows: rentals} = await connection.query(`SELECT json_build_object(
                'id', r.id,
                'customerId', r."customerId",
                'gameId', r."gameId",
                'rentDate', r."rentDate",
                'daysRented', r."daysRented",
                'returnDate', r."returnDate",
                'originalPrice', r."originalPrice",
                'delayFee', r."delayFee",
                'customer', json_build_object(
                        'id', c.id,
                        'name', c.name
                    ),
                'game', json_build_object(
                    'id', g.id,
                    'name', g.name,
                    'categoryId', g."categoryId",
                    'categoryName', cat.name
                    )
                )FROM rentals r JOIN customers c ON r."customerId" = c.id JOIN games g ON r."gameId" = g.id JOIN categories cat ON g."categoryId" = cat.id WHERE r."gameId" = $1;`, [gameId]
        );
        const rentalsByGameId = rentals.map(e => e = e.json_build_object);
        return res.send(rentalsByGameId);
        }
        const {rows: rentals} = await connection.query(`SELECT json_build_object(
                'id', r.id,
                'customerId', r."customerId",
                'gameId', r."gameId",
                'rentDate', r."rentDate",
                'daysRented', r."daysRented",
                'returnDate', r."returnDate",
                'originalPrice', r."originalPrice",
                'delayFee', r."delayFee",
                'customer', json_build_object(
                        'id', c.id,
                        'name', c.name
                    ),
                'game', json_build_object(
                    'id', g.id,
                    'name', g.name,
                    'categoryId', g."categoryId",
                    'categoryName', cat.name
                    )
                )FROM rentals r JOIN customers c ON r."customerId" = c.id JOIN games g ON r."gameId" = g.id JOIN categories cat ON g."categoryId" = cat.id;`
        );
        
        const rentalsList = rentals.map(e => e = e.json_build_object);
        res.send(rentalsList);
    } catch (error) {
        console.log(error);
        res.sendStatus(422);
    }
};

export async function deleteRental(req,res){
    const id = req.params.id;

    if(isNaN(id)){
        return res.sendStatus(400);
    }

    try {
        const rentalsById = await connection.query(`SELECT * FROM rentals WHERE rentals.id =$1;`, [id]);
        const rentalById = rentalsById.rows[0];
        if(!rentalById) return res.sendStatus(404);
        if(!rentalsById.returnDate) return res.sendStatus(400);
        res.sendStatus(200);

    } catch (error) {
        console.log(error);
        res.sendStatus(422);
    }
}

export async function addRental(req, res){
    const newRental = req.body;
    const rentDate = dayjs().format('YYYY-MM-DD'); 
    const validation = rentalSchema.validate(newRental, { abortEarly: false });
    if(validation.error){
        const message =  validation.error.details.map(e => e.message);
        return res.status(400).send(message);
    }

    try {

        const customers = await connection.query('SELECT id FROM customers;');
        const customersId = customers.rows.map(e => e.id);
        const hasCustomerId = customersId.find(e => e == newRental.customerId);
        if(!hasCustomerId) return res.sendStatus(400);
        const games = await connection.query('SELECT id FROM games;');
        const gamesId = games.rows.map(e => e.id);
        const hasGameId = gamesId.find(e => e == newRental.gameId);
        if(!hasGameId) return res.sendStatus(400);

        const {rows: stockGame} = await connection.query(`SELECT "stockTotal" FROM games WHERE games.id = ${newRental.gameId};`);
        const stockGameNow = stockGame[0].stockTotal; 
        console.log(stockGame[0].stockTotal, stockGameNow);
        if(stockGameNow < 1) return res.sendStatus(400);

        const {rows: pricePerGame} = await connection.query(`SELECT "pricePerDay" FROM games WHERE games.id = ${newRental.gameId};`);
        console.log(pricePerGame[0].pricePerDay);

        const originalPrice = (pricePerGame[0].pricePerDay) * (newRental.daysRented);
        console.log(originalPrice);
        await connection.query(`INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES (
            ${newRental.customerId}, 
            ${newRental.gameId},
            '${rentDate}',
            ${newRental.daysRented},
            null,
            ${originalPrice},
            null);`
        );

        await connection.query(`UPDATE games SET "stockTotal" = ${stockGameNow - 1} WHERE id = ${newRental.gameId};`);
        res.sendStatus(201);

    } catch (error) {
        console.log(error);
        res.sendStatus(422);
    }
}
