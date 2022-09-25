const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express()

MongoClient.connect('mongodb+srv://team1:team1@cluster0.o3uyn92.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('best-college-football-teams')
    const quotesCollection = db.collection('teams')

    app.set('view engine', 'ejs')
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use(express.static('public'))

    app.get('/', (req, res) => {
      db.collection('teams').find().toArray()
        .then(results => {
          res.render('index.ejs', { teams: results })
        })
        .catch(/* ... */)
    })

    app.post('/teams', (req, res) => {
      quotesCollection.insertOne(req.body)
        .then(result => {
          res.redirect('/')
        })
        .catch(error => console.error(error))
    })

    app.listen(process.env.PORT || 3000,
        () => console.log("server running..."))

    app.put('/teams', (req, res) => {
      quotesCollection.findOneAndUpdate(
        { team: 'Alabama' },
        {
          $set: {
            team: req.body.name,
            quote: req.body.quote
          }
        },
        {
          upsert: true
        }
      )
        .then(result => res.json('Success'))
        .catch(error => console.error(error))
    })

    app.delete('/teams', (req, res) => {
      quotesCollection.deleteOne(
        { team: req.body.name }
      )
        .then(result => {
          if (result.deletedCount === 0) {
            return res.json('No team to delete')
          }
          res.json('Deleted worse team')
        })
        .catch(error => console.error(error))
    })

  })
  .catch(console.error)