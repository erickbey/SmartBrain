const handleRegistration = (req, res, knex, bcrypt) => {
    const { email, name, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    if (!email || !name || !password) {
        return res.status(400).json('incorrect form submission')
    }

    knex.transaction(trx => {
        trx.insert({
            hash,
            email
        })
        .into('login')
        .returning('email')
        .then(email => {
            return trx('users')
            .returning('*')
            .insert({
                email: email[0].email,
                name,
                joined: new Date()
            }).then(user => {
                res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('Unable to register'))
}

module.exports = {
    handleRegistration: handleRegistration
};