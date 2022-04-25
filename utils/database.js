const fs = require('fs');
const mongoose = require('mongoose');
const Logger = require('./Logger');
const dotenv = require('dotenv');
const port = process.env.PORT || 5000;

dotenv.config({ path: '../config.env' });
//Todo: for deployment
const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);
// const DB = process.env.DATABASE_LOCAL;
console.log(DB);
mongoose.connect(DB).then(() => console.log('DB Connected Successfully'));

//MODELS______________________________________________________________________________

//IndependentCollectionsModel
let folder = '../models/IndependentCollections';
// const Year = require(`${folder}/yearModel`);
const Course = require(`${folder}/courseModel`);
// const Section = require(`${folder}/sectionModel`);
const Department = require(`${folder}/departmentModel`);
const Log = require(`${folder}/logModel`);

//Users
folder = '../models/Users';
const User = require(`${folder}/userModel`);
const Student = require(`${folder}/studentModel`);
const Staff = require(`${folder}/staffModel`);
const Physician = require(`${folder}/physicianModel`);

//Medicals
folder='../models/Medicals'
// const Medicine = require(`${folder}/medicineModel`);
const MedicalRecord = require(`${folder}/medicalRecordModel`);

// Chats
folder='../models/Chats'
const Chat = require(`${folder}/chatModel`);
const ChatRoom = require(`${folder}/chatRoomModel`);

const loadJSON = (folder, collection_name) => {
    return JSON.parse(fs.readFileSync(`../dummy data/${folder}/${collection_name}.json`, 'utf-8'));
}
//COLLECTIONS______________________________________________________________________________
folder = 'independent_collections';
//Independent Collections
// const years = loadJSON(folder, 'years');
const courses = loadJSON(folder, 'courses');
// const sections = loadJSON(folder, 'sections');
const departments = loadJSON(folder, 'departments');
const logs = loadJSON(folder, 'logs');

//Users
folder = 'users';
const users = loadJSON(folder, 'users');
const students = loadJSON(folder, 'students');
const staffs = loadJSON(folder, 'staffs');
const physicians = loadJSON(folder, 'physicians');

//Medicals
folder = 'medicals'
// const medicines = loadJSON(folder, 'medicines'); 
const medicalRecords = loadJSON(folder, 'medicalRecords');
//Chats
folder='chats'
const chats = loadJSON(folder, 'chats');
const chatRooms = loadJSON(folder, 'chatRooms');


const importData = async () => {
    try {
        await mongoose.connection.dropDatabase();
        Logger.createIdLogFile('./');
        await User.create(users);//import first
        //Independent Collections
        // await Year.create(years);
        await Course.create(courses);
        // await Section.create(sections);
        await Department.create(departments);

        // //Users
        await Student.create(students);
        await Staff.create(staffs);
        await Physician.create(physicians);

        //Medicals
        await MedicalRecord.create(medicalRecords);
        // await Medicine.create(medicines);

        //Chats
        await ChatRoom.create(chatRooms);
        await Chat.create(chats);


        console.log('imported');
    } catch (err) {
        console.log(err);
    }
}
importData();