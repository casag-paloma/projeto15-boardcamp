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
