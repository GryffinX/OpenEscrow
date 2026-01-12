// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract OpenEscrowConfigurableSplit {
    address public buyer;
    address public seller;

    uint256 public totalAmount;
    uint256 public releasedAmount;

    uint256 public designPercent;
    uint256 public developmentPercent;

    bool public designReleased;
    bool public developmentReleased;

    enum State {
        AWAITING_PAYMENT,
        FUNDED,
        COMPLETED,
        DISPUTED
    }

    State public state;

    constructor(
        address _seller,
        uint256 _designPercent,
        uint256 _developmentPercent
    ) {
        require(_designPercent + _developmentPercent == 100, "Split must be 100%");
        require(_designPercent > 0 && _developmentPercent > 0, "Invalid split");

        buyer = msg.sender;
        seller = _seller;
        designPercent = _designPercent;
        developmentPercent = _developmentPercent;

        state = State.AWAITING_PAYMENT;
    }

    function fundEscrow() external payable {
        require(msg.sender == buyer, "Only buyer");
        require(state == State.AWAITING_PAYMENT, "Invalid state");
        require(msg.value > 0, "Send funds");

        totalAmount = msg.value;
        state = State.FUNDED;
    }

    function releaseDesignMilestone() external {
        require(msg.sender == buyer, "Only buyer");
        require(state == State.FUNDED, "Escrow not active");
        require(!designReleased, "Already released");

        uint256 amount = (totalAmount * designPercent) / 100;

        designReleased = true;
        releasedAmount += amount;

        (bool success, ) = payable(seller).call{value: amount}("");
        require(success, "Transfer failed");
    }

    function releaseDevelopmentMilestone() external {
        require(msg.sender == buyer, "Only buyer");
        require(state == State.FUNDED, "Escrow not active");
        require(designReleased, "Design not released");
        require(!developmentReleased, "Already released");

        uint256 amount = totalAmount - releasedAmount;

        developmentReleased = true;
        state = State.COMPLETED;

        (bool success, ) = payable(seller).call{value: amount}("");
        require(success, "Transfer failed");
    }

    function raiseDispute() external {
        require(msg.sender == buyer, "Only buyer");
        require(state == State.FUNDED, "Invalid state");

        state = State.DISPUTED;
    }
}
