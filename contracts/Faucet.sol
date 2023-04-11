// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import @openzeppelin/contracts/token/ERC20/IERC20.sol";
import @openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import @openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Faucet is ReentrancyGuard{
    
    using SafeERC20 for IERC20;
    address public faucetOwner; 
    uint dailyETHThreshold = 0.5 ether;
    uint dailyTokenThreshold = 10;
    uint constant COOLDOWN_PERIOD = 1 days;
    address sender = 0x4B40f99E93A8814be7fDe5F6AaFA5e9823E13728;
    // IERC20 public daiToken;
    // IERC20 public usdcToken;
    // IERC20 publi1c linkToken;
    event FaucetDrained (address to, uint amount);
    
    // REcipient Account => Timestamp
    mapping (address => uint) lastETHReceivedTimestamp;
    // IP Address => Timestamp
    mapping (string => uint) lastETHReceivedIPAddress;

    // REcipient Account => Timestamp
    mapping (address => uint) lastTokenReceivedTimestamp;
    // IP Address => Timestamp
    mapping (string => uint) lastTokenReceivedIPAddress;

    IERC20 public daiToken = IERC20(0xfA36653d85B3A7D06Cd5d83e4d03667b36b44B7a);
    IERC20 public usdcToken = IERC20(0xacEc0F50978654652d089E4e7016D9682a3b27CD);
    IERC20 public linkToken = IERC20(0x9FA894F65353cC2b4feCeA717B998a88a4641255);
    // 183.83.166.80
    // DAI = '0xfA36653d85B3A7D06Cd5d83e4d03667b36b44B7a';
    // USDC = '0xacEc0F50978654652d089E4e7016D9682a3b27CD';
    // LINK = '0x9FA894F65353cC2b4feCeA717B998a88a4641255';

    modifier onlyOwner() {
        require(msg.sender == faucetOwner, Not owner");
        _;
    }
    
    receive() external payable {}

    // constructor(address _daiAddress, address _usdcAddress, address _linkAddress) {
    //     daiToken = IERC20(_daiAddress);
    //     usdcToken = IERC20(_usdcAddress);
    //     linkToken = IERC20(_linkAddress);
    //     faucetOwner = msg.sender; 
    // }

    constructor() {
        faucetOwner = msg.sender; 
    }

    function transferETH(string memory _ipAddress) external payable{
        require(msg.sender != address(0), Invalid address");
        //This is to prevent Sybil attack
        require(block.timestamp - lastETHReceivedIPAddress[_ipAddress] >= COOLDOWN_PERIOD, Request Not Allowed From This IP Address Yet");
        // Check for Cooldown period
        require(block.timestamp - lastETHReceivedTimestamp[msg.sender] >= COOLDOWN_PERIOD, Request Not Allowed Yet");
        (bool success,) = payable(msg.sender).call{value: dailyETHThreshold}(");
        require(success, Failed to transfer ETH");
        
        lastETHReceivedTimestamp[msg.sender] = block.timestamp;
        lastETHReceivedIPAddress[_ipAddress] = block.timestamp;
        emit FaucetDrained (msg.sender, dailyETHThreshold);
    }

    function transferToken(address _token, string memory _ipAddress) external{
        require(msg.sender != address(0), Invalid address");
        require(IERC20(_token) == daiToken || IERC20(_token) == usdcToken || IERC20(_token) == linkToken, Token Not recognized");
        require(block.timestamp - lastTokenReceivedIPAddress[_ipAddress] >= COOLDOWN_PERIOD, Request Not Allowed Yet");
        require(block.timestamp - lastTokenReceivedTimestamp[msg.sender] >= COOLDOWN_PERIOD, Request Not Allowed Yet");
        SafeERC20.safeTransfer(IERC20(_token), msg.sender, dailyTokenThreshold);
        // should use mint instead of transfer
        // IERC20(_token).mint(msg.sender, dailyTokenThreshold);
        // daiToken.transfer(account1, numberToEthers(20000));

        lastTokenReceivedTimestamp[msg.sender] = block.timestamp;
        lastTokenReceivedIPAddress[_ipAddress] = block.timestamp;
        emit FaucetDrained (msg.sender, dailyTokenThreshold);
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

    // function getBalance(address _token, address _address) external view returns(uint){
    //     return IERC20(_token).balanceOf(_address);
    // }

    function withdraw(address _addr) public payable onlyOwner{
        (bool success,) = _addr.call{value: address(this).balance}(");
        require(success, Failed to withdraw ETH");
    }

    
}


// 0x62C21bbd9dA59327Dee56F6a1312B569C64bB0e0 - Faucet Address
