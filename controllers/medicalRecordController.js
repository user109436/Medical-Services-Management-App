const path = require('path');
const fs = require("fs");
const PdfPrinter = require("pdfmake");
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const MedicalRecord = require('../models/Medicals/medicalRecordModel');
const Student = require('../models/Users/studentModel');
const Staff = require('../models/Users/staffModel');
const Chat = require('../models/Chats/chatModel');


const ObjectId = require('mongoose').Types.ObjectId;

const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}
const fullnameLastNameFirst = ({ ...name }) => {
    return `${name.lastname.toUpperCase()}, ${name.firstname.toUpperCase()} ${name.suffix ? name.suffix : ''} ${name.middlename ? name.middlename.toUpperCase()+'.' : ''}`;
}
const fullname = (name) => {
    return `${name.firstname.toUpperCase()} ${name.middlename ? name.middlename.toUpperCase() : ''}. ${name.lastname.toUpperCase()} ${name.suffix ? name.suffix : ''}`;
}
const pdfDocTemplate = (doc) => {
    const logo = dataImage(path.join(__dirname, '../', 'client/assets/logo.jpeg'));
    const bg = dataImage(path.join(__dirname, '../', 'client/assets/bg.png'));
    return {
        footer: function (currentPage, pageCount) { return { text: currentPage.toString() + ' of ' + pageCount, margin: [40, 0] }; },
        background: [
            {
                image: `${logo}`,
                width: 60,
                alignment: 'right',
                margin: 15
            },
            {
                image: `${bg}`,
                width: 550,
                alignment: 'center',
                margin: 20,
                opacity: .3
            },
        ],
        content: [
            {
                stack: [
                    {
                        text: [
                            "Student No./Employee No.: ",
                            { text: `${doc.employee_student_no}`, style: "textBold", fontSize: 14 },
                        ],
                    },
                    {
                        text: [
                            "Patient: ",
                            { text: `${fullnameLastNameFirst(doc.patient.name)}`, style: "textBold", fontSize: 23, link: `${doc.patient_info_link}`, decoration: 'underline', color: "blue" },
                        ],
                    },
                    {
                        text: [
                            "Birthdate: ",
                            { text: `${formatDate(doc.patient.birthday)}`, style: "textBold", fontSize: 14 },
                            " Sex: ",
                            { text: `${doc.patient.sex.toUpperCase()}`, style: "textBold", fontSize: 14 },
                        ],
                    },
                    "--------------------------------------------------------------------------------------------------------------------------------",
                ],
            },
            {
                text: `Date: ${formatDate(doc.createdAt)}`,
                margin: [0, 10, 0, 10],
            },
            { text: "Symptoms", style: "section" },
            { text: [`${doc.symptoms}`] },
            { text: "Diagnosis", style: "section" },
            { text: [`${doc.diagnosis}`] },
            {
                text: [
                    `Laboratory Results (if any) `,
                    {
                        text: "verify here",
                        link: ` ${doc.laboratories_link}`,
                        decoration: "underline",
                        color: "blue",
                    }
                ], style: "section"
            },
            { text: [`${doc.laboratories ? doc.laboratories : ">"}`] },
            {
                text: [
                    `Prescription `,
                    {
                        text: "verify here",
                        link: ` ${doc.prescriptions_link}`,
                        decoration: "underline",
                        color: "blue",
                    }
                ], style: "section"
            },
            { text: [`${doc.prescriptions}`] },
            {
                stack: [
                    { text: [`${fullname(doc.physician.name)}`] },
                    { text: [`Licensed No.:${doc.physician.prc_license}`] },
                    { text: [`PTR No:${doc.physician.ptr_no ? doc.physician.ptr_no : '_____________'}`] },
                ],
                style: "footer",
            },
            {
                style: "note",
                text: [
                    `This is an official Medical Record of ${fullname(doc.patient.name)} from Anorico Health Care Center `,
                    
                ],
            },
        ],
        styles: {
            section: {
                fontSize: 13,
                margin: [0, 20, 0, 0],
            },
            textBold: {
                bold: true,
            },
            footer: {
                alignment: "right",
            },
            note: {
                italics: true,
                margin: [0, 20, 0, 30],
                fontSize: 10,
            },
        },
        defaultStyle: {
            font: "Times",
        },
    };
}
const pdfPrescriptionTemplate = (doc) => {
    const logo = dataImage(path.join(__dirname, '../', 'client/assets/logo.jpeg'));
    const bg = dataImage(path.join(__dirname, '../', 'client/assets/bg.png'));
    return {
        footer: function (currentPage, pageCount) { return { text: currentPage.toString() + ' of ' + pageCount, margin: [40, 0] }; },
        background: [
            {
                image: `${logo}`,
                width: 60,
                alignment: 'right',
                margin: 15
            },
            {
                image: `${bg}`,
                width: 550,
                alignment: 'center',
                margin: 20,
                opacity: .3
            },
        ],
        content: [
            {
                stack: [
                    {
                        text: [
                            "Student No./Employee No.: ",
                            { text: `${doc.employee_student_no}`, style: "textBold", fontSize: 14 },
                        ],
                    },
                    {
                        text: [
                            "Patient: ",
                            { text: `${fullnameLastNameFirst(doc.patient.name)}`, style: "textBold", fontSize: 23, link: `${doc.patient_info_link}`, decoration: 'underline', color: "blue" },
                        ],
                    },
                    {
                        text: [
                            "Birthdate: ",
                            { text: `${formatDate(doc.patient.birthday)}`, style: "textBold", fontSize: 14 },
                            " Sex: ",
                            { text: `${doc.patient.sex.toUpperCase()}`, style: "textBold", fontSize: 14 },
                        ],
                    },
                    "--------------------------------------------------------------------------------------------------------------------------------",
                ],
            },
            {
                text: `Date: ${formatDate(doc.createdAt)}`,
                margin: [0, 10, 0, 10],
            },
            {
                text: [
                    `Prescription `,
                    {
                        text: "verify here",
                        link: ` ${doc.prescriptions_link}`,
                        decoration: "underline",
                        color: "blue",
                    }
                ], style: "section"
            },
            { text: [`${doc.prescriptions}`] },
            {
                stack: [
                    { text: [`${fullname(doc.physician.name)}`] },
                    { text: [`Licensed No.:${doc.physician.prc_license}`] },
                    { text: [`PTR No:${doc.physician.ptr_no ? doc.physician.ptr_no : '_____________'}`] },
                ],
                style: "footer",
            },
            {
                style: "note",
                text: [
                    `This is an official Medical Record of ${fullname(doc.patient.name)} from Anorico Health Care Center `,
                    
                ],
            },
        ],
        styles: {
            section: {
                fontSize: 13,
                margin: [0, 20, 0, 0],
            },
            textBold: {
                bold: true,
            },
            footer: {
                alignment: "right",
            },
            note: {
                italics: true,
                margin: [0, 20, 0, 30],
                fontSize: 10,
            },
        },
        defaultStyle: {
            font: "Times",
        },

    }
}
const base64 = (file) => {
    return fs.readFileSync(file, "base64");
}
const dataImage = (file) => {
    return `data:image/jpeg;base64,${base64(file)}`;
}

