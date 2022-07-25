import connection from "../dbStrategy/pgdb.js";

export async function getCustomers(req, res){
    const cpf = req.query.cpf;
    try {
        if(cpf){
            const customersByCpf = await connection.query(`SELECT * FROM customers WHERE customers.cpf ILIKE '${cpf}%';`);
            return res.send(customersByCpf.rows);    
        }

        const customers = await connection.query(`SELECT * FROM customers;`);
        res.send(customers.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(422);
    }
};

export async function getCustomersById(req, res){
    const id = parseInt(req.params.id);
    if(isNaN(id)){
        return res.sendStatus(400);
    }

    try {
        const customersById = await connection.query(`SELECT * FROM customers WHERE customers.id =$1;`, [id]);
        const customerById = customersById.rows[0];
        if(!customerById) return res.sendStatus(404);
        res.send(customerById);
        
    } catch (error) {
        console.log(error);
        res.sendStatus(422);
    }
};
