const qtmAddress = '0x11223344d5b43ec0930af1236f4cf67bf7d81217';
const supraAddress = '0xee90faf3216dfae5e8ac1f3f48f10527f38fff78';
const usdcAddress = '0x04068da6c83afcfa0e13ba15a6696662335d5b75';
const buyQTMAddress = '0xc625792613CAeAeD2F2fcdaA8d05218260CcC872';
const buySupra1Address = '0xD567f218D0a4151Ae2Bc08B969AA90B0D9401fD7';

let fSaccount = false;
let fSprovider = false;
let usdcAllowance = false;
let supra1Allowance = false;
let supra2Allowance = false;
let supra3Allowance = false;
let supra1Remaining = false;
let supra2Remaining = false;
let supra3Remaining = false;
let buy1Contract = false;
let buy2Contract = false;
let buy3Contract = false;
let buyQTMContract = false;
let supraContract = false;
let usdcContract = false;
let qtmContract = false;
let web3Instance = new Web3X('https://rpc.ftm.tools/');


window.onload = async function () {
    await connectWallet();
};

function SnackBar(userOptions) {
    var _This = this;
    var _Interval;
    var _Element;
    var _Container;
    var _Message;
    var _MessageWrapper;

    function _create() {
        _applyUserOptions();
        _setContainer();
        _applyPositionClasses();

        _Element = _createMessage();
        _Container.appendChild(_Element);

        if (_Options.timeout !== false && _Options.timeout > 0) {
            _Interval = setTimeout(_This.Close, _Options.timeout);
        }
    }

    function _applyUserOptions() {
        _Options = {
            message: userOptions?.message ?? "Operation performed successfully.",
            dismissible: userOptions?.dismissible ?? true,
            timeout: userOptions?.timeout ?? 5000,
            status: userOptions?.status ? userOptions.status.toLowerCase().trim() : "",
            actions: userOptions?.actions ?? [],
            fixed: userOptions?.fixed ?? false,
            position: userOptions?.position ?? "br",
            container: userOptions?.container ?? document.body,
            width: userOptions?.width,
            speed: userOptions?.speed,
            icon: userOptions?.icon
        };
    }

    function _setContainer() {
        var target = getOrFindContainer();

        if (target === undefined) {
            console.warn("SnackBar: Could not find target container " + _Options.container);
            target = document.body; // default to the body as the container
        }

        _Container = getOrAddContainerIn(target);

        function getOrAddContainerIn(target) {
            var node;
            var positionClass = _getPositionClass();

            for (var i = 0; i < target.children.length; i++) {
                node = target.children.item(i);

                if (node.nodeType === 1
                    && node.classList.length > 0
                    && node.classList.contains("js-snackbar-container")
                    && node.classList.contains(positionClass)
                ) {
                    return node;
                }
            }

            return createNewContainer(target);
        }

        function createNewContainer(target) {
            var container = document.createElement("div");
            container.classList.add("js-snackbar-container");

            if (_Options.fixed) {
                container.classList.add("js-snackbar-container--fixed");
            }

            target.appendChild(container);
            return container;
        }

        function getOrFindContainer() {
            return typeof _Options.container === "object"
                ? _Options.container
                : document.getElementById(_Options.container);
        }
    }

    function _applyPositionClasses() {
        _Container.classList.add(_getPositionClass());

        var fixedClassName = "js-snackbar-container--fixed";

        if (_Options.fixed) {
            _Container.classList.add(fixedClassName);
        }
        else {
            _Container.classList.remove(fixedClassName);
        }
    }

    function _createMessage() {
        var outerElement = createWrapper();

        var innerSnack = createInnerSnackbar();

        outerElement.appendChild(innerSnack);

        return outerElement;

        function createWrapper() {
            var outerElement = document.createElement("div");

            outerElement.classList.add("js-snackbar__wrapper");
            outerElement.style.height = "0px";
            outerElement.style.opacity = "0";
            outerElement.style.marginTop = "0px";
            outerElement.style.marginBottom = "0px";

            setWidth(outerElement);
            setSpeed(outerElement);

            return outerElement;
        }

        function createInnerSnackbar() {
            var innerSnack = document.createElement("div");
            innerSnack.classList.add("js-snackbar", "js-snackbar--show");

            applyColorAndIconTo(innerSnack);
            insertMessageTo(innerSnack);
            addActionsTo(innerSnack);
            addDismissButtonTo(innerSnack);

            return innerSnack;
        }

        function applyColorAndIconTo(element) {
            if (!_Options.status) return;

            var status = document.createElement("span");
            status.classList.add("js-snackbar__status");

            applyColorTo(status);
            applyIconTo(status);

            element.appendChild(status);

            function applyColorTo(element) {
                switch (_Options.status) {
                    case "success":
                    case "green":
                        element.classList.add("js-snackbar--success");
                        break;
                    case "warning":
                    case "alert":
                    case "orange":
                        element.classList.add("js-snackbar--warning");
                        break;
                    case "danger":
                    case "error":
                    case "red":
                        element.classList.add("js-snackbar--danger");
                        break;
                    default:
                        element.classList.add("js-snackbar--info");
                        break;
                }
            }

            function applyIconTo(element) {
                if (!_Options.icon) return;

                var icon = document.createElement("span");
                icon.classList.add("js-snackbar__icon");

                switch (_Options.icon) {
                    case "exclamation":
                    case "warn":
                    case "danger":
                        icon.innerText = "!";
                        break;
                    case "info":
                    case "question":
                    case "question-mark":
                        icon.innerText = "?";
                        break;
                    case "plus":
                    case "add":
                        icon.innerText = "+";
                        break;
                    default:
                        if (_Options.icon.length > 1) {
                            console.warn("Invalid icon character provided: ", _Options.icon);
                        }

                        icon.innerText = _Options.icon.substr(0, 1);
                        break;
                }

                element.appendChild(icon);
            }
        }

        function insertMessageTo(element) {
            _MessageWrapper = document.createElement("div");
            _MessageWrapper.classList.add("js-snackbar__message-wrapper");

            _Message = document.createElement("span");
            _Message.classList.add("js-snackbar__message")
            _Message.innerHTML = _Options.message;

            _MessageWrapper.appendChild(_Message);
            element.appendChild(_MessageWrapper);
        }

        function addActionsTo(element) {
            if (typeof _Options.actions !== "object") {
                return;
            }

            for (var i = 0; i < _Options.actions.length; i++) {
                addAction(element, _Options.actions[i]);
            }

            function addAction(element, action) {
                var button = document.createElement("span");
                button.classList.add("js-snackbar__action");
                button.textContent = action.text;

                if (typeof action.function === "function") {
                    if (action.dismiss === true) {
                        button.onclick = function () {
                            action.function();
                            _This.Close();
                        }
                    }
                    else {
                        button.onclick = action.function;
                    }
                }
                else {
                    button.onclick = _This.Close;
                }

                element.appendChild(button);
            }
        }

        function addDismissButtonTo(element) {
            if (!_Options.dismissible) {
                return;
            }

            var closeButton = document.createElement("span");
            closeButton.classList.add("js-snackbar__close");
            closeButton.innerText = "\u00D7";
            closeButton.onclick = _This.Close;

            element.appendChild(closeButton);
        }

        function setWidth(element) {
            if (!_Options.width) return;

            element.style.width = _Options.width;
        }

        function setSpeed(element) {
            const { speed } = _Options;

            switch (typeof speed) {
                case "number":
                    element.style.transitionDuration = speed + "ms";
                    break;
                case "string":
                    element.style.transitionDuration = speed;
                    break;
            }
        }
    }

    function _getPositionClass() {
        switch (_Options.position) {
            case "bl":
                return "js-snackbar-container--bottom-left";
            case "tl":
                return "js-snackbar-container--top-left";
            case "tr":
                return "js-snackbar-container--top-right";
            case "tc":
            case "tm":
                return "js-snackbar-container--top-center";
            case "bc":
            case "bm":
                return "js-snackbar-container--bottom-center";
            default:
                return "js-snackbar-container--bottom-right";
        }
    }

    this.Open = function () {
        var contentHeight = getMessageHeight();

        _Element.style.height = contentHeight + "px";
        _Element.style.opacity = 1;
        _Element.style.marginTop = "5px";
        _Element.style.marginBottom = "5px";

        _Element.addEventListener("transitioned", function () {
            _Element.removeEventListener("transitioned", arguments.callee);
            _Element.style.height = null;
        })

        function getMessageHeight() {
            const wrapperStyles = window.getComputedStyle(_MessageWrapper)

            return _Message.scrollHeight
                + parseFloat(wrapperStyles.getPropertyValue('padding-top'))
                + parseFloat(wrapperStyles.getPropertyValue("padding-bottom"))
        }
    }

    this.Close = function () {
        if (_Interval)
            clearInterval(_Interval);

        var snackbarHeight = _Element.scrollHeight; // get the auto height as a px value
        var snackbarTransitions = _Element.style.transition;
        _Element.style.transition = "";

        requestAnimationFrame(function () {
            _Element.style.height = snackbarHeight + "px"; // set the auto height to the px height
            _Element.style.opacity = 1;
            _Element.style.marginTop = "0px";
            _Element.style.marginBottom = "0px";
            _Element.style.transition = snackbarTransitions

            requestAnimationFrame(function () {
                _Element.style.height = "0px";
                _Element.style.opacity = 0;
            })
        });

        setTimeout(function () {
            _Container.removeChild(_Element);
        }, 1000);
    };

    _create();
    _This.Open();
}

