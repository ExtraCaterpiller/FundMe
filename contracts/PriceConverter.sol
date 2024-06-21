// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getPrice(
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        (, int answer, , , ) = priceFeed.latestRoundData();
        return uint256(answer * 1e10);
    }

    function getConversionRate(
        uint256 ethAmout,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        uint256 ethPrice = getPrice(priceFeed);
        uint256 ethAmountInUsd = (ethAmout * ethPrice) / 1e18;
        return ethAmountInUsd;
    }
}
