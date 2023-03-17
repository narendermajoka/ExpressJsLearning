const fs = require('fs');
const path = require('path');

const deleteFile = (filePath) =>{
    filePath = path.join(path.dirname(__dirname), filePath);
    console.log(filePath);
    fs.unlink(filePath, (err)=>{
        if(err){
            console.log(err);
            throw new Error(err);
        }
    });
};

exports.deleteFile = deleteFile;