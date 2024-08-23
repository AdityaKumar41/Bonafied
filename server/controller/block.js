const ethers = require("ethers");
const DataModel = require("../model/data");
require("dotenv").config();
const { parse } = require("url");
const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const {
  abi,
} = require("../artifacts/contracts/ContractApi.sol/ContractApi.json");
const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
const crypto = require("crypto");
const User = require("../model/User");
const LogData = require("../model/logdata");
const { getVerifyAuth } = require("../utils/auth");

async function handlePostLogin(req, res) {
  const { aadharNumber } = req.body;

  if (!aadharNumber) {
    return res.render("result", {
      message: "Aadhaar number is required.",
      data: [],
    });
  }

  try {
    // Hash the Aadhaar number for privacy
    const hashedAadhar = crypto
      .createHash("sha256")
      .update(aadharNumber)
      .digest("hex");

    // Check MongoDB for existing data
    let mongoData = await DataModel.find({ hashedAadhar });

    // If no data in MongoDB, fetch from blockchain
    if (mongoData.length === 0) {
      const blockchainData = await contractInstance.getDataByAadhar(
        hashedAadhar
      );

      if (blockchainData.length === 0) {
        return res.render("result", {
          message: "Aadhaar number does not match.",
          data: [],
        });
      }

      // Store blockchain data in MongoDB
      for (const entry of blockchainData) {
        const newData = {
          date: entry.date, // Update to store date instead of id
          name: entry.name,
          university: entry.university,
          passyear: entry.passyear,
          hash: entry.transactionHash,
          hashedAadhar,
        };

        await DataModel.create(newData);
      }

      // Retrieve the newly added data from MongoDB
      mongoData = await DataModel.find({ hashedAadhar });
    }

    // Format the data for rendering
    const formattedData = mongoData.map((entry) => ({
      date: entry.date, // Update to use date instead of id
      name: entry.name,
      university: entry.university,
      passyear: entry.passyear,
      hash: entry.hash,
      Aadhar: entry.hashedAadhar,
    }));

    res.render("result", {
      message: "Aadhaar verified successfully!",
      data: formattedData,
    });
  } catch (error) {
    res.render("result", { message: error.message, data: [] });
  }
}

// Handle set data form submission
async function handleSetData(req, res) {
  try {
    const dataEntries = req.body.students;
    console.log(dataEntries);

    // Check if the request body is an array
    if (!Array.isArray(dataEntries)) {
      return res.status(400).send({
        success: false,
        message: "Invalid data format. Expected an array of data entries.",
      });
    }

    const results = [];
    const errors = [];

    // Iterate over each data entry
    for (const entry of dataEntries) {
      const { name, university, passyear, aadharNumber, date, courseProgram } =
        entry;

      if (
        !date ||
        !name ||
        !university ||
        !passyear ||
        !aadharNumber ||
        !courseProgram
      ) {
        errors.push({ entry, message: "Missing required fields." });
        continue;
      }

      try {
        // Hash the Aadhaar number for privacy
        const hashedAadhar = crypto
          .createHash("sha256")
          .update(aadharNumber)
          .digest("hex");

        // Store certificate data on blockchain
        const setDataTx = await contractInstance.setData(
          date, // Ensure `date` is correctly passed to the contract method
          name,
          university,
          passyear,
          hashedAadhar,
          courseProgram // Pass the new field
        );
        const receipt = await setDataTx.wait(); // Wait for the transaction to be mined

        const transactionHash = receipt.transactionHash;

        if (!transactionHash) {
          errors.push({
            entry,
            message: "Blockchain transaction failed or incomplete.",
          });
          continue;
        }

        // Save to the database
        const newData = await DataModel.create({
          date, // Store `date` instead of `id`
          name,
          university,
          passyear,
          hash: transactionHash,
          hashedAadhar,
          courseProgram, // Save the new field
        });

        console.log(newData);

        results.push({ entry: newData, message: "Data set successfully!" });
      } catch (error) {
        errors.push({ entry, message: `Blockchain error: ${error.message}` });
      }
    }

    // Respond with a summary of results and errors
    res.send({
      success: true,
      results,
      errors,
      message: `${results.length} entries processed successfully, ${errors.length} entries failed.`,
    });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: `Server error: ${error.message}` });
  }
}

