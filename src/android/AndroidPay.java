package com.bsit.cordova.androidpay;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.Manifest;
import android.app.Dialog;
import android.content.DialogInterface;
import android.support.annotation.NonNull;
import android.util.Log;
import android.os.Bundle;
import android.app.Activity;
import android.content.Intent;
import android.content.IntentSender;
import android.widget.Toast;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.BooleanResult;
import com.google.android.gms.common.api.CommonStatusCodes;
import com.google.android.gms.common.GoogleApiAvailability;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.PendingResult;
import com.google.android.gms.common.api.ResultCallback;
import com.google.android.gms.common.api.Status;
import com.google.android.gms.wallet.Cart;
import com.google.android.gms.wallet.FullWallet;
import com.google.android.gms.wallet.FullWalletRequest;
import com.google.android.gms.wallet.IsReadyToPayRequest;
import com.google.android.gms.wallet.LineItem;
import com.google.android.gms.wallet.MaskedWallet;
import com.google.android.gms.wallet.MaskedWalletRequest;
import com.google.android.gms.wallet.PaymentMethodTokenizationParameters;
import com.google.android.gms.wallet.PaymentMethodTokenizationType;
import com.google.android.gms.wallet.Wallet;
import com.google.android.gms.wallet.WalletConstants;
import com.google.android.gms.wallet.fragment.SupportWalletFragment;
import com.google.android.gms.wallet.fragment.WalletFragmentInitParams;
import com.google.android.gms.wallet.fragment.WalletFragmentMode;
import com.google.android.gms.wallet.fragment.WalletFragmentOptions;
import com.google.android.gms.wallet.fragment.WalletFragmentStyle;

import java.util.HashMap;
import java.util.Map;


