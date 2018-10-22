# photon_js

## 準備

  `src/assets/`に`Photon-Javascript_SDK.js`,`Photon-Javascript_SDK.min.js`を入れる．
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