exports.getMedicalRecords = factory.getAll(MedicalRecord);
exports.getMedicalRecord = factory.getOne(MedicalRecord);
exports.createMedicalRecord = factory.createOne(MedicalRecord);
exports.updateMedicalRecord = factory.updateOne(MedicalRecord);
exports.deleteMedicalRecord = factory.deleteOne(MedicalRecord);
//TODO:include link to view prescription & laboratories & to view pdf format
exports.exportMedicalRecord = catchAsync(async (req, res, next) => {
    const medicalRecord = await MedicalRecord.findById(req.params.id);

    if (!medicalRecord) {
       return res.status(200).json({
            status: "success",
            message: 'No Records Found'
        });
    }
    let doc = {
        patient_info_link: `${req.protocol}://${req.get('host')}/view-medical-record/${medicalRecord._id}/?`,
        prescriptions_link: `${req.protocol}://${req.get('host')}/view-medical-record/${medicalRecord._id}/##`,
        laboratories_link: `${req.protocol}://${req.get('host')}/view-medical-record/${medicalRecord._id}/#lab`,
        employee_student_no: '',
        patient: '',
        physician: '',
        symptoms: '',
        diagnosis: '',
        laboratories: '',
        prescriptions: '',
        createdAt:medicalRecord.createdAt,
        verficationToken: `${req.protocol}://${req.get('host')}/view-medical-record/verify/${medicalRecord.verificationToken}`
    }
    // 1. Extract User Role
    const role = medicalRecord.user_id.role;
    const staff = role.includes('faculty') || role.includes('non-faculty') || role.includes('encoder') || role.includes('admin');
    //2. Identify what type of Patient(Student/Staff/Physician)
    let patient = '';
    if (role.includes('student')) {
        patient = await Student.find({ user_id: medicalRecord.user_id._id });
        doc.employee_student_no = patient[0].student_no;
    } else if (staff) {
        patient = await Staff.find({ user_id: medicalRecord.user_id._id });
        doc.employee_student_no = patient[0].employee_no;
    }
    //3.Get Physician(Medical Record & Prescription)
    doc.patient = patient[0];
    doc.physician = medicalRecord.physician_id;



    medicalRecord.symptoms.forEach(item => {
        doc.symptoms += `> ${item.symptom}\n `;
    })
    medicalRecord.diagnosis.forEach(item => {
        doc.diagnosis += `> ${item.diagnose}\n `;
    })
    medicalRecord.laboratories.forEach(item => {
        doc.laboratories += `> ${item.laboratory}\n `;
    })
    let meds = '';
    medicalRecord.prescriptions.forEach(prescription => {
        meds += '>Rx \n ';
        prescription.medicine.forEach(medicine => {
            meds += `\n${formatDate(prescription.createdAt)} \n`
            meds += `${medicine.details}\n\n`
            meds += `Prescribe by:${fullname(prescription.physician_id.name)} \n\n `;

        });
    })
    doc.prescriptions = meds;


    const fontPath = "./fonts/Times New Roman";
    const fonts = {
        Times: {
            normal: `${fontPath}/times new roman.ttf`,
            bold: `${fontPath}/times new roman bold.ttf`,
            italics: `${fontPath}/times new roman italic.ttf`,
            bolditalics: `${fontPath}/times new roman bold italic.ttf`,
        },
        Roboto: {
            normal: `${fontPath}/Roboto-Regular.ttf`,
            bold: `${fontPath}/Roboto-Medium.ttf`,
            italics: `${fontPath}/Roboto-Italic.ttf`,
            bolditalics:
                `${fontPath}/Roboto-MediumItalic.ttf`,
        },
    };
    console.log(__dirname);
    const printer = new PdfPrinter(fonts);
    const docDefinition = pdfDocTemplate(doc);
    const options = {
        // ...
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition, options);
    let temp = '';
    pdfDoc.pipe(temp = fs.createWriteStream('./client/public/assets/pdf/medical-record.pdf'));
    pdfDoc.end();
    temp.on('finish', async function () {
        res.download('./client/public/assets/pdf/medical-record.pdf');
    });

});
exports.exportPrescriptionRecord = catchAsync(async (req, res, next) => {
    const medicalRecord = await MedicalRecord.findById(req.params.id);

    if (!medicalRecord) {
        return res.status(200).json({
            status: "success",
            message: 'No Records Found'
        });
    }
    let doc = {
        patient_info_link: `${req.protocol}://${req.get('host')}/view-medical-record/${medicalRecord._id}/?`,
        prescriptions_link: `${req.protocol}://${req.get('host')}/view-medical-record/${medicalRecord._id}/#${req.params.prescription_id}`,
        employee_student_no: '',
        patient: '',
        physician: '',
        prescriptions: '',
        createdAt:'',
        verficationToken: `${req.protocol}://${req.get('host')}/view-medical-record/verify/${medicalRecord.verificationToken}`
    }
    // 1. Extract User Role
    const role = medicalRecord.user_id.role;
    const staff = role.includes('faculty') || role.includes('non-faculty') || role.includes('encoder') || role.includes('admin');
    //2. Identify what type of Patient(Student/Staff/Physician)
    let patient = '';
    if (role.includes('student')) {
        patient = await Student.find({ user_id: medicalRecord.user_id._id });
        doc.employee_student_no = patient[0].student_no;
    } else if (staff) {
        patient = await Staff.find({ user_id: medicalRecord.user_id._id });
        doc.employee_student_no = patient[0].employee_no;
    }
    //3.Get Physician(Medical Record & Prescription)
    doc.patient = patient[0];
    doc.physician = medicalRecord.physician_id;
    let meds = '';
    console.log(`prescription_id:`,req.params.prescription_id);
    medicalRecord.prescriptions.forEach(prescription => {
        if(prescription._id.toString()===req.params.prescription_id){ //find the id of the medicine
            meds += '>Rx \n ';
            prescription.medicine.forEach(medicine => {
                meds += `\n${formatDate(prescription.createdAt)} \n`
                meds += `${medicine.details}\n\n`
                meds += `Prescribe by:${fullname(prescription.physician_id.name)} \n\n `;
                
            });
            doc.createdAt=prescription.createdAt;
            return true;
        }
    })
    doc.prescriptions = meds;

    const fontPath = "./fonts/Times New Roman";
    const fonts = {
        Times: {
            normal: `${fontPath}/times new roman.ttf`,
            bold: `${fontPath}/times new roman bold.ttf`,
            italics: `${fontPath}/times new roman italic.ttf`,
            bolditalics: `${fontPath}/times new roman bold italic.ttf`,
        },
        Roboto: {
            normal: `${fontPath}/Roboto-Regular.ttf`,
            bold: `${fontPath}/Roboto-Medium.ttf`,
            italics: `${fontPath}/Roboto-Italic.ttf`,
            bolditalics:
                `${fontPath}/Roboto-MediumItalic.ttf`,
        },
    };
    console.log('prescriptions:',__dirname);
    const printer = new PdfPrinter(fonts);
    const docDefinition = pdfPrescriptionTemplate(doc);
    const options = {
        // ...
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition, options);
    let temp = '';
    pdfDoc.pipe(temp = fs.createWriteStream('./client/public/assets/pdf/prescription-record.pdf'));
    pdfDoc.end();
    temp.on('finish', async function () {
        res.download('./client/public/assets/pdf/prescription-record.pdf');
    });

});
exports.verifyMedicalRecord = catchAsync(async (req, res, next) => {
    const medicalRecord = await MedicalRecord.find({ verificationToken: req.params.verificationToken });
    let doc = {};
    if (medicalRecord.length > 0) {
        // 1. Extract User Role
        const role = medicalRecord[0].user_id.role;
        const staff = role.includes('faculty') || role.includes('non-faculty') || role.includes('encoder') || role.includes('admin');
        //2. Identify what type of Patient(Student/Staff/Physician)
        if (role.includes('student')) {
            doc.patient = await Student.find({ user_id: medicalRecord[0].user_id._id });
        } else if (staff) {
            doc.patient = await Staff.find({ user_id: medicalRecord[0].user_id._id });
        }
        doc.patient = doc.patient[0];
        doc.physician = medicalRecord[0].physician_id;
        let name = fullname(doc.patient.name);
        return res.status(200).json({
            status: 'success',
            message: `This Medical Record is Verified and belongs to ${name}`,
            doc
        })
    }
    return res.status(200).json({
        status: 'success',
        message: `This  Medical Record is Invalid`
    });


});

