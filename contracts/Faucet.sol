// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Faucet is ReentrancyGuard{
    
    using SafeERC20 for IERC20;
    address public faucetOwner; 
    uint dailyETHThreshold = 0.5 ether;
    uint dailyTokenThreshold = 10;
    uint constant COOLDOWN_PERIOD = 1 days;
    IERC20 public daiToken;
    IERC20 public usdcToken;
    IERC20 public linkToken;

    event Transfer (address to, uint amount);
    // Recipient Account => Timestamp
    mapping (address => uint) lastETHReceivedTimestamp;
    // IP Address => Timestamp
    mapping (string => uint) lastETHReceivedIPAddress;

    // Recipient Account => Token Address => Timestamp
    mapping (address => mapping (address => uint)) lastTokenReceivedTimestamp;
    // IP Address => Token Address => Timestamp
    mapping (string => mapping (address => uint)) lastTokenReceivedIPAddress;

    modifier onlyOwner() {
        require(msg.sender == faucetOwner, "Not Owner");
        _;
    }
    
    receive() external payable {}

    constructor(address _daiAddress, address _usdcAddress, address _linkAddress) {
        daiToken = IERC20(_daiAddress);
        usdcToken = IERC20(_usdcAddress);
        linkToken = IERC20(_linkAddress);
        faucetOwner = msg.sender; 
    }

    function transferETH(string memory _ipAddress) external payable{
        require(msg.sender != address(0), "Invalid address");
        //This is to prevent Sybil attack
        require(block.timestamp - lastETHReceivedIPAddress[_ipAddress] >= COOLDOWN_PERIOD, "Request Not Allowed From This IP Address Yet");
        // Check for Cooldown period
        require(block.timestamp - lastETHReceivedTimestamp[msg.sender] >= COOLDOWN_PERIOD, "Request Not Allowed Yet");
        require(address(this).balance > dailyETHThreshold, "Not Enough Balance to Send");
        (bool success,) = payable(msg.sender).call{value: dailyETHThreshold, gas:2000000}("");
        require(success, "Failed to transfer ETH");
        
        lastETHReceivedTimestamp[msg.sender] = block.timestamp;
        lastETHReceivedIPAddress[_ipAddress] = block.timestamp;
        emit Transfer (msg.sender, dailyETHThreshold);
    }

    function transferToken(address _token, string memory _ipAddress) external {
        require(msg.sender != address(0), "Invalid address");
        require(IERC20(_token) == daiToken || IERC20(_token) == usdcToken || IERC20(_token) == linkToken, "Token Not recognized");
        require(block.timestamp - lastTokenReceivedIPAddress[_ipAddress][_token] >= COOLDOWN_PERIOD, "Request Not Allowed Yet");
        require(block.timestamp - lastTokenReceivedTimestamp[msg.sender][_token] >= COOLDOWN_PERIOD, "Request Not Allowed Yet");
        
        SafeERC20.safeTransfer(IERC20(_token), msg.sender, dailyTokenThreshold);
        lastTokenReceivedTimestamp[msg.sender][_token] = block.timestamp;
        lastTokenReceivedIPAddress[_ipAddress][_token] = block.timestamp;
        emit Transfer (msg.sender, dailyTokenThreshold);
    }

    function getDAITotalSupply() external view returns(uint) {
        return daiToken.totalSupply();
    }

    function getUSDCTotalSupply() external view returns(uint) {
        return daiToken.totalSupply();
    }

    function getLINKTotalSupply() external view returns(uint) {
        return daiToken.totalSupply();
    }

    function getDAIBalance() external view returns(uint){
        return daiToken.balanceOf(msg.sender);
    }

    function getUSDCBalance() external view returns(uint){
        return usdcToken.balanceOf(msg.sender);
    }

    function getLINKBalance() external view returns(uint){
        return linkToken.balanceOf(msg.sender);
    }

    function withdraw(address _addr) public payable onlyOwner{
        (bool success,) = _addr.call{value: address(this).balance, gas:200000}("");
        require(success, "Failed to withdraw ETH");
    }   
}