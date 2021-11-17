pragma solidity >=0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract DonationContract is Ownable {
    event Withdraw(bool success, bytes data);

    mapping(address => uint256) public ownerToDonation;
    uint256 private allDotatValue;

    function getAllDotateValue() public view returns (uint256) {
        return allDotatValue;
    }

    function donate() public payable {
        require(msg.value == 0, "Donate for zero amount");

        ownerToDonation[msg.sender] += msg.value;
        allDotatValue += msg.value;
    }

    function withdraw(address payable _to) public payable onlyOwner {
        uint256 value = allDotatValue;
        allDotatValue = 0;

        (bool sent, bytes memory data) = _to.call{value: value}("");
        require(sent, "Failed to send Ether");
        emit Withdraw(sent, data);
    }
}
