//SPDX-License-Identifier: MIT
//Pragma
pragma solidity ^0.8.7;

//Imports
import "./PriceConverter.sol";

//Error Codes
error FundMe_NotOwner();

//Interfaces, Libraries, Contracts

/**
 * @title A contract for crowd funding
 * @author The Dude
 * @notice This contract is to demo a sample funding contract
 * @dev This implements price feeds as our library
 */

contract FundMe {
    // Type Declarations
    using PriceConverter for uint256;

    //State variables

    //Get funds from users
    uint256 public constant i_MINIMUM_USD = 50 * 1e18;
    //s_funders addresses
    address[] private s_funders;
    //MAp addresses to s_funders
    mapping(address => uint256) private s_addressToAmountFunded;
    // address owner
    address private immutable i_owner;

    //Create a const here to change the address of the agrinterface according to chains
    AggregatorV3Interface private s_priceFeed;

    // Modifiers

    modifier onlyOwner() {
        //require (msg.sender == i_owner, "Sender not owner!");
        if (msg.sender != i_owner) {
            revert FundMe_NotOwner();
        }
        _;
    }

    // Functions Order
    /// constructor
    /// receive
    /// fallback
    /// external
    /// public
    /// internal
    /// private
    /// view/pure

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    // What if soe sends money to the contract without calling the fund function?
    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    /**
     * @notice This function funds the contract
     * @dev This makes use of conversion and msg.sender
     */
    function fund() public payable {
        // set a minimum fund amount in USD
        require(
            msg.value.getConversionRate(s_priceFeed) >= i_MINIMUM_USD,
            "You need to spend more ETH!"
        );
        s_funders.push(msg.sender);
        s_addressToAmountFunded[msg.sender] = msg.value;
    }

    function withdraw() public onlyOwner {
        //set all the s_funders ' addresses to zero
        for (
            uint256 funderindex = 0;
            funderindex < s_funders.length;
            funderindex++
        ) {
            // funder address index
            address funder = s_funders[funderindex];
            //set the mapping to zero
            s_addressToAmountFunded[funder] = 0;
        }

        // reset the array
        s_funders = new address[](0);
        // withdraw
        /* Using transfer 
            payable(msg.sender).transfer(address(this).balance)

            *Using send
            bool sendSuccess = payable(msg.sender).send(address(this).balance);
            require(sendSuccess, "sendFailed");
            */

        //Using call (recommended)
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call failed");
    }

    function cheaperWithdraw() public onlyOwner {
        address[] memory funders = s_funders;
        // we store the storage variable into memory variable and we use that memory variable for the loop
        // mappings can't be stored in memory, sorry!
        for (
            uint256 funderindex = 0;
            funderindex < funders.length;
            funderindex++
        ) {
            address funder = funders[funderindex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);
        (bool success, ) = i_owner.call{value: address(this).balance}("");
        require(success);
    }

    // View / Pure

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFunder(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getAddressToAmountFunded(
        address funder
    ) public view returns (uint256) {
        return s_addressToAmountFunded[funder];
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
}
