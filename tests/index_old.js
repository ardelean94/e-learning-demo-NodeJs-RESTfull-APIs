const mongoose = require('mongoose');
const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());    //middleware

//connect to mongoDB
mongoose.connect('mongodb://localhost/courses')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

//define a schema
const courseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    author: { type: String, required: true} ,
    tags: {
        type: Array,
        //custom validation - sync
        // validate: {
        //     validator: function(v){
        //         return v && v.length > 0;
        //     },
        //     message: 'A course should have at least one tag.'
        // }

        //custom validation - async
        isAsync: true,
        validator: function(v, callback){
            setTimeout(() => {
                //Do some async work
                const result = v && v.length > 0;
                callback(result);    
            }, 4000);
        },
        message: 'A course should have at least one tag'
    },
    date: { type: Date, default: Date.now },
    isPublished: Boolean
});
const Course = mongoose.model('Course', courseSchema);


// async function createCourse(){
//     const course = new Course({
//         name: "Name 1",
//         author: "author 1",
//         tags: ["tag 1", "tag 2"],
//         isPublished: true
//     });
    
//     const result = await course.save();
//     console.log(result);
// }

// //createCourse();

// async function getCourses(){
//     return await Course.find();
// }

// async function run(){
//     const courses = await getCourses();
//     console.log(courses);
// }

// async function getCourse(name){
//     return await Course.find({ name: name});
// }

// //getCourse('Name 1');

// // //Update courses - Query First
// // async function updateCourse(id) {
// //     const course = await Course.findById(id);
// //     if(!course) return;

// //     course.isPublished = true;
// //     course.author = 'Another Author';

// //     // //another approach of updating
// //     // course.set({
// //     //     isPublished: true,
// //     //     author: 'Another Author 2'
// //     // });

// //     const result = await course.save();
// //     console.log(result);
// // }

// //Update courses - Update First
// async function updateCourse(id) {
//     const result = await Course.updateOne({ _id: id }, {
//         $set: {
//             author: 'Mosh',
//             isPublished: false
//         }
//     });

//     console.log(result);
// }

// //updateCourse('6082a61b5b3c781d84f43772');


// //Delete
// async function removeCourse(id) {
//     const result = await Course.deleteOne({ _id: id });
//     console.log(result);
// }

//removeCourse('6082a61b5b3c781d84f43772');

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'}
];

// GET /api/courses
app.get('/api/courses', (req, res) => {
    Course.find((error, result) => {
        if(error) return res.status(500).send(error);
        res.send(result);
    });
});

//GET /api/courses/:id
app.get('/api/courses/:id', async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (!course)
    return res
      .status(404)
      .send("The customer with the given ID was not found.");

    res.send(course);
});

// POST /api/courses
app.post('/api/courses', (req, res) => {

    //object destructuring const {...} = ...
    const { error } = validateCourse(req.body);
    if(error)   return res.status(400).send(error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };

    courses.push(course);
    res.send(course);
});

// PUT /api/courses/:id
app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send(`The course with the id ${req.params.id} was not found.`);

    //object destructuring const {...} = ...
    const { error } = validateCourse(req.body);
    
    if(error){     //  400
        res.status(400).send(error.details[0].message);
        return;
    }

    course.name = req.body.name;
    res.send(course);
});

// DELETE /api/courses/:id
app.delete('/api/courses/:id', (req, res) =>{
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send(`The course with the id ${req.params.id} was not found.`);

    const index = courses.indexOf(course);
    courses.splice(index, 1);
    res.send(course);
});

//set PORT = xyz - set the environment variable
const port = process.env.PORT || 3000;
app.listen(port, () =>{ console.log(`Listening on port ${port}...`); });


//Input Validation using joi
//schema of the course object
function validateCourse(course){
    
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    return schema.validate(course);
}


//Modeling Relationships
//Trade off between query perfomance and consistency

//Using Reference (Normalization) - similar with Relational Databases -> CONSISTENCY
let author = {
    name: 'John'
}

let course = {
    author: 'id',
    price: 1500
}


//Using Embedded Documents (Denormalization) -> PERFOMANCE
let author2 = {
    course: {
        name: 'e-learning'
    },
    name: 'Johnny'
}


//Hybrid
let author3 = {
    name: 'John'
    // 50 other properties
}

let course3 = {
    author: {
        id: 'ref to author3',
        name: 'John'
    },
    price: 1500
}