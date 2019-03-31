var CurrentAccount = new Vue({
	el: '#currentAccount',
	data: {
		address: ''
	}
});
var CoinAddress = new Vue({ 
    el: '#coinAddress',
    data: {
		address: '0xBD0dC36a80f01BF6b9786EbFCcd53BBE835BC493'
    }
});
var ReceiveAddress = new Vue({
	el:'#addressList',
	data:{
		address: ''
	}
});
var TransferValues = new Vue({
	el:'#valueList',
	data:{
		values: '',
		total:0
	}
});
var ErrorMessage = new Vue({
	el: '#errormessage',
	data: {
		message: ''
	}
});
var Submit = new Vue({
	el: '#btnRun',
	data: {
		name: 'run'
	},
	// 在 `methods` 对象中定义方法
	methods: {
		getTransferInfo: function (event) {
			var isError = false;
			var msg = new Array;

			if (CoinAddress.address.length == 0) {
				msg.push('CoinAddress is necessary.');
				isError = true;
			}
			if (ReceiveAddress.address.length == 0) {
				msg.push('ReceiveAddress is necessary.');
				isError = true;
			}
			if (TransferValues.values.length == 0) {
				msg.push('TransferValues is necessary.');
				isError = true;
			}			
			ReceiveAddress.address = convertArray(ReceiveAddress.address);
			TransferValues.values = convertArray(TransferValues.values);
			var cnt = ReceiveAddress.address.length;
			if (cnt > 100) {
				msg.push('Receive Address counts  is over 100 and donot be supported.');
				isError = true;
			}
			if (ReceiveAddress.address.length != TransferValues.values.length) {
				msg.push('The count of ReceiveAddress and TransferValues are must be equal.');
				isError = true;
			}
			if (isError) {
				ErrorMessage.message = '';
				for (var i in msg) {
					ErrorMessage.message += msg[i] + '\n';
				}
				return;
			}
			for (var i in TransferValues.values) {
				TransferValues.total += Number(TransferValues.values[i]);
			} 
			startApp();
		}
	}
})
const batchTransferContractAddress = '0x1745A2A561952B51c15C93847Cb746F47fb9Aa2e';
var myContract;

window.onload = function() {
	console.log(0);
	if (typeof web3 !== 'undefined') {
	    web3 = new Web3(web3.currentProvider);
	    console.log(1);
	} else {
		console.log(2);	
		ErrorMessage.message ='Your Browser Need Install web3.extend Tool.';
		return;
	}

	var v = web3.version;  //获取web3的版本
	console.log(v);	

	web3.eth.defaultAccount = web3.eth.accounts[0];
	CurrentAccount.address = web3.eth.accounts[0];
	if (web3.eth.accounts.length == 0)
		ErrorMessage.message = 'We can\'t read your ETH account address.';
};

function convertArray(values) {
	return values.replace(/\ +/g, "").replace(/[\r\n]/g, "").split(',')
}

function startApp(){
	var myContractAddress = CoinAddress.address;//'0xBD0dC36a80f01BF6b9786EbFCcd53BBE835BC493';
    myContract = web3.eth.contract(myContractABI).at(myContractAddress);

	var batchTransferContract = web3.eth.contract(BatchTransferContractABI).at(batchTransferContractAddress);
	myContract.approve(batchTransferContractAddress, TransferValues.total, function (error, result) {
		if (!error) {
			console.log(result);
			batchTransferContract.batchTransferFrom(CoinAddress.address, ReceiveAddress.address, TransferValues.values, function (error, result) {
				if (!error)
					console.log(result);
				else
					console.log(error);
			});
		}
		else
			console.log(error);
	});

}



