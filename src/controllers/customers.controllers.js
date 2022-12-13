import { connectionDB } from "../database/db.js"
import { customerSchema } from "../Models/schemas.js"

export async function createCustom(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    const { error } = customerSchema.validate({
        name: name,
        phone: phone,
        cpf: cpf,
        birthday: birthday,
    }, { abortEarly: false });

    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    try {
        const cpfTaken = await connectionDB.query('SELECT * FROM customers WHERE cpf=$1;',[cpf])
        if (cpfTaken.rows.length > 0) {
            res.status(500).send("Este CPF já está cadastrado");
            return
        }

        await connectionDB.query('INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);', [name, phone, cpf, birthday]);
        res.sendStatus(201);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function findAllCustom(req, res) {
    const { cpf } = req.query;

    try {
        if (cpf === undefined) {
            const allCustomers = await connectionDB.query('SELECT * FROM customers;')

            res.send(allCustomers.rows)
        } else {
            const customersCpf = await connectionDB.query('SELECT * FROM customers WHERE cpf LIKE $1;', [`%${cpf}%`])

            res.send(customersCpf.rows)
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function findCustomById(req, res) {
    const { id } = req.params;

    try {
        const oneCustomer = await connectionDB.query('SELECT * FROM customers WHERE id=$1;', [id]);

        if (oneCustomer.rows.length === 0) {
            res.sendStatus(404)
        }
        res.send(oneCustomer.rows[0])
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function updateCustom(req, res) {
    const { name, phone, cpf, birthday } = req.body;
    const { id } = req.params;

    try {
        await connectionDB.query('UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5;', [name, phone, cpf, birthday, id])

        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
}