async function connectWallet() {
    web3Instance = new Web3X('https://rpc.ftm.tools/');
    if (typeof ethereum === 'undefined') {
        jQuery('#buyQTMButton').attr('disabled', 'disabled');
        jQuery('#buyQTMButton').text('NO WALLET');
        jQuery('#buySupra1Button').attr('disabled', 'disabled');
        jQuery('#buySupra1Button').text('NO WALLET');
        jQuery('#buySupra2Button').attr('disabled', 'disabled');
        jQuery('#buySupra2Button').text('NO WALLET');
        jQuery('#buySupra3Button').attr('disabled', 'disabled');
        jQuery('#buySupra3Button').text('NO WALLET');
    }

    ethereum.on('accountsChanged', async function () {
        window.location.reload();
    });
    ethereum.on('chainChanged', () => {
        window.location.reload();
    });

    await assign();

    const provider = web3.currentProvider;
    fSprovider = provider;
    web3Instance.setProvider(provider);

    const chainId = await provider.chainId;
    if (chainId != '0xfa') {
        jQuery('#buyQTMButton').attr('disabled', 'disabled');
        jQuery('#buyQTMText').text('WRONG NETWORK');
        jQuery('#buySupra1Button').attr('disabled', 'disabled');
        jQuery('#buySupra1Text').text('WRONG NETWORK');
        jQuery('#buySupra2Button').attr('disabled', 'disabled');
        jQuery('#buySupra2Text').text('WRONG NETWORK');
        jQuery('#buySupra3Button').attr('disabled', 'disabled');
        jQuery('#buySupra3Text').text('WRONG NETWORK');
    }

    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    let account = false;

    if (accounts.length > 0) {
        fSaccount = accounts[0];

        account = fSaccount;

        await updateAllowance();
    } else {
        jQuery('#buyQTMButton').removeAttr('disabled');
        jQuery('#buyQTMButton').click(connectWallet);
        jQuery('#buyQTMText').text('CONNECT WALLET');
        jQuery('#buySupra1Button').removeAttr('disabled');
        jQuery('#buySupra1Button').click(connectWallet);
        jQuery('#buySupra1Text').text('CONNECT WALLET');
        jQuery('#buySupra2Button').removeAttr('disabled');
        jQuery('#buySupra2Button').click(connectWallet);
        jQuery('#buySupra2Text').text('CONNECT WALLET');
        jQuery('#buySupra3Button').removeAttr('disabled');
        jQuery('#buySupra3Button').click(connectWallet);
        jQuery('#buySupra3Text').text('CONNECT WALLET');
    }

    return account;
}

