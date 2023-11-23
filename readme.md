---
layout: default
title: How to Use
---

# musicplayer

HTML5 + CSS3 + JavaScript のみで作成された音楽プレーヤー

https://coal-ongaku.github.io/musicplayer/index.html

## how to use

画面のフォルダボタンを押して、以下のような構成となったフォルダをダイアログから選択する。

```
folder
├── 01 - スクリーンプリズン.flac
├── 02 - 仮面.flac
├── 03 - Alert.flac
├── 04 - 一番星に輝いたのは.flac
├── ...
├── albumart.png
└── info.json
```

- 音楽の対応拡張子：`*.flac`,`*.wav`,`*.mp3`
- 音楽は再生したい順にファイル名昇順にしておく(01\_などの prefix をつけておくといい)
- albumart.png:アルバムアートの画像(正方形推奨)
- info.json:曲の情報が書かれたもの

```
{
	"album":{
		"title":"アルバム名",
		"artist":"アルバムアーティスト"
	},
	"songs":[
		{
			"title":"1曲目のタイトル",
			"artist":"曲のアーティスト",
			"description":"説明"
		},
		{
			"title":"2曲目のタイトル",
			"artist":"曲のアーティスト",
			"description":"説明"
		}
	]
}
```

`\n`は`<br>`タグに変換され改行されるので、長い説明文の場合は`\n`を利用するのがおすすめ。

info.json は、[JSON エディタ](https://coal-ongaku.github.io/musicplayer/jsoneditor.html)で作成することもできる。