async function handleGetDataByHash(req, res) {
  try {
    const hash = req.params.hash;
    console.log(hash);

    // Retrieve data from the smart contract
    const data = await contractInstance.getData(hash);

    // Destructure the data according to the updated contract
    let val = {
      date: data[0],
      name: data[1],
      university: data[2],
      passyear: parseInt(data[3]),
      hashedAadhar: data[4],
      courseProgram: data[5],
    };

    // Log the data retrieval action
    const existingEntry = await LogData.findOne({
      hash: val.hashedAadhar,
    });
    if (!existingEntry) {
      await LogData.create({
        hash: val.hashedAadhar,
        view: "true",
      });
    }

    res.json(val);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function handleGetData(req, res) {
  try {
    // const data = await contractInstance.getAllData();
    // const getAllDataList = data.map((user) => ({
    //   id: parseInt(user.id),
    //   name: user.name,
    //   university: user.university,
    //   passyear: parseInt(user.passyear),
    //   hashedAadhar: user.hashedAadhar,
    // }));

    const getAllDataList = await DataModel.find({});
    res.status(200).json(getAllDataList);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function handleVerifyOwner(req, res) {
  try {
    const { date, name, university, passyear, hashedAadhar, courseProgram } =
      req.body;
    console.log(date, name, university, passyear, hashedAadhar, courseProgram);

    // Call the smart contract function to verify data ownership
    const isVerified = await contractInstance.verifyDataOwnership(
      date,
      name,
      university,
      passyear,
      hashedAadhar,
      courseProgram // Include courseProgram in the verification call
    );

    if (isVerified) {
      // Fetch the user data from MongoDB using the date as the key
      const user = await DataModel.findOne({ date });

      if (user) {
        // Respond with the certificate data
        res.json({
          success: true,
          message: "Data ownership verified successfully.",
          data: user,
        });
      } else {
        res
          .status(404)
          .json({ success: false, message: "User data not found." });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "Data ownership verification failed.",
      });
    }
  } catch (error) {
    console.error("Error verifying data:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

async function credVerified(req, res) {
  try {
    // Fetch all data from the LogData collection
    const data = await LogData.find();
    const verifiedCount = data.filter(
      (item) => item.verified === "true"
    ).length;

    const credViewCount = data.filter((item) => item.view === "true").length;
    res.status(200).json({ data, verifiedCount, credViewCount });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
}

async function handleSignup(req, res) {
  try {
    const {
      firstname,
      lastname,
      email,
      password,
      organizationURL,
      organizationName,
    } = req.body;

    // Extract email domain
    const emailDomain = email.split("@")[1];

    // Extract domain from organization URL
    const { hostname: organizationURLDomain } = parse(organizationURL);
    if (!emailDomain || !organizationURLDomain) {
      return res
        .status(400)
        .json({ error: "Invalid email or organization URL" });
    }

    // Ensure both domains match (case-insensitive comparison)
    if (emailDomain.toLowerCase() !== organizationURLDomain.toLowerCase()) {
      return res
        .status(400)
        .json({ error: "Email domain and organization URL domain must match" });
    }

    // Proceed with user creation
    await User.create({
      firstname,
      lastname,
      email,
      password,
      organizationURL,
      organizationName,
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function handleLogin(req, res) {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    const getToken = await User.checkPassword(email, password);
    console.log(getToken);
    if (!getToken) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    res.cookie("token", getToken).status(200).json({ token: getToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function handleProfile(req, res) {
  try {
    const auth = req.headers.authorization.split(" ")[1];

    const user = getVerifyAuth(auth);
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }
    const data = await User.findOne({ _id: user._id });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
async function handleLogout(req, res) {
  try {
    return res.clearCookie("token").status(200).json({ message: "Logged out" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  handlePostLogin,
  handleSetData,
  handleGetDataByHash,
  handleGetData,
  handleVerifyOwner,
  handleSignup,
  handleLogin,
  handleProfile,
  credVerified,
  handleLogout,
};
