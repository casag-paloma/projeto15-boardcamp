import connection from "../dbStrategy/pgdb.js";
import gameSchema from "../schemas/gameSchema.js";

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

export async function addGame(req, res){
    const newGame = req.body;
    const validation = gameSchema.validate(newGame, { abortEarly: false });
    
    if(validation.error){
        const message =  validation.error.details.map(e => e.message);
        return res.status(400).send(message);
    }

    try {

        const categoriesId = await connection.query('SELECT id FROM categories;');
        const categoriesIdList = categoriesId.rows.map(e => e.id);
        const hasCategoryId = categoriesIdList.find(e => e === newGame.categoryId);
        if(!hasCategoryId){
            return res.status(400).send('Essa id de Categoria não existe no banco de dados')
        }

        const games = await connection.query('SELECT * FROM games;');
        const gamesNames = games.rows.map(e => e.name);
        const repeatName = gamesNames.find(e => e == newGame.name)
        if(repeatName){
            return res.status(409).send('Esse jogo já existe.')
        }
        await connection.query(`INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES (
            '${newGame.name}', 
            '${newGame.image}',
            ${newGame.stockTotal}, 
            ${newGame.categoryId}, 
            ${newGame.pricePerDay});`
        )
        res.sendStatus(201);

    } catch (error) {
        console.log(error);
        res.sendStatus(422);
    }
}
