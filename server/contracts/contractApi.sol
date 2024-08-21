// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ContractApi {
    struct Data {
        uint256 id;
        string name;
        string university;
        uint256 passyear;
        string hashedAadhar;
    }

    address public owner;
    mapping(string => Data[]) private dataMap; // Map Aadhaar hashes to multiple Data entries
    mapping(uint256 => Data) private dataById; // Map IDs to Data
    Data[] private dataArray; // Array to keep track of all Data entries

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    event DataAdded(uint256 id, string hashedAadhar);

    function setData(
        uint256 _id,
        string memory _name,
        string memory _university,
        uint256 _passyear,
        string memory _hashedAadhar
    ) public onlyOwner {
        require(dataById[_id].id == 0, "ID already exists"); // Ensure unique ID

        Data memory data = Data({
            id: _id,
            name: _name,
            university: _university,
            passyear: _passyear,
            hashedAadhar: _hashedAadhar
        });

        dataMap[_hashedAadhar].push(data);
        dataById[_id] = data;
        dataArray.push(data);

        emit DataAdded(_id, _hashedAadhar);
    }

    function getData(
        uint256 _id
    )
        public
        view
        returns (string memory, string memory, uint256, string memory)
    {
        require(dataById[_id].id != 0, "Data not found");
        Data memory data = dataById[_id];
        return (data.name, data.university, data.passyear, data.hashedAadhar);
    }

    function getDataByAadhar(
        string memory _hashedAadhar
    ) public view returns (Data[] memory) {
        return dataMap[_hashedAadhar];
    }

    function getAllData() public view returns (Data[] memory) {
        return dataArray;
    }

    function verifyDataOwnership(
        uint256 _id,
        string memory _name,
        string memory _university,
        uint256 _passyear,
        string memory _hashedAadhar
    ) public view returns (bool) {
        Data memory data = dataById[_id];
        return (data.id == _id &&
            keccak256(abi.encodePacked(data.name)) ==
            keccak256(abi.encodePacked(_name)) &&
            keccak256(abi.encodePacked(data.university)) ==
            keccak256(abi.encodePacked(_university)) &&
            data.passyear == _passyear &&
            keccak256(abi.encodePacked(data.hashedAadhar)) ==
            keccak256(abi.encodePacked(_hashedAadhar)));
    }
}
