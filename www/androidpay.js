/*global cordova, module*/
var TAG = 'AndroidPay';

function _buildReverseLookup(flatJSON) {
  var reversed = Object.keys(flatJSON).reduce((acc, key) => {
    var value = flatJSON[key];
    
    if (acc[value]) {
      if (Array.isArray(acc[value])) {
        acc[value].push(key);
      } else {
        acc[value] = [acc[value], key];
      }
    } else {
      acc[flatJSON[key]] = key;
    }
    
    return acc;
  }, {});
  
  return Object.assign({}, flatJSON, { _reverse: reversed });
}

/**
 * These constants are mostly an exact copy of their Java's counterparts.
 * @name Constants
 * @type {object} 
 */
var Constants = {
	/**
	 * @type {object}
	 * @prop {object} MESSAGES  - Un/successful values
	 * @prop {string} MESSAGES.IS_READY_TO_PAY  - Sent when #isReadyToPay() is successful
	 * @prop {string} MESSAGES.IS_NOT_READY_TO_PAY - Sent when #isReadyToPay() is not succesfull
	 */
	ACTIONS_RESPONSES: {
		MESSAGES: _buildReverseLookup({
			IS_READY_TO_PAY: "READY",
			IS_NOT_READY_TO_PAY: "NOT_READY"
		}),
		STAGES: _buildReverseLookup({
			LOAD_MASKED_WALLET_REQUEST_CODE: 1000,
			LOAD_FULL_WALLET_REQUEST_CODE: 1001
		})
	},
	/**
	 * com.google.android.gms.wallet.WalletConstants
	 * @type {object}
	 * @memberof Constants
	 * 
	 * @prop {number}	RESULT_ERROR
	 * @prop {string}	EXTRA_IS_USER_PREAUTHORIZED
	 * @prop {string}	EXTRA_MASKED_WALLET
	 * @prop {string}	EXTRA_FULL_WALLET
	 * @prop {string}	EXTRA_ERROR_CODE
	 * @prop {string}	EXTRA_MASKED_WALLET_REQUEST
	 * @prop {string}	EXTRA_IS_NEW_USER
	 * @prop {string}	EXTRA_IS_READY_TO_PAY
	 * @prop {string}	EXTRA_WEB_PAYMENT_DATA
	 * @prop {number}	ERROR_CODE_SERVICE_UNAVAILABLE
	 * @prop {number}	ERROR_CODE_INVALID_PARAMETERS
	 * @prop {number}	ERROR_CODE_MERCHANT_ACCOUNT_ERROR
	 * @prop {number}	ERROR_CODE_SPENDING_LIMIT_EXCEEDED
	 * @prop {number}	ERROR_CODE_BUYER_ACCOUNT_ERROR
	 * @prop {number}	ERROR_CODE_INVALID_TRANSACTION
	 * @prop {number}	ERROR_CODE_AUTHENTICATION_FAILURE
	 * @prop {number}	ERROR_CODE_UNSUPPORTED_API_VERSION
	 * @prop {number}	ERROR_CODE_UNKNOWN
	 * @prop {number}	ENVIRONMENT_PRODUCTION
	 * @prop {number}	ENVIRONMENT_TEST
	 * @prop {number}	ENVIRONMENT_SANDBOX
	 * @prop {number}	ENVIRONMENT_STRICT_SANDBOX
	 * @prop {number}	THEME_DARK
	 * @prop {number}	THEME_LIGHT
	 * @prop {string}	ACTION_ENABLE_WALLET_OPTIMIZATION
	 * @prop {string}	METADATA_TAG_WALLET_API_ENABLED
	 */
	WalletConstants: _buildReverseLookup({
	  RESULT_ERROR: 1,
	  EXTRA_IS_USER_PREAUTHORIZED: "com.google.android.gm.wallet.EXTRA_IS_USER_PREAUTHORIZED",
	  EXTRA_MASKED_WALLET: "com.google.android.gms.wallet.EXTRA_MASKED_WALLET",
	  EXTRA_FULL_WALLET: "com.google.android.gms.wallet.EXTRA_FULL_WALLET",
	  EXTRA_ERROR_CODE: "com.google.android.gms.wallet.EXTRA_ERROR_CODE",
	  EXTRA_MASKED_WALLET_REQUEST: "com.google.android.gms.wallet.EXTRA_MASKED_WALLET_REQUEST",
	  EXTRA_IS_NEW_USER: "com.google.android.gms.wallet.EXTRA_IS_NEW_USER",
	  EXTRA_IS_READY_TO_PAY: "com.google.android.gms.wallet.EXTRA_IS_READY_TO_PAY",
	  EXTRA_WEB_PAYMENT_DATA: "com.google.android.gms.wallet.EXTRA_WEB_PAYMENT_DATA",
	  ERROR_CODE_SERVICE_UNAVAILABLE: 402,
	  ERROR_CODE_INVALID_PARAMETERS: 404,
	  ERROR_CODE_MERCHANT_ACCOUNT_ERROR: 405,
	  ERROR_CODE_SPENDING_LIMIT_EXCEEDED: 406,
	  ERROR_CODE_BUYER_ACCOUNT_ERROR: 409,
	  ERROR_CODE_INVALID_TRANSACTION: 410,
	  ERROR_CODE_AUTHENTICATION_FAILURE: 411,
	  ERROR_CODE_UNSUPPORTED_API_VERSION: 412,
	  ERROR_CODE_UNKNOWN: 413,
	  ENVIRONMENT_PRODUCTION: 1,
	  ENVIRONMENT_TEST: 3,
	  ENVIRONMENT_SANDBOX: 0,
	  ENVIRONMENT_STRICT_SANDBOX: 2,
	  THEME_DARK: 0,
	  THEME_LIGHT: 1,
	  ACTION_ENABLE_WALLET_OPTIMIZATION: "com.google.android.gms.wallet.ENABLE_WALLET_OPTIMIZATION",
	  METADATA_TAG_WALLET_API_ENABLED: "com.google.android.gms.wallet.api.enabled",
	}),
	/**
	 * com.google.android.gms.common.api.CommonStatusCodes
	 * @type {object}
	 *
	 * @prop {number}	SUCCESS_CACHE
	 * @prop {number}	SUCCESS
	 * @prop {number}	SERVICE_VERSION_UPDATE_REQUIRED
	 * @prop {number}	SERVICE_DISABLED
	 * @prop {number}	SIGN_IN_REQUIRED
	 * @prop {number}	INVALID_ACCOUNT
	 * @prop {number}	RESOLUTION_REQUIRED
	 * @prop {number}	NETWORK_ERROR
	 * @prop {number}	INTERNAL_ERROR
	 * @prop {number}	DEVELOPER_ERROR
	 * @prop {number}	ERROR
	 * @prop {number}	INTERRUPTED
	 * @prop {number}	TIMEOUT
	 * @prop {number}	CANCELED
	 * @prop {number}	API_NOT_CONNECTED
	 * @prop {number}	DEAD_CLIENT 
	 */
	CommonStatusCodes: _buildReverseLookup({
	  SUCCESS_CACHE: -1,
	  SUCCESS: 0,
	  SERVICE_VERSION_UPDATE_REQUIRED: 2,
	  SERVICE_DISABLED: 3,
	  SIGN_IN_REQUIRED: 4,
	  INVALID_ACCOUNT: 5,
	  RESOLUTION_REQUIRED: 6,
	  NETWORK_ERROR: 7,
	  INTERNAL_ERROR: 8,
	  DEVELOPER_ERROR: 10,
	  ERROR: 13,
	  INTERRUPTED: 14,
	  TIMEOUT: 15,
	  CANCELED: 16,
	  API_NOT_CONNECTED: 17,
	  DEAD_CLIENT: 18,
	}),
	/**
	 * com.google.android.gms.wallet.WalletConstants.CardNetwork
	 * @type {object}
	 * 
	 * @prop {Number} AMEX
	 * @prop {Number} DISCOVER
	 * @prop {Number} JCB
	 * @prop {Number} MASTERCARD
	 * @prop {Number} VISA
	 * @prop {Number} INTERAC
	 * @prop {Number} OTHER
	 */
	CardNetwork: _buildReverseLookup({
	  AMEX: 1,
	  DISCOVER: 2,
	  JCB: 3,
	  MASTERCARD: 4,
	  VISA: 5,
	  INTERAC: 6,
	  OTHER: 1000,
	}),
	/**
	 * com.google.android.gms.wallet.PaymentMethodTokenizationType
	 * @type {object}
	 * 	  
	 * @prop {number} PAYMENT_GATEWAY
	 * @prop {number} NETWORK_TOKEN
	 */
	PaymentMethodTokenizationType: _buildReverseLookup({
	  PAYMENT_GATEWAY: 1,
	  NETWORK_TOKEN: 2,
	}),
	/**
	 * android.app.Activity
	 * @type {object}
	 * @prop {number}	RESULT_CANCELED
	 * @prop {number}	RESULT_OK
	 */
	Activity: _buildReverseLookup({
	  RESULT_CANCELED: 0,
	  RESULT_OK: -1,
	})
};


