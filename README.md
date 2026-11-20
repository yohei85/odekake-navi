# odekake-navi
おでかけスポット検索アプリ

## チケット案内のクリック集計

Cloudflare の Workers & Pages → Observability → Query Builder で集計します。

- Filter: `event` = `ticket_click`。アカウントに複数の Workers がある場合は `odekake-navi` に絞ります。
- Group By: `facility`。ガイドと施設カードを分ける場合は `surface` も追加します。
- 集計: `count`。期間は画面上部で選択します。

1件は公式料金・チケットリンクのクリックです。予約完了数や利用者数とは異なります。
Worker が記録する項目はイベント名、施設名、リンクの場所のみです。
