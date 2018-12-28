var RECEIPT_FOLDER_ID = 'target folder-ID';//レシートフォルダのフォルダID
var SEARCH_TIME = 86400;

function myFunction() {
  var receiptFolder = DriveApp.getFolderById(RECEIPT_FOLDER_ID);
  var files = receiptFolder.searchFiles('mimeType = "image/jpeg"');

  // フォルダのファイルのデータを取得
  var lastUpdateMap = {};
  while (files.hasNext()) {
    var file = files.next();
    lastUpdateMap[file.getId()] = Math.floor(Date.parse(file.getLastUpdated())/1000);
  }

  
  // 24時間以内に更新があったか確認
  var updateFileList = [];
  var dateobj = new Date();
  var now_unix_time = Math.floor(dateobj.getTime() / 1000) ;
  var day_ago_unix_time = now_unix_time - SEARCH_TIME;
  var filetoocr 

  for (key in lastUpdateMap) {
    if(lastUpdateMap[key] > day_ago_unix_time) {
      //file ID でOCR化するJPEGファイル
      var fileToOcr = DriveApp.getFileById(key);
      var imageBlob = fileToOcr.getBlob();
      //同一フォルダにGoogleドキュメントを作成するためにJPEG fileのparent folder IDをget
      var parentsId = Drive.Files.get(key).parents;
      //OCRしたファイルをinsert
      var resource = {
        title: imageBlob.getName(),
        mimeType: imageBlob.getContentType(),
        parents: parentsId
      };
      var options = {
        ocr: true
      };
      Drive.Files.insert(resource, imageBlob, options);
      Logger.log(key + lastUpdateMap[key] + " " + day_ago_unix_time);
    }
  }
}