function _exec(action, args) {
  return new Promise(function(resolve, reject) {
    cordova.exec(
      function(result) {
        resolve(result);
      },
      function(error) {
        var candidates = [];
        
        if (error.code) {
          candidates.push(Constants.CommonStatusCodes._reverse[error.code]);
          candidates.push(Constants.WalletConstants._reverse[error.code]);
          candidates.push(Constants.Activity._reverse[error.code]);
        } else {
          candidates.push('anything');
        }
        
        var errorMessage = 'An error occured on native side.';
        if (error.code) errorMessage += ' Error code is: ' + error.code + '.';
        errorMessage += 'It might be ' + candidates.filter(Boolean).join(' or ');
        
        var e = new Error(errorMessage);
        if (error.code) e.code = error.code;
        e.raw = error;
        
        reject(e);
      }, TAG, action, args || []);
  });
}

function _bind(event, listener, args) {
  cordova.exec(
    function(result) {
      listener(result);
    }, 
    function(error) {
      listener(null, error);
    }, TAG, 'bindListener', [event].concat(args || []));
}

function tryParseJson(res, rejectOnParseError) {
  return new Promise(function(resolve, reject) {
    var json;

    try {
      json = (res && typeof res === 'string' && JSON.parse(res)) || res;
      return resolve(json);
    } catch (e) {
      console.log('Couldn\'t parse: '  + res);
      return rejectOnParseError ? reject(e) : resolve(res);
    }
  });
}

