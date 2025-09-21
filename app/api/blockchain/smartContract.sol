// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CidRegistry {
    mapping(string => string) private cidMap;

    event CidStored(string indexed hash, string cid);

    function storeCid(string calldata hash, string calldata cid) external {
        cidMap[hash] = cid;
        emit CidStored(hash, cid);
    }

    function getCid(string calldata hash) external view returns (string memory) {
        return cidMap[hash];
    }
}