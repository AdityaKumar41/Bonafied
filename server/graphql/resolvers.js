const ethers = require("ethers");
const DataModel = require("../model/Student");
const crypto = require("crypto");
require("dotenv").config();

const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const {
  abi,
} = require("../artifacts/contracts/ContractApi.sol/ContractApi.json");
const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

const resolvers = {
  Query: {
    async getDataById(_, { id }) {
      try {
        const idBigNumber = ethers.BigNumber.from(id);
        const data = await contractInstance.getData(idBigNumber);
        return {
          id: data[0],
          name: data[1],
          university: data[2],
          passyear: parseInt(data[3]),
          hash: data[4],
          hashedAadhar: data[5],
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },

    async getAllData() {
      try {
        const data = await contractInstance.getAllData();
        return data.map((user) => ({
          id: user.id.toString(),
          name: user.name,
          university: user.university,
          passyear: parseInt(user.passyear),
          hash: user.hash,
          hashedAadhar: user.hashedAadhar,
        }));
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },

  Mutation: {
    async setData(_, { id, name, university, passyear, aadharNumber }) {
      try {
        const hashedAadhar = crypto
          .createHash("sha256")
          .update(aadharNumber)
          .digest("hex");
        const idBigNumber = ethers.BigNumber.from(id);

        const setDataTx = await contractInstance.setData(
          idBigNumber,
          name,
          university,
          passyear,
          hashedAadhar
        );
        const receipt = await setDataTx.wait();
        return receipt.transactionHash;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    async verifyOwner(_, { id, name, university, passyear, hashedAadhar }) {
      try {
        const isVerified = await contractInstance.verifyDataOwnership(
          id,
          name,
          university,
          passyear,
          hashedAadhar
        );
        if (isVerified) {
          const user = await DataModel.findOne({ id });
          return {
            success: true,
            message: "Data ownership verified successfully.",
            data: user
              ? {
                  id: user.id,
                  name: user.name,
                  university: user.university,
                  passyear: user.passyear,
                  hash: user.hash,
                  hashedAadhar: user.hashedAadhar,
                }
              : null,
          };
        } else {
          return {
            success: false,
            message: "Data ownership verification failed.",
            data: null,
          };
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};

module.exports = resolvers;