function _execParse(action, args, alwaysSuccess) {
  return _exec(action, args).then(function(res) { return tryParseJson(res, alwaysSuccess); });
}

var isBootstrapped = false;

/**
 * @namespace
 * @type {Object}
 * @see {@link https://developers.google.com/android-pay/tutorial|Android Pay (Native) Tutorial}
 * @example
 * var AndroidPay = cordova.plugins.AndroidPay;
 * 
 * AndroidPay.setup({
 *   environment: AndroidPay.Constants.WalletConstants.ENVIRONMENT_TEST,
 *   paymentMethodTokenizationParameters: {
 *     gateway: 'stripe',
 *     'stripe:publishableKey': 'pk_test_XXX',
 *     'stripe:version': 'YYYY-MM-DD'
 *   },
 *   allowedCards: [
 *     AndroidPay.Constants.CardNetwork.VISA,
 *     AndroidPay.Constants.CardNetwork.MASTERCARD
 *  ]
 * })
 * .then(function(result) { 
 *   console.log(result);
 *   return AndroidPay.bootstrap();
 * })
 * .then(function(result) {
 *   console.log(result);
 *   return AndroidPay.isReadyToPay();
 * })
 * .then(function(readyToPay) {
 *   console.log(result);
 *
 *   if (!readyToPay) {
 *     return Promise.reject(new Error('User is not ready to pay'));
 *   }
 * 	
 *  return AndroidPay.setCart({
 *    currencyCode: 'EUR',
 *    totalPrice: '1.00',
 *    lineItems: [
 *     {
 *       currencyCode: 'EUR',
 *       quantity: '1',
 *       description: '',
 *       totalPrice: '1.00',
 *       unitPrice: '1.00'
 *     }
 *   ]
 *  })
 * })
 * .then(function(result) {
 *   console.log(result);
 *   return AndroidPay.loadMasketWallet();
 * })
 * .then(function(tokenizationResult) {
 *   console.log(tokenizationResult);
 *
 *   // send to server
 * })
 * .catch(function(err) {
 *   console.log(err);
 * }); 
 */