async function getBalances() {
    var usdcBalance = 0;
    var supraBalance = 0;
    var qtmBalance = 0;
    var usdcDecimals = await usdcContract.methods.decimals().call();
    var supraDecimals = await supraContract.methods.decimals().call();
    var qtmDecimals = await qtmContract.methods.decimals().call();
    usdcBalance = await usdcContract.methods.balanceOf(fSaccount).call();
    usdcBalance = usdcBalance / Math.pow(10, usdcDecimals);
    usdcBalance = parseFloat(usdcBalance).toFixed(2);
    supraBalance = await supraContract.methods.balanceOf(fSaccount).call();
    supraBalance = supraBalance / Math.pow(10, supraDecimals);
    supraBalance = parseFloat(supraBalance).toFixed(2);
    qtmBalance = await qtmContract.methods.balanceOf(fSaccount).call();
    qtmBalance = qtmBalance / Math.pow(10, qtmDecimals);
    qtmBalance = parseFloat(qtmBalance).toFixed(2)
    jQuery('#supraWallet').text(supraBalance);
    jQuery('#qtmWallet').text(qtmBalance);
    jQuery('#usdcWallet').text(usdcBalance);
    jQuery('#receiveQTMText').text(`You will receive ${supraBalance * 10} QTM for all your SUPRA`);

    return [qtmBalance, supraBalance, usdcBalance];
}