public class AndroidPay extends CordovaPlugin implements
        GoogleApiClient.ConnectionCallbacks,
        GoogleApiClient.OnConnectionFailedListener {

    private static final int LOAD_MASKED_WALLET_REQUEST_CODE = 1000;
    private static final int LOAD_FULL_WALLET_REQUEST_CODE = 1001;

    private GoogleApiClient googleApiClient;

    private Map<String, CallbackContext> listeners;
    protected CallbackContext context;

    private Cart cart;

    private String TAG = "AndroidPay";
    private IsReadyToPayRequest.Builder readyToPayRequestBuilder = IsReadyToPayRequest.newBuilder();

    private String merchantName = "App";
    private Boolean phoneNumberRequired = false;
    private Boolean shippingAddressRequired = false;
    private Boolean allowPrepaidCard = true;
    private Boolean allowDebitCard = true;

    private PaymentMethodTokenizationParameters.Builder tokenizationParametersBuilder = PaymentMethodTokenizationParameters.newBuilder();
    private Wallet.WalletOptions.Builder walletOptionsBuilder = new Wallet.WalletOptions.Builder();

    private CallbackContext bootstrapCallback;
    private Boolean bootstrapped = false;

    public void setTag(String tag) {
        Log.d(TAG, "setTag: " + tag);
        this.TAG = tag;
        handleSuccess();
    }
    public void setEnvironment(int environment) {
        Log.d(TAG, "setEnvironment: " + environment);
        walletOptionsBuilder.setEnvironment(environment);
        handleSuccess();
    }
    public void setTheme(int theme) {
        Log.d(TAG, "setTheme: " + theme);
        walletOptionsBuilder.setTheme(theme);
        handleSuccess();
    }
    private void addAllowedCard(int card) {
        Log.d(TAG, "addAllowedCard: " + card);
        this.readyToPayRequestBuilder.addAllowedCardNetwork(card);
        handleSuccess();
    }
    private void setPaymentMethodTokenizationType(int type) {
        Log.d(TAG, "setPaymentMethodTokenizationType: " + type);
        tokenizationParametersBuilder.setPaymentMethodTokenizationType(type);
        handleSuccess();
    }
    private void addPaymentMethodTokenizationParameter(String key, String value) {
        Log.d(TAG, "addPaymentMethodTokenizationParameter: " + key + ", " + value);
        tokenizationParametersBuilder.addParameter(key, value);
        handleSuccess();
    }
    private void setMerchantName(String merchantName) {
        Log.d(TAG, "setMerchantName: " + merchantName);
        this.merchantName = merchantName;
        handleSuccess();
    }
    private void setPhoneNumberRequired(Boolean phoneNumberRequired) {
        Log.d(TAG, "setPhoneNumberRequired: " + phoneNumberRequired);
        this.phoneNumberRequired = phoneNumberRequired;
        handleSuccess();
    }
    private void setShippingAddressRequired(Boolean shippingAddressRequired) {
        Log.d(TAG, "setShippingAddressRequired: " + shippingAddressRequired);
        this.shippingAddressRequired = shippingAddressRequired;
        handleSuccess();
    }
    private void setAllowPrepaidCard(Boolean allowPrepaidCard) {
        Log.d(TAG, "setAllowPrepaidCard: " + allowPrepaidCard);
        this.allowPrepaidCard = allowPrepaidCard;
        handleSuccess();
    }
    private void setAllowDebitCard(Boolean allowDebitCard) {
        Log.d(TAG, "setAllowDebitCard: " + allowDebitCard);
        handleSuccess();
        this.allowDebitCard = allowDebitCard;
    }

    private void bootstrap() {
        Log.d(TAG, "bootstrap");
        if (bootstrapped) {
            handleSuccess();
            return;
        }
        googleApiClient = new GoogleApiClient.Builder(cordova.getActivity())
                .addConnectionCallbacks(this)
                .addOnConnectionFailedListener(this)
                .addApi(Wallet.API, walletOptionsBuilder.build())
                .build();

        googleApiClient.connect();
    }

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        Log.d(TAG, "initialize");
        listeners = new HashMap<String, CallbackContext>();
    }

    @Override
    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
        this.context = callbackContext;

        if (action.equals("bindListener")) {
            Log.d(TAG, "New listener for "  + args.getString(0));
            listeners.put(args.getString(0), callbackContext);
            return true;
        }

        if (action.equals("setTag")) {
            this.setTag(args.getString(0));
            return true;
        }

        if (action.equals("setEnvironment")) {
            this.setEnvironment(args.getInt(0));
            return true;
        }

        if (action.equals("setTheme")) {
            this.setTheme(args.getInt(0));
            return true;
        }

        if (action.equals("addAllowedCard")) {
            this.addAllowedCard(args.getInt(0));
            return true;
        }

        if (action.equals("setPaymentMethodTokenizationType")) {
            this.setPaymentMethodTokenizationType(args.getInt(0));
            return true;
        }

        if (action.equals("addPaymentMethodTokenizationParameter")) {
            this.addPaymentMethodTokenizationParameter(args.getString(0), args.getString(1));
            return true;
        }

        if (action.equals("setMerchantName")) {
            this.setMerchantName(args.getString(0));
            return true;
        }

        if (action.equals("setPhoneNumberRequired")) {
            this.setPhoneNumberRequired(args.getBoolean(0));
            return true;
        }

        if (action.equals("setShippingAddressRequired")) {
            this.setShippingAddressRequired(args.getBoolean(0));
            return true;
        }

        if (action.equals("setAllowPrepaidCard")) {
            this.setAllowPrepaidCard(args.getBoolean(0));
            return true;
        }

        if (action.equals("setAllowDebitCard")) {
            this.setAllowDebitCard(args.getBoolean(0));
            return true;
        }

        if (action.equals("bootstrap")) {
            bootstrapCallback = callbackContext;
            this.bootstrap();
            return true;
        }

        if (action.equals("isReadyToPay")) {
            Log.d(TAG, "isReadyToPay");
            Wallet.Payments.isReadyToPay(googleApiClient, this.readyToPayRequestBuilder.build()).setResultCallback(
                    new ResultCallback<BooleanResult>() {
                        @Override
                        public void onResult(@NonNull BooleanResult booleanResult) {
                            if (booleanResult.getStatus().isSuccess()) {
                                if (booleanResult.getValue()) {
                                    handleSuccess("READY", 1);
                                } else {
                                    handleSuccess("NOT_READY", 0);
                                }
                            } else {
                                // Error making isReadyToPay call
                                Log.e(TAG, "isReadyToPay:" + booleanResult.getStatus());
                                handleError("Error:" + booleanResult.getStatus(), 0);
                            }
                        }
                    }
            );

            return true;
        }

        if (action.equals("setCart")) {
            Log.d(TAG, "setCart");
            JSONObject jsonArgs = args.getJSONObject(0);

            Cart.Builder cartBuilder = Cart.newBuilder()
                    .setCurrencyCode(jsonArgs.getString("currencyCode")) // EUR
                    .setTotalPrice(jsonArgs.getString("totalPrice")); // 1.00

            JSONArray lineItems = jsonArgs.getJSONArray("lineItems");
            Log.d(TAG, "lineItems: " + lineItems.toString());
            Log.d(TAG, "lineItems.length: " + lineItems.length());

            if (lineItems.length() > 0) {
                for (int i = 0; i <= (lineItems.length() - 1); i++) {
                    JSONObject lineItemData = lineItems.getJSONObject(i);

                    LineItem.Builder lineItemBuilder = LineItem.newBuilder()
                            .setCurrencyCode(lineItemData.getString("currencyCode"))
                            .setQuantity(lineItemData.getString("quantity"))
                            .setDescription(lineItemData.getString("description"))
                            .setTotalPrice(lineItemData.getString("totalPrice"))
                            .setUnitPrice(lineItemData.getString("unitPrice"));

                    Log.d(TAG, "building LineItem " + lineItemBuilder);
                    cartBuilder.addLineItem(lineItemBuilder.build());
                }
            }

            cart = cartBuilder.build();

            handleSuccess(cart.getLineItems().toString());

            return true;
        }

        if (action.equals("loadMaskedWallet")) {
            Log.d(TAG, "loadMaskedWallet");

            MaskedWalletRequest.Builder maskedWalletRequest = MaskedWalletRequest.newBuilder()
                    .setPaymentMethodTokenizationParameters(tokenizationParametersBuilder.build())
                    .setMerchantName(merchantName)
                    .setPhoneNumberRequired(phoneNumberRequired)
                    .setEstimatedTotalPrice(cart.getTotalPrice())
                    .setCurrencyCode(cart.getCurrencyCode())
                    .setAllowDebitCard(allowDebitCard)
                    .setAllowPrepaidCard(allowPrepaidCard)
                    .setShippingAddressRequired(shippingAddressRequired);


            Log.d(TAG, maskedWalletRequest.toString());

            cordova.setActivityResultCallback(this);
            Wallet.Payments.loadMaskedWallet(googleApiClient, maskedWalletRequest.build(), LOAD_MASKED_WALLET_REQUEST_CODE);

            return true;
        }

        return false;
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        int errorCode = -1;

        if (data != null) {
            errorCode = data.getIntExtra(
                    WalletConstants.EXTRA_ERROR_CODE, -1);
        }

        Log.d(TAG, "onActivityResult, resultCode=" + resultCode);

        if (requestCode == LOAD_MASKED_WALLET_REQUEST_CODE) {

            Log.d(TAG, "onActivityResult: " + "requestCode=LOAD_MASKED_WALLET_REQUEST_CODE");



            if (resultCode == Activity.RESULT_OK) {

                try {
                    sendToListener("maskedWalletLoaded", (new JSONObject())
                            .put("resultCode", resultCode));
                } catch (JSONException e) {
                    sendToListener("maskedWalletLoaded", e);
                }

                MaskedWallet maskedWallet = data.getParcelableExtra(WalletConstants.EXTRA_MASKED_WALLET);
                FullWalletRequest fullWalletRequest = FullWalletRequest.newBuilder()
                        .setCart(cart)
                        .setGoogleTransactionId(maskedWallet.getGoogleTransactionId())
                        .build();

                cordova.setActivityResultCallback(this);
                Wallet.Payments.loadFullWallet(googleApiClient, fullWalletRequest, LOAD_FULL_WALLET_REQUEST_CODE);
            } else {
                handleWalletError(errorCode);
                handleError("loadMaskedWallet failed", errorCode);
            }

        } else if (requestCode == LOAD_FULL_WALLET_REQUEST_CODE) {

            Log.d(TAG, "onActivityResult: " + "requestCode=LOAD_FULL_WALLET_REQUEST_CODE");

            if (resultCode == Activity.RESULT_OK) {
                FullWallet fullWallet = data.getParcelableExtra(WalletConstants.EXTRA_FULL_WALLET);
                String tokenJSON = fullWallet.getPaymentMethodToken().getToken();

                try {
                    JSONObject token = new JSONObject(tokenJSON);
                    handleSuccess(token);
                } catch (JSONException e) {
                    sendToListener("fullWalletLoaded", e);
                    handleSuccess(tokenJSON);
                }

                Log.d(TAG, tokenJSON);
            } else {
                handleWalletError(errorCode);
                handleError("loadFullWallet failed", resultCode);
            }

        } else {
            super.onActivityResult(requestCode, resultCode, data);
        }
    }

    @Override
    public void onConnected(Bundle connectionHint) {
        Log.i(TAG, "Connected to GoogleApiClient");
        if (!bootstrapped) {
            bootstrapped = true;
            bootstrapCallback.success();
        }
    }


    @Override
    public void onConnectionSuspended(int cause) {
        Log.i(TAG, "Connection suspended");
    }

    @Override
    public void onDestroy() {
        Log.i(TAG, "On onDestroy");
    }

    @Override
    public void onConnectionFailed(@NonNull ConnectionResult result) {
        Log.i(TAG, "Connection failed");
        if (!bootstrapCallback.isFinished()) {
            bootstrapCallback.error(result.getErrorMessage());
        }
    }

    protected void sendToListener(String listenerName, String data) {
        sendToListener(listenerName, data, PluginResult.Status.OK);
    }

    protected void sendToListener(String listenerName, String data, PluginResult.Status status) {
        try {
            sendToListener(listenerName, (new JSONObject()).put("message", data), status);
        } catch(JSONException e) {
            sendToListener(listenerName, e);
        }
    }

    protected void sendToListener(String listenerName, JSONException e) {
        sendToListener(listenerName, e.getMessage(), PluginResult.Status.JSON_EXCEPTION);
    }

    protected void sendToListener(String listenerName, JSONObject data) {
        sendToListener(listenerName, data, PluginResult.Status.OK);
    }

    protected void sendToListener(String listenerName, JSONObject data, PluginResult.Status status) {
        if (listeners.containsKey(listenerName)) {
            PluginResult eventData = new PluginResult(status, data);
            eventData.setKeepCallback(true);
            listeners.get(listenerName).sendPluginResult(eventData);
        }
    }

    protected void handleError(String errorMsg, int errorCode) {
        try {
            Log.e(TAG, errorMsg);

            JSONObject error = new JSONObject();
            error.put("message", errorMsg);
            error.put("code", errorCode);
            handleError(error);
            //context.error(error);

        } catch (JSONException e) {
            Log.e(TAG, e.toString());
        }
    }

    protected void handleError(String errorMsg) {
        try {
            Log.e(TAG, errorMsg);

            JSONObject error = new JSONObject();
            error.put("message", errorMsg);
            handleError(error);
            //context.error(error);

        } catch (JSONException e) {
            Log.e(TAG, e.toString());
        }
    }

    protected void handleError(JSONObject json) {
        Log.e(TAG, json.toString());

        if (context != null) {
            context.error(json);
        }
    }

    private void handleSuccess() {
        context.success();
    }

    protected void handleSuccess(String msg, int code) {
        try {
            Log.i(TAG, msg);
            JSONObject success = new JSONObject();
                success.put("message", msg);
                success.put("code", code);
                handleSuccess(success);
                //context.success(success);

        } catch (JSONException e) {
            handleError(e.getMessage(), 0);
        }
    }

    protected void handleSuccess(String msg) {
        try {
            Log.i(TAG, msg);
            JSONObject success = new JSONObject();
            success.put("message", msg);
            handleSuccess(success);
            //context.success(success);

        } catch (JSONException e) {
            handleError(e.getMessage(), 0);
        }
    }

    protected void handleSuccess(JSONObject json) {
        Log.i(TAG, json.toString());

        if (context != null) {
            context.success(json);
        }
    }

    protected void handleWalletError(int errorCode) {
        switch (errorCode) {
            case WalletConstants.ERROR_CODE_INVALID_PARAMETERS:
                Log.e(TAG, "ERROR_CODE_INVALID_PARAMETERS");
                break;
            case WalletConstants.ERROR_CODE_AUTHENTICATION_FAILURE:
                Log.e(TAG, "ERROR_CODE_AUTHENTICATION_FAILURE");
                break;
            case WalletConstants.ERROR_CODE_BUYER_ACCOUNT_ERROR:
                Log.e(TAG, "ERROR_CODE_BUYER_ACCOUNT_ERROR");
                break;
            case WalletConstants.ERROR_CODE_MERCHANT_ACCOUNT_ERROR:
                Log.e(TAG, "ERROR_CODE_MERCHANT_ACCOUNT_ERROR");
                break;
            case WalletConstants.ERROR_CODE_SERVICE_UNAVAILABLE:
                Log.e(TAG, "ERROR_CODE_SERVICE_UNAVAILABLE");
                break;
            case WalletConstants.ERROR_CODE_UNSUPPORTED_API_VERSION:
                Log.e(TAG, "ERROR_CODE_UNSUPPORTED_API_VERSION");
                break;
            case CommonStatusCodes.API_NOT_CONNECTED:

                break;
            case WalletConstants.ERROR_CODE_UNKNOWN:
            default:
                Log.e(TAG, "UNKNOWN_ERROR: " + errorCode);
                // unrecoverable error
                // mGoogleWalletDisabled = true;
                // displayGoogleWalletErrorToast(errorCode);
                break;
        }
    }
}
