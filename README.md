# Photon Client Javascript SDK を利用した実装テスト

## 内容

  <img width="554" alt="demo" src="https://user-images.githubusercontent.com/15827817/47614266-79746200-dae0-11e8-97fb-3163c39eec69.png">

  十字キーで移動です．プレイヤー(黄色のやつ)の位置を共有します．



## 準備

  Photon Client Javascript SDKは[こちら](https://www.photonengine.com/)から入手．      
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
