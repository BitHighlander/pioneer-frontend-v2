import injectedModule from "@web3-onboard/injected-wallets";
import { init } from "@web3-onboard/react";
import walletConnectModule from "@web3-onboard/walletconnect";

const INFURA_KEY = "fb05c87983c4431baafd4600fd33de7e";

const walletConnect = walletConnectModule();

const injected = injectedModule({
  custom: [
    // include custom injected wallet modules here
  ],
  filter: {
    // mapping of wallet labels to filter here
  },
});

export default init({
  // An array of wallet modules that you would like to be presented to the user to select from when connecting a wallet.
  wallets: [injected, walletConnect],
  // An array of Chains that your app supports
  chains: [
    {
      // hex encoded string, eg '0x1' for Ethereum Mainnet
      id: "0x1",
      // string indicating chain namespace. Defaults to 'evm' but will allow other chain namespaces in the future
      namespace: "evm",
      // the native token symbol, eg ETH, BNB, MATIC
      token: "ETH",
      // used for display, eg Ethereum Mainnet
      label: "Ethereum Mainnet",
      // used for network requests
      rpcUrl: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
    },
    {
      id: "0x3",
      token: "tROP",
      label: "Ethereum Ropsten Testnet",
      rpcUrl: `https://ropsten.infura.io/v3/${INFURA_KEY}`,
    },
    // {
    //   id: '0x4',
    //   token: 'rETH',
    //   label: 'Ethereum Rinkeby Testnet',
    //   rpcUrl: `https://rinkeby.infura.io/v3/${INFURA_KEY}`
    // },
    // {
    //   id: '0x89',
    //   token: 'MATIC',
    //   label: 'Matic Mainnet',
    //   rpcUrl: 'https://matic-mainnet.chainstacklabs.com'
    // }
  ],
  appMetadata: {
    // The name of your dApp
    name: "Pioneers.dev",
    // SVG icon string, with height or width (whichever is larger) set to 100% or a valid image URL
    icon: "<svg id=\"Layer_1\" height=\"100%\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" viewBox=\"0 0 380.94 434.03\"><defs><style>.cls-1{fill:#262a3d;}.cls-2{fill:url(#linear-gradient);}.cls-3{fill:url(#linear-gradient-2);}</style><linearGradient id=\"linear-gradient\" x1=\"2.19\" y1=\"163.03\" x2=\"188.9\" y2=\"163.03\" gradientUnits=\"userSpaceOnUse\"><stop offset=\"0\" stop-color=\"#55ccfe\"/><stop offset=\"1\" stop-color=\"#5e93ef\"/></linearGradient><linearGradient id=\"linear-gradient-2\" x1=\"2.19\" y1=\"324.73\" x2=\"375.61\" y2=\"324.73\" xlink:href=\"#linear-gradient\"/></defs><polygon class=\"cls-1\" points=\"64.42 324.73 2.19 216.93 126.66 216.93 126.66 216.93 188.9 324.73 64.42 324.73\"/><polygon class=\"cls-2\" points=\"126.66 216.93 2.19 216.93 64.42 109.13 188.9 109.13 126.66 216.93\"/><polygon class=\"cls-1\" points=\"251.14 216.93 188.9 109.13 64.42 109.13 2.19 1.33 251.14 1.33 375.61 216.93 251.14 216.93\"/><polygon class=\"cls-3\" points=\"251.14 432.53 2.19 432.53 64.42 324.73 188.9 324.73 251.14 216.93 375.61 216.93 251.14 432.53\"/></svg>",
    // Optional wide format logo (ie icon and text) to be displayed in the sidebar of connect modal. Defaults to icon if not provided
    // logo: "https://cdn3.vectorstock.com/i/1000x1000/01/82/green-compass-vector-19780182.jpg",
    // The description of your app
    description: "Pioneer Developer Program",
    // The url to a getting started guide for app
    gettingStartedGuide: "https://pioneers.dev",
    // url that points to more information about app
    explore: "https://pioneers.dev",
    // if your app only supports injected wallets and when no injected wallets detected, recommend the user to install some
    recommendedInjectedWallets: [
      {
        // display name
        name: "MetaMask",
        // link to download wallet
        url: "https://metamask.io",
      },
    ],
    // Optional - but allows for dapps to require users to agree to TOS and privacy policy before connecting a wallet
    // agreement: {
    //   version: '1.0.0',
    //   termsUrl: 'https://www.blocknative.com/terms-conditions',
    //   privacyUrl: 'https://www.blocknative.com/privacy-policy'
    // }
  },
});
