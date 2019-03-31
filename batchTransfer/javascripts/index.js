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
		address: ['0x34d45c6B39B764BF91f6528FfA526f5C7275995D', '0x34d45c6B39B764BF91f6528FfA526f5C7275995D']
	}
});
var TransferValues = new Vue({
	el:'#valueList',
	data:{
		values: ['20', '4'],
		total:0
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
			// `this` 在方法里指向当前 Vue 实例
			//alert('Hello ' + this.name + '!')
			// `event` 是原生 DOM 事件
			//if (event) {
			//	alert(event.target.tagName)
			//}
			console.log(ReceiveAddress.address);
			console.log(TransferValues.values);
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
		console.log('You need install MetaMask');
		return;
		//web3 = new Web3(new Web3.providers.HttpProvider(NODE_NRL));
	}

	web3.eth.defaultAccount = web3.eth.accounts[0];
	CurrentAccount.address = web3.eth.accounts[0];

	console.log(web3.eth.defaultAccount);
	var v = web3.version;  //获取web3的版本
	console.log(v);	
};


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



