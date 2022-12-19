/*
    Pioneer SDK

        A ultra-light bridge to the pioneer platform

              ,    .  ,   .           .
          *  / \_ *  / \_      .-.  *       *   /\'__        *
            /    \  /    \,   ( ₿ )     .    _/  /  \  *'.
       .   /\/\  /\/ :' __ \_   -           _^/  ^/    `--.
          /    \/  \  _/  \-'\      *    /.' ^_   \_   .'\  *
        /\  .-   `. \/     \ /==~=-=~=-=-;.  _/ \ -. `_/   \
       /  `-.__ ^   / .-'.--\ =-=~_=-=~=^/  _ `--./ .-'  `-
      /        `.  / /       `.~-^=-=~=^=.-'      '-._ `._

                             A Product of the CoinMasters Guild
                                              - Highlander

      Api Docs:
        * https://pioneers.dev/docs/
      Transaction Diagram
        * https://github.com/BitHighlander/pioneer/blob/master/docs/pioneerTxs.png

*/
// @ts-ignore
import { SDK } from "@pioneer-sdk/sdk";
import { v4 as uuidv4 } from "uuid";

export class PioneerService {
  public App: any;

  public Api: any;

  public queryKey: string;

  public jwt: string | undefined;

  public pairingCode: string | undefined;

  public isInitialized = false;

  public username: string | undefined;

  public context: string | undefined;

  public assetContext: string | undefined;

  public assetBalanceNativeContext: string | undefined;

  public assetBalanceUsdValueContext: string | undefined;

  public valueUsdContext: string | undefined;

  public wallets: any[] | undefined;

  public balances: any[];

  public pubkeys: any[];

  public invocations: any[];

  public status: any;

  public events: any;

  public userParams: any;

  public user: any;

  public isBridgeOnline: boolean;

  public totalValueUsd: any;

  public walletsIds: any;

  public walletDescriptions: any;

  public sendToAddress: string | undefined;

  public sendToAmountNative: string | undefined;

  public sendToNetwork: string | undefined;

  public sendToAsset: string | undefined;

  public sendToFeeLevel: string | undefined;

  public sendInvocation: string | undefined;

  constructor() {
    this.isBridgeOnline = false;
    this.invocations = [];
    this.balances = [];
    this.pubkeys = [];
    this.events = {};
    let queryKey: string | null = localStorage.getItem("queryKey");
    let username: string | null = localStorage.getItem("username");
    if (!queryKey) {
      console.log("Creating new username~!");
      queryKey = `queryKey:${uuidv4()}`;
      queryKey = queryKey.substring(0, 13);
      console.log("Creating new queryKey~! queryKey: ", queryKey);
      localStorage.setItem("queryKey", queryKey);
      this.queryKey = queryKey;
    } else {
      this.queryKey = queryKey;
    }
    if (!username) {
      console.log("Creating new username~!");
      username = `user:${uuidv4()}`;
      username = username.substring(0, 13);
      console.log("Creating new username~! username: ", username);
      localStorage.setItem("username", username);
      this.username = username;
    } else {
      this.username = username;
    }
  }

  async getStatus(): Promise<any> {
    return this.status;
  }

  async getInvocationStatus(invocationId: string): Promise<any> {
    return await this.App.getInvocation(invocationId);
  }

  getQueryKey(): string {
    return this.queryKey;
  }

  getUsername(): string {
    return this.username as string;
  }

  forget(): boolean {
    localStorage.removeItem("queryKey");
    localStorage.removeItem("username");
    return true;
  }

  async pairWallet(wallet: any): Promise<any> {
    try {
      // const keyring = new core.Keyring();
      // const keepkeyAdapter = keepkeyWebUSB.WebUSBKeepKeyAdapter.useKeyring(keyring);
      // let wallet = await keepkeyAdapter.pairDevice(undefined /*tryDebugLink=*/ );
      //
      // if(wallet){
      //     let result = await this.App.init(wallet)
      //     console.log("result: ",result)
      //     this.status = this.App.markets
      //     console.log("STATUS: ",this.status)
      //     //
      //     this.context = this.App.context
      //     this.valueUsdContext = this.App.valueUsdContext
      //     this.walletsIds = this.App.wallets
      //     this.wallets = this.App.walletDescriptions
      //     this.walletDescriptions = this.App.walletDescriptions
      //     this.totalValueUsd = this.App.totalValueUsd
      //     this.username = this.App.username
      //     this.balances = this.App.balances
      //     this.pubkeys = this.App.pubkeys
      //
      //     return this.App
      // } else {
      //     console.log("no wallet found! : ")
      // }
    } catch (e) {
      console.error(e);
    }
  }

