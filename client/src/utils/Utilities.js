

export const hasErrors = (obj, whiteList = []) => {
    let errors = 0;
    for (let key in obj) {
        if (whiteList.includes(key)) continue; //ignore not required field
        if (key.includes('Error')) continue; //ignore non-database field
        if (obj[key] === "") {
            obj[`${key}Error`] = true;
            errors++;
        }
    }
    return errors;
}

export const resetErrors = (obj, whiteList = []) => {
    for (let key in obj) {
        if (whiteList.includes(key)) continue; //ignore not required field
        if (!key.includes('Error')) continue; //ignore non-error field
        obj[key] = false;
    }
}
export const makeFieldsError = (obj, whiteList = []) => {
    for (let key in obj) {
        if (whiteList.includes(key)) continue; //ignore not required field
        if (!key.includes('Error')) continue; //ignore non-error field
        obj[key] = true;
    }
}
export const resetFields = (obj, whiteList = []) => {
    for (let key in obj) {
        if (whiteList.includes(key)) continue; //ignore not required field
        if (key.includes('Error')) continue; //ignore non-database field
        obj[key] = "";
    }
}

export const fullname = (name) => {
    if(!name)return false;
    let fullname = '';
    fullname += name?.firstname + " "||'';
    fullname += name?.middlename ? name?.middlename + " " : '';
    fullname += name?.lastname ||'';
    fullname += name?.suffix ? name?.suffix + " " : '';
    return fullname
}


export const isObjectExist = (obj = [], newObj = {}, whitelist = []) => {
    if (Object.keys(newObj).length === 0) return false;
    if (obj.length === 0) return false;
    for (let item in obj) {
        let keyCounter = 0, duplicateKeys = 0;
        for (let key in obj[item]) {
            if (whitelist.includes(key)) continue; //ignore not required field
            if (key.includes('Error')) continue; //ignore non-database field
            //trim fields & lowercase
            obj[item][key] = obj[item][key]?.toString().trim().toLowerCase();
            newObj[key] = newObj[key]?.toString().trim().toLowerCase();
            if (obj[item][key] === newObj[key]) {
                duplicateKeys++;
            }
            keyCounter++;
        }
        if (keyCounter === duplicateKeys) {
            return true;
        }
    };
    return false;
}

export const updateObjectById = (obj = [], newObj = {}) => {
    if (Object.keys(newObj).length === 0) return false;
    if (obj.length === 0) return false;
    for (let item in obj) {
        for (let key in obj[item]) {
            if (key !== 'id') continue; //ignore non id field
            if (key.includes('Error')) continue; //ignore non-database field
            if (obj[item]['id'] === newObj['id']) {
                let updateData = { ...newObj };
                obj[item] = updateData;
                return true;
            }
        }
    };
    return false;
}
export const copyFields = (objDest, objSrc, whiteList = []) => {
    for (let key in objSrc) {
        if (whiteList.includes(key)) continue; //ignore not required field
        if (key.includes('Error')) continue; //ignore non-error field
        objDest[key] = objSrc[key];
    }
}

export const getYearSection = (student) => {
    let yearSection = '';
    yearSection += student?.year_id?.year||'';
    // yearSection += student?.course_id?.course_code + "-";
    yearSection += student?.course_id?.course;
    yearSection += student?.section_id?.section||'';
    return yearSection;
}

export const formatDate = (date) => {
    //2021-04-25
    return new Date(date).toISOString().slice(0, 10);
}

export const addLabelField = (array = [], key) => { //for combo box
    if (array.length === 0) return false;
    for (let item in array) {
        if (key === 'name') {
            array[item]['label'] = fullname(array[item][key]);
            continue;
        }
        array[item]['label'] = array[item][key];
    }
}
export const addLabelFields = (array = [], key1, key2) => { //for combo box
    if (array.length === 0) return false;
    for (let item in array) {
        array[item]['label'] = `${array[item][key1]} - ${array[item][key2] ? array[item][key2] : ""}`;
    }
}
export const filterArrayObj = (array, key, ...allowed) => {
    let newArrayObj = {
        doc: []
    };
    array.forEach((obj) => {
        if (allowed.includes(obj[key])) newArrayObj.doc.push(obj);
    })
    return newArrayObj;
}

export const humanReadableDate = (isoDate) => {
    // from:
    // https://jsfiddle.net/samurai_jane/4h4ss38t/
    // https://stackoverflow.com/questions/39924309/javascript-iso-date-to-human-readable
    const readable = new Date(isoDate); 
    const m = readable.getMonth();  
    const d = readable.getDate(); 
    const y = readable.getFullYear(); 
    const time= readable.toLocaleTimeString('en',
    { timeStyle: 'short', hour12: false, timeZone: 'UTC' });

    // we define an array of the months in a year
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    // we get the text name of the month by using the value of m to find the corresponding month name
    const mlong = months[m];
    return `${mlong} ${d} ${y} - ${time}`;
}
export const hasFileExtension=(imagePath, fileExtensions=['.jpeg', '.jpg', '.png'])=>{
    let hasExtension = false;
    fileExtensions.forEach(extension => {
      if (imagePath.includes(extension)) {
        hasExtension = true;
        return;
      }
    });
    return hasExtension;
}
// https://www.codegrepper.com/code-examples/javascript/how+to+convert+image+to+base64+in+javascript
//https://blog.shovonhasan.com/using-promises-with-filereader/

const readUploadedFileAsBase64 = (inputFile) => {
  const temporaryFileReader = new FileReader();

  return new Promise((resolve, reject) => {
    temporaryFileReader.onerror = () => {
      temporaryFileReader.abort();
      reject(new DOMException("Problem parsing input file."));
    };

    temporaryFileReader.onload = () => {
      resolve(temporaryFileReader.result);
    };
    temporaryFileReader.readAsDataURL(inputFile);
  });
};

export const encodeImageFileAsURL = async (file) => {

  try {
    const fileContents = await readUploadedFileAsBase64(file)  
    return fileContents;
  } catch (e) {
    console.warn(e.message)
  }
}
