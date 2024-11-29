const snmp = require('net-snmp');
const express = require('express');
const cors = require('cors');

// cors
const app = express();
app.use(cors());
app.use(express.json());


const target = '127.0.0.1'; 
const community = 'public';    


const session = snmp.createSession(target, community);


app.get('/snmp/get', (req, res) => {
    const oid = req.query.oid;

    session.get([oid], (error, varbinds) => {
        if (error) {
            res.status(500).json({ error: error.toString() });
        } else {
            res.json({ oid, value: varbinds[0].value.toString() });
        }
    });
});


app.post('/snmp/set', (req, res) => {
    const { oid, value } = req.body;
    const varbind = [{ oid, type: snmp.ObjectType.Integer, value }];

    session.set(varbind, (error) => {
        if (error) {
            res.status(500).json({ error: error.toString() });
        } else {
            res.json({ message: 'Value set successfully' });
        }
    });
});


const PORT = 3000;
app.listen(PORT, () => console.log(`SNMP Agent server running on port ${PORT}`));