  async init(): Promise<any> {
    const network = "mainnet";
    if (!this.queryKey) {
      throw Error("Failed to init! missing queryKey");
    }
    if (!this.username) {
      throw Error("Failed to init! missing username");
    }
    if (!this.isInitialized) {
      this.isInitialized = true;

      const blockchains = [
        "bitcoin",
        "ethereum",
        "thorchain",
        "bitcoincash",
        "litecoin",
        "binance",
        "cosmos",
        "dogecoin",
        "osmosis",
      ];

      const config: any = {
        blockchains,
        network,
        username: this.username,
        service: process.env.REACT_APP_PIONEER_SERVICE,
        url: process.env.REACT_APP_APP_URL,
        queryKey: this.queryKey,
        wss: process.env.REACT_APP_URL_PIONEER_SOCKET,
        spec: process.env.REACT_APP_URL_PIONEER_SPEC,
        rangoApiKey:
          process.env.REACT_APP_RANGO_API_KEY ||
          "02b14225-f62e-4e4f-863e-a8145e5befe5",
        paths: [], // TODO allow import custom paths
      };
      console.log("config: ", config);
      this.App = new SDK(config.spec, config);
      this.Api = this.App.pioneer;
      // this.App.on('keepkey',(message) => {
      //   this.events.events.emit('keepkey',message)
      // })

      // init with HDwallet
      if (this.App && this.App.context) {
        this.status = this.App.markets;
        console.log("STATUS: ", this.status);
        this.context = this.App.context;
        this.valueUsdContext = this.App.valueUsdContext;
        this.walletsIds = this.App.wallets;
        this.wallets = this.App.walletDescriptions;
        this.walletDescriptions = this.App.walletDescriptions;
        this.totalValueUsd = this.App.totalValueUsd;
        this.username = this.App.username;
        this.balances = this.App.balances;
        this.pubkeys = this.App.pubkeys;
      }
      return {
        status: "Online",
        code: this.pairingCode,
        paired: true,
        assetContext: this.assetContext,
        assetBalanceNativeContext: this.assetBalanceNativeContext,
        assetBalanceUsdValueContext: this.assetBalanceUsdValueContext,
        username: this.username,
        context: this.context,
        wallets: this.wallets,
        balances: this.balances,
        pubkeys: this.pubkeys,
        walletsIds: this.walletsIds,
        valueUsdContext: this.valueUsdContext,
        totalValueUsd: this.totalValueUsd,
      };

      return this.App;
    }
    console.log("Already initialized!");
    return {
      status: "Online",
      paired: true,
      code: this.pairingCode,
      assetContext: this.assetContext,
      assetBalanceNativeContext: this.assetBalanceNativeContext,
      assetBalanceUsdValueContext: this.assetBalanceUsdValueContext,
      username: this.username,
      context: this.context,
      wallets: this.wallets,
      balances: this.balances,
      pubkeys: this.pubkeys,
      walletsIds: this.walletsIds,
      valueUsdContext: this.valueUsdContext,
      totalValueUsd: this.totalValueUsd,
    };
  }

  /*
        Pioneer Invocation API lifecycle
              docs: https://github.com/BitHighlander/pioneer/blob/master/docs/pioneerTxs.png
        invoke (SDK)
        inspect/approve/sign/broadcast (in desktop app)
        push -> broadcast (SDK)
        confirmations -> (SDK)
        (optional) invoke RPF
            Repeat...
  
        transfer object example:https://github.com/BitHighlander/pioneer/blob/master/e2e/sdk-transfers/osmosis-e2e-transfer/src/index.ts#L245
    * */
  // build transfer
  async buildTx(transfer: any): Promise<any> {}

  async createPairingCode(): Promise<any> {
    return this.pairingCode;
  }

  async onPair(): Promise<any> {
    const info = await this.App.getUserInfo();
    if (info && !info.error) {
      // console.log('INFO: ', info)
      const userParams = await this.App.getUserParams();
      this.balances = this.App.balances;
      this.context = info.context;
      // this.valueUsdContext = info.totalValueUsd;
      this.wallets = info.wallets;
      // this.valueUsdContext = userInfo.valueUsdContext;
      this.totalValueUsd = info.totalValueUsd;
      if (info.username) this.username = info.username;
      return userParams;
    }
    // console.log('no user data found!')
    return {
      success: false,
      error: "No user info for key",
    };
  }

  async refresh(): Promise<any> {
    const info = await this.App.getUserInfo();
    if (info && !info.error) {
      // console.log('INFO: ', info)
      const userParams = await this.App.getUserParams();
      this.context = info.context;
      // this.valueUsdContext = info.totalValueUsd;
      this.wallets = info.wallets;
      this.balances = this.App.balances;
      // this.valueUsdContext = userInfo.valueUsdContext;
      this.totalValueUsd = info.totalValueUsd;
      if (info.username) this.username = info.username;
      return userParams;
    }
    // console.log('no user data found!')
    return {
      success: false,
      error: "No user info for key",
    };
  }
}