exports.getPrescriptions = catchAsync(async (req, res, next) => {
    const doc = await MedicalRecord.findById(req.params.id);
    if (!doc) {
        return res.status(200).json({
            status: 'success',
            message: `This Prescription Does not Exist`
        })
    }
    const { prescriptions } = doc;
    return res.status(200).json({
        status: 'success',
        length: doc.length,
        prescriptions
    });
});

exports.getLaboratories = catchAsync(async (req, res, next) => {
    const medicalRecord = await MedicalRecord.findById(req.params.id);
    const createdAt=new Date(medicalRecord.createdAt);
    const year = createdAt.getFullYear();
    const month = createdAt.getMonth()+1;
    const day = createdAt.getDate();
    const startDate = new Date(`${year}-${month}-${day}`);
    const endDate = new Date(`${year}-${month}-${day+1}`);
    const user_id =medicalRecord.user_id._id;
    const doc = await Chat.aggregate(
        [
        {
        $match:{
            createdAt:{
                $gte: startDate,
                $lt: endDate
            },
            sender:user_id
        }
        }
        ])
    return res.status(200).json({
        status:'success',
        length:doc.length,
        doc
    });
})
exports.getPatientInfo = catchAsync(async (req, res, next) => {
    const medicalRecord = await MedicalRecord.findById(req.params.id);

    if (!medicalRecord) {
       return res.status(200).json({
            status: "success",
            message: 'No Records Found'
        });
    }
    // 1. Extract User Role
    const role = medicalRecord.user_id.role;
    const staff = role.includes('faculty') || role.includes('non-faculty') || role.includes('encoder') || role.includes('admin');
    //2. Identify what type of Patient(Student/Staff/Physician)
    let doc = '';
    if (role.includes('student')) {
        doc = await Student.findOne({ user_id: medicalRecord.user_id._id });
    } else if (staff) {
        doc = await Staff.findOne({ user_id: medicalRecord.user_id._id });
    }
    if (!doc) {
        return res.status(200).json({
            status: 'success',
            message: "No Records Found for this patient"
        })
    }
    return res.status(200).json({
        status: 'success',
        length: doc.length,
        doc
    });

});
exports.getMedicalRecordByUserId = catchAsync(async (req, res, next) => {
    const doc = await MedicalRecord.find({ user_id: req.params.id });
    if (!doc) {
        return res.status(400).json({
            status: 'fail',
            message: `No Document found with that ID`
        });
    }
   return res.status(200).json({
        status: 'success',
        length:doc.length,
        doc
    });
})
