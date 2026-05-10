const mongoose = require('mongoose');

async function fixDepts() {
  await mongoose.connect('mongodb+srv://hari20045058_db_user:93VqAY1FZ1WzuGXC@cluster0.mqnk6lg.mongodb.net/test?retryWrites=true&w=majority', {family: 4});
  const db = mongoose.connection.db;

  const users = await db.collection('users').find({}).toArray();
  const depts = await db.collection('departments').find({}).toArray();
  
  let updatedUsers = 0;
  for (let user of users) {
    if (typeof user.departmentId === 'string' && user.departmentId.length !== 24) {
      const matchingDept = depts.find(d => d.name === user.departmentId);
      if (matchingDept) {
        await db.collection('users').updateOne(
          { _id: user._id },
          { $set: { departmentId: matchingDept._id } }
        );
        updatedUsers++;
      }
    }
  }

  const books = await db.collection('books').find({}).toArray();
  let updatedBooks = 0;
  for (let book of books) {
    if (typeof book.departmentId === 'string' && book.departmentId.length !== 24) {
      const matchingDept = depts.find(d => d.name === book.departmentId);
      if (matchingDept) {
        await db.collection('books').updateOne(
          { _id: book._id },
          { $set: { departmentId: matchingDept._id } }
        );
        updatedBooks++;
      }
    }
  }

  const issued = await db.collection('issuedbooks').find({}).toArray();
  let updatedIssued = 0;
  for (let item of issued) {
    if (typeof item.departmentId === 'string' && item.departmentId.length !== 24) {
      const matchingDept = depts.find(d => d.name === item.departmentId);
      if (matchingDept) {
        await db.collection('issuedbooks').updateOne(
          { _id: item._id },
          { $set: { departmentId: matchingDept._id } }
        );
        updatedIssued++;
      }
    }
  }
  
  console.log('UPDATED USERS:', updatedUsers);
  console.log('UPDATED BOOKS:', updatedBooks);
  console.log('UPDATED ISSUED:', updatedIssued);
  process.exit(0);
}

fixDepts();