function onChangeAmount1() {
    const val = jQuery('#usdcAmount1').val();
    jQuery('#receiveSupra1Text').text(`You will receive ${parseFloat(val / 20).toFixed(2)} SUPRA`);
}

function onChangeAmount2() {
    const val = jQuery('#usdcAmount2').val();
    jQuery('#receiveSupra2Text').text(`You will receive ${parseFloat(val / 30).toFixed(2)} SUPRA`);
}

function onChangeAmount3() {
    const val = jQuery('#usdcAmount3').val();
    jQuery('#receiveSupra3Text').text(`You will receive ${parseFloat(val / 50).toFixed(2)} SUPRA`);
}

async function updateAllowance() {
    supra1Allowance = await usdcContract.methods.allowance(fSaccount, buySupra1Address).call();
    /*supra2Allowance = await buy2Contract.methods.allowance(fSaccount, usdcAddress).call();
    supra3Allowance = await buy3Contract.methods.allowance(fSaccount, usdcAddress).call();*/
    qtmAllowance = await supraContract.methods.allowance(fSaccount, buyQTMAddress).call();

    if (supra1Allowance === '0') {
        jQuery("#buySupra1Button").off('click');
        jQuery('#buySupra1Button').removeAttr('disabled');
        jQuery('#buySupra1Text').text('APPROVE');
        jQuery('#buySupra1Button').click(approveSupraTokenContract1);
    } else {
        jQuery("#buySupra1Button").off('click');
        jQuery('#buySupra1Button').removeAttr('disabled');
        jQuery('#buySupra1Text').text('EXCHANGE');
        jQuery('#buySupra1Button').click(buySupra1);
    }

    if (supra2Allowance === '0') {
        jQuery("#buySupra2Button").off('click');
        jQuery('#buySupra2Button').removeAttr('disabled');
        jQuery('#buySupra2Text').text('APPROVE');
        jQuery('#buySupra2Button').click(approveSupraTokenContract2);
    } else {
        jQuery("#buySupra2Button").off('click');
        jQuery('#buySupra2Button').removeAttr('disabled');
        jQuery('#buySupra2Text').text('EXCHANGE');
        jQuery('#buySupra2Button').click(buySupra2);
    }

    if (supra3Allowance === '0') {
        jQuery("#buySupra3Button").off('click');
        jQuery('#buySupra3Button').removeAttr('disabled');
        jQuery('#buySupra3Text').text('APPROVE');
        jQuery('#buySupra3Button').click(approveSupraTokenContract3);
    } else {
        jQuery("#buySupra3Button").off('click');
        jQuery('#buySupra3Button').removeAttr('disabled');
        jQuery('#buySupra3Text').text('EXCHANGE');
        jQuery('#buySupra3Button').click(buySupra3);
    }
    console.log("supra1q", qtmAllowance);

    if (qtmAllowance === '0') {
        jQuery("#buyQTMButton").off('click'); 
        jQuery('#buyQTMButton').removeAttr('disabled');
        jQuery('#buyQTMText').text('APPROVE');
        jQuery('#buyQTMButton').click(approveQTMTokenContract);
    } else {
        jQuery("#buyQTMButton").off('click'); 
        jQuery('#buyQTMButton').removeAttr('disabled');
        jQuery('#buyQTMText').text('EXCHANGE');
        jQuery('#buyQTMButton').click(buyQTM);
    }
}

