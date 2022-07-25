import connection from "../dbStrategy/pgdb.js";

export async function getGames(req, res){
    const name = req.query.name;
    try {
        if(name){
            const gamesByName = await connection.query(`SELECT games.*, categories.name as "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id WHERE games.name ILIKE '${name}%';`);
            return res.send(gamesByName.rows);    
        }
        
        const games = await connection.query(`SELECT games.*, categories.name as "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id;`);
        res.send(games.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(422);
    }
};

