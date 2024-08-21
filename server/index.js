const ethers = require("ethers");
const express = require("express");
const bodyParser = require("body-parser");
const router = require("./routes/static");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const connectDB = require("./conn");
const DataModel = require("./model/data");
const { checkCookiesAuthentication } = require("./middleware/check");

const app = express();
const PORT = process.env.PORT || 3000;
connectDB();

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

app.use("/", router);

// Function to verify Aadhaar and get associated data
// async function verifyAadhar(hashedAadhar) {
//   try {
//     // Fetch all data
//     const data = await contractInstance.getAllData(); // Adjust this logic as needed

//     for (const entry of data) {
//       if (entry.hashedAadhar === hashedAadhar) {
//         // Return the data if Aadhaar matches
//         return {
//           success: true,
//           message: "Aadhaar verified successfully!",
//           data: {
//             id: entry.id.toString(),
//             name: entry.name,
//             university: entry.university,
//             passyear: entry.passyear,
//           },
//         };
//       }
//     }

//     return { success: false, message: "Aadhaar number does not match." };
//   } catch (error) {
//     return { success: false, message: error.message };
//   }
// }

// app.get("/certificate/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const user = await DataModel.findOne({ id });

//     if (!user) {
//       return res.status(404).send("User not found");
//     }

//     res.redirect("/certificate", {
//       message: "Data ownership verified successfully.",
//       data: user,
//     });
//   } catch (error) {
//     console.error("Error fetching certificate data:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
