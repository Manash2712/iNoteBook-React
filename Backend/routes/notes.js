const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
const Note = require("../models/Note")
const { body, validationResult } = require("express-validator");

//ROUTE 1: Get all the notes useing: GET "/api/notes/getallnotes". Login Required!
router.get('/fetchallnotes',fetchuser, async (req,res) => {
    const notes = await Note.find({user: req.user})
    res.json(notes)
})

//ROUTE 2: Add a new note using: POST "/api/notes/addnote". Login required
router.post('/addnote',fetchuser,
  [
    body("title", "Enter a valid Title").isLength({ min: 3 }),
    // body("email", "Enter a valid email").isEmail(),
    body("description", "Description must be atleast 5 characters!").isLength({ min: 5}),
  ], 
  async(req,res) => {

    try {
        //If there are errors, return bad request and the
        const {title, description, tag} = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }

        const note = new Note({
            title, description, tag, user: req.user
        })
        const saveNote = await note.save();

        res.json(saveNote)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occurred!!");
    }
    
  })

  //ROUTE 3: Update an existing Note using PUT "/api/notes/updatenote". Login required
  router.put('/updatenote/:id',fetchuser,async(req,res) =>{
    const {title, description, tag} = req.body;
    const newNote = {};
    if(title){newNote.title = title};
    if(description){newNote.description = description};
    if(tag){newNote.tag = tag};

    //find the note to be updated and update it!
    // console.log(req.params.id)
    let note = await Note.findById(req.params.id);
    console.log(note)
    if(!note){
        return req.status(404).send('Not Found');
    }
    if(note.user.toString() !== req.user){
        return res.status(404).send("Not Allowed!");
    }

    note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
    res.json({note})

  })

  //ROUTE 4: Delete an existing note using delete "/api/notes/deletenote/;id". Login requiured
  router.delete('/deletenote/:id', fetchuser, async(req,res) => {
    let note = await Note.findById(req.params.id);
    if(!note){ res.status(404).send("Not Found")}

    //Allow deletion only if user owns this Note
    if(note.user.toString() !== req.user){
        return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id);
    res.json({"Success": "Note has been deleted", note: note});
  })

module.exports = router