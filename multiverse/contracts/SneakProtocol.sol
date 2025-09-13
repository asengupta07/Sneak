// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract SneakProtocol is Ownable, ReentrancyGuard {
    // Constants
    uint256 public constant INITIAL_PRICE = 50; // 0.5 USD in basis points (50/100)
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public constant LTV = 6000; // 60% LTV in basis points
    uint256 public constant FIXED_FEE = 5 * 10 ** 18; // $5 fixed fee
    uint256 public constant INTEREST_RATE = 0; // No interest for simplicity
    uint256 public constant LIQUIDATION_PENALTY = 500; // 5% liquidation penalty
    uint256 public constant LP_REWARD_RATE = 400; // 4% LP reward
    uint256 public constant PROTOCOL_FEE_RATE = 100; // 1% protocol fee
    uint256 public constant HYSTERESIS = 100; // 1% hysteresis for liquidation

    // State variables
    uint256 public nextOpportunityId = 1;
    uint256 public nextChainId = 1;
    IERC20 public immutable baseToken; // USDC or similar stablecoin

    struct Opportunity {
        uint256 id;
        string name;
        string imageUrl;
        uint256 liquidityYes;
        uint256 liquidityNo;
        uint256 priceYes; // In basis points
        uint256 priceNo; // In basis points
        address creator;
        bool resolved;
        bool outcome; // true for YES, false for NO
        uint256 totalYesTokens;
        uint256 totalNoTokens;
        uint256 creationTime;
    }

    struct Position {
        uint256 opportunityId;
        bool side; // true for YES, false for NO
        uint256 amount;
        uint256 tokens;
        uint256 currentValue;
        bool active;
    }

    struct PositionChain {
        uint256 chainId;
        address owner;
        Position[] positions;
        uint256 totalDebt;
        bool liquidated;
    }

    // Mappings
    mapping(uint256 => Opportunity) public opportunities;
    mapping(uint256 => PositionChain) public positionChains;
    mapping(address => uint256[]) public userChains;
    mapping(uint256 => mapping(bool => mapping(address => uint256)))
        public userTokens; // opportunityId => side => user => amount
    mapping(address => uint256) public protocolFees;

    // Events
    event OpportunityCreated(
        uint256 indexed opportunityId,
        string name,
        string imageUrl,
        uint256 initialLiquidity
    );
    event TokensPurchased(
        uint256 indexed opportunityId,
        address indexed user,
        bool side,
        uint256 amount,
        uint256 tokens
    );
    event ChainCreated(uint256 indexed chainId, address indexed owner);
    event ChainExtended(
        uint256 indexed chainId,
        uint256 opportunityId,
        bool side,
        uint256 amount
    );
    event ChainLiquidated(uint256 indexed chainId, uint256 startIndex);
    event OpportunityResolved(uint256 indexed opportunityId, bool outcome);

    constructor(address _baseToken) Ownable(msg.sender) {
        baseToken = IERC20(_baseToken);
    }

    // Create a new opportunity
    function createOpportunity(
        string calldata _name,
        string calldata _imageUrl,
        uint256 _initialLiquidity
    ) external nonReentrant {
        require(_initialLiquidity > 0, "Initial liquidity must be positive");
        require(
            baseToken.transferFrom(
                msg.sender,
                address(this),
                _initialLiquidity
            ),
            "Transfer failed"
        );

        uint256 halfLiquidity = _initialLiquidity / 2;

        opportunities[nextOpportunityId] = Opportunity({
            id: nextOpportunityId,
            name: _name,
            imageUrl: _imageUrl,
            liquidityYes: halfLiquidity,
            liquidityNo: halfLiquidity,
            priceYes: INITIAL_PRICE,
            priceNo: INITIAL_PRICE,
            creator: msg.sender,
            resolved: false,
            outcome: false,
            totalYesTokens: (halfLiquidity * BASIS_POINTS) / INITIAL_PRICE,
            totalNoTokens: (halfLiquidity * BASIS_POINTS) / INITIAL_PRICE,
            creationTime: block.timestamp
        });

        // Give initial tokens to creator
        userTokens[nextOpportunityId][true][msg.sender] =
            (halfLiquidity * BASIS_POINTS) /
            INITIAL_PRICE;
        userTokens[nextOpportunityId][false][msg.sender] =
            (halfLiquidity * BASIS_POINTS) /
            INITIAL_PRICE;

        emit OpportunityCreated(
            nextOpportunityId,
            _name,
            _imageUrl,
            _initialLiquidity
        );
        nextOpportunityId++;
    }

    // Buy tokens for an opportunity
    function buyTokens(
        uint256 _opportunityId,
        bool _side,
        uint256 _amount
    ) external nonReentrant {
        require(
            opportunities[_opportunityId].id != 0,
            "Opportunity does not exist"
        );
        require(
            !opportunities[_opportunityId].resolved,
            "Opportunity already resolved"
        );
        require(_amount > 0, "Amount must be positive");
        require(
            baseToken.transferFrom(msg.sender, address(this), _amount),
            "Transfer failed"
        );

        Opportunity storage opp = opportunities[_opportunityId];

        // Calculate new prices and tokens
        uint256 tokensToMint;

        if (_side) {
            // YES side
            tokensToMint = (_amount * BASIS_POINTS) / opp.priceYes;
            opp.liquidityYes += _amount;

            // Update prices based on TECH.md formula
            uint256 newPriceYes = (opp.liquidityYes * opp.priceYes) /
                (opp.liquidityYes - _amount);
            uint256 newPriceNo = (opp.liquidityNo * opp.priceNo) /
                (opp.liquidityNo + _amount);

            opp.priceYes = newPriceYes;
            opp.priceNo = newPriceNo;
            opp.totalYesTokens += tokensToMint;
        } else {
            // NO side
            tokensToMint = (_amount * BASIS_POINTS) / opp.priceNo;
            opp.liquidityNo += _amount;

            // Update prices
            uint256 newPriceNo = (opp.liquidityNo * opp.priceNo) /
                (opp.liquidityNo - _amount);
            uint256 newPriceYes = (opp.liquidityYes * opp.priceYes) /
                (opp.liquidityYes + _amount);

            opp.priceNo = newPriceNo;
            opp.priceYes = newPriceYes;
            opp.totalNoTokens += tokensToMint;
        }

        userTokens[_opportunityId][_side][msg.sender] += tokensToMint;

        emit TokensPurchased(
            _opportunityId,
            msg.sender,
            _side,
            _amount,
            tokensToMint
        );
    }

    // Create a position chain
    function createPositionChain(
        uint256 _opportunityId,
        bool _side,
        uint256 _amount
    ) external nonReentrant {
        require(
            opportunities[_opportunityId].id != 0,
            "Opportunity does not exist"
        );
        require(
            !opportunities[_opportunityId].resolved,
            "Opportunity already resolved"
        );
        require(_amount > 0, "Amount must be positive");
        require(
            baseToken.transferFrom(msg.sender, address(this), _amount),
            "Transfer failed"
        );

        // Buy initial position
        _buyTokensInternal(_opportunityId, _side, _amount);

        // Create chain
        PositionChain storage chain = positionChains[nextChainId];
        chain.chainId = nextChainId;
        chain.owner = msg.sender;
        chain.liquidated = false;

        Position memory newPosition = Position({
            opportunityId: _opportunityId,
            side: _side,
            amount: _amount,
            tokens: (_amount * BASIS_POINTS) /
                (
                    _side
                        ? opportunities[_opportunityId].priceYes
                        : opportunities[_opportunityId].priceNo
                ),
            currentValue: _amount,
            active: true
        });

        chain.positions.push(newPosition);
        userChains[msg.sender].push(nextChainId);

        emit ChainCreated(nextChainId, msg.sender);
        nextChainId++;
    }

    // Extend a position chain
    function extendChain(
        uint256 _chainId,
        uint256 _opportunityId,
        bool _side
    ) external nonReentrant {
        require(
            positionChains[_chainId].owner == msg.sender,
            "Not chain owner"
        );
        require(!positionChains[_chainId].liquidated, "Chain is liquidated");
        require(
            opportunities[_opportunityId].id != 0,
            "Opportunity does not exist"
        );
        require(
            !opportunities[_opportunityId].resolved,
            "Opportunity already resolved"
        );

        PositionChain storage chain = positionChains[_chainId];
        require(chain.positions.length > 0, "Chain has no positions");

        // Get collateral value from last position
        Position storage lastPosition = chain.positions[
            chain.positions.length - 1
        ];
        uint256 collateralValue = getCurrentPositionValue(lastPosition);

        // Calculate maximum allocation with LTV and fee buffer
        uint256 maxAllocation = (collateralValue * LTV) / BASIS_POINTS;
        require(maxAllocation > FIXED_FEE, "Insufficient collateral for fee");

        uint256 allocationAmount = maxAllocation - FIXED_FEE;

        // Add to debt
        chain.totalDebt += allocationAmount + FIXED_FEE;

        // Buy tokens for new position
        _buyTokensInternal(_opportunityId, _side, allocationAmount);

        Position memory newPosition = Position({
            opportunityId: _opportunityId,
            side: _side,
            amount: allocationAmount,
            tokens: (allocationAmount * BASIS_POINTS) /
                (
                    _side
                        ? opportunities[_opportunityId].priceYes
                        : opportunities[_opportunityId].priceNo
                ),
            currentValue: allocationAmount,
            active: true
        });

        chain.positions.push(newPosition);

        emit ChainExtended(_chainId, _opportunityId, _side, allocationAmount);
    }

    // Check and liquidate undercollateralized chains
    function liquidateChain(uint256 _chainId) external nonReentrant {
        PositionChain storage chain = positionChains[_chainId];
        require(!chain.liquidated, "Chain already liquidated");
        require(chain.positions.length > 1, "Cannot liquidate single position");

        // Find first undercollateralized position
        uint256 liquidationIndex = 0;
        bool shouldLiquidate = false;

        for (uint256 i = 1; i < chain.positions.length; i++) {
            Position storage prevPosition = chain.positions[i - 1];
            uint256 collateralValue = getCurrentPositionValue(prevPosition);
            uint256 debt = (chain.positions[i].amount + FIXED_FEE);
            uint256 threshold = (debt * (BASIS_POINTS - HYSTERESIS)) /
                BASIS_POINTS;

            if (collateralValue < threshold) {
                liquidationIndex = i;
                shouldLiquidate = true;
                break;
            }
        }

        require(shouldLiquidate, "Chain is sufficiently collateralized");

        // Liquidate positions from liquidationIndex onwards
        for (uint256 i = liquidationIndex; i < chain.positions.length; i++) {
            chain.positions[i].active = false;
            // Apply liquidation penalty to liquidator incentive
        }

        // Reduce total debt
        chain.totalDebt = 0; // Simplified - should calculate remaining debt properly

        emit ChainLiquidated(_chainId, liquidationIndex);
    }

    // Resolve an opportunity
    function resolveOpportunity(
        uint256 _opportunityId,
        bool _outcome
    ) external onlyOwner {
        require(
            opportunities[_opportunityId].id != 0,
            "Opportunity does not exist"
        );
        require(!opportunities[_opportunityId].resolved, "Already resolved");

        opportunities[_opportunityId].resolved = true;
        opportunities[_opportunityId].outcome = _outcome;

        emit OpportunityResolved(_opportunityId, _outcome);
    }

    // Claim winnings from resolved opportunity
    function claimWinnings(uint256 _opportunityId) external nonReentrant {
        require(
            opportunities[_opportunityId].resolved,
            "Opportunity not resolved"
        );

        Opportunity storage opp = opportunities[_opportunityId];
        bool winningSide = opp.outcome;
        uint256 userTokenAmount = userTokens[_opportunityId][winningSide][
            msg.sender
        ];

        require(userTokenAmount > 0, "No tokens to claim");

        userTokens[_opportunityId][winningSide][msg.sender] = 0;

        // Calculate payout
        uint256 totalWinningTokens = winningSide
            ? opp.totalYesTokens
            : opp.totalNoTokens;
        uint256 totalLiquidity = opp.liquidityYes + opp.liquidityNo;
        uint256 lpReward = (totalLiquidity * LP_REWARD_RATE) / BASIS_POINTS;
        uint256 protocolFee = (totalLiquidity * PROTOCOL_FEE_RATE) /
            BASIS_POINTS;
        uint256 distributionPool = totalLiquidity - lpReward - protocolFee;

        uint256 payout = (userTokenAmount * distributionPool) /
            totalWinningTokens;

        protocolFees[address(baseToken)] += protocolFee;

        require(baseToken.transfer(msg.sender, payout), "Transfer failed");
        require(
            baseToken.transfer(opp.creator, lpReward),
            "LP reward transfer failed"
        );
    }

    // Internal function to buy tokens
    function _buyTokensInternal(
        uint256 _opportunityId,
        bool _side,
        uint256 _amount
    ) internal {
        Opportunity storage opp = opportunities[_opportunityId];

        uint256 tokensToMint;

        if (_side) {
            // YES side
            tokensToMint = (_amount * BASIS_POINTS) / opp.priceYes;
            opp.liquidityYes += _amount;

            uint256 newPriceYes = (opp.liquidityYes * opp.priceYes) /
                (opp.liquidityYes - _amount);
            uint256 newPriceNo = (opp.liquidityNo * opp.priceNo) /
                (opp.liquidityNo + _amount);

            opp.priceYes = newPriceYes;
            opp.priceNo = newPriceNo;
            opp.totalYesTokens += tokensToMint;
        } else {
            // NO side
            tokensToMint = (_amount * BASIS_POINTS) / opp.priceNo;
            opp.liquidityNo += _amount;

            uint256 newPriceNo = (opp.liquidityNo * opp.priceNo) /
                (opp.liquidityNo - _amount);
            uint256 newPriceYes = (opp.liquidityYes * opp.priceYes) /
                (opp.liquidityYes + _amount);

            opp.priceNo = newPriceNo;
            opp.priceYes = newPriceYes;
            opp.totalNoTokens += tokensToMint;
        }
    }

    // Get current value of a position
    function getCurrentPositionValue(
        Position memory _position
    ) public view returns (uint256) {
        if (!_position.active) return 0;

        Opportunity memory opp = opportunities[_position.opportunityId];
        if (opp.resolved) {
            if (opp.outcome == _position.side) {
                // Calculate resolved payout
                uint256 totalWinningTokens = _position.side
                    ? opp.totalYesTokens
                    : opp.totalNoTokens;
                uint256 totalLiquidity = opp.liquidityYes + opp.liquidityNo;
                uint256 lpReward = (totalLiquidity * LP_REWARD_RATE) /
                    BASIS_POINTS;
                uint256 protocolFee = (totalLiquidity * PROTOCOL_FEE_RATE) /
                    BASIS_POINTS;
                uint256 distributionPool = totalLiquidity -
                    lpReward -
                    protocolFee;

                return
                    (_position.tokens * distributionPool) / totalWinningTokens;
            } else {
                return 0; // Losing side gets nothing
            }
        } else {
            // Current market value
            uint256 currentPrice = _position.side ? opp.priceYes : opp.priceNo;
            return (_position.tokens * currentPrice) / BASIS_POINTS;
        }
    }

    // View functions
    function getOpportunity(
        uint256 _opportunityId
    ) external view returns (Opportunity memory) {
        return opportunities[_opportunityId];
    }

    function getPositionChain(
        uint256 _chainId
    ) external view returns (PositionChain memory) {
        return positionChains[_chainId];
    }

    function getUserChains(
        address _user
    ) external view returns (uint256[] memory) {
        return userChains[_user];
    }

    function getUserTokens(
        uint256 _opportunityId,
        bool _side,
        address _user
    ) external view returns (uint256) {
        return userTokens[_opportunityId][_side][_user];
    }

    // Admin function to withdraw protocol fees
    function withdrawProtocolFees(address _token) external onlyOwner {
        uint256 amount = protocolFees[_token];
        protocolFees[_token] = 0;
        require(IERC20(_token).transfer(owner(), amount), "Transfer failed");
    }
}
