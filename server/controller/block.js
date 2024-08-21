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
          id: entry.id.toString(),
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
      id: entry.id,
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
      const { id, name, university, passyear, aadharNumber } = entry;

      if (!id || !name || !university || !passyear || !aadharNumber) {
        errors.push({ entry, message: "Missing required fields." });
        continue;
      }

      try {
        // Hash the Aadhaar number for privacy
        const hashedAadhar = crypto
          .createHash("sha256")
          .update(aadharNumber)
          .digest("hex");

        // Convert `id` to a BigNumber
        const idBigNumber = ethers.BigNumber.from(id);

        // Store certificate data on blockchain
        const setDataTx = await contractInstance.setData(
          idBigNumber,
          name,
          university,
          passyear,
          hashedAadhar
        );
        const receipt = await setDataTx.wait();
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
          id: idBigNumber.toString(),
          name,
          university,
          passyear,
          hash: transactionHash,
          hashedAadhar,
        });

        results.push({ entry: newData, message: "Data set successfully!" });
      } catch (error) {
        errors.push({ entry, message: error.message });
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
    res.status(500).send({ success: false, message: error.message });
  }
}

async function handleGetDataById(req, res) {
  // GET endpoint to retrieve data by ID
  try {
    const id = req.params.id;

    // Convert `id` to a BigNumber
    const idBigNumber = ethers.BigNumber.from(id);

    const data = await contractInstance.getData(idBigNumber);
    let val = {
      name: data[0],
      university: data[1],
      passyear: parseInt(data[2]),
      hashedAadhar: data[3],
      hash: data[4],
    };
    res.render("result", { message: `Data: ${JSON.stringify(val)}` });
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function handleGetData(req, res) {
  try {
    const data = await contractInstance.getAllData();
    const getAllDataList = data.map((user) => ({
      id: parseInt(user.id),
      name: user.name,
      university: user.university,
      passyear: parseInt(user.passyear),
      hashedAadhar: user.hashedAadhar,
    }));
    res.status(200).json(getAllDataList);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function handleVerifyOwner(req, res) {
  try {
    const { id, name, university, passyear, hashedAadhar } = req.body;
    console.log(id, name, university, passyear, hashedAadhar);

    // Call the smart contract function to verify data ownership
    const isVerified = await contractInstance.verifyDataOwnership(
      id,
      name,
      university,
      passyear,
      hashedAadhar
    );

    if (isVerified) {
      // Fetch the user data from MongoDB
      const user = await DataModel.findOne({ id });

      if (user) {
        // Respond with certificate data
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
  router.get("/profile", async (req, res) => {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ error: "Unauthorized" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return res.status(404).json({ error: "User not found" });

      res.json({ user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}

module.exports = {
  handlePostLogin,
  handleSetData,
  handleGetDataById,
  handleGetData,
  handleVerifyOwner,
  handleSignup,
  handleLogin,
  handleProfile,
};
