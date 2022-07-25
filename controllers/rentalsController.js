import connection from "../dbStrategy/pgdb.js";

export async function getRentals(req, res){
    try {
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
        
        const rentalsList = rentals.map(e => e = e.json_build_object)
        res.send(rentalsList);
    } catch (error) {
        console.log(error);
        res.sendStatus(422);
    }
};
