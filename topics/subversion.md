# Subversion (SVN)

- Macでも使える
- macOSには標準で入っていない場合が多いので、Homebrewでインストールするのが一般的
```bash
brew install subversion
svn --version
```


### GUIクライアント
- 公式クライアント（TortoiseSVN）はWindows専用
- 公式が提供するMac用のGUIツールは存在しない
- 以下のようなサードパーティ製のGUIクライアントを利用する
    - SmartSVN（クロスプラットフォーム対応・商用/無料版あり）
    - Cornerstone（有料・評価版あり）
   
### VS Code拡張機能
- コミット・更新・差分表示などをVS Code上で操作できる
- 拡張機能名：vscode-svn