// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "./PriceConverter.sol";

/** @notice A contract for crowd funding
 * @dev This contract allows users to fund a project and withdraw funds
 */

error FundMe__NotOwner();

contract FundMe {
    using PriceConverter for uint256;

    address private immutable i_owner;
    AggregatorV3Interface private s_priceFeed;
    uint256 public constant MINIMUM_USD = 50 * 1e18;
    address[] private s_funders;
    mapping(address => uint256) private s_addressTOAmountFunded;

    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert FundMe__NotOwner();
        }
        _;
    }

    constructor(address _priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(_priceFeedAddress);
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    function fund() public payable {
        require(
            msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD,
            "Didn't send enough fund"
        );
        s_funders.push(msg.sender);
        s_addressTOAmountFunded[msg.sender] = msg.value;
    }

    function withdraw() public onlyOwner {
        for (uint256 i = 0; i < s_funders.length; i++) {
            address funder = s_funders[i];
            s_addressTOAmountFunded[funder] = 0;
        }

        s_funders = new address[](0);

        // withdraw
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Withdraw failed");
    }

    function cheaperWithdraw() public onlyOwner {
        address[] memory funders = s_funders;
        for (uint256 i = 0; i < funders.length; i++) {
            address funder = funders[i];
            s_addressTOAmountFunded[funder] = 0;
        }

        s_funders = new address[](0);
        (bool success, ) = payable(i_owner).call{value: address(this).balance}(
            ""
        );
        require(success);
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFunders(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getAddressToAmount(address funder) public view returns (uint256) {
        return s_addressTOAmountFunded[funder];
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
}
