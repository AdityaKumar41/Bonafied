// const mongoose = require('mongoose');

// // Function to connect to a university-specific database
// async function connectToUniversityDatabase(universityId) {
//   // Fetch the database connection string based on the universityId
//   const dbUri = getDatabaseUriForUniversity(universityId); // Implement this function to retrieve the URI
//   await mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
// }


// // Common Student Schema
// const studentSchema = new mongoose.Schema({
//   id: Number,
//   name: String,
//   university: String,
//   passyear: Number,
//   aadharNumber: String,
// });

// const StudentModel = mongoose.model('Student', studentSchema);
