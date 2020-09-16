const express = require('express'); //declaro una variable express para indicar que voy a usar express
const mongoose = require('mongoose');//declaramos const para indicar el uso de mongoose
const app = express();//creo una variable de tipo express que contendra todo lo que tiene express
/*metodo GET,recibe 2 paramteros (ruta:a la que el servidor va a responder) y una funcion arrow que tiene dos parametros req y res, desde el parametro/funcion REQ el servidor recibe todo lo que el usuario manda o consulta y RES es la respuesta que da el servidor al cliente*/
app.use(express.json());// declaramos que recibiremos dentro del BODY la informacion en formato JASON!

//const para conectar la base de datos con nuestra aplicacion
const uri = "mongodb+srv://pepe:WPWQ0dHVO3GQwnFM@cluster0.cwvjj.mongodb.net/pwitt?retryWrites=true&w=majority";


//conexion a mongoose
async function conectar()
{
    try
    {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("Conectado a la base de datos metodo: mongoodb - async-await");
    }
    catch (e)
    {
        console.log(e);
    }
};
conectar();


//esquemas libro
const LibroSchema = new mongoose.Schema({
    nombre: String,
    autor: String,
    genero: String,
    prestado: String,
})

//Modelo enlaza el modelo hecho con la coleccion de MONGO
const LibroModel = mongoose.model("libros", LibroSchema);


//esquema  de genero
const Generochema = new mongoose.Schema({
    idGenero: String,
    nomGenero: String
})
//Modelo enlaza el modelo hecho con la coleccion de MONGO
const GeneroModel = mongoose.model("genero", Generochema);


// uso de metodo CRUD- create, read, update, delete


//METODO POST- INGRESO DE LIBRO

app.post('/libro', async (req, res) =>
{ //conexion a la base de datos async await
    try
    {
        //verificacion de informacion
        let nombre = req.body.nombre;
        let autor = req.body.autor;
        let descripcion = req.body.descripcion;
        let genero = req.body.genero;
        let prestado = req.body.prestado;

        //comprobacion de datos
        if (autor == undefined || nombre == undefined || genero == undefined || prestado == undefined)
        {
            throw new Error('debes cargar todos los campos requeridos');
        }
        if (autor == '' || nombre == '' || genero == '')
        {
            throw new Error('no pueden haber campos vacios solamente en pretado');
        }

        //creo una estructura para enviar a la base de datos
        let libro = {
            nombre: nombre,
            autor: autor,
            genero: genero,
            prestado: prestado
        }
        //hago el push del libro a la base de datos
        let libroGuardado = await LibroModel.create(libro); //pongo await

        console.log(libroGuardado);
        res.status(200).send("libro guardado" + libroGuardado);


    } catch (e)
    {

        res.status(422).send('ERROR EN LA CARGA DE LIBRO' + e);

    }
});

//get para todos
app.get('/libro', async (req, res) =>
{
    try
    {
        let listaLibros = await LibroModel.find();
        console.log(listaLibros)

        res.status(200).send(listaLibros);
    } catch (e)
    {
        res.status(422).send('algo salio mal' + e);
    }
})


//get unico
app.get('/libro/:id', async (req, res) =>
{
    LibroSchema

    try
    {

        let idLibro = req.params.id;
        let libroElegido = await LibroModel.findById(idLibro);
        res.status(200).send(libroElegido);
    } catch (e)
    {
        res.status(422).send('algo salio mal' + e);
    }
});

app.put('/libro/:id', async (req, res) =>
{
    LibroSchema


    try
    {

        let libroId = req.params.id;
        let prestado = req.body.prestado;
        if (libro == undefined)
        {
            throw new Error("No enviaste ninguna libro");
        }
        let libro = await LibroModel.findById(libroId);
        if (libro.prestado != "")
        {
            throw new Error("El libro ya esta prestado");
        } else
        {
            let libroAPrestar = {

                prestado: prestado
            }

            await LibroModel.findByIdAndUpdate(libroId, libroAPrestar);
            res.status(200).send("libro prestado a: " + libroAPrestar.prestado);
        }
    } catch (e)
    {
        
        res.status(422).send('algo salio mal' + e);
    }

})

mongoose.set('useFindAndModify', false);

//metodo Delete

app.delete('/libro/:id', async (req, res) =>
{

    try
    {

        let libroId = req.params.id;
        let libro = await LibroModel.findById(libroId);
        let libroDevuelto = {
            prestado: ""
        }
        await LibroModel.findOneAndUpdate(libroId, libroDevuelto);

        res.status(200).send("libro borrado ");

    } catch (e)
    {
        res.status(422).send('algo salio mal ' + e);
    }

});




app.post('/genero', async (req, res) =>
{ 
    try
    {
        
        let idGenero = req.body.idGenero;
        let nomGenero = req.body.nomGenero;
        if (idGenero == undefined || nomGenero == undefined)
        {
            throw new Error('debes cargar LibroSchema los campos requeridos');
        }
        if (idGenero == '' || nomGenero == '')
        {
            throw new Error('no pueden haber campos vacios');
        }
        
        let genero = {
            idGenero: idGenero,
            nomGenero: nomGenero
        }
        
        let generoGuardado = await GeneroModel.create(genero);
        console.log(generoGuardado);
        res.status(200).send("genero guardado" + generoGuardado);
    } catch (e)
    {
        res.status(422).send('ERROR EN LA CARGA DEL GENERO' + e);
    }
});
//get gral
app.get('/genero', async (req, res) =>
{
    try
    {
        let listaGenero = await GeneroModel.find();
        console.log(listaGenero)
        res.status(200).send(listaGenero);
    } catch (e)
    {
        res.status(422).send('algo salio mal' + e);
    }
})
//get unico
app.get('/genero/:id', async (req, res) =>
{
    try
    {
        let idGenero = req.params.id;
        let generoElegido = await GeneroModel.findById(idGenero);
        res.status(200).send(generoElegido);
    } catch (e)
    {
        res.status(422).send('algo salio mal' + e);
    }
});

app.put('/genero/:id', async (req, res) =>
{
    try
    {
        let idGenero = req.body.id;
        let genero = await GeneroModel.findById(idGenero);
        await GeneroModel.findOneAndUpdate(idGenero);
        res.status(200).send("el genero ha sido modificado ");
    } catch (e)
    {
        res.status(422).send('algo salio mal' + e);
    }
});

//metodo Delete
app.delete('/genero/:id', async (req, res) =>
{
    try
    {
        let idGenero = req.params.id;
        let genero = await GeneroModel.findById(idGenero);
        await GeneroModel.findOneAndUpdate(idGenero);
        res.status(200).send("el genero ha sido eliminado ");
    } catch (e)
    {
        res.status(422).send('algo salio mal' + e);
    }
});



app.listen(3000, () =>
{
    console.log('servidor escuchando en puerto 3000');
});