// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

/// @notice Common predicates for Fuel InputMessages
library InputMessagePredicates {
    bytes32 public constant CONTRACT_MESSAGE_PREDICATE =
        0x1b68c76eb5a9674b776daab8e2ded519fc152cf1e4f78b08559d4106e36d2176;
}

/// @title IFuelMessagePortal
/// @notice The Fuel Message Portal contract sends and receives messages between the EVM and Fuel
interface IFuelMessagePortal {
    ////////////
    // Events //
    ////////////

    /// @notice Emitted when a Message is sent from the EVM to Fuel
    event SentMessage(
        bytes32 indexed sender,
        bytes32 indexed recipient,
        uint64 nonce,
        uint64 amount,
        bytes data
    );

    ///////////////////////////////
    // Public Functions Outgoing //
    ///////////////////////////////

    /// @notice Send a message to a recipient on Fuel
    /// @param recipient The message receiver address or predicate root
    /// @param data The message data to be sent to the receiver
    function sendMessage(bytes32 recipient, bytes memory data) external payable;

    /// @notice Send only ETH to the given recipient
    /// @param recipient The recipient address
    function sendETH(bytes32 recipient) external payable;

    ///////////////////////////////
    // Public Functions Incoming //
    ///////////////////////////////

    /// @notice Used by message receiving contracts to get the address on Fuel that sent the message
    function getMessageSender() external view returns (bytes32);
}
