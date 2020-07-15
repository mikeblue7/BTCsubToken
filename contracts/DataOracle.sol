pragma solidity >0.4.2;
import "github.com/provable-things/ethereum-api/provableAPI_0.4.25.sol";

contract DataOracle is usingProvable {
	address owner;

	event newOraclizeQuery();

	    struct coinsInfo {
        bytes32 ETH;
        bytes32 BTC;
        bytes32 USDT;
        bytes32 TUSD;
        bytes32 BUSD;
        bytes32 COMP;
        bytes32 BCH;
        bytes32 XTZ;
        bytes32 BTCsub;
        uint256 customPreGasLimit;
        uint256 customPostGasLimit;
    }

        struct coinInfo {
        uint256 pre;
        uint256 post;
        bytes32 preOraclizeId;
        bytes32 postOraclizeId;
    }


    mapping (address => mapping (bytes32 => coinInfo)) public coinIndex; 
    mapping (address => mapping (bytes32 => bytes32)) oraclizeIndex; 
    mapping (bytes32 => address) oraclizeInverseIndex; 
    mapping(bytes32=>bool) validIds;

    coinsInfo coins;

        constructor() public {
        provable_setProof(proofType_TLSNotary | proofStorage_IPFS);
        LogConstructorInitiated("Constructor was initiated. Call 'updatePrice()' to send the Provable Query.");
        provable_setCustomGasPrice(30000000000 wei);
        coins.ETH = bytes32("ETH");
        owner = msg.sender;
        coins.customPreGasLimit = 120000;
        coins.customPostGasLimit = 230000;
    }
    
    modifier onlyOwner {
        require(owner == msg.sender);
        _;
    }

        function changeOraclizeGasPrice(uint _newGasPrice) external onlyOwner {
        provable_setCustomGasPrice(_newGasPrice);
    }
    

    string public ETHUSD;
    event LogConstructorInitiated(string nextStep);
    event LogPriceUpdated(string price);
    event LogNewProvableQuery(string description);


    function __callback(bytes32 myid, string result) external {
        if (msg.sender != provable_cbAddress()) revert();
        bytes32 coin_pointer;
        coin_pointer = oraclizeIndex[eventAddress][myid];
        address eventAddress = oraclizeInverseIndex[myid];
        ETHUSD = result;
        emit LogPriceUpdated(result);
        delete validIds[myid];
        updatePrice();
    }

    function updatePrice() external payable {
        if (provable_getPrice("URL") > this.balance) {
            emit LogNewProvableQuery("Provable query was NOT sent, please add some ETH to cover for the query fee");
        } else {
        	bytes32 temp_ID;
            emit LogNewProvableQuery("Provable query was sent, standing by for the answer..");
            temp_ID = provable_query(360, "URL", "json(https://api.pro.coinbase.com/products/ETH-USD/ticker).price",coins.customPostGasLimit);

            temp_ID = provable_query(360, "URL", "json(https://api.pro.coinbase.com/products/BTC-USD/ticker).price",coins.customPostGasLimit);

            temp_ID = provable_query(360, "URL", "json(https://api.pro.coinbase.com/products/USDT-USD/ticker).price",coins.customPostGasLimit);

            temp_ID = provable_query(360, "URL", "json(https://api.pro.coinbase.com/products/TUSD-USD/ticker).price",coins.customPostGasLimit);

            temp_ID = provable_query(360, "URL", "json(https://api.pro.coinbase.com/products/BUSD-USD/ticker).price",coins.customPostGasLimit);

            temp_ID = provable_query(360, "URL", "json(https://api.pro.coinbase.com/products/COMP-USD/ticker).price",coins.customPostGasLimit);

            temp_ID = provable_query(360, "URL", "json(https://api.pro.coinbase.com/products/BCH-USD/ticker).price",coins.customPostGasLimit);

            temp_ID = provable_query(360, "URL", "json(https://api.pro.coinbase.com/products/XTZ-USD/ticker).price",coins.customPostGasLimit);

            temp_ID = provable_query(360, "URL", "json(https://api.pro.coinbase.com/products/BTCSub-USD/ticker).price",coins.customPostGasLimit);
            
            validIds[temp_ID] = true;

        }
    }
}