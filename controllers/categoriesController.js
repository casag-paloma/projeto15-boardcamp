import connection from "../dbStrategy/pgdb.js";
import categorySchema from "../schemas/categorySchema.js";

export async function getCategories(req, res){
    try {
        const categories = await connection.query('SELECT * FROM categories;');
         res.send(categories.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(422);
    }
};

export async function addCategory(req, res){
    const newCategory = req.body;
    const validation = categorySchema.validate(newCategory);

    if(validation.error){
        const message =  validation.error.details.map(e => e.message);
        return res.status(400).send(message);
    }

    try {
        const categories = await connection.query('SELECT * FROM categories;');
        const categoriesNames = categories.rows.map(e => e.name);

        const repeatName = categoriesNames.find(e => e == newCategory.name)
        if(repeatName){
            return res.status(409).send('Essa categoria já existe.')
        }
        await connection.query(`INSERT INTO categories (name) VALUES ('${newCategory.name}');`)
        res.sendStatus(201);

    } catch (error) {
        res.sendStatus(422);
    }
}