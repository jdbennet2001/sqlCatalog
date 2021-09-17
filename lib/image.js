/*
 Image utilities
 */

 var Jimp = require('jimp');
 

 async function resize(buffer, height=360, width=Jimp.AUTO){

    let image = await Jimp.read(buffer)
    let out =  await image.resize(width, height);
    let data = await out.getBufferAsync(Jimp.MIME_JPEG);
    return data;

 }

 module.exports = {resize}