# Photon Client Javascript SDK を利用した実装テスト

Photon Client Javascript SDKは[こちら](https://www.photonengine.com/)から入手

## 準備

  `src/assets/`に`Photon-Javascript_SDK.js`,`Photon-Javascript_SDK.d.ts`を入れる．
  `src/`に以下の内容の`config.ts`を作成．

  ```typescript
  export default {
      photon : {
          // 各自で設定
          Wss     : true, 
          Id      : '<AppId>',
          Version : '<Version>'
      }
  }
  ```
  
  ## ビルド
  
  
  `npm run build` か `npm run release` を実行．
    
  ## 実行
  
  `dist/index.html`を開く．
