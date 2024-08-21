const Student = require("../../model/data");
const { generateCustomLink } = require("../../utils/generateLink");
const ethers = require("ethers");

const studentResolvers = {
  Query: {
    getStudentData: async (_, { id }) => {
      const student = await Student.findById(id);
      if (!student) throw new Error("Student not found");
      return student;
    },
    getAllStudents: async () => {
      return await Student.find();
    },
  },
  Mutation: {
    setStudentData: async (
      _,
      { id, name, university, passyear, aadharNumber }
    ) => {
      const hashedAadhar = crypto
        .createHash("sha256")
        .update(aadharNumber)
        .digest("hex");
      const idBigNumber = ethers.BigNumber.from(id);

      // Blockchain interaction logic
      const setDataTx = await contractInstance.setData(
        idBigNumber,
        name,
        university,
        passyear,
        hashedAadhar
      );
      const receipt = await setDataTx.wait();
      const transactionHash = receipt.transactionHash;

      const link = generateCustomLink(id);

      const newStudent = new Student({
        id: idBigNumber.toString(),
        name,
        university,
        passyear,
        hash: transactionHash,
        hashedAadhar,
        link,
      });

      await newStudent.save();

      return newStudent;
    },
    verifyStudentOwnership: async (
      _,
      { id, name, university, passyear, hashedAadhar }
    ) => {
      const isVerified = await contractInstance.verifyDataOwnership(
        id,
        name,
        university,
        passyear,
        hashedAadhar
      );
      return isVerified;
    },
  },
};

module.exports = studentResolvers;