var AndroidPay = {
	
	/**
	 *
	 * @method
	 * @param  {String} event    
	 * @param  {Function} listener 
	 * @param  {Array} args     
	 * @example
	 * cordova.plugins.AndroidPay.on('error', function(e) {
	 * 	console.log(e);
	 * });
	 */
  on: _bind,
  
	/**
	 * 
	 * @method
	 * @param {Object}	options 
	 * @param	{String}	options.tag
	 * @param {Array}		options.allowedCards
	 * @param {Number}	options.environment
	 * @param {Number}	options.theme
	 * @param {Number}	options.paymentMethodTokenizationType
	 * @param {Object}	options.paymentMethodTokenizationParameters
	 * @param {String}	options.paymentMethodTokenizationParameters.gateway
	 * @param {String}	options.merchantName
	 * @param {Boolean}	options.phoneNumberRequired
	 * @return {Promise}
	 * @example
	 * cordova.plugins.AndroidPay.setup({
	 * 	environment: cordova.plugins.AndroidPay.Constants.WalletConstants.ENVIRONMENT_TEST,
	 * 	paymentMethodTokenizationParameters: {
	 * 		gateway: 'stripe',
	 * 		'stripe:publishableKey': 'pk_test_XXX',
	 * 		'stripe:version': 'YYYY-MM-DD'
	 * 	},
	 * 	allowedCards: [
	 *    AndroidPay.Constants.CardNetwork.VISA,
	 *    AndroidPay.Constants.CardNetwork.MASTERCARD
	 * 	]
	 * })
	 * .then(function(result) { 
	 * 	console.log(result);
	 * })
	 * .catch(function(err) {
	 * 	console.log(err);
	 * }); 
	 */
  setup: function(options) {
    var _options = Object.assign({
      tag: 'AndroidPay',
      allowedCards: [
        Constants.CardNetwork.AMEX,
        Constants.CardNetwork.DISCOVER,
        Constants.CardNetwork.JCB,
        Constants.CardNetwork.MASTERCARD,
        Constants.CardNetwork.VISA,
        Constants.CardNetwork.INTERAC
      ],
      environment: Constants.WalletConstants.ENVIRONMENT_TEST,
      theme: Constants.WalletConstants.THEME_LIGHT,
      paymentMethodTokenizationType: Constants.PaymentMethodTokenizationType.PAYMENT_GATEWAY,
      paymentMethodTokenizationParameters: {
        gateway: 'stripe',
        'stripe:publishableKey': '',
        'stripe:version': '',
      },
      merchantName: 'App',
      phoneNumberRequired: false,
    }, options);
    
    var op = [
      this.setTag(_options.tag),
      this.setEnvironment(_options.environment),
      this.setTheme(_options.theme),
      this.setPaymentMethodTokenizationType(_options.paymentMethodTokenizationType),
      this.setMerchantName(_options.merchantName),
      this.setPhoneNumberRequired(_options.phoneNumberRequired)
    ];
    
    op = op.concat(_options.allowedCards.map(this.addAllowedCard));
    
    op = op.concat(Object.keys(_options.paymentMethodTokenizationParameters).map((function(key) {
      var value = _options.paymentMethodTokenizationParameters[key];
      
      return this.addPaymentMethodTokenizationParameter(key, value);
    }).bind(this)));
    
    return Promise.all(op);
  },
	
	/**
	 * 
	 * @method
	 * @param  {String} tag 
	 * @return {Promise}     
	 */
  setTag: function(tag) {
    return _exec('setTag', [tag]);
  },
	
	/**
	 * 
	 * @method
	 * @param  {Number} environment 
	 * @return {Promise}             
	 * @example
	 * cordova.plugins.AndroidPay.setEnvironment(cordova.plugins.AndroidPay.Constants.WalletConstants.ENVIRONMENT_TEST)
	 * .then(function(result) {
	 * 	console.log(result);
	 * })
	 * .catch(function(err) {
	 * 	console.log(err);
	 * })
	 */
  setEnvironment: function(environment) {
    return _exec('setEnvironment', [environment]);
  },
	/**
	 * 
	 * @method
	 * @param  {Number} card 
	 * @return {Promise}      
	 * @example
	 * cordova.plugins.AndroidPay.addAllowedCard(cordova.plugins.AndroidPay.Constants.CardNetwork.VISA)
	 * .then(function(result) {
	 * 	console.log(result);
	 * })
	 * .catch(function(err) {
	 * 	console.log(err);
	 * });
	 */
  addAllowedCard: function(card) {
    return _exec('addAllowedCard', [card]);
  },
	/**
	 * 
	 * @method
	 * @param  {Number} theme 
	 * @return {Promise}       
	 * @example
	 * cordova.plugins.AndroidPay.setTheme(cordova.plugins.Constants.WalletConstants.THEME_LIGHT)
	 * 	.then(function(result) {
	 * 		console.log(result);
	 * 	})
	 * 	.then(function(err) {
	 * 		console.log(err);
	 * 	});
	 */
  setTheme: function(theme) {
    return _exec('setTheme', [theme]);
  },
	/**
	 * 
	 * @method
	 * @param  {Number} paymentMethodTokenizationType 
	 * @return {Promise}   
	 * @example
	 * cordova.plugins.AndroidPay.setPaymentMethodTokenizationType(cordova.plugins.Android.Constants.PaymentMethodTokenizationType.PAYMENT_GATEWAY) 
	 * 	.then(function(result) {
	 * 		console.log(result);
	 * 	})
	 * 	.then(function(err) {
	 * 		console.log(err);
	 * 	});                           
	 */
  setPaymentMethodTokenizationType: function(paymentMethodTokenizationType) {
    return _exec('setPaymentMethodTokenizationType', [paymentMethodTokenizationType]);
  },
	/**
	 * 
	 * @method
	 * @param  {String} key   
	 * @param  {String} value 
	 * @return {Promise}       
	 * @example
	 * cordova.plugins.AndroidPay.addPaymentMethodTokenizationParameter('stripe:publishableKey', 'pk_test_XXX')
	 * 	.then(function(result) {
	 * 		console.log(result);
	 * 	})
	 * 	.then(function(err) {
	 * 		console.log(err);
	 * 	});
	 */
  addPaymentMethodTokenizationParameter: function(key, value) {
    return _exec('addPaymentMethodTokenizationParameter', [key, value]);
  },
	/**
	 * 
	 * @method
	 * @param  {String} merchantName 
	 * @return {Promise}              
	 * @example
	 * cordova.plugins.AndroidPay.setMerchantName('Merchant')
	 * 	.then(function(result) {
	 * 		console.log(result);
	 * 	})
	 * 	.then(function(err) {
	 * 		console.log(err);
	 * 	});
	 */
  setMerchantName: function(merchantName) {
    return _exec('setMerchantName', [merchantName]);
  },
	/**
	 * 
	 * @method
	 * @param  {Boolean} phoneNumberRequired 
	 * @return {Promise}        
	 * @example     
	 * cordova.plugins.AndroidPay.setPhoneNumberRequired(true)
	 * 	.then(function(result) {
	 * 		console.log(result);
	 * 	})
	 * 	.then(function(err) {
	 * 		console.log(err);
	 * 	});        
	 */
  setPhoneNumberRequired: function(phoneNumberRequired) {
    return _exec('setPhoneNumberRequired', [phoneNumberRequired]);
  },
  
	/**
	 * 
	 * @method
	 * @return {Promise} 
	 * @example
	 * cordova.plugins.AndroidPay.bootstrap()
	 * 	.then(function(result) {
	 * 		console.log(result);
	 * 	})
	 * 	.then(function(err) {
	 * 		console.log(err);
	 * 	});
	 */
  bootstrap: function() {
    return _execParse('bootstrap').then(result => {
			isBootstrapped = true;
			return Promise.resolve(result);
		});
  },
  
	/**
	 * 
	 * @method
	 * @return {Promise} 
	 * @example
	 * cordova.plugins.AndroidPay.isReadyToPay()
	 * 	.then(function(result) {
	 * 		console.log(result);
	 * 	})
	 * 	.then(function(err) {
	 * 		console.log(err);
	 * 	});
	 */
  isReadyToPay: function() {
    return _execParse('isReadyToPay').then(function(data) {
      if (Constants.ACTIONS_RESPONSES.MESSAGES.IS_READY_TO_PAY === data.message) {
        return Promise.resolve(true);
      }

      if (Constants.ACTIONS_RESPONSES.MESSAGES.IS_NOT_READY_TO_PAY === data.message) {
        return Promise.resolve(false);
      }

      return Promise.reject(new Error('Unknown response: ' + data.toString()));
    });
  },
	
	/**
	 * 
	 * @method
	 * @param	{Object} 	options 
	 * @param	{String} 	options.currencyCode
	 * @param	{String} 	options.totalPrice
	 * @param {Array}		options.lineItems
	 * @param {String}	options.lineItems.currencyCode
	 * @param {String}	options.lineItems.quantity
	 * @param {String}	options.lineItems.description
	 * @param {String}	options.lineItems.totalPrice
	 * @param	{String}	options.lineItems.unitPrice
	 * @return {Promise}         
	 * @example
	 * cordova.plugins.AndroidPay.setCart({
	 *  currencyCode: 'EUR',
	 *  totalPrice: '1.00',
	 *  lineItems: [
	 *    {
	 *      currencyCode: 'EUR',
	 *      quantity: '1',
	 *      description: '',
	 *      totalPrice: '1.00',
	 *      unitPrice: '1.00'
	 *    }
	 *  ]
	 * })
	 * .then(function(result) {
	 * 	console.log(result);
	 * })
	 * .then(function(err) {
	 * 	console.log(err);
	 * });
	 */
  setCart: function(options) {
    return _execParse('setCart', [options]);
  },
	/**
	 * 
	 * @method
	 * @return {Promise} 
	 * @example
	 * cordova.plugins.AndroidPay.loadWallet()
	 * 	.then(function(result) {
	 * 		console.log(result);
	 * 	})
	 * 	.then(function(err) {
	 * 		console.log(err);
	 * 	});
	 */
  loadWallet: function() {
    return _execParse('loadMaskedWallet');
  },
	/**
	 * 
	 * @method
	 * @return {Promise} 
	 * @example
	 * cordova.plugins.AndroidPay.loadMaskedWallet()
	 * 	.then(function(result) {
	 * 		console.log(result);
	 * 	})
	 * 	.then(function(err) {
	 * 		console.log(err);
	 * 	});
	 */
  loadMaskedWallet: function() {
    return _execParse('loadMaskedWallet');
  },
  Constants: Constants
};

module.exports = AndroidPay;