async function approveQTMTokenContract() {
    console.log('Hey!')
    const approval = await supraContract.methods.approve(buyQTMAddress, '1000000000000000000000000').send({ from: fSaccount })
        .on('transactionHash', function (hash) {
            new SnackBar({
                message: hash ? `Transaction Send` : 'Declined',
                dismissible: true,
                status: hash ? "green" : "red",
                timeout: 3000,
            });
        });
    new SnackBar({
        message: approval ? 'Approved' : 'Declined',
        dismissible: true,
        status: approval ? "green" : "red",
        timeout: 3000,
    });
    await updateAllowance(approval);
}

async function approveSupraTokenContract1() {
    const approval = await usdcContract.methods.approve(buySupra1Address, '1000000000000000000000000').send({ from: fSaccount })
        .on('transactionHash', function (hash) {
            new SnackBar({
                message: hash ? `Transaction Send` : 'Declined',
                dismissible: true,
                status: hash ? "green" : "red",
                timeout: 3000,
            });
        });
    new SnackBar({
        message: approval ? 'Approved' : 'Declined',
        dismissible: true,
        status: approval ? "green" : "red",
        timeout: 3000,
    });
    await updateAllowance(approval);
}

async function approveSupraTokenContract2() {
    const approval = await buy2Contract.methods.approve(usdcAddress, '1000000000000000000000000').send({ from: fSaccount })
        .on('transactionHash', function (hash) {
            new SnackBar({
                message: hash ? `Transaction Send` : 'Declined',
                dismissible: true,
                status: hash ? "green" : "red",
                timeout: 3000,
            });
        });
    new SnackBar({
        message: approval ? 'Approved' : 'Declined',
        dismissible: true,
        status: approval ? "green" : "red",
        timeout: 3000,
    });
    await updateAllowance(approval);
}

async function approveSupraTokenContract3() {
    const approval = await buy3Contract.methods.approve(usdcAddress, '1000000000000000000000000').send({ from: fSaccount })
        .on('transactionHash', function (hash) {
            new SnackBar({
                message: hash ? `Transaction Send` : 'Declined',
                dismissible: true,
                status: hash ? "green" : "red",
                timeout: 3000,
            });
        });
    new SnackBar({
        message: approval ? 'Approved' : 'Declined',
        dismissible: true,
        status: approval ? "green" : "red",
        timeout: 3000,
    });
    await updateAllowance(approval);
}

async function buyQTM() {
    var result = await buyQTMContract.methods.singleRedeem(0).send({ from: fSaccount, gasPrice: '40000000000' })
        .on('transactionHash', function (hash) {
            new SnackBar({
                message: hash ? `Transaction Send` : 'Declined',
                dismissible: true,
                status: hash ? "green" : "red",
                timeout: 3000,
            });
        });
    new SnackBar({
        message: result ? 'Purchase Confirmed' : 'Declined',
        dismissible: true,
        status: result ? "green" : "red",
        timeout: 3000,
    });
    if (result) {
        await getBalances();
    }
}

async function buySupra1() {
    const val = jQuery('#usdcAmount1').val();
    const valFormatted = val * Math.pow(10, 6);
    var result = await buy1Contract.methods.buySupra(valFormatted).send({ from: fSaccount, gasPrice: '40000000000' })
        .on('transactionHash', function (hash) {
            new SnackBar({
                message: hash ? `Transaction Send` : 'Declined',
                dismissible: true,
                status: hash ? "green" : "red",
                timeout: 3000,
            });
        });
    new SnackBar({
        message: result ? 'Purchase Confirmed' : 'Declined',
        dismissible: true,
        status: result ? "green" : "red",
        timeout: 3000,
    });
    if (result) {
        await getBalances();
    }
}

async function buySupra2() {
    var result = await buyQTMContract.methods.singleRedeem().send({ from: fSaccount, gasPrice: '40000000000' })
        .on('transactionHash', function (hash) {
            new SnackBar({
                message: hash ? `Transaction Send` : 'Declined',
                dismissible: true,
                status: hash ? "green" : "red",
                timeout: 3000,
            });
        });
    new SnackBar({
        message: result ? 'Purchase Confirmed' : 'Declined',
        dismissible: true,
        status: result ? "green" : "red",
        timeout: 3000,
    });
    if (result) {
        await getBalances();
    }
}

