const axios = require("axios");
const Event = require("../models/event.model");
const fs = require("fs");
const path = require("path");

exports.getEvents = async (req, res, next) => {};

exports.reportEvent = async (req, res, next) => {
  try {
    const { alarmTime, description, alarmPicUrl } = req.body;

    await dowloandAndSaveImage(alarmPicUrl, req, res);
    // if (filePath instanceof Error) {
    //   throw new Error(
    //     "Error Occured while Reporting, Make sure the event is okay"
    //   );
    // }
    // console.log(filePath);
  } catch (error) {
    next(error);
  }
};

// readBlobDataAndSave = (blob, imageName, folderPath) => {
//   const reader = new FileReader();

//   reader.onloadend = () => {
//     const buffer = Buffer.from(reader.result);
//     const filePath = `${folderPath}/${imageName}`;

//     fs.writeFile(filePath, buffer, (error) => {
//       if (error) {
//         console.error("Error occurred while writing the image file:", error);
//       } else {
//         console.log("Image file saved successfully!");
//       }
//     });
//   };

//   reader.readAsArrayBuffer(blob);
// };

dowloandAndSaveImage = async (imageUrl, req, res) => {
  const assetsFolder = "assets";
  const fileType = ".jpeg";

  // Create the assets folder if it doesn't exist
  fs.mkdirSync(assetsFolder, { recursive: true });
  let filePathToReturn;

  try {
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });
    // BEGIN FILE NAME
    const fileName =
      "IMG" +
      "-" +
      new Date().toISOString().split(":").join("").split("-").join("") +
      "-" +
      "TVWS_SECURITY" +
      Math.floor(1000 + Math.random() * 9000);

    const newFilePath = path.join(assetsFolder, fileName + fileType);
    await fs.writeFile(newFilePath, Buffer.from(response.data), (error) => {
      if (error) {
        console.error(`Error occurred while saving ${fileName}:`, error);
        filePathToReturn = error;
      } else {
        console.log(`${fileName} saved successfully!`);
        // COPIED CODE
        saveDetails(req, res, newFilePath);
        //
      }
    });
  } catch (error) {
    console.error(`Error occurred while fetching ${imageUrl}:`, error);
  }
};

saveDetails = async (req, res, filePath) => {
  const { alarmTime, description } = req.body;
  const { mobile, username } = req.user;
  const event = new Event({
    time: alarmTime,
    description: description,
    username: username,
    mobile: mobile,
    image: filePath,
  });
  const savedEvent = await event.save();

  if (!savedEvent) {
    const error = new Error("Event was not saved into the db");
    error.statusCode = 500;
    throw error;
  }
  res.status(200).json({ message: "Reported successfully" });
};

exports.getReports = async (req, res, next) => {
  try {
    const foundEvents = await Event.find().sort({ _id: -1 }).limit(100);
    if (foundEvents) {
      return res
        .status(201)
        .json({ message: "Events found", reports: foundEvents });
    }
    throw new Error("Something went wrong");
  } catch (error) {
    next(error);
  }
};
