// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ContractApi {
    struct Data {
        string date;
        string name;
        string university;
        uint256 passyear;
        string hashedAadhar;
        string courseProgram;
    }

    address public owner;
    mapping(string => Data) private dataMap; // Map hashedAadhar to a single Data entry (ensure uniqueness)
    mapping(string => Data) private dataByDate; // Map dates to Data
    Data[] private dataArray; // Array to keep track of all Data entries

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    event DataAdded(string date, string hashedAadhar);

    function setData(
        string memory _date,
        string memory _name,
        string memory _university,
        uint256 _passyear,
        string memory _hashedAadhar,
        string memory _courseProgram
    ) public onlyOwner {
        require(
            bytes(dataMap[_hashedAadhar].hashedAadhar).length == 0,
            "hashedAadhar already exists"
        ); // Ensure unique hashedAadhar
        require(
            bytes(dataByDate[_date].date).length == 0,
            "Date already exists"
        ); // Ensure unique date

        Data memory data = Data({
            date: _date,
            name: _name,
            university: _university,
            passyear: _passyear,
            hashedAadhar: _hashedAadhar,
            courseProgram: _courseProgram
        });

        dataMap[_hashedAadhar] = data;
        dataByDate[_date] = data;
        dataArray.push(data);

        emit DataAdded(_date, _hashedAadhar);
    }

    // Updated getData function to take hashedAadhar as input and return corresponding data
    function getData(
        string memory _hashedAadhar
    )
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            uint256,
            string memory,
            string memory
        )
    {
        require(
            bytes(dataMap[_hashedAadhar].hashedAadhar).length != 0,
            "Data not found"
        );
        Data memory data = dataMap[_hashedAadhar];
        return (
            data.date,
            data.name,
            data.university,
            data.passyear,
            data.hashedAadhar,
            data.courseProgram
        );
    }

    function getDataByAadhar(
        string memory _hashedAadhar
    ) public view returns (Data memory) {
        require(
            bytes(dataMap[_hashedAadhar].hashedAadhar).length != 0,
            "Data not found"
        );
        return dataMap[_hashedAadhar];
    }

    function getAllData() public view returns (Data[] memory) {
        return dataArray;
    }

    function verifyDataOwnership(
        string memory _date,
        string memory _name,
        string memory _university,
        uint256 _passyear,
        string memory _hashedAadhar,
        string memory _courseProgram
    ) public view returns (bool) {
        Data memory data = dataMap[_hashedAadhar]; // Use hashedAadhar to find the data
        return (keccak256(abi.encodePacked(data.date)) ==
            keccak256(abi.encodePacked(_date)) &&
            keccak256(abi.encodePacked(data.name)) ==
            keccak256(abi.encodePacked(_name)) &&
            keccak256(abi.encodePacked(data.university)) ==
            keccak256(abi.encodePacked(_university)) &&
            data.passyear == _passyear &&
            keccak256(abi.encodePacked(data.hashedAadhar)) ==
            keccak256(abi.encodePacked(_hashedAadhar)) &&
            keccak256(abi.encodePacked(data.courseProgram)) ==
            keccak256(abi.encodePacked(_courseProgram)));
    }
}