async function buySupra3() {
    var result = await buyQTMContract.methods.singleRedeem().send({ from: fSaccount, gasPrice: '40000000000' })
        .on('transactionHash', function (hash) {
            new SnackBar({
                message: hash ? `Transaction Send` : 'Declined',
                dismissible: true,
                status: hash ? "green" : "red",
                timeout: 3000,
            });
        });
    new SnackBar({
        message: result ? 'Purchase Confirmed' : 'Declined',
        dismissible: true,
        status: result ? "green" : "red",
        timeout: 3000,
    });
    if (result) {
        await getBalances();
    }
}

async function assign() {
    buyQTMContract = new web3Instance.eth.Contract(qtmAbi, buyQTMAddress);
    buy1Contract = new web3Instance.eth.Contract(buySupraAbi, buySupra1Address);
    supraContract = new web3Instance.eth.Contract(tokenAbi, supraAddress);
    usdcContract = new web3Instance.eth.Contract(tokenAbi, usdcAddress);
    qtmContract = new web3Instance.eth.Contract(tokenAbi, qtmAddress);
}

const qtmAbi = [
    {
        "inputs": [
            {
                "internalType": "contract IERC20",
                "name": "_qtm",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "QtmRedeem",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "contract IERC20",
                "name": "_sToken",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_qtmRate",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_maxQTM",
                "type": "uint256"
            }
        ],
        "name": "addSToken",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "multiRedeem",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_sid",
                "type": "uint256"
            }
        ],
        "name": "pauseSToken",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "qtm",
        "outputs": [
            {
                "internalType": "contract IERC20",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract IERC20",
                "name": "_token",
                "type": "address"
            }
        ],
        "name": "recoverTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract IERC20",
                "name": "",
                "type": "address"
            }
        ],
        "name": "sTokenExistence",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "sTokenInfo",
        "outputs": [
            {
                "internalType": "contract IERC20",
                "name": "sToken",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "qtmRate",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "qtmDelivered",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "maxQtm",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "remainingQtm",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isPaused",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "sTokenLength",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_sid",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_qtmRate",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_maxQTM",
                "type": "uint256"
            }
        ],
        "name": "set",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_sid",
                "type": "uint256"
            }
        ],
        "name": "singleRedeem",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_sid",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_user",
                "type": "address"
            }
        ],
        "name": "userQtmBySid",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_sid",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_user",
                "type": "address"
            }
        ],
        "name": "userSTokenBySid",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

