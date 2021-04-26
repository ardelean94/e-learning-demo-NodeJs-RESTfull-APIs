const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground-Array-SubDocuments')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String
});

const Author = mongoose.model('Author', authorSchema);

const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
  authors: [authorSchema]
}));

async function createCourse(name, authors) {
  const course = new Course({
    name, 
    authors: authors
  }); 
  
  const result = await course.save();
  console.log(result);
}

async function listCourses() { 
  const courses = await Course.find();
  console.log(courses);
}

async function updateAuthor(courseId){
  //Solution 1 - query first and then update
  //const course = await Course.findById(courseId);
  // course.author.name = 'John Miky';
  // course.save();

  //Solution 2 - update dicrectly
  const course = await Course.updateOne({ _id: courseId }, {
    //$set - for update; $unset - for remove
    $unset: {
      'author': ''
    }
  });
}

async function addAuthor(courseId, author){
  const course = await Course.findById(courseId);
  course.authors.push(author);
  course.save();
}

async function removeAuthor(courseId, authorId){
  const course = await Course.findById(courseId);
  const author = course.authors.id(authorId);
  author.remove();
  course.save();
}

//updateAuthor('608305747d7def5d60c5d96f');

// createCourse('Node Course', [
//   new Author({ name: 'John' }),
//   new Author({ name: 'Miky' })
// ]);

//addAuthor('60830840123c641fe89b224e', new Author({ name: 'Amy'}));

//removeAuthor('60830840123c641fe89b224e', '608308cad6ad461b94f04b7b');
