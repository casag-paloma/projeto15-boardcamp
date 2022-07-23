import connection from "../dbStrategy/pgdb.js";

export async function getCategories(req, res){
    try {
        const categories = await connection.query('SELECT * FROM categories;');
         res.send(categories.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(422);
    }
}