const tokenAbi = [{ "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "authorizer", "type": "address" }, { "indexed": true, "internalType": "bytes32", "name": "nonce", "type": "bytes32" }], "name": "AuthorizationCanceled", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "authorizer", "type": "address" }, { "indexed": true, "internalType": "bytes32", "name": "nonce", "type": "bytes32" }], "name": "AuthorizationUsed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "account", "type": "address" }], "name": "Blacklisted", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "userAddress", "type": "address" }, { "indexed": false, "internalType": "address payable", "name": "relayerAddress", "type": "address" }, { "indexed": false, "internalType": "bytes", "name": "functionSignature", "type": "bytes" }], "name": "MetaTransactionExecuted", "type": "event" }, { "anonymous": false, "inputs": [], "name": "Pause", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "newRescuer", "type": "address" }], "name": "RescuerChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "previousAdminRole", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "newAdminRole", "type": "bytes32" }], "name": "RoleAdminChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }], "name": "RoleGranted", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }], "name": "RoleRevoked", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "account", "type": "address" }], "name": "UnBlacklisted", "type": "event" }, { "anonymous": false, "inputs": [], "name": "Unpause", "type": "event" }, { "inputs": [], "name": "APPROVE_WITH_AUTHORIZATION_TYPEHASH", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "BLACKLISTER_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "CANCEL_AUTHORIZATION_TYPEHASH", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "DECREASE_ALLOWANCE_WITH_AUTHORIZATION_TYPEHASH", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "DEFAULT_ADMIN_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "DEPOSITOR_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "DOMAIN_SEPARATOR", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "EIP712_VERSION", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "INCREASE_ALLOWANCE_WITH_AUTHORIZATION_TYPEHASH", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "META_TRANSACTION_TYPEHASH", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "PAUSER_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "PERMIT_TYPEHASH", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "RESCUER_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "TRANSFER_WITH_AUTHORIZATION_TYPEHASH", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "WITHDRAW_WITH_AUTHORIZATION_TYPEHASH", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "uint256", "name": "validAfter", "type": "uint256" }, { "internalType": "uint256", "name": "validBefore", "type": "uint256" }, { "internalType": "bytes32", "name": "nonce", "type": "bytes32" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "approveWithAuthorization", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "authorizer", "type": "address" }, { "internalType": "bytes32", "name": "nonce", "type": "bytes32" }], "name": "authorizationState", "outputs": [{ "internalType": "enum GasAbstraction.AuthorizationState", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "blacklist", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "blacklisters", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "authorizer", "type": "address" }, { "internalType": "bytes32", "name": "nonce", "type": "bytes32" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "cancelAuthorization", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "decrement", "type": "uint256" }, { "internalType": "uint256", "name": "validAfter", "type": "uint256" }, { "internalType": "uint256", "name": "validBefore", "type": "uint256" }, { "internalType": "bytes32", "name": "nonce", "type": "bytes32" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "decreaseAllowanceWithAuthorization", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }, { "internalType": "bytes", "name": "depositData", "type": "bytes" }], "name": "deposit", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, {
    "inputs": [{
        "internalType": "address", "name"
            : "userAddress", "type": "address"
    }, { "internalType": "bytes", "name": "functionSignature", "type": "bytes" }, { "internalType": "bytes32", "name": "sigR", "type": "bytes32" }, { "internalType": "bytes32", "name": "sigS", "type": "bytes32" }, { "internalType": "uint8", "name": "sigV", "type": "uint8" }], "name": "executeMetaTransaction", "outputs": [{ "internalType": "bytes", "name": "", "type": "bytes" }], "stateMutability": "payable", "type": "function"
}, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }], "name": "getRoleAdmin", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "getRoleMember", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }], "name": "getRoleMemberCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "grantRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "hasRole", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "increment", "type": "uint256" }, { "internalType": "uint256", "name": "validAfter", "type": "uint256" }, { "internalType": "uint256", "name": "validBefore", "type": "uint256" }, { "internalType": "bytes32", "name": "nonce", "type": "bytes32" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "increaseAllowanceWithAuthorization", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "newName", "type": "string" }, { "internalType": "string", "name": "newSymbol", "type": "string" }, { "internalType": "uint8", "name": "newDecimals", "type": "uint8" }, { "internalType": "address", "name": "childChainManager", "type": "address" }], "name": "initialize", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "initialized", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "isBlacklisted", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "nonces", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "pause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "paused", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "pausers", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "permit", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "renounceRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "contract IERC20", "name": "tokenContract", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "rescueERC20", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "rescuers", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "revokeRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "uint256", "name": "validAfter", "type": "uint256" }, { "internalType": "uint256", "name": "validBefore", "type": "uint256" }, { "internalType": "bytes32", "name": "nonce", "type": "bytes32" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "transferWithAuthorization", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "unBlacklist", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "unpause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "newName", "type": "string" }, { "internalType": "string", "name": "newSymbol", "type": "string" }], "name": "updateMetadata", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "uint256", "name": "validAfter", "type": "uint256" }, { "internalType": "uint256", "name": "validBefore", "type": "uint256" }, { "internalType": "bytes32", "name": "nonce", "type": "bytes32" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "withdrawWithAuthorization", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]

const buySupraAbi = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "buySupra",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract IERC20",
				"name": "_supra",
				"type": "address"
			},
			{
				"internalType": "contract IERC20",
				"name": "_token",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_supraRate",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "BuySupra",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "pause",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract IERC20",
				"name": "_token",
				"type": "address"
			}
		],
		"name": "recoverTokens",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_newRate",
				"type": "uint256"
			}
		],
		"name": "setSupraRate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract IERC20",
				"name": "_token",
				"type": "address"
			}
		],
		"name": "setToken",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "availableSupra",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "paused",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "supra",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_tokenAmount",
				"type": "uint256"
			}
		],
		"name": "supraByToken",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "supraRate",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "token",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "tokensForAllSupra",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "userSupra",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "userSupraByAllToken",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "userToken",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]