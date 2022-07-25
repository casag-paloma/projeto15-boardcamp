import connection from "../dbStrategy/pgdb.js";
import customerSchema from '../schemas/customerSchema.js'

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

export async function addCustomer(req, res){
    const newCustomer = req.body;
    const validation = customerSchema.validate(newCustomer, { abortEarly: false });
    if(validation.error){
        const message =  validation.error.details.map(e => e.message);
        return res.status(400).send(message);
    }

    try {

        const customers = await connection.query('SELECT cpf FROM customers;');
        const customersCpf = customers.rows.map(e => e.cpf);
        const repeatCpf = customersCpf.find(e => e == newCustomer.cpf)
        if(repeatCpf){
            return res.status(409).send('Esse cpf já está cadastrado no sistema.')
        }

        await connection.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES (
            '${newCustomer.name}', 
            '${newCustomer.phone}',
            '${newCustomer.cpf}', 
            '${newCustomer.birthday}');`
        );
        res.sendStatus(201);

    } catch (error) {
        console.log(error);
        res.sendStatus(422);
    }
}

export async function updateCustomerById(req, res){
    const id = parseInt(req.params.id);
    if(isNaN(id)){
        return res.sendStatus(400);
    }

    const newCustomer = req.body;
    const validation = customerSchema.validate(newCustomer, { abortEarly: false });
    if(validation.error){
        const message =  validation.error.details.map(e => e.message);
        return res.status(400).send(message);
    }

    try {

        const customers = await connection.query('SELECT cpf FROM customers;');
        const customersCpf = customers.rows.map(e => e.cpf);
        const repeatCpf = customersCpf.find(e => e == newCustomer.cpf)
        if(repeatCpf){
            return res.status(409).send('Esse cpf já está cadastrado no sistema.')
        }

        await connection.query(`UPDATE customers SET name = '${newCustomer.name}', phone = '${newCustomer.phone}', cpf = '${newCustomer.cpf}', birthday = '${newCustomer.birthday}' WHERE id=$1;`, [id]);
        res.sendStatus(200);

    } catch (error) {
        console.log(error);
        res.sendStatus(422);
    }
}